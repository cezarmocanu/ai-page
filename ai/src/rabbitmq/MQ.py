from pika import BlockingConnection,ConnectionParameters
import sys
class MQ:

    @staticmethod    
    def publishIn(queue, body):
        connection = BlockingConnection(ConnectionParameters(host='localhost'))
        channel = connection.channel()
        channel.queue_declare(queue=queue)
        channel.basic_publish(exchange='', routing_key=queue, body=body)        
        connection.close()



