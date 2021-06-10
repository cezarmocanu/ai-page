from flask import Blueprint, render_template, request,jsonify,abort, send_file
import json
import base64
from PIL import Image
from ocr.constants import KEY
import io
from schemas import dump
from models import *

AnalysisController = Blueprint('AnalysisController', __name__, url_prefix='/analysis')

def resize_image(aspect_string, image_stream):
    try:
        aspect = int(aspect_string)
    except:
        return image_stream

    image = Image.open(image_stream)
    width, height = image.size
    width *= aspect / 100
    height *= aspect / 100
    image.thumbnail((width, height), Image.ANTIALIAS)
    stream = io.BytesIO()
    image.save(stream, format='JPEG')
    stream.seek(0)
    
    return stream
    

@AnalysisController.route('/', methods=('GET', 'POST'))
def analyze():
    if request.method == 'POST':
        body = json.loads(request.data)
        template_form = TemplateForm.query.filter_by(id = body['form_id']).first()
        
        if template_form == None:
            return 'No form with id {}'.format()

        page = Page(order_number=int(body['order_number']), form_id=body['form_id'])
        for c_topic in body['topics']:
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
                
        # template_form.pages.append(page)
        ###TODO: Refactor so that you don't need to pass fomr_id when initializing page
        db.session.add(page)
        
        if len(template_form.pages) == len(template_form.images):
            template_form.status = 'ANALYSED'
        db.session.commit()
        
        return 'ANALYSIS CREATED'
    else:
        forms = TemplateForm.query.all()
        
        output = []
        
        for form in forms:
            form_data = dump(form)
            form_data['pages'] = len(form.pages)
            form_data['images'] = len(form.images)
            output.append(form_data)
        
        return jsonify(output)
    
@AnalysisController.route('/<form_id>')
def analysis_get_one(form_id):
    form = TemplateForm.query.filter_by(id = form_id).first_or_404(description='No form with that id')
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

@AnalysisController.route('/<form_id>/page/<page_number_str>')
def analysis_get_one_page(form_id, page_number_str):
    form = TemplateForm.query.filter_by(id = form_id).first_or_404(description='No form with that id')
    page_number = int(page_number_str)
    
    if page_number >= len(form.pages):
        abort(404)
        
    page = form.pages[page_number]    
    output = dump(page)
    topics = []
    for topic in page.topics:
        t = dump(topic)
        options = []
        for option in topic.options:
            options.append(dump(option))
        t['options'] = options
        topics.append(t)
    output['topics'] = topics
    
    return jsonify(output)

@AnalysisController.route('/<form_id>/image/<image_number_str>')
def analysis_get_one_image(form_id, image_number_str):
    form = TemplateForm.query.filter_by(id = form_id).first_or_404(description='No form with that id')
    image_number = int(image_number_str)
    
    if image_number >= len(form.images):
        abort(404)
    
    template_image = form.images[image_number]
    aspect = request.args.get('aspect')
    stream = resize_image(aspect, io.BytesIO(io.BytesIO(template_image.data)))
    
    return send_file(stream, mimetype='image/JPEG')