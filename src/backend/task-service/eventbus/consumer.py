import logging
import os
import socket

from celery import Celery
from kombu import Connection, Queue, Exchange, Consumer

from django.contrib.auth.models import User

from guardian.shortcuts import assign_perm

from tasks.models import Profile, Project, Resource

from task_service.settings import CELERY_BROKER_URL

logger = logging.getLogger('default')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'task_service.settings')

app = Celery('task_service')


def event_handler(func):
    def inner(*args, **kwargs):
        logger.info("Message accepted: {0!r}".format(args[0]))
        if args[0]['version'] == '1.0':
            try:
                obj = func(*args, **kwargs)
                args[1].ack()
                logger.info("Object {0!r} was created".format(str(obj)))
            except Exception as e:
                logger.exception(str(e))
                args[1].ack()
        else:
            logger.debug("Message has invalid version{0!r}".format(args[0]))

    return inner


@event_handler
def user_created_event_handler(body, message):
    user = User(username=body['username'])
    user.set_unusable_password()
    user.save()

    assign_perm("tasks.add_task", user)
    assign_perm("tasks.view_task", user)
    assign_perm("tasks.change_task", user)
    assign_perm("tasks.delete_task", user)

    Profile.objects.create(user=user, user_service_id=body['id'])
    return user


@event_handler
def project_created_event_handler(body, message):
    return Project.objects.create(project_service_id=body['id'])


@event_handler
def resource_created_event_handler(body, message):
    return Resource.objects.create(resource_service_id=body['id'], rate=body['rate'])


class EventsConsumer:

    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super(EventsConsumer, cls).__new__(cls)
        return cls.instance

    # TODO refactor this to fabric class
    def __init__(self):
        rabbit_url = CELERY_BROKER_URL
        conn = Connection(rabbit_url, heartbeat=10)
        exchange = Exchange(name='users_exchange',
                            type='fanout',
                            durable=True)
        users_queue = Queue(name='tasks_users_queue', exchange=exchange)
        user_consumer = Consumer(conn, queues=users_queue, callbacks=[user_created_event_handler])
        user_consumer.consume()

        projects_exchange = Exchange(name='projects_exchange',
                                     type='fanout',
                                     durable=True)
        projects_queue = Queue(name='tasks_projects_queue', exchange=projects_exchange)
        project_consumer = Consumer(conn, queues=projects_queue, callbacks=[project_created_event_handler])
        project_consumer.consume()

        resources_exchange = Exchange(name='resources_exchange',
                                      type='fanout',
                                      durable=True)
        resources_queue = Queue(name='tasks_resources_queue', exchange=resources_exchange)
        resource_consumer = Consumer(conn, queues=resources_queue, callbacks=[resource_created_event_handler])
        resource_consumer.consume()

        def establish_connection():
            revived_connection = conn.clone()
            revived_connection.ensure_connection(max_retries=3)
            channel = revived_connection.channel()

            user_consumer.revive(channel)
            user_consumer.consume()

            project_consumer.revive(channel)
            project_consumer.consume()

            resource_consumer.revive(channel)
            resource_consumer.consume()

            return revived_connection

        def consume():
            new_conn = establish_connection()
            while True:
                try:
                    new_conn.drain_events(timeout=2)
                except socket.timeout:
                    new_conn.heartbeat_check()

        def run():
            while True:
                try:
                    consume()
                except conn.connection_errors:
                    print("connection revived")

        run()
