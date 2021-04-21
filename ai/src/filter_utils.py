from cv2 import *
import numpy as np

def selectCheckboxes(img, contour_weight = 15):
  ##adaugarea de blur gausian pentru a diferentia zonele de interes
  blur = GaussianBlur(img, (15,15) , 9)
  
  ##filtrarea bilaterala ce are scopul de a pastra muchiile in timp ce filtreaza
  ##sunetul ce afeacteaza imaginea
  blur = bilateralFilter(blur,5,100,100)
  
  ##detectarea muchiilor
  canny = Canny(blur, 100, 210)
  
  ##dilatarea muchiilor pentru unirea contururilor
  kernel = np.ones((3,3),np.uint8)
  dil_canny = dilate(canny, kernel, iterations = 3)
  
  ##detectarea de contururi si filtrarea lor in functie de dimensiune
  contours, _ = findContours(dil_canny, RETR_EXTERNAL, CHAIN_APPROX_NONE)
  contours = np.array(contours, dtype=object)
  
  areas_filter = np.array([True if contourArea(ctr) >= 1000 else False  for ctr in contours])
  good_contours = contours[areas_filter]
  
  mask = np.zeros_like(img)
  drawContours(mask, good_contours, -1, (255,255,255), contour_weight)

  contours_bbox = []
  for ctr in good_contours:
    (x, y, w, h) = boundingRect(ctr)
    contours_bbox.append([x, y, w, h])
    
  return mask, contours_bbox


def selectLines(img):
  canny = Canny(img, 100, 200)
  
  kernel = np.ones((3,3),np.uint8)
  dil_canny = dilate(canny, kernel, iterations = 1)
  
  se = getStructuringElement(MORPH_RECT,(15,15))
  closing = morphologyEx(dil_canny, MORPH_CLOSE, se)
  
  se = getStructuringElement(MORPH_CROSS,(9,9))
  tophat = morphologyEx(closing, MORPH_TOPHAT, se)
  
  se = getStructuringElement(MORPH_RECT,(9,5))
  open_morph = morphologyEx(tophat, MORPH_OPEN, se)
  
  contours, _ = findContours(open_morph, RETR_EXTERNAL, CHAIN_APPROX_NONE)
  contours = np.array(contours, dtype=object)
  
  areas = np.array([contourArea(ctr) for ctr in contours])
  max_area = areas.max()
  areas_filter = np.array([True if area >= max_area * 0.1 else False  for area in areas])
  good_contours = contours[areas_filter]
  
  mask = np.zeros_like(img)
  drawContours(mask, good_contours, -1, (255,255,255), -1)
  
  return mask

def selectGrayboxes(img):
  hsv = cvtColor(img, COLOR_BGR2HSV)
  gray_mask = inRange(hsv, (0, 0, 100), (255, 10, 230))
  se = getStructuringElement(MORPH_RECT, (100,5))
  closing = morphologyEx(gray_mask, MORPH_CLOSE, se)
  
  contours, _ = findContours(closing, RETR_EXTERNAL, CHAIN_APPROX_NONE)
  contours = np.array(contours, dtype=object)
  
  areas = np.array([contourArea(ctr) for ctr in contours])
  max_area = areas.max()
  mask = np.zeros_like(img)
  
  if max_area < 100_000:
    return mask
  
  areas_filter = np.array([True if area >= max_area * 0.5 else False  for area in areas])
  good_contours = contours[areas_filter]
  
  drawContours(mask, good_contours, -1, (255,255,255), -1)
  drawContours(mask, good_contours, -1, (255,255,255), 20)
  return mask

