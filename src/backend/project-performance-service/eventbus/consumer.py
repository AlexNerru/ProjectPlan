from django.contrib.auth.models import User
from performance_indicators.models import Profile

from project_performance_service.settings import CELERY_BROKER_URL

import logging
import os
import socket

from celery import Celery
from kombu import Connection, Queue, Exchange

logger = logging.getLogger(__name__)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_service.settings')

app = Celery('project_service')


class Consumer:

    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super(Consumer, cls).__new__(cls)
        return cls.instance

    def __init__(self):
        with Connection(CELERY_BROKER_URL, heartbeat=1, connect_timeout=3600) as self.conn:
            with self.conn.channel() as self.channel:
                users_exchange = Exchange(name='users_exchange',
                                          type='fanout',
                                          durable=True,
                                          channel=self.channel)
                projects_exchange = Exchange(name='projects_exchange',
                                             type='fanout',
                                             durable=True,
                                             channel=self.channel)

                self.users_queue = Queue('projects_performance_users_queue',
                                         exchange=users_exchange,
                                         channel=self.channel)
                self.users_queue.declare(channel=self.channel)
                logger.info("Users queue created")

                self.projects_queue = Queue('projects_performance_projects_queue',
                                            exchange=projects_exchange,
                                            channel=self.channel)
                self.projects_queue.declare(channel=self.channel)
                logger.info("Projects queue created")

                self.consumer = self.conn.Consumer(self.users_queue, self.channel)
                self.consumer.register_callback(Consumer.user_created_event_handler)
                self.consumer.consume()

                self.projects_consumer = self.conn.Consumer(self.projects_queue, self.channel)
                self.projects_consumer.register_callback(Consumer.user_created_event_handler)
                self.projects_consumer.consume()

                self.__run()

    def __establish_connection(self):
        revived_connection = self.conn.clone()
        revived_connection.ensure_connection(max_retries=3)
        new_channel = revived_connection.channel()
        self.consumer.revive(new_channel)
        self.consumer.consume()
        self.projects_consumer.revive(new_channel)
        self.projects_consumer.consume()
        return revived_connection

    def __consume(self):
        new_conn = self.__establish_connection()
        while True:
            try:
                logger.debug("Draining Events")
                new_conn.drain_events(timeout=3)
            except socket.timeout:
                logger.debug("Heart Beat Check")
                new_conn.heartbeat_check()

    def __run(self):
        while True:
            try:
                self.__consume()
            except self.conn.connection_errors:
                logger.debug("Connection Revived")

    @staticmethod
    def user_created_event_handler(body, message):
        logger.info("Message accepted: {0!r}".format(body))
        if message['version'] == '1.0':
            try:
                user = User(username=body['username'])
                user.set_unusable_password()
                user.save()
                profile = Profile(user=user, user_service_id=body['id'])
                profile.save()
                message.ack()
                logger.info("User created")
            except Exception as e:
                logger.exception(e)
                message.requeue()
        else:
            logger.debug("Message has invalid version{0!r}".format(body))

    @staticmethod
    def projects_created_event_handler(body, message):
        logger.info("Message accepted: {0!r}".format(body))
        if message['version'] == '1.0':
            try:
                pass
            except Exception as e:
                logger.exception(e)
                message.requeue()
        else:
            logger.debug("Message has invalid version{0!r}".format(body))
