from django.contrib.auth.models import User

from resources.models import Resource
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from rest_framework_guardian.serializers import ObjectPermissionsAssignmentMixin

from resource_service.serializers import LoggingSerializer


class ResourceSerializer(LoggingSerializer):
    class Meta:
        model = Resource
        fields = '__all__'

    def get_permissions_map(self, created):
        current_user = self.context['request'].user

        return {
            'view_resource': [current_user],
            'add_resource': [current_user],
            'change_resource': [current_user],
            'delete_resource': [current_user]
        }
