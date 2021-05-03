import logging
import os

from celery import Celery
from kombu import Exchange, Connection

from task_service.settings import CELERY_BROKER_URL

logger = logging.getLogger(__name__)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'task_service.settings')

app = Celery('task_service')
app.config_from_object('django.conf:settings', namespace='CELERY')


class Publisher:
    """
    Class for publishing messages via producer to the RabbitMQ
    """

    retry_policy = {'interval_start': 0,
                    'interval_step': 2,
                    'interval_max': 30,
                    'max_retries': 30}

    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super(Publisher, cls).__new__(cls)
        return cls.instance

    def __init__(self):
        with Connection(CELERY_BROKER_URL, heartbeat=1, connect_timeout=3600) as self.conn:
            with self.conn.channel() as self.channel:
                self.producer = self.conn.Producer(serializer='json')
                self.users_exchange = Exchange(name='users_exchange',
                                               type='fanout',
                                               durable=True,
                                               channel=self.channel)
                self.projects_exchange = Exchange(name='projects_exchange',
                                                  type='fanout',
                                                  durable=True,
                                                  channel=self.channel)
                self.users_exchange.declare()
                logger.info("Users exchange declared")
                self.projects_exchange.declare()
                logger.info("Projects exchange declared")
