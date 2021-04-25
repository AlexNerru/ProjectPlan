from __future__ import absolute_import, unicode_literals

import os
from celery import Celery
from kombu import Exchange, Connection, Queue
from user_service.settings import CELERY_BROKER_URL

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'user_service.settings')

app = Celery('user_service')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks(['user_service.tasks'], force=True)

priority_to_routing_key = {'high': 'hipri',
                           'mid': 'midpri',
                           'low': 'lopri'}

with Connection(CELERY_BROKER_URL) as conn:
    with conn.channel() as channel:
        producer = conn.Producer(serializer='json')

        users_exchange = Exchange(name='users_exchange', type='fanout', durable=True, channel=channel)

        users_exchange.declare()
