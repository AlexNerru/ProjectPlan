import logging

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from rest_framework_guardian.filters import ObjectPermissionsFilter

from django_filters.rest_framework import DjangoFilterBackend

from task_service.permissions import DjangoObjectGetPermission
from task_service.viewsets import LoggingViewSet, logging_action

from tasks.models import Task
from tasks.serializers import TaskSerializer
from tasks.filters import TaskFilter
from tasks.graphs import cumulative_graph_data, planned_work_hours_per_day, fact_work_hours_per_day

logger = logging.getLogger('default')


class TaskViewSet(LoggingViewSet):

    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [DjangoObjectGetPermission]
    filter_backends = (ObjectPermissionsFilter, DjangoFilterBackend)
    filterset_class = TaskFilter


class PlanFactGraphView(APIView):
    permission_classes = [IsAuthenticated]

    @logging_action
    def get(self, request, pk):
        data = cumulative_graph_data(pk, planned_work_hours_per_day, fact_work_hours_per_day)
        return Response(data, status=status.HTTP_200_OK)



