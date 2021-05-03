from django.contrib.auth.models import User
from resources.models import Resource
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'first_name','last_name', 'grade' ]
        read_only_fields = ['id']