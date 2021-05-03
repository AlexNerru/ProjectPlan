from django.http import HttpRequest
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from resources.models import *
from resources.serializers import  ResourceSerializer
from rest_framework.permissions import IsAuthenticated
from resource_service.microservices_auth import MicroservicesJWTBackend
from drf_yasg.utils import swagger_auto_schema


class ResourceListView(generics.ListCreateAPIView):
    """
    View to create or get list of projects
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated]

    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer


class ResourceView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to RUD projects
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated]

    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer