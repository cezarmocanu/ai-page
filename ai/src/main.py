
from cv2 import *
from constants import CLINICAL_DS
from utils import show, getResource
from image_utils import *
import numpy as np
  
def init():
  img1 = imread(getResource(CLINICAL_DS, 2))
  
  no_graybox = add(img1, selectGrayboxes(img1))
  # show(no_graybox)
  
  no_checkboxes_img = add(no_graybox, selectCheckboxes(no_graybox))
  # show(no_checkboxes_img)
  
  no_lines_img = add(no_checkboxes_img, selectLines(no_checkboxes_img))
  
  show(no_lines_img)
  no_lines_img = ~no_lines_img
  
  kernel = np.ones((5,5),np.uint8)
  dil = dilate(no_lines_img, kernel, iterations = 2)
  
  show(no_lines_img)
  # show(dil)
  
  waitKey(0)
  destroyAllWindows()

if __name__ == "__main__":
  init()