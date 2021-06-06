import pika, sys, os
from cv2 import *
import numpy as np
import requests
import base64
import json

from ocr.ocr import create_ocr_analisys

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