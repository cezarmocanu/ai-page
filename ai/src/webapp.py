from flask import Flask, jsonify,send_file
from flask_cors import CORS
from ocr import OCR, GET_IMAGE, LOAD_DATA
from PIL import Image
import io


app = Flask(__name__)
CORS(app)
# from src.ocr.ocr import OCR

    
@app.route('/ocranalyze/<page_number>')
def get_analyze(page_number = 0):
    compressed_topics = OCR(int(page_number))
    return jsonify(compressed_topics)

@app.route('/ocr/<page_number>')
def get_ocr(page_number = 0):
    data = LOAD_DATA(int(page_number))
    return jsonify(data)

@app.route('/image/<page_number>')
def get_image(page_number = 0):
    arr = GET_IMAGE(int(page_number))
    img = Image.fromarray(arr.astype('uint8'))

    file_object = io.BytesIO()

    img.save(file_object, 'JPEG')

    file_object.seek(0)

    return send_file(file_object, mimetype='image/JPEG')

# @app.route('/image/<page_number>')
# def get_image(page_number = 0):
#     arr = GET_IMAGE(int(page_number))
#     img = Image.fromarray(arr.astype('uint8'))

#     file_object = io.BytesIO()

#     img.save(file_object, 'JPEG')

#     file_object.seek(0)

#     return send_file(file_object, mimetype='image/JPEG')
