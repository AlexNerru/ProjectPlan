import logging

from rest_framework import viewsets

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers

from resource_service.settings import CACHE_TTL

logger = logging.getLogger('default')


def logging_action(func):
    def inner(*args, **kwargs):
        logger.debug("Processing {0!r} {1!r} request: {2!r} ".format(args[1].method,
                                                                     args[1].path,
                                                                     args[1].body))
        response = func(*args, **kwargs)
        logger.debug("Processed {0!r} {1!r} request: {2!r} ".format(args[1].method,
                                                                    args[1].path,
                                                                    args[1].body))
        return response
    return inner


class LoggingViewSet(viewsets.ModelViewSet):

    @logging_action
    def list(self, request, **kwargs):
        response = super().list(request, **kwargs)
        return response

    @logging_action
    def create(self, request, **kwargs):
        response = super().create(request, **kwargs)
        return response

    @logging_action
    def retrieve(self, request, pk=None, **kwargs):
        response = super().retrieve(request, pk, **kwargs)
        return response

    @logging_action
    def update(self, request, pk=None, **kwargs):
        response = super().update(request, pk, **kwargs)
        return response

    @logging_action
    def partial_update(self, request, pk=None, **kwargs):
        response = super().partial_update(request, pk, **kwargs)
        return response

    @logging_action
    def destroy(self, request, pk=None, **kwargs):
        response = super().destroy(request, pk, **kwargs)
        return response

    #@method_decorator(cache_page(CACHE_TTL))
    #@method_decorator(vary_on_headers('Authorization'))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
