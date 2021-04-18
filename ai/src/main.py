
from cv2 import *
from constants import CLINICAL_DS
from utils import show, getResource
import numpy as np


def selectCheckboxes(img, contour_weight = 20):
  ##adaugarea de blur gausian pentru a diferentia zonele de interes
  blur = GaussianBlur(img, (15,15) , 9)
  
  ##filtrarea bilaterala ce are scopul de a pastra muchiile in timp ce filtreaza
  ##sunetul ce afeacteaza imaginea
  blur = bilateralFilter(blur,5,100,100)
  
  ##detectarea muchiilor
  canny = Canny(blur, 100, 210)
  
  ##dilatarea muchiilor pentru unirea contururilor
  kernel = np.ones((3,3),np.uint8)
  dil_canny = dilate(canny, kernel, iterations = 2)
  
  ##detectarea de contururi si filtrarea lor in functie de dimensiune
  contours, _ = findContours(dil_canny, RETR_EXTERNAL, CHAIN_APPROX_NONE)
  contours = np.array(contours)
  
  areas_filter = np.array([True if contourArea(ctr) >= 500 else False  for ctr in contours])
  goodContours = contours[areas_filter]
  
  mask = np.zeros_like(img)
  drawContours(mask, goodContours, -1, (255,255,255), contour_weight)

  return mask

def init():
  img1 = imread(getResource(CLINICAL_DS, 2))
  
  no_checkboxes_img = add(img1,selectCheckboxes(img1))

  show(no_checkboxes_img)
  waitKey(0)
  destroyAllWindows()

if __name__ == "__main__":
  init()