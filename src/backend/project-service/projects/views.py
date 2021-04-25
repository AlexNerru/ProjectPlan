from django.http import HttpRequest
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from projects.models import *
from projects.serializers import ProjectSerializer, ProductSerializer,\
    CompanySerializer, ProjectProgramSerializer, ProjectPortfolioSerializer
from rest_framework.permissions import IsAuthenticated
from project_service.microservices_auth import MicroservicesJWTBackend
from drf_yasg.utils import swagger_auto_schema


class ProjectListView(generics.ListCreateAPIView):
    """
    View to create or get list of projects
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated]

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class ProjectView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to RUD projects
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated]

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class ProductListView(generics.ListCreateAPIView):
    """
        View to create or get list of products
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated]

    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to RUD products
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated]

    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class CompanyListView(generics.CreateAPIView):
    """
    View to create companies
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated]

    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class CompanyView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to RUD companies
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated]

    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class ProjectProgramView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to RUD project programs
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated]

    queryset = ProjectProgram.objects.all()
    serializer_class = ProjectProgramSerializer


class ProjectProgramListView(generics.ListCreateAPIView):
    """
    View to create or get list of project programs
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated]

    queryset = ProjectProgram.objects.all()
    serializer_class = ProjectProgramSerializer


class ProjectPortfolioView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to RUD project programs
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated]

    queryset = ProjectPortfolio.objects.all()
    serializer_class = ProjectPortfolioSerializer


class ProjectPortfolioListView(generics.ListCreateAPIView):
    """
    View to create or get list of project programs
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated]

    queryset = ProjectPortfolio.objects.all()
    serializer_class = ProjectPortfolioSerializer