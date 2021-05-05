from django.contrib.auth.models import User

from rest_framework import serializers
from rest_framework_guardian.serializers import ObjectPermissionsAssignmentMixin

from tasks.models import *


class TaskReadCreateSerializer(ObjectPermissionsAssignmentMixin, serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    status = serializers.PrimaryKeyRelatedField(queryset=TaskStatus.objects.all())
    resources = serializers.PrimaryKeyRelatedField(many=True, queryset=Resource.objects.all())

    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['id']
        depth = 1

    def get_permissions_map(self, created):
        current_user = self.context['request'].user

        #TODO: change this permission
        return {
            'view_post': [current_user],
            'change_post': [current_user],
            'delete_post': [current_user]
        }


class TaskUpdateSerializer(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    status = serializers.PrimaryKeyRelatedField(queryset=TaskStatus.objects.all())
    resources = serializers.PrimaryKeyRelatedField(many=True, queryset=Resource.objects.all())

    class Meta:
        model = Task
        fields = ['id', 'name', 'description', 'creator', 'project', 'status', 'resources']
        depth = 1