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
    
def is_page_verified(queried_page):
    total_entries = 0
    verified_topics = 0
    verified_options = 0

    total_entries += len(queried_page.topics)
    
    for topic in queried_page.topics:
        if topic.verified == True:
            verified_topics += 1
        
        for option in topic.options:
            if option.verified == True:
                verified_options += 1
                
        total_entries += len(topic.options)
    
    return verified_topics+verified_options == total_entries

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
        status = request.args.get('status')
        forms = []
        
        if status != None:
            forms = TemplateForm.query.filter_by(status=status)
        else:
            forms = TemplateForm.query.all()
        
        output = []
        
        for form in forms:
            form_data = dump(form)
            form_data['pages'] = len(form.pages)
            form_data['images'] = len(form.images)
            output.append(form_data)
        
        return jsonify(output)
    
@AnalysisController.route('/<form_id>', methods=['GET', 'DELETE'])
def analysis_get_one(form_id):
    if request.method == 'DELETE':
        form = TemplateForm.query.filter_by(id = form_id).first_or_404(description='No form with that id')
        db.session.delete(form)
        db.session.commit()
        return 'ok'
    if request.method == 'GET':
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
                t['options'] = sorted(options, key=lambda opt: int(opt['id']), reverse=False)
                topics.append(t)
            p['topics'] = sorted(topics, key=lambda top: int(top['id']), reverse=False)
            output['pages'].append(p)

        pages = sorted(output['pages'], key=lambda page: int(page['order_number']), reverse=False)

        output['pages'] = pages


        return jsonify(output)

@AnalysisController.route('/<form_id>/page/<page_number_str>')
def analysis_get_one_page(form_id, page_number_str):
    form = TemplateForm.query.filter_by(id = form_id).first_or_404(description='No form with that id')
    page_number = int(page_number_str)
    
    if page_number >= len(form.pages):
        abort(404)
        
    page_index = None
    for index,page in enumerate(form.pages):
        if page.order_number == page_number:
            page_index = index
            break
    
    if page_index == None:
        return 'No page found with that order_number'
    
    page = form.pages[page_index]    
    output = dump(page)
    topics = []
    for topic in page.topics:
        t = dump(topic)
        options = []
        for option in topic.options:
            options.append(dump(option))
        t['options'] = sorted(options, key=lambda opt: int(opt['id']), reverse=False)
        topics.append(t)
    output['topics'] = sorted(topics, key=lambda top: int(top['id']), reverse=False)

    
    return jsonify(output)

@AnalysisController.route('/<form_id>/image/<image_number_str>')
def analysis_get_one_image(form_id, image_number_str):
    form = TemplateForm.query.filter_by(id = form_id).first_or_404(description='No form with that id')
    image_number = int(image_number_str)

    if image_number >= len(form.images):
        abort(404)
    
    template_image = form.images[image_number]
    aspect = request.args.get('aspect')
    stream = resize_image(aspect, io.BytesIO(template_image.data))
    
    return send_file(stream, mimetype='image/JPEG')

@AnalysisController.route('/update', methods=['PUT'])
def analysis_update_data():
    # form = TemplateForm.query.filter_by(id = form_id).first_or_404(description='No form with that id')
    
    ##TODO verify if body is ok
    id = int(request.json['id'])
    entity_type = request.json['type']
    value = request.json['value']
    
    if entity_type == 'OPTION':
        option = Option.query.filter_by(id = id).first_or_404(description='Entity does not exist')    
        option.verified = True
        option.label = value
        
    if entity_type == 'TOPIC':
        topic = Topic.query.filter_by(id = id).first_or_404(description='Entity does not exist')
        topic.verified = True
        topic.title = value
    
    ##TODO automatic verified for bigger entities
    db.session.commit()
    return 'success'


@AnalysisController.route('<form_id>/page/<page_number>/update', methods=['PUT'])
def analysis_update_data_and_verify(form_id, page_number):
    form = TemplateForm.query.filter_by(id = form_id).first_or_404(description='No form with that id')
    
    ###TODO de utilizat si in cazul la celelalte cautari de pagini
    page_order_number = int(page_number)
    page_index = None
    for index,page in enumerate(form.pages):
        if page.order_number == page_order_number:
            page_index = index
            break
    
    if page_index == None:
        return 'No page found with that order_number'

    
    id = int(request.json['id'])
    entity_type = request.json['type']
    value = request.json['value']
    
    if entity_type == 'OPTION':
        option = Option.query.filter_by(id = id).first_or_404(description='Entity does not exist')    
        option.verified = True
        option.label = value
        
    if entity_type == 'TOPIC':
        topic = Topic.query.filter_by(id = id).first_or_404(description='Entity does not exist')
        topic.verified = True
        topic.title = value

    queried_page = form.pages[page_index]
    
    if is_page_verified(queried_page):
        queried_page.verified = True
    
    form_verified = True
    for index,page in enumerate(form.pages):
        if page.verified == False:
            form_verified = False
            break
    
    if form_verified:
        form.status = 'VERIFIED'

    db.session.commit()
    
    return 'success'

@AnalysisController.route('<form_id>/page/<page_number>/verify', methods=['PUT'])
def analysis_verify_page_data(form_id, page_number):
    form = TemplateForm.query.filter_by(id = form_id).first_or_404(description='No form with that id')
    
    ###TODO de utilizat si in cazul la celelalte cautari de pagini
    page_order_number = int(page_number)
    page_index = None
    for index,page in enumerate(form.pages):
        if page.order_number == page_order_number:
            page_index = index
            break
    
    if page_index == None:
        return 'No page found with that order_number'

    
    id = int(request.json['id'])
    entity_type = request.json['type']
    
    Model = None
    
    if entity_type == 'OPTION':
        Model = Option
    if entity_type == 'TOPIC':
        Model = Topic

    entity = Model.query.filter_by(id = id).first_or_404(description='Entity does not exist')    
    
    if entity == None:
        return 'Entity could not be found'
    
    entity.verified = True  
    queried_page = form.pages[page_index]
    
    if is_page_verified(queried_page):
        queried_page.verified = True
        
    form_verified = True
    for index,page in enumerate(form.pages):
        if page.verified == False:
            form_verified = False
            break
    
    if form_verified:
        form.status = 'VERIFIED'
        
    db.session.commit()
    
    return 'success'