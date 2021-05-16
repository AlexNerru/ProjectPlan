from rest_framework_guardian.filters import ObjectPermissionsFilter

from django_filters.rest_framework import DjangoFilterBackend

from project_service.permissions import DjangoObjectGetPermission
from project_service.viewsets import LoggingViewSet

from projects.models import *
from projects.serializers import ProjectSerializer, ProductSerializer,\
    CompanySerializer, ProjectProgramSerializer, ProjectPortfolioSerializer
from projects.filters import ProjectFilter


class ProjectViewSet(LoggingViewSet):

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [DjangoObjectGetPermission]
    filter_backends = (DjangoFilterBackend, )
    filterset_class = ProjectFilter


class ProductViewSet(LoggingViewSet):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [DjangoObjectGetPermission]
    filter_backends = (ObjectPermissionsFilter,)


class CompanyViewSet(LoggingViewSet):

    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [DjangoObjectGetPermission]
    filter_backends = (ObjectPermissionsFilter,)


class ProjectProgramViewSet(LoggingViewSet):

    queryset = ProjectProgram.objects.all()
    serializer_class = ProjectProgramSerializer
    permission_classes = [DjangoObjectGetPermission]
    filter_backends = (ObjectPermissionsFilter,)


class ProjectPortfolioViewSet(LoggingViewSet):

    queryset = ProjectPortfolio.objects.all()
    serializer_class = ProjectPortfolioSerializer
    permission_classes = [DjangoObjectGetPermission]
    filter_backends = (ObjectPermissionsFilter,)
