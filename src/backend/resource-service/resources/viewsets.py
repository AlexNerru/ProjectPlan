from rest_framework import mixins, viewsets

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers


class CachedModelViewSet(viewsets.ModelViewSet):
    """
    A viewset that provides `retrieve`, `create`, and `list` actions.

    To use it, override the class and set the `.queryset` and
    `.serializer_class` attributes.
    """

    @method_decorator(cache_page(60 * 60))
    @method_decorator(vary_on_headers('Authorization'))
    def list(self, request, **kwargs):
        return super().list(request, **kwargs)