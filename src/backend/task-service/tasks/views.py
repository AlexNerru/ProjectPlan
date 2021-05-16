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
from tasks.graphs import graph_data,\
    planned_work_hours_per_day, fact_work_hours_per_day,\
    planned_cost_per_day, fact_cost_per_day

logger = logging.getLogger('default')


class TaskViewSet(LoggingViewSet):

    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [DjangoObjectGetPermission]
    filter_backends = (DjangoFilterBackend, )
    filterset_class = TaskFilter


class WorkHoursCumulativeGraphView(APIView):
    permission_classes = [IsAuthenticated]

    @logging_action
    def get(self, request, pk):
        data = graph_data(planned_work_hours_per_day, fact_work_hours_per_day, True, pk)
        return Response(data, status=status.HTTP_200_OK)


class CostsGraphView(APIView):
    permission_classes = [IsAuthenticated]

    @logging_action
    def get(self, request, pk):
        data = graph_data(planned_cost_per_day, fact_cost_per_day, True, pk)
        return Response(data, status=status.HTTP_200_OK)


class WorkHoursCumulativeAllGraphView(APIView):
    permission_classes = [IsAuthenticated]

    @logging_action
    def get(self, request):
        data = graph_data(planned_work_hours_per_day, fact_work_hours_per_day, True)
        return Response(data, status=status.HTTP_200_OK)


class CostsGraphAllView(APIView):
    permission_classes = [IsAuthenticated]

    @logging_action
    def get(self, request):
        data = graph_data(planned_cost_per_day, fact_cost_per_day, True)
        return Response(data, status=status.HTTP_200_OK)


class WorkHoursAllGraphView(APIView):
    permission_classes = [IsAuthenticated]

    @logging_action
    def get(self, request):
        data = graph_data(planned_work_hours_per_day, fact_work_hours_per_day, False)
        return Response(data, status=status.HTTP_200_OK)


class WorkHoursGraphView(APIView):
    permission_classes = [IsAuthenticated]

    @logging_action
    def get(self, request, pk):
        data = graph_data(planned_work_hours_per_day, fact_work_hours_per_day, False, pk)
        return Response(data, status=status.HTTP_200_OK)




