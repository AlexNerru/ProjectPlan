import os
import logging

from django.core.management.base import BaseCommand
from tasks.models import Profile

from django.contrib.auth.management.commands.createsuperuser import get_user_model
from django.contrib.auth.models import User

logger = logging.getLogger('default')


class Command(BaseCommand):

    def handle(self, *args, **options):
        username = os.getenv('DJANGO_SU_NAME')
        email = os.getenv('DJANGO_SU_EMAIL')
        password = os.getenv('DJANGO_SU_PASSWORD')

        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            user = get_user_model()._default_manager.db_manager('default') \
            .create_superuser(username=username, email=email, password=password)

            profile = Profile(user=user, user_service_id=1)
            profile.save()

            logger.info("Superuser created")
