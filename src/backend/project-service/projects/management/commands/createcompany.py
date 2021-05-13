import logging

from django.core.management.base import BaseCommand
from projects.models import Company

logger = logging.getLogger('default')


class Command(BaseCommand):

    def handle(self, *args, **options):
        try:
            company = Company.objects.get(name = "Test Company")
        except Company.DoesNotExist:
            company = Company.objects.create(name = "Test Company")

            logger.info("Company created {0!r}".format(str(company)))