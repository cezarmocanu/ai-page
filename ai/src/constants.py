import os

ROOT = os.path.dirname(os.path.realpath(__file__))
RESOURCES = '{root}/../resources'.format(root=ROOT)

CLINICAL_DS = {
  'path': '{RESOURCES}/clinical_ds/jpg'.format(RESOURCES=RESOURCES),
  'files': ['1.jpg', '2.jpg', '3.jpg']
}
