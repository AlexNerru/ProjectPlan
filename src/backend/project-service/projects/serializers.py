
from rest_framework import serializers

from projects.models import Product, ProjectPortfolio, ProjectProgram, Project, Company
from project_service.serializers import LoggingSerializer


class ProjectSerializer(LoggingSerializer):
    owner_username = serializers.SerializerMethodField('get_owner_username')

    def get_owner_username(self, obj):
        return obj.owner.username

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


class CompanySerializer(LoggingSerializer):
    class Meta:
        model = Company
        fields = '__all__'

    def get_permissions_map(self, created):
        current_user = self.context['request'].user

        return {
            'view_company': [current_user],
            'add_company': [current_user],
            'change_company': [current_user],
            'delete_company': [current_user]
        }


class ProjectProgramSerializer(LoggingSerializer):
    class Meta:
        model = ProjectProgram
        fields = '__all__'

    def get_permissions_map(self, created):
        current_user = self.context['request'].user

        return {
            'view_projectprogram': [current_user],
            'add_projectprogram': [current_user],
            'change_projectprogram': [current_user],
            'delete_projectprogram': [current_user]
        }


class ProjectPortfolioSerializer(LoggingSerializer):
    class Meta:
        model = ProjectPortfolio
        fields = '__all__'

    def get_permissions_map(self, created):
        current_user = self.context['request'].user

        return {
            'view_projectportfolio': [current_user],
            'add_projectportfolio': [current_user],
            'change_projectportfolio': [current_user],
            'delete_projectportfolio': [current_user]
        }
