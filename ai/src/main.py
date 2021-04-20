import numpy as np
from cv2 import *
from pytesseract import *

from constants import CLINICAL_DS
from utils import show, getResource
from image_utils import *
from sort_2d import *




def get_boxes(img):
  d = image_to_data(img, output_type = Output.DICT)
  
  boxes = []

  n_boxes = len(d['text'])
  for i in range(n_boxes):
    (x, y, w, h) = (d['left'][i], d['top'][i], d['width'][i], d['height'][i])
    text = d['text'][i]
    conf = d['conf'][i]
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
  boxes += get_boxes(binary)
  boxes += get_boxes(inverted)
  boxes += get_boxes(dilated)
  boxes += get_boxes(closing)
  
  sort_boxes_2d(boxes)
    
  # draws the connected nodes
  # for i in range(0, len(boxes) - 1):
  #   p1 = (boxes[i][0], boxes[i][1])
  #   p2 = (boxes[i+1][0], boxes[i+1][1])
  #   img = line(img, p1, p2, (0,255,0), 5)
  #   print(f'{boxes[i][4]}  -  {boxes[i][5]}')
  
  i = 0  
  filtered_boxes = []
  
  while i < len(boxes) - 1:
    best_conf_index = i
    word = boxes[best_conf_index][4]
    
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
  
  return filtered_boxes

def init():
  img1 = imread(getResource(CLINICAL_DS, 2))
  
  no_graybox = add(img1, selectGrayboxes(img1))
  # # show(no_graybox)
  
  no_checkboxes_img = add(no_graybox, selectCheckboxes(no_graybox))
  # # show(no_checkboxes_img)
  
  no_lines_img = add(no_checkboxes_img, selectLines(no_checkboxes_img))
  
  words = multifilter_word_querry(no_lines_img)
  
  show(no_lines_img)
  waitKey(0)
  destroyAllWindows()

if __name__ == "__main__":
  init()