from django.core.management.base import BaseCommand
from eventbus.consumer import EventsConsumer
from eventbus.publisher import Publisher
import logging

logger = logging.getLogger('default')


class Command(BaseCommand):

    def handle(self, *args, **options):
        EventsConsumer()
        Publisher()
