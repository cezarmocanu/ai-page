import numpy as np
import cv2

from .utils import show

def match_keypoints(template_image, query_image):
    percent = 20
    h,w,_ = template_image.shape
    orb = cv2.ORB_create(1000)
    kp_t, desc_t = orb.detectAndCompute(template_image, None)
    kp_q, desc_q = orb.detectAndCompute(query_image, None)
    
    bf = cv2.BFMatcher(cv2.NORM_HAMMING)
    matches = bf.match(desc_q, desc_t)
    matches.sort(key = lambda x: x.distance)
    good = matches[:int(len(matches) * (percent / 100))]
    
    src_points = np.float32([kp_q[m.queryIdx].pt for m in good]).reshape(-1, 1, 2)
    dst_points = np.float32([kp_t[m.trainIdx].pt for m in good]).reshape(-1, 1, 2)
    
    M, _ = cv2.findHomography(src_points, dst_points, cv2.RANSAC, 5.0)
    birdeye = cv2.warpPerspective(query_image, M, (w,h))
    return birdeye

def extract_roi(birdeye, rois):
    
    pass