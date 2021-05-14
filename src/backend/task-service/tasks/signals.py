import logging

from django.db.models.signals import post_save, post_delete, m2m_changed
from django.dispatch import receiver

from eventbus.publisher import Publisher

from tasks.models import Task
from tasks.serializers import TaskSerializer

logger = logging.getLogger('default')


@receiver(m2m_changed, sender=Task.resources.through)
def send_message_task_saved(sender, instance, pk_set, **kwargs):
    data = TaskSerializer(instance).data

    data['resources'] = list(pk_set)

    Publisher().event_task_created(data, '1.0')
    logger.debug("Signal performed: post_save with object {0!r}".format(str(data)))
