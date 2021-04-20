from rest_framework import authentication


class MicroservicesJWTBackend(authentication.BaseAuthentication):
    """
    Authenticate by checking JWT Token in user-service
    """

    def authenticate(self, request, **kwargs):
        print(request)
        return None

    def get_user(self, user_id):
        pass