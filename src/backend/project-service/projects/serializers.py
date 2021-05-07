
from rest_framework import serializers

from projects.models import Product, ProjectPortfolio, ProjectProgram, Project, Company
from project_service.serializers import LoggingSerializer


class ProjectSerializer(LoggingSerializer):
    class Meta:
        model = Project
        fields = '__all__'

    def get_permissions_map(self, created):
        current_user = self.context['request'].user

        return {
            'view_project': [current_user],
            'add_project': [current_user],
            'change_project': [current_user],
            'delete_project': [current_user]
        }


class ProductSerializer(LoggingSerializer):
    class Meta:
        model = Product
        fields = '__all__'

    def get_permissions_map(self, created):
        current_user = self.context['request'].user

        return {
            'view_product': [current_user],
            'add_product': [current_user],
            'change_product': [current_user],
            'delete_product': [current_user]
        }


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
