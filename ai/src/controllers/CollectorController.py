from flask import Blueprint, render_template, request,jsonify,Response
import json
import base64
import io
import numpy as np
from PIL import Image

from schemas import dump
from models import db, TemplateForm, TemplateImage, Page, Collection, CollectedImage, Topic, ExtractedPage,Extraction, BirdeyeImage
from rabbitmq import MQ


CollectorController = Blueprint('CollectorController', __name__, url_prefix='/collector')


@CollectorController.route('/<form_id>/json', methods=['POST', 'GET'])
def collection_json(form_id):
    template_form = TemplateForm.query.filter_by(id = form_id).first_or_404('No form with that id')
    
    data = []
    
    
    collections = template_form.collections
    for collection in collections:
        extracted_pages = collection.extracted
        for extracted_page in extracted_pages:
            
            order_number = extracted_page.order_number
            data_page = template_form.pages[order_number]
            
            for topic in data_page.topics:
                data_topic = {
                    'topic': topic.title
                }
                
                data_options = []
                for option in topic.options:
                    opt = {
                        'name': option.label,
                        'value' : 0
                    }
                
                    for extraction in extracted_page.extractions:
                        if str(extraction.option_id) in str(option.id):
                            opt['value'] += 1

                    data_options.append(opt)
                
                data_topic['options'] = data_options
                data.append(data_topic)
                    
    
    content = str({'data':data})
    content = content.replace('\'', '\"')
    return Response(content,  mimetype='application/json',headers={'Content-Disposition':f'attachment;filename={template_form.title}-{template_form.id}.json'})
    
    
@CollectorController.route('/<form_id>', methods=['POST', 'GET'])
def collection_control(form_id):
    if (request.method == 'POST'):
        form_data = request.form.to_dict()
        template_form = TemplateForm.query.filter_by(id = form_id).first()
        collection = Collection(form_id=form_id)
        db.session.add(collection)
        db.session.flush()

        #key is the page number
        for index, key in enumerate(form_data.keys()):
            encoded = form_data[key]
            # template_encoded = template_form.images[int(key)]
            
            template_encoded = None
            page_order_number = int(key)
            print()
            print(key)
            print()
            options_roi = ''
            
            for image in template_form.images:
                if image.order_number == page_order_number:
                    template_encoded = str(base64.b64encode(image.data))[2: -1]
                    break
            
            
            for page in template_form.pages:
                if page.order_number == page_order_number:
                    # print(page.topics)
                    for topic in page.topics:
                        print(topic.id)
                        for option in topic.options:
                            id = option.id
                            x  = option.x 
                            y  = option.y 
                            w  = option.w 
                            h  = option.h 
                            roi = f'{topic.id}|{id}|{x}|{y}|{w}|{h}#'
                            options_roi += roi
                        options_roi += '$'
                    break
            MQ.publishIn('diff',f'{collection.id}:{key}:{options_roi}:{encoded}:{template_encoded}')
        db.session.commit()
        return 'done'
    else:
        template_form = TemplateForm.query.filter_by(id = form_id).first_or_404('No form with that id')
        
        return jsonify(dump(template_form.collections))
        
        

@CollectorController.route('/<form_id>/topic/<topic_id>')
def collection_options_statistics(form_id, topic_id):
    template_form = TemplateForm.query.filter_by(id = int(form_id)).first()
    topic = Topic.query.filter_by(id = int(topic_id)).first()
    
    option_ids = {}
    for opt in topic.options:
        option_ids[str(opt.id)] = 0
    
    
    collections = template_form.collections
    
    
    for collection in collections:
        pages = collection.extracted
        for page in pages:
            for extraction in page.extractions:
                print(extraction.topic_id)
                if str(extraction.option_id) in option_ids.keys():
                    option_ids[str(extraction.option_id)] += 1
                    
    
    return jsonify(option_ids)

              
        
    
@CollectorController.route('/create', methods=['POST', 'GET'])
def create_collection():
    if (request.method == 'POST'):
        body = json.loads(request.data)
        
        collection_id = body['collection_id']
        order_number = body['order_number']
        birdeye_encoded = body['birdeye']
        collected_encoded = body['collected_photo']
        extractions = body['extractions']
        
        collection = Collection.query.filter_by(id = int(collection_id)).first()
        
        extraction_page = ExtractedPage(order_number = int(order_number), collection_id = collection_id)
        birdeye_image = BirdeyeImage(data = base64.b64decode(birdeye_encoded),order_number = int(order_number), collection_id = collection_id)
        collected_image = CollectedImage(data = base64.b64decode(collected_encoded), order_number = int(order_number), collection_id = collection_id)
        
        for extr in extractions:
            extraction = Extraction(option_id=extr['option_id'] , topic_id=extr['topic_id'])
            extraction_page.extractions.append(extraction)
            db.session.add(extraction)
            
        db.session.add(extraction_page)
        db.session.add(birdeye_image)
        db.session.add(collected_image)
        
        db.session.commit()
        
        return 'success'
    
