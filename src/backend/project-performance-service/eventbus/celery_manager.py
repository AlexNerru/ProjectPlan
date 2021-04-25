from __future__ import absolute_import, unicode_literals

import os
import socket
import logging

from celery import Celery
from kombu import Connection, Queue, Exchange

from django.contrib.auth.models import User
from performance_indicators.models import Profile

from project_performance_service.settings import CELERY_BROKER_URL

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_performance_service.settings')

app = Celery('project_performance_service')
app.config_from_object('django.conf:settings', namespace='CELERY')
logger = logging.getLogger(__name__)


def user_created_event_handler(body, message):
    logger.info("Message accepted: {0!r}".format(body))
    try:
        message.ack()
        user = User(username=body['username'])
        user.set_unusable_password()
        user.save()
        profile = Profile(user=user, user_service_id=body['id'])
        profile.save()
        logger.info("User created")
    except Exception as e:
        logger.exception(e)
        message.requeue()


def create_queues():
    with Connection(CELERY_BROKER_URL, heartbeat=1, connect_timeout=3600) as conn:
        with conn.channel() as channel:
            logger.info("Project performance: creating queues")

            producer = conn.Producer(serializer='json')

            users_exchange = Exchange(name='users_exchange', type='fanout', durable=True, channel=channel)

            users_exchange.declare()

            users_queue = Queue('performance_users_queue',
                                exchange=users_exchange, channel=channel)

            users_queue.declare(channel=channel)

            consumer = conn.Consumer(users_queue, channel)

            consumer.register_callback(user_created_event_handler)

            consumer.consume()

            def establish_connection():
                revived_connection = conn.clone()
                revived_connection.ensure_connection(max_retries=3)
                new_channel = revived_connection.channel()
                consumer.revive(new_channel)
                consumer.consume()
                return revived_connection

            def consume():
                new_conn = establish_connection()
                while True:
                    try:
                        logger.debug("Draining Events")
                        new_conn.drain_events(timeout=3)
                    except socket.timeout:
                        logger.debug("Heart Beat Check")
                        new_conn.heartbeat_check()

            def run():
                while True:
                    try:
                        consume()
                    except conn.connection_errors:
                        logger.debug("Connection Revived")

            run()
