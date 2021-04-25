from .celery_manager import producer
from .celery_manager import users_exchange


class Publisher:
    """
    Class for publishing messages via producer to the RabbitMQ
    """

    producer = producer
    exchange = users_exchange
    retry_policy = {'interval_start': 0,
                    'interval_step': 2,
                    'interval_max': 30,
                    'max_retries': 30}

    @classmethod
    def event_user_registered(cls, data, version):
        message = data.copy()
        message['version'] = version
        producer.publish(message, exchange=cls.exchange,
                         retry_policy=cls.retry_policy)
