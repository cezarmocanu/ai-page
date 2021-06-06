from flask import Blueprint, render_template, request,jsonify
import base64

from schemas import dump
from models import db, TemplateForm, TemplateImage, Page
from rabbitmq import MQ

TemplateController = Blueprint('TemplateController', __name__, url_prefix='/template')

@TemplateController.route('/', methods=('GET', 'POST'))
def template():
    if request.method == 'POST':
        form_data = request.form.to_dict()
        template_form = TemplateForm(title=form_data['title'], status='NEW')
        db.session.add(template_form)
        db.session.flush()
        del form_data['title']
        
        for index, key in enumerate(form_data.keys()):
            _, encoded = form_data[key].split(",", 1)
            decoded = base64.b64decode(encoded)
            template_image = TemplateImage(data=decoded, order_number=index)        
            template_form.images.append(template_image)
            db.session.add(template_image)
            MQ.publishIn('ocr',f'{template_form.id}:{index}:{encoded}')
            
        db.session.commit()
        
        return 'IMAGES RECIEVED'
    else:
        return 'GET template'










