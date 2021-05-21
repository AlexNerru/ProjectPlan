import logging

from rest_framework import serializers

from tasks.models import *

from task_service.serializers import LoggingSerializer

logger = logging.getLogger('default')


class TaskSerializer(LoggingSerializer):
    creator = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    status = serializers.PrimaryKeyRelatedField(queryset=TaskStatus.objects.all())
    resources = serializers.PrimaryKeyRelatedField(many=True, queryset=Resource.objects.all())

    class Meta:
        model = Task
        fields = '__all__'

    def get_permissions_map(self, created):
        current_user = self.context['request'].user

        return {
            'view_task': [current_user],
            'add_task': [current_user],
            'change_task': [current_user],
            'delete_task': [current_user]
        }

    #TODO write create and update methods loggers
