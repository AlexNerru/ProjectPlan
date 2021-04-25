from django.http import HttpRequest
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from performance_indicators.models import PerformanceIndicator
from performance_indicators.serializers import PerformanceIndicatorSerializer, PerformanceIndicatorComponentSerializer
from rest_framework.permissions import IsAuthenticated
from project_performance_service.microservices_auth import MicroservicesJWTBackend
from drf_yasg.utils import swagger_auto_schema

# Create your views here.

class PerformanceIndicatorListView(generics.ListCreateAPIView):
    """
    View to create or get list of performance indicators
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated]

    queryset = PerformanceIndicator.objects.all()
    serializer_class = PerformanceIndicatorSerializer


class PerformanceIndicatorView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to RUD performance indicators
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated]

    queryset = PerformanceIndicator.objects.all()
    serializer_class = PerformanceIndicatorSerializer
