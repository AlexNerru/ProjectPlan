from django.http import HttpRequest
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from projects.models import *
from projects.serializers import ProjectSerializer
from rest_framework.permissions import IsAuthenticated
from project_service.microservices_auth import MicroservicesJWTBackend
from drf_yasg.utils import swagger_auto_schema
from eventbus.celery_manager import create_queues


class ProjectList(generics.ListCreateAPIView):
    """
    View to create or get list of projects
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated]

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class Test(APIView):

    def get(self, request):
        create_queues()
        return 200

