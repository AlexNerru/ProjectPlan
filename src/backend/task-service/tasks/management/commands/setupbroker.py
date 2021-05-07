from django.core.management.base import BaseCommand
from eventbus.consumer import Consumer
from eventbus.publisher import Publisher
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):

    def handle(self, *args, **options):
        Publisher()
        Consumer()
