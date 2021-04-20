from __future__ import absolute_import, unicode_literals

import os

import socket
from celery import Celery
from kombu import Connection, Queue
from project_service.settings import CELERY_BROKER_URL

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_service.settings')

app = Celery('project_service')
app.config_from_object('django.conf:settings', namespace='CELERY')


def callback(body, message):
    print('RECEIVED MESSAGE: {0!r}'.format(body))
    message.ack()


def create_queues():
    with Connection(CELERY_BROKER_URL, heartbeat=1, connect_timeout=3600) as conn:
        with conn.channel() as channel:
            users_queue = Queue('users_queue', routing_key='user_created', exchange='users_exchange', channel=channel)

            users_queue.declare(channel=channel)

            consumer = conn.Consumer(users_queue, channel)

            consumer.register_callback(callback)

            consumer.consume()

            def establish_connection():
                revived_connection = conn.clone()
                revived_connection.ensure_connection(max_retries=3)
                channel = revived_connection.channel()
                consumer.revive(channel)
                consumer.consume()
                return revived_connection

            def consume():
                new_conn = establish_connection()
                while True:
                    try:
                        new_conn.drain_events(timeout=3)
                    except socket.timeout:
                        new_conn.heartbeat_check()

            def run():
                while True:
                    try:
                        consume()
                    except conn.connection_errors:
                        print("connection revived")

            run()
