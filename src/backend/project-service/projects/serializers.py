from django.contrib.auth.models import User
from projects.models import Product, ProjectPortfolio, ProjectProgram, Project, Company
from rest_framework import serializers
from rest_framework.validators import UniqueValidator


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'company', 'program',
                  'product', 'owner', 'participants']
        read_only_fields = ['id']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'company', 'owner', 'participants']
        read_only_fields = ['id']


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name']
        read_only_fields = ['id']


class ProjectProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectProgram
        fields = ['id', 'name', 'portfolio', 'company']
        read_only_fields = ['id']


class ProjectPortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectPortfolio
        fields = ['id', 'name', 'company']
        read_only_fields = ['id']
