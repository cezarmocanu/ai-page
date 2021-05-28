import pika, sys, os
import requests
from ocr.ocr import OCR

def consumer():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()

    channel.queue_declare(queue='hello')

    def callback(ch, method, properties, body):
        
        [page_number] = body.decode('utf-8').split(':')
        page_number = int(page_number)
        
        print('Stated analysis of page {}'.format(page_number))
        compressed_topics = OCR(page_number)
        print('Finished analysis of page {}'.format(page_number))
        # print(response.status_code)
        # print(response.content)

    channel.basic_consume(queue='hello', on_message_callback=callback, auto_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()


    # try:
    #     main()
    # except KeyboardInterrupt:
    #     print('Interrupted')
    #     try:
    #         sys.exit(0)
    #     except SystemExit:
    #         os._exit(0)