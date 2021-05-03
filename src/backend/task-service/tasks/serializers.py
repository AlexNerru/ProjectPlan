from django.contrib.auth.models import User
from tasks.models import *
from rest_framework import serializers
from rest_framework.validators import UniqueValidator


class TaskSerializer(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(queryset=User)
    project = serializers.PrimaryKeyRelatedField(queryset=Project)
    status = serializers.PrimaryKeyRelatedField(queryset=TaskStatus)
    resources = serializers.PrimaryKeyRelatedField(many=True, queryset=Resource)

    class Meta:
        model = Task
        fields = ['id', 'name', 'description', 'creator', 'project', 'status', 'resources']
        read_only_fields = ['id']
        depth = 1