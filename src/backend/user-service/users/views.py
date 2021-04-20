from django.http import HttpRequest
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from users.serializers import RegisterSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from drf_yasg.utils import swagger_auto_schema
from eventbus import Publisher


class UsersView(APIView):
    """
    APIView for getting all users

    get:
    Method to get all users from the system
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: HttpRequest) -> Response:
        """
        Method to get all users from the system

        :param request: http request, no parameters
        :type request: HttpRequest
        :returns: 200
        """
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class UserView(APIView):
    """
    APIView for getting details of current user

    get:
    Method to get details of the authenticated user
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: HttpRequest) -> Response:
        """
        Method to get details of current user

        :param request: http request, no parameters
        :type request: HttpRequest
        :returns: 200
        """
        serializer = UserSerializer(request.user, many=False)
        return Response(serializer.data)


class RegisterView(APIView):
    """
    APIView for creating users in the system

    post:
    Method to register new user in the system
    """

    @swagger_auto_schema(request_body=RegisterSerializer)
    def post(self, request: HttpRequest) -> Response:
        """
        API method used to register new users in the system. There is no any confirmation yet

        :param request: http request, containing email, username, password, last name and first name
        :type request: HttpRequest
        :returns: 201 if user created, 400 if it was validation errors
        """
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return_data = serializer.validated_data
            del return_data["password"]
            Publisher.event_user_registered(return_data, version='v1')
            return Response(data=return_data, status=status.HTTP_201_CREATED)
        return Response(data=serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)
