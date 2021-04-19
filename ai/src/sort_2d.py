  
import numpy as np
import math

def get_angle(center, p):
  x = [center[0] - p[0]]
  y = [center[1] - p[1]]
  angle = np.arctan2(y, x)[0]
  if angle <= 0:
    angle += 2 * np.pi
  return angle

def get_distance(p1, p2):
  x = p1[0] - p2[0]
  y = p1[1] - p2[1]
  return math.sqrt(x ** 2 + y ** 2)
  
def compare_points(center, pt1, pt2):
  ang1 = get_angle(center, pt1)
  ang2 = get_angle(center, pt2)
  if ang1 < ang2:
    return True
  d1 = get_distance(center, pt1)
  d2 = get_distance(center, pt2)
  if ang1 == ang2 and d1 < d2:
    return True
  
  return False

### Accepta un array de boxes de tipul [x,y,w,h,word,conf] ca si points
### o sa accepte doar x,y
def sort_boxes_2d(points):
  pts = np.array(points)
  
  c_x = int(np.mean(pts[::, 0].astype(np.float)))
  c_y = int(np.mean(pts[::, 1].astype(np.float)))
  
  for i in range(0, len(points)):
    points[i][0] -= c_x
    points[i][1] -= c_y
  
  # #######!!!!!!!!!!!MAKE IT MORE PERFORMANT!!!!!###########
  for i in range(0, len(points)):
    for j in range(0, len(points)):
      if compare_points([c_x, c_y], points[i], points[j]):
        points[i], points[j] = points[j], points[i]
  
  for i in range(0, len(points)):
    points[i][0] += c_x
    points[i][1] += c_y
    
  return points