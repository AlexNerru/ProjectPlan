from django.conf import settings
from django.core.management.base import BaseCommand
from users.models import Profile

from django.contrib.auth.management.commands.createsuperuser import get_user_model
from django.contrib.auth.models import User

import os
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):

    def handle(self, *args, **options):
        username = os.getenv('DJANGO_SU_NAME', 'admin_default')
        email = os.getenv('DJANGO_SU_EMAIL', 'admin@mysite.com')
        password = os.getenv('DJANGO_SU_PASSWORD', 'mypass_default')

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            user = get_user_model()._default_manager.db_manager('default') \
            .create_superuser(username=username, email=email, password=password)

            profile = Profile(user=user)
            profile.save()

            logger.info("Superuser created")
