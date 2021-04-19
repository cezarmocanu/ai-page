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


def combine_words():
  data1 = [[759544, 'Clinical', 95, 358, 306], [762249, 'Data', 95, 582, 307], [759909, 'Set', 96, 723, 306], [792266, '(To', 89, 827, 319], [792337, 'fill', 89, 898, 319]]
  data2 = [[757062, 'Clinical', 96, 357, 305], [759767, 'Data', 95, 581, 306], [757427, 'Set', 96, 722, 305], [789784, '(To', 37, 826, 318], [789855, 'fill', 94, 897, 318]]
  
  data = []

  # i = 0
  # j = 0
  
  # while i < len(data1) and j < len(data2):
  #   if data1[i][0] <= data2[j][0]:
  #     data.append(data1[i])
  #     i += 1      
  #   else:
  #     data.append(data2[j])
  #     j += 1
  
  # print(i,j)
  # # if i >= j:
  # #   while i <= len(data1):
  # #     data.append(data1[i])
  # #     i += 1      
  
  # if i < j:
  #   while i < len(data1):
  #     data.append(data1[i])
  #     i += 1 
  # else:
  #   while j < len(data2):
  #     data.append(data2[2])
  #     j += 1 
  
  data = np.array(data)
  
  print(data[::,0])
  print(data[::,1])
  print(data[::,2])

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