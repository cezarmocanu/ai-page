from cv2 import waitKey,imread, Sobel,filter2D, cvtColor, cornerHarris, morphologyEx
from cv2 import GaussianBlur, Canny, dilate, erode, bilateralFilter
from cv2 import CV_64F, COLOR_BGR2GRAY, MORPH_OPEN, MORPH_GRADIENT, MORPH_CLOSE, MORPH_TOPHAT, MORPH_BLACKHAT
from constants import CLINICAL_DS
from utils import show, getResource
import numpy as np


def selectCheckboxes():
  img1 = imread(getResource(CLINICAL_DS, 0))

  gray = cvtColor(img1,COLOR_BGR2GRAY)
  ###possible filter for selecting lines
  # blur_kernel = np.ones((9, 9))
  # blur_kernel *= -1
  # blur_kernel[4, :] = 81
  # blur_kernel /= 81

  blur = GaussianBlur(img1, (15,15) , 9)
  blur = bilateralFilter(blur,5,100,100)
  blur = bilateralFilter(blur,5,50,50)
  canny = Canny(blur, 100, 210)

  kernel = np.ones((3,3),np.uint8)

  dil_canny = dilate(canny, kernel, iterations=3)
  
  # final = dil_blackhat - dil_canny
  
  for_harris = np.float32(dil_canny)
  harris = cornerHarris(for_harris,4,3,0.04)

  dil_harris = dilate(harris, kernel, iterations=3)
  img1[dil_harris > 0.1 * dil_harris.max()] = [0,0,255]

  show(blur)
  show(dil_canny)
  show(img1)
  
  

def init():
  img1 = imread(getResource(CLINICAL_DS, 0))
  
  # gray = cvtColor(img1,COLOR_BGR2GRAY)

  

  # sobely = Sobel(gray,CV_64F, 1, 1, ksize=1)

  # gray = np.float32(gray)

  # dst = cornerHarris(gray,4,3,0.04)
  # kernel= np.ones((7,7), np.uint8)
  # dst = dilate(dst,kernel, iterations = 1)
  # img1[dst > 0.7 * dst.max()]= [255,127,127]



  #result is dilated for marking the corners, not important
  # dst = cv2.dilate(dst,None)
  # show(sobely)
  # show(img1)
  selectLines()


  waitKey(0)

if __name__ == "__main__":
  init()