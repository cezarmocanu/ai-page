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
    if len(text) > 0:
      boxes.append([x, y, w, h, text, conf])
  
  return boxes
  
def select_boxes(img):
  
  boxes = get_boxes(img)
  sort_boxes_2d(boxes)
    
  for i in range(0, len(boxes) - 1):
    p1 = (boxes[i][0], boxes[i][1])
    p2 = (boxes[i+1][0], boxes[i+1][1])
    img = line(img, p1, p2, (0,255,0), 5)
    print(boxes[i][2])
  
  show(img)

def init():
  img1 = imread(getResource(CLINICAL_DS, 0))
  
  no_graybox = add(img1, selectGrayboxes(img1))
  # # show(no_graybox)
  
  no_checkboxes_img = add(no_graybox, selectCheckboxes(no_graybox))
  # # show(no_checkboxes_img)
  
  no_lines_img = add(no_checkboxes_img, selectLines(no_checkboxes_img))
  
  # show(no_lines_img)
  # no_lines_img = ~no_lines_img
  
  kernel = np.ones((3,3),np.uint8)
  dil = dilate(no_lines_img, kernel, iterations = 1)
  
  img = no_lines_img
  boxes = get_boxes(no_lines_img)
  boxes += get_boxes(dil)
  
  sort_boxes_2d(boxes)
    
  for i in range(0, len(boxes) - 1):
    p1 = (boxes[i][0], boxes[i][1])
    p2 = (boxes[i+1][0], boxes[i+1][1])
    img = line(img, p1, p2, (0,255,0), 5)
    print(boxes[i][4])
  
  show(img)
  
  # show(no_lines_img)
  # show(dil)
  # combine_words()
  
  waitKey(0)
  destroyAllWindows()

if __name__ == "__main__":
  init()