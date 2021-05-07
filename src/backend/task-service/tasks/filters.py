import django_filters

from tasks.models import Task

#TODO: Create loggers for this: override filter_queryset in another class
class TaskFilter(django_filters.FilterSet):
    class Meta:
        model = Task
        fields = ['project', 'status', 'creator', 'resources']