import os

ROOT = os.path.dirname(os.path.realpath(__file__))
RESOURCES = '{root}/../resources'.format(root=ROOT)

CLINICAL_DS = {
  'path': '{RESOURCES}/clinical_ds/jpg'.format(RESOURCES=RESOURCES),
  'files': ['1.jpg', '2.jpg', '3.jpg']
}


class KEY:
  X = 0
  Y = 1
  W = 2
  H = 3
  TEXT = 4
  CONF = 5