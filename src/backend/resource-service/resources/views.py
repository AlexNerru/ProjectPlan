from rest_framework_guardian.filters import ObjectPermissionsFilter

from django_filters.rest_framework import DjangoFilterBackend

from resource_service.permissions import DjangoObjectGetPermission
from rest_framework.permissions import IsAuthenticated
from resource_service.viewsets import LoggingViewSet

from resources.serializers import ResourceSerializer
from resources.models import Resource
from resources.filters import ResourceFilter


class ResourcesViewSet(LoggingViewSet):

    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = (DjangoFilterBackend, )
    filterset_class = ResourceFilter
