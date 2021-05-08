import numpy as np
import builtins
from cv2 import *
from pytesseract import *

from constants import CLINICAL_DS, KEY, OUTPUTS
from utils import show, getResource, pprint, to_json
from filter_utils import *
from sort_2d import *
from functools import reduce
from os import path
import json


'''
BUG: Rows may contains dublicated word
OPT: CHECK FOR VISITED CHECKBOXES WHEN INTERSECTING WITH ROWS
'''
def get_boxes(img):
  d = image_to_data(img, output_type = Output.DICT)
  
  boxes = []

  n_boxes = len(d['text'])
  for i in range(n_boxes):
    (x, y, w, h, text, conf) = (d['left'][i], d['top'][i], d['width'][i], d['height'][i], d['text'][i], d['conf'][i])
    if len(text) > 0 and conf > 50:
      boxes.append([x, y, w, h, text, conf])
      # img = rectangle(img, (x,y), (x+w,y+h), (0,255,0),10)
      
  # show(img)
  return boxes
  
def multifilter_word_querry(src_img):
  img = np.copy(src_img)
  # img_sort = np.copy(img)
  
  _, binary = threshold(img, 127,255, THRESH_BINARY)
  
  inverted = ~img
  
  kernel = np.ones((3,3),np.uint8)
  dilated = dilate(inverted, kernel, iterations = 1)
  
  closing = morphologyEx(inverted, MORPH_CLOSE, kernel)
  
  boxes = get_boxes(img)
  print('Processed... 1 / 5 (base)')
  boxes += get_boxes(binary)
  print('Processed... 2 / 5 (binary)')
  boxes += get_boxes(inverted)
  print('Processed... 3 / 5 (inverted)')
  boxes += get_boxes(dilated)
  print('Processed... 4 / 5 (dilated)')
  boxes += get_boxes(closing)
  print('Processed... 5 / 5 (closing)')
  
  sort_boxes_2d(boxes)
  print('Sorted contours...')

  
  # separates same word in different location
  for i in range(0, len(boxes) - 1):
    # img_sort = line(img_sort, (boxes[i][0],boxes[i][1]), (boxes[i+1][0],boxes[i+1][1]), (0,255,0),15)
    if (boxes[i][4] == boxes[i+1][4] and
        (abs(boxes[i][0] - boxes[i+1][0]) > 10 or
        abs(boxes[i][1] - boxes[i+1][1]) > 10)):
      boxes.insert(i + 1, [0,0,0,0,'|',0])
  
  # show(img_sort)
  i = 0
  filtered_boxes = []
  
  while i < len(boxes) - 1:
    best_conf_index = i
    word = boxes[best_conf_index][4]
    
    if word != '|':  
      while i < len(boxes) - 1 and word == boxes[i+1][4]:
        if boxes[best_conf_index][5] < boxes[i+1][5]:
          best_conf_index = i + 1
        i += 1
      filtered_boxes.append(boxes[best_conf_index])
    i += 1

  i -= 1
  if boxes[i][4] == filtered_boxes[-1][4]:
    if boxes[i][5] > filtered_boxes[-1][5]:
      filtered_boxes[-1] = boxes[i]
  else:
    filtered_boxes.append(boxes[i])
  
  print('Filtered for best confidence...')
  return filtered_boxes



