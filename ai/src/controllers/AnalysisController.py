from flask import Blueprint, render_template, request,jsonify
import json
import base64
from ocr.constants import KEY
from schemas import dump
from models import *

AnalysisController = Blueprint('AnalysisController', __name__, url_prefix='/analysis')

@AnalysisController.route('/', methods=('GET', 'POST'))
def template():
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
                
        template_form.pages.append(page)
        ###TODO: Refactor so that you don't need to pass fomr_id when initializing page
        
        if len(template_form.pages) == len(template_form.images):
            template_form.status = 'ANALYSED'
            
        db.session.add(page)
        db.session.commit()
        
        return 'ANALYSIS CREATED'
    else:
        return 'GET'










