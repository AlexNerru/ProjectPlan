import logging

from rest_framework_guardian.filters import ObjectPermissionsFilter
from rest_framework import viewsets

from django_filters.rest_framework import DjangoFilterBackend

from task_service.permissions import DjangoObjectGetPermission

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers
from task_service.settings import CACHE_TTL

from tasks.models import Task
from tasks.serializers import TaskSerializer
from tasks.filters import TaskFilter

logger = logging.getLogger('default')


class TaskViewSet(viewsets.ModelViewSet):

    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [DjangoObjectGetPermission]
    filter_backends = (ObjectPermissionsFilter, DjangoFilterBackend)
    filterset_class = TaskFilter

    def list(self, request, **kwargs):
        #logger.debug("Processing {0!r} {1!r} request: {2!r} ".format(request.method,
        #                                                             request.path,
        #                                                             request.body))
        response = super().list(request, **kwargs)
        #logger.debug("Processed {0!r} {1!r} request: {2!r} ".format(request.method,
        #                                                            request.path,
        #                                                            request.body))
        return response

    def create(self, request, **kwargs):
        response = super().create(request, **kwargs)
        return response

    def retrieve(self, request, pk=None, **kwargs):
        response = super().retrieve(request, pk, **kwargs)
        return response

    def update(self, request, pk=None, **kwargs):
        response = super().update(request, pk, **kwargs)
        return response

    def partial_update(self, request, pk=None, **kwargs):
        response = super().partial_update(request, pk, **kwargs)
        return response

    def destroy(self, request, pk=None, **kwargs):
        response = super().destroy(request, pk, **kwargs)
        return response

    @method_decorator(cache_page(CACHE_TTL))
    @method_decorator(vary_on_headers('Authorization'))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

