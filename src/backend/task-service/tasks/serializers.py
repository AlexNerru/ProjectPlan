from django.contrib.auth.models import User
from tasks.models import Task
from rest_framework import serializers
from rest_framework.validators import UniqueValidator


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'name', 'description', 'owner', 'project', 'status', 'resources']
        read_only_fields = ['id']
        depth = 1