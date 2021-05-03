from django.http import HttpRequest
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from tasks.models import *
from tasks.serializers import TaskSerializer
from rest_framework.permissions import IsAuthenticated
from task_service.microservices_auth import MicroservicesJWTBackend
from drf_yasg.utils import swagger_auto_schema


class TaskListView(generics.ListCreateAPIView):
    """
    View to create or get list of projects
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated]

    queryset = Resource.objects.all()
    serializer_class = TaskSerializer


class TaskView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to RUD projects
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated]

    queryset = Resource.objects.all()
    serializer_class = TaskSerializer