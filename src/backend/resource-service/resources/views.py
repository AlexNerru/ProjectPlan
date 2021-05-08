from rest_framework_guardian.filters import ObjectPermissionsFilter

from django_filters.rest_framework import DjangoFilterBackend

from resource_service.permissions import DjangoObjectGetPermission
from resource_service.viewsets import LoggingViewSet

from resources.serializers import ResourceSerializer
from resources.models import *


class ResourcesViewSet(LoggingViewSet):

    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [DjangoObjectGetPermission]
    filter_backends = (ObjectPermissionsFilter,)
