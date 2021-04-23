from flask import Flask, jsonify,send_file
app = Flask(__name__)
from ocr import OCR, GET_IMAGE
from PIL import Image
import io

# from src.ocr.ocr import OCR

    
@app.route('/ocr/<page_number>')
def get_ocr(page_number = 0):
    # compressed_topics = OCR(int(page_number))
    return jsonify('ok')

@app.route('/image/<page_number>')
def get_image(page_number = 0):
    arr = GET_IMAGE(int(page_number))
    img = Image.fromarray(arr.astype('uint8'))

    file_object = io.BytesIO()

    img.save(file_object, 'JPEG')

    file_object.seek(0)

    return send_file(file_object, mimetype='image/JPEG')
