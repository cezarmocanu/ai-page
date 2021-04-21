import numpy as np
from cv2 import *
from pytesseract import *

from constants import CLINICAL_DS, KEY
from utils import show, getResource
from filter_utils import *
from sort_2d import *


'''
BUG: Rows may contains dublicated word
OPT: QUICKSORT/MERGE_SORT
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
  
  return boxes
  
def multifilter_word_querry(src_img):
  img = np.copy(src_img)
  
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
    if (boxes[i][4] == boxes[i+1][4] and
        (abs(boxes[i][0] - boxes[i+1][0]) > 10 or
        abs(boxes[i][1] - boxes[i+1][1]) > 10)):
      boxes.insert(i + 1, [0,0,0,0,'|',0])
  
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
    
    for i in range(0, len(sentences)):      
      sw = sentences[i][0]
      ew = sentences[i][-1]
      img = rectangle(img, (sw[0], sw[1]), (ew[0] + ew[2], ew[1] + ew[3]), (255,0,255), 3)

  show(img)
  
  return text_sentences

def init():
  img1 = imread(getResource(CLINICAL_DS, 0))
  
  no_graybox = add(img1, selectGrayboxes(img1))

  checkbox_mask, checkbox_contours =  selectCheckboxes(no_graybox)
  no_checkbox_img = add(no_graybox, checkbox_mask)
  
  no_lines_img = add(no_checkbox_img, selectLines(no_checkbox_img))
  
  boxes = multifilter_word_querry(no_lines_img)
  
  text_rows = select_rows(boxes, np.copy(no_lines_img))
  
  splitrows_by_checkboxes(text_rows, checkbox_contours, np.copy(no_graybox))
  
  waitKey(0)
  destroyAllWindows()

if __name__ == "__main__":
  init()