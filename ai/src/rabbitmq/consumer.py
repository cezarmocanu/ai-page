import pika, sys, os
from cv2 import *
import numpy as np
import requests
import base64
import json

from ocr.ocr import create_ocr_analisys, extract_data

def consumer():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()

    channel.queue_declare(queue='ocr')

    def callback(ch, method, properties, body):
        [form_id, order_number, encoded] = body.decode('utf-8').split(':')
        decoded = base64.b64decode(encoded)
        
        np_arr = np.frombuffer(decoded, dtype = np.uint8)
        image_buffer = cv2.imdecode(np_arr, flags = 1)

        print('Stated analysis of page {} form {}'.format(order_number,form_id))
        topics = create_ocr_analisys(image_buffer)
        print('Finished analysis of page {} form {}'.format(order_number,form_id))
        
        headers = {'Content-Type': 'application/json', 'Accept':'application/json'}
        data = {
            'form_id': form_id,
            'order_number': order_number,
            'topics': topics
        }
        requests.post(url = 'http://localhost:5000/analysis/', data=json.dumps(data), headers=headers)
        ##TODO: do something useful with response

    channel.basic_consume(queue='ocr', on_message_callback=callback, auto_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()
    
    
    

def diffConsumer():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()

    channel.queue_declare(queue='diff')

    def callback(ch, method, properties, body):
        [collection_id, order_number, options_roi, encoded, template_encoded] = body.decode('utf-8').split(':')
        
        decoded = base64.b64decode(encoded)
        template_decoded = base64.b64decode(template_encoded)
        
        np_arr = np.frombuffer(decoded, dtype = np.uint8)
        query_image = cv2.imdecode(np_arr, flags = 1)

        np_arr_2 = np.frombuffer(template_decoded, dtype = np.uint8)
        template_image = cv2.imdecode(np_arr_2, flags = 1)
        
        
        
        topics = options_roi.split('$')
        
        topics_roi = []
        
        for topic in topics:
            options = topic.split('#')
            rois = []
            if len(topic) > 0:
                for opt in options:
                    params = []
                    if len(opt) > 0:
                        for p in opt.split('|'):
                            params.append(int(p))
                        rois.append(params)
                topics_roi.append(rois)
        
        [extractions, birdeye] = extract_data(template_image, query_image, topics_roi)
        
        retval, buffer = cv2.imencode('.jpg', birdeye)
        birdeye_encoded = base64.b64encode(buffer).decode('utf-8')
        
        print('collection_id')
        print(collection_id)
        headers = {'Content-Type': 'application/json', 'Accept':'application/json'}
        data = {
            'collection_id': collection_id,
            'order_number': order_number,
            'extractions': extractions,
            'birdeye': birdeye_encoded,
            'collected_photo': encoded
        }
        requests.post(url = 'http://localhost:5000/collector/create', data=json.dumps(data), headers=headers)
        ##TODO: do something useful with response

    channel.basic_consume(queue='diff', on_message_callback=callback, auto_ack=True)

    print(' [*] Started DIFF CONSUMER. To exit press CTRL+C')
    channel.start_consuming()