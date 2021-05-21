import logging

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from eventbus.publisher import Publisher

from projects.models import Project
from projects.serializers import ProjectSerializer

logger = logging.getLogger('default')


@receiver(post_save, sender=Project)
def send_message_project_saved(sender, instance, created, **kwargs):
    if created:
        data = ProjectSerializer(instance).data
        Publisher().event_project_registered(data, '1.0')
        logger.info("Signal performed: post_save with object {0!r}".format(str(data)))


@receiver(post_delete, sender=Project)
def send_message_project_deleted(sender, instance, **kwargs):
    pass
