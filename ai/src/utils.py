import cv2 as cv
import random
import string
from constants import PRETTY_PRINTER
import json
import os.path
from os import path

def genRadomString():
  return ''.join(random.choice(string.ascii_lowercase) for i in range(10))

def getResource(resource, file_index = 0):
  if file_index >= len(resource['files']):
    return False
  filepath = r'{dir}/{file}'.format(dir=resource['path'], file=resource['files'][file_index]);
  
  if path.exists(filepath):
    return filepath
  
  return False

def show(img, name=None):
  if name is None:
    name = genRadomString()
  cv.imshow(name, img)
  
def pprint(obj):
  PRETTY_PRINTER.pprint(obj)
  
def to_json(filename, data):
  with open(filename, 'w') as outfile:
    json.dump(data, outfile)