import django_filters

from resources.models import Resource


#TODO: Create loggers for this: override filter_queryset in another class
class ResourceFilter(django_filters.FilterSet):
    class Meta:
        model = Resource
        fields = ['project', 'grade']
