from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_guardian.filters import ObjectPermissionsFilter

from django_filters.rest_framework import DjangoFilterBackend

from resource_service.permissions import DjangoObjectGetPermission
from resource_service.viewsets import LoggingViewSet, logging_action

from resources.serializers import ResourceSerializer
from resources.models import Resource
from resources.filters import ResourceFilter
from resources.graphs import resources_skills_graph, resources_skills_level_graph

class ResourcesViewSet(LoggingViewSet):

    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = (DjangoFilterBackend, )
    filterset_class = ResourceFilter


class SkillsLevelGraphView(APIView):
    permission_classes = [IsAuthenticated]

    @logging_action
    def get(self, request):
        data = resources_skills_level_graph()
        return Response(data, status=status.HTTP_200_OK)

class SkillsGraphView(APIView):
    permission_classes = [IsAuthenticated]

    @logging_action
    def get(self, request):
        data = resources_skills_graph()
        return Response(data, status=status.HTTP_200_OK)
