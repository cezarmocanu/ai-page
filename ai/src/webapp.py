from flask import Flask, jsonify,send_file, request
from flask_cors import CORS
from ocr import OCR, GET_IMAGE, LOAD_DATA
from PIL import Image
import io
import base64


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


@app.route('/collector/', methods = ['POST', 'GET'])
def collector():
    if request.method == 'POST':
        form_data = request.form.to_dict()
        img_data = base64.b64decode(form_data['image'])
        file_name = 'collected-images/1-collected.jpg'
        with open(file_name, 'wb') as f:
            f.write(img_data)
        return 'SUCCESS'
    else:
        return 'NO GET'
# @app.route('/image/<page_number>')
# def get_image(page_number = 0):
#     arr = GET_IMAGE(int(page_number))
#     img = Image.fromarray(arr.astype('uint8'))

#     file_object = io.BytesIO()

#     img.save(file_object, 'JPEG')

#     file_object.seek(0)

#     return send_file(file_object, mimetype='image/JPEG')