def select_rows(boxes, img):
  
  ### inaltimea celui mai mare cuvant
  row_h = -1
  _, img_w, _ = img.shape
  
  for i in range(len(boxes)):
    [_, _, _, h, *_] = boxes[i]
    
    ###determinam cel mai inalt cuvant ca si inaltime liniilor despartitoare
    if row_h < h:
      row_h = h

  rows = []
  unvisited = boxes.copy()
  
  ### trecem pe la toate cuvintele nevizitate
  ### detectam daca aabb_colision cu linia de selectare
  while len(unvisited) > 0:
    current_box = unvisited[0]
    scanning_row = [0, current_box[1] + current_box[3] // 2 - row_h // 2, img_w, row_h]
    text_row = []
    
    i = 0
    while i < len(unvisited):
      next_box = unvisited[i]
      if aabb(scanning_row, next_box):
        text_row.append(unvisited.pop(i))
        i -= 1
      i += 1
        
    rows.append(text_row)
  
  ### sortam cuvintele din linii crescator pe axa X
  for i in range(0, len(rows)):      
    rows[i] = sorted(rows[i], key=lambda word: word[0])
    # start_word = rows[i][0]
    # end_word = rows[i][-1]
    # img = rectangle(img, (start_word[0], start_word[1]), (end_word[0] + end_word[2], end_word[1] + end_word[3]), (255,0,255), 3)
    
  # show(img)
  
  rows = sorted(rows, key=lambda x: x[0][1])
  
  return rows

def splitrows_by_checkboxes(text_rows, checkboxes, img):
  
  text_sentences = []
  for row_index in range(len(text_rows)):
    current_row = text_rows[row_index]
    start_word = current_row[0]
    end_word = current_row[-1]
    row_box = [start_word[0], start_word[1], end_word[0] + end_word[2] - start_word[0], end_word[1] + end_word[3] - start_word[1]]
    # img = rectangle(img, (row[0], row[1]), (row[0] + row[2], row[1] + row[3]), (255,0,255), 3)
    
    cut_positions = []
    for i in range(0, len(checkboxes)):
      if aabb(checkboxes[i], row_box):
        cut_positions.append(checkboxes[i])
    
    cut_positions = sorted(cut_positions, key=lambda x: x[0])
    
    sentences = []
    word_index = 0
    
    while len(cut_positions) > 0:
      sentence = []
      while len(cut_positions) > 0 and  current_row[0][KEY.X] <= cut_positions[0][KEY.X]:
        # print(f'{[KEY.TEXT]} {current_row[word_index][KEY.X]} {cut_positions[0][KEY.X]}')
        sentence.append(current_row[0])
        current_row.pop(0)
        word_index += 1
      
      cut_positions.pop(0)
      sentences.append(sentence)
      
    sentences.append(current_row)
    text_sentences.extend(sentences)
    
    # for i in range(0, len(sentences)):      
    #   sw = sentences[i][0]
    #   ew = sentences[i][-1]
      # img = rectangle(img, (sw[0], sw[1]), (ew[0] + ew[2], ew[1] + ew[3]), (255,0,255), 3)

  # show(img)
  
  return text_sentences


def associate_checkboxes(sentences, checkboxes, img):
  
  sentences = sentences.copy()
  checkboxes = checkboxes.copy()
  # index = 0
  # cbs = len(checkboxes)
  form_options = []
  # checkbox_index = 0
  while len(checkboxes) > 0:
    cbox = checkboxes[0]
    option_dict = {}
    for i in range(0,len(sentences)):
      sentence = sentences[i]
      distance = get_distance([cbox[KEY.X] + cbox[KEY.W], cbox[KEY.Y]], [sentence[0][KEY.X], sentence[0][KEY.Y]])
      if distance < 50:
        x = cbox[KEY.X]
        y = builtins.min(cbox[KEY.Y], sentence[0][KEY.Y])
        w = sentence[-1][KEY.X] + sentence[-1][KEY.W] - x
        h = builtins.max(cbox[KEY.H], sentence[0][KEY.H])
        
        option_dict[KEY.CHECBOX] = checkboxes.pop(0)
        option_dict[KEY.LABEL] = sentences.pop(i)
        break;
    form_options.append(option_dict)
    # index += 1
    
  sentences = sorted(sentences, key= lambda x: x[0][KEY.Y], reverse=True)
  
  topics = []
  
  for i in range(0, len(sentences)):      
    sw = sentences[i][0]
    ew = sentences[i][-1]
    
    topic = {}
    topic[KEY.TITLE] = sentences[i]
    
    topic_inputs = []
    cb = 0
    while cb < len(form_options):
      [x, y ,w ,h ] = form_options[cb][KEY.CHECBOX]    

      if y > sw[KEY.Y]:
        img = line(img, (x,y), (sw[KEY.X], sw[KEY.Y]), (255,0,0), 10)
        topic_inputs.append(form_options.pop(cb))
        cb -= 1
      cb += 1
    
    if len(topic_inputs) > 0:
      topic[KEY.INPUTS] = topic_inputs
      topics.append(topic)

  return topics
      
def save_data(topics, page_number):
  # to_json('topics.json', topics)
  
  compressed_topics = []
  
  for topic in topics:
    compressed_topic = {}
    
    title = ""
    for box in topic[KEY.TITLE]:
      title += f'{box[KEY.TEXT]} '
    
    compressed_topic[KEY.TITLE] = title
    
    compressed_inputs = []
    
    for topic_input in topic[KEY.INPUTS]:
      compressed_input = {}
      
      compressed_input[KEY.CHECBOX] = topic_input[KEY.CHECBOX]
      
      label = []
      for box in topic_input[KEY.LABEL]:
        if len(label) == 0 or box[KEY.TEXT] != label[-1]:
          label.append(box[KEY.TEXT])
      
      separator = ' '
      compressed_input[KEY.LABEL] = separator.join(label)
      
      compressed_inputs.append(compressed_input)
    
    compressed_topic[KEY.INPUTS] = compressed_inputs[::-1]
    
    compressed_topics.append(compressed_topic)
  
  compressed_topics = compressed_topics[::-1]
  to_json(f'./outputs/ocr-{page_number}.min.json', compressed_topics)
  return compressed_topics

def LOAD_DATA(page_number):
      
  filepath = r"{dir}/ocr-{page_number}.min.json".format(dir=OUTPUTS, page_number=page_number);
  if not path.exists(filepath):
      return {"error": "page does not exist"}
  
  return json.load(open(filepath))

def GET_IMAGE(page_number):
  if getResource(CLINICAL_DS, page_number) == False:
    return "page does not exist"
  
  img1 = imread(getResource(CLINICAL_DS, page_number))
  
  return img1

def OCR(page_number):
  if getResource(CLINICAL_DS, page_number) == False:
    return "page does not exist"
  
  img1 = imread(getResource(CLINICAL_DS, page_number))
  
  # show(img1)
  no_graybox = add(img1, selectGrayboxes(img1))
  # show(no_graybox)
  
  checkbox_mask, checkbox_contours =  selectCheckboxes(no_graybox)
  no_checkbox_img = add(no_graybox, checkbox_mask)
  # show(no_checkbox_img)
  
  no_lines_img = add(no_checkbox_img, selectLines(no_checkbox_img))
  # show(no_lines_img)
  
  boxes = multifilter_word_querry(no_lines_img)
  
  text_rows = select_rows(boxes, np.copy(no_lines_img))
  
  sentences = splitrows_by_checkboxes(text_rows, checkbox_contours, np.copy(no_graybox))
  
  topics = associate_checkboxes(sentences, checkbox_contours, np.copy(no_graybox))
  
  compressed_topics = save_data(topics, page_number)
  
  return compressed_topics
        
def init():
  
  OCR(1)
  
  waitKey(0)
  destroyAllWindows()

if __name__ == "__main__":
  init()