from django.http import HttpRequest

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, viewsets
from rest_framework.permissions import IsAuthenticated

from rest_framework_guardian import filters

from drf_yasg.utils import swagger_auto_schema

from resources.serializers import ResourceSerializer
from resources.models import *
from resource_service.microservices_auth import MicroservicesJWTBackend
from resources.permissions import ResourcePermissions


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


class ResourceViewSet(viewsets.ModelViewSet):

    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [ResourcePermissions]
    filter_backends = [filters.ObjectPermissionsFilter]
