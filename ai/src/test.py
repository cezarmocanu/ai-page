import cv2
import numpy as np
from constants import KEY, RESOURCES
from PIL import Image
import io

nparr = cv2.imread('{resources}/clinical_ds/jpg/1.jpg'.format(resources=RESOURCES))

img = Image.fromarray(nparr)
file_object = io.BytesIO()

# encoded = cv2.imencode('.jpg', img)[1].tostring()

# nparr = np.fromstring(encoded, np.uint8)

# img2 = cv2.imdecode(nparr, cv2.IMREAD_COLOR)



img.save(file_object, 'JPEG')

file_object.seek(0)
print(file_object.read())

# cv2.imshow('aa',img2)
# cv2.waitKey(0)

###problema este la cum se salveaza in bd