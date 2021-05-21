import logging

from django.core.management.base import BaseCommand
from tasks.models import TaskStatus

logger = logging.getLogger('default')


class Command(BaseCommand):

    def handle(self, *args, **options):
        try:
            TaskStatus.objects.get(name="DONE")
            TaskStatus.objects.get(name="TODO")
            TaskStatus.objects.get(name="IN PROGRESS")
        except TaskStatus.DoesNotExist:
            task_status_done = TaskStatus.objects.create(name="DONE")
            task_status_todo = TaskStatus.objects.create(name="TODO")
            task_status_inprogress = TaskStatus.objects.create(name="IN PROGRESS")

            logger.info("Task status created {0!r}".format(str(task_status_done)))
            logger.info("Task status created {0!r}".format(str(task_status_todo)))
            logger.info("Task status created {0!r}".format(str(task_status_inprogress)))