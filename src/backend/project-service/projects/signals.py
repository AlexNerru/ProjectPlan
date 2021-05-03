from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from eventbus.publisher import Publisher

from projects.models import Project


@receiver(post_save, sender=Project)
def send_message_project_saved(sender, instance, created, **kwargs):
    if created:
        pass


@receiver(post_delete, sender=Project)
def send_message_project_deleted(sender, instance):
    pass
