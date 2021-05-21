from rest_framework import authentication
from django.contrib.auth.models import User
from rest_framework.exceptions import AuthenticationFailed

from projects.models import Profile
from project_service.settings import TOKEN_VERIFY_URL, USER_BY_TOKEN_URL

import requests
import logging

logger = logging.getLogger('default')


class MicroservicesJWTBackend(authentication.BaseAuthentication):
    """
    Authenticate by checking JWT Token in user-service
    """

    def authenticate(self, request):
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
            logger.debug("Authorizing token {0!r}".format(token))
            response = requests.post(
                TOKEN_VERIFY_URL,
                data={'token': token},
            )
            if response.status_code == 200:
                response = requests.get(
                    USER_BY_TOKEN_URL,
                    headers={'Authorization': 'Bearer '+token},
                )
                logger.debug("Authorizing response {0!r}".format(response.json()))
                user = User.objects.get(username=response.json()['username'])
                logger.debug("User authenticated {0!r}".format(str(user)))
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
