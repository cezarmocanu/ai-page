import cv2 as cv
import random
import string

def genRadomString():
  return ''.join(random.choice(string.ascii_lowercase) for i in range(10))

def getResource(resource, file_index = 0):
  return r'{dir}/{file}'.format(dir=resource['path'], file=resource['files'][file_index]);

def show(img, name=None):
  if name is None:
    name = genRadomString()
  cv.imshow(name, img)