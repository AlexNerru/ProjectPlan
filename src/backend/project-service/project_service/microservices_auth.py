from rest_framework import authentication
from django.contrib.auth.models import User
from rest_framework.exceptions import AuthenticationFailed

from projects.models import Profile
from rest_framework_simplejwt.backends import TokenBackend

import requests
import logging
import os

logger = logging.getLogger(__name__)


class MicroservicesJWTBackend(authentication.BaseAuthentication):
    """
    Authenticate by checking JWT Token in user-service
    """

    def authenticate(self, request):
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
            logger.debug(token)
            token_verify_url = os.environ.get('TOKEN_VERIFY_URL', 'http://user-service:80/token/verify/')
            response = requests.post(
                token_verify_url,
                data={'token': token},
            )
            logger.debug(response.status_code)
            if response.status_code == 200:
                user_by_token_url = os.environ.get('USER_BY_TOKEN_URL',
                                                   'http://user-service:80/token/user/')
                response = requests.get(
                    user_by_token_url,
                    headers={'Authorization': 'Bearer '+token},
                )
                logger.debug(response.text[1:-1])
                user = User.objects.get(username=response.text[1:-1])
                logger.debug("User authenticated")
                return (user, None)
            else:
                raise AuthenticationFailed
        return None


    def get_user(self, user_id):
        try:
            profile = Profile.objects.get(user_service_id=user_id)
            return User.objects.get(pk=profile.user.id)
        except User.DoesNotExist:
            return None
