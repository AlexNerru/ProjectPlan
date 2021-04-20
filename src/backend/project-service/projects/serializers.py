from django.contrib.auth.models import User
from projects.models import Product, ProjectPortfolio, ProjectProgram, Project
from rest_framework import serializers
from rest_framework.validators import UniqueValidator


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'program', 'product', 'owner', 'participants']
        read_only_fields = ['id']
