from django.core.management.base import BaseCommand
from eventbus.celery_manager import create_queues


class Command(BaseCommand):

    def handle(self, *args, **options):
        create_queues()

        self.stdout.write("Queues Created\n", ending='')
