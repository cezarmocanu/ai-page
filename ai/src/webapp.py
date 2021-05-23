from flask import Flask, jsonify,send_file, request
from flask_cors import CORS
from ocr import OCR, GET_IMAGE, LOAD_DATA
from constants import KEY
from PIL import Image
import io
import base64

from models import *
from schemas import dump,ma

DB_STRING = 'postgresql+psycopg2://ai-page-admin:123456@localhost:5432/ai-page-db'

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_STRING
db.init_app(app)
ma.init_app(app)
CORS(app)

db.create_all(app=app)

@app.route('/form/<form_id>/add_page/')
def test(form_id = 0):
    form = Form.query.filter_by(id=form_id).first_or_404(description='No form with that id')
    return jsonify(dump(form.pages))
    
    
    # page = Page(order_number=len(form.pages) + 1,form_id=form_id)
    # form.pages.append(page)
    
    # db.session.add(page)
    # db.session.commit()
    
    # fs = FormSchema()
    # ps = PageSchema(many=True)
    # print((fs.dump(form).values))
    # return jsonify(ps.dump(form.pages))
    
@app.route('/ocr_analyze/<page_number>')
def analyze(page_number = 0):
    
    ###TODO de verificat daca pagina deja a fost analizata
    ###
    
    compressed_topics = OCR(int(page_number))
    
    page = Page(order_number=1)
    for c_topic in compressed_topics:
        topic = Topic(title=c_topic[KEY.TITLE])
        c_inputs = c_topic[KEY.INPUTS]
        
        for c_input in c_inputs:
            option = Option(
                label = c_input[KEY.LABEL],
                x = c_input[KEY.CHECBOX][KEY.X],
                y = c_input[KEY.CHECBOX][KEY.Y],
                w = c_input[KEY.CHECBOX][KEY.W],
                h = c_input[KEY.CHECBOX][KEY.H],
            )
            db.session.add(option)
            topic.options.append(option)
            
        db.session.add(topic)
        page.topics.append(topic)
    
    form = Form(title='Clinical_ds')
    form.pages.append(page)
    
    db.session.add(page)
    db.session.add(form)
    db.session.commit()

    return jsonify(compressed_topics)

@app.route('/ocr/<form_id>')
def get_analysis(form_id = 0):
    form = Form.query.filter_by(id=form_id).first_or_404(description='No form with that id')
    output = dump(form)
    output['pages'] = []
    
    
    for page in form.pages:
        p = dump(page)
        topics = []
        for topic in page.topics:
            t = dump(topic)
            options = []
            for option in topic.options:
                options.append(dump(option))
            t['options'] = options
            topics.append(t)
        p['topics'] = topics
        output['pages'].append(p)
    
    
    
    
    
    return jsonify(output)

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
