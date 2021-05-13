import logging

from django.core.management.base import BaseCommand
from projects.models import Company

from django.contrib.auth.management.commands.createsuperuser import get_user_model
from django.contrib.auth.models import User

logger = logging.getLogger('default')


class Command(BaseCommand):

    def handle(self, *args, **options):
        try:
            company = Company.objects.get(name = "Test Company")
        except Company.DoesNotExist:
            company = Company.objects.create(name = "Test Company")

            logger.info("Company created {0!r}".format(str(company)))