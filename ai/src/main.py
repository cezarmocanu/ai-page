import cv2 as cv
import os
import random
import string

ROOT = os.path.dirname(os.path.realpath(__file__))
RESOURCES = '{root}/../resources'.format(root=ROOT)

CLINICAL_DS = {
  'path': '{RESOURCES}/clinical_ds/jpg'.format(RESOURCES=RESOURCES),
  'files': ['1.jpg', '2.jpg', '3.jpg']
}

def genRadomString():
  return ''.join(random.choice(string.ascii_lowercase) for i in range(10))

def getResource(resource, file_index = 0):
  return r'{dir}/{file}'.format(dir=resource['path'], file=resource['files'][file_index]);

def show(img, name=None):
  if name is None:
    name = genRadomString()
  cv.imshow(name, img)

def init():
  
  img1 = cv.imread(getResource(CLINICAL_DS, 0))
  show(img1)
  cv.waitKey(0)

if __name__ == "__main__":
  init()