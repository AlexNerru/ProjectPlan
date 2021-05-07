import django_filters

from projects.models import Project


#TODO: Create loggers for this: override filter_queryset in another class
class ProjectFilter(django_filters.FilterSet):
    class Meta:
        model = Project
        fields = ['program', 'business_product', 'owner', 'participants']