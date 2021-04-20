from django.apps import AppConfig
from eventbus.celery_manager import create_queues


class ProjectsConfig(AppConfig):
    name = 'projects'
