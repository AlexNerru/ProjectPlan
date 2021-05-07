import logging

from rest_framework_guardian.filters import ObjectPermissionsFilter

from django_filters.rest_framework import DjangoFilterBackend

from task_service.permissions import DjangoObjectGetPermission
from task_service.viewsets import LoggingViewSet

from tasks.models import Task
from tasks.serializers import TaskSerializer
from tasks.filters import TaskFilter

logger = logging.getLogger('default')


class TaskViewSet(LoggingViewSet):

    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [DjangoObjectGetPermission]
    filter_backends = (ObjectPermissionsFilter, DjangoFilterBackend)
    filterset_class = TaskFilter



