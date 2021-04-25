from django.core.management.base import BaseCommand
from eventbus.celery_manager import create_queues
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):

    def handle(self, *args, **options):
        create_queues()

        logger.info("Queues Created")
