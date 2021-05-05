import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers
from django.shortcuts import get_object_or_404

from guardian.shortcuts import assign_perm

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from rest_framework.permissions import IsAuthenticated
from rest_framework_guardian.filters import DjangoObjectPermissionsFilter
from task_service.microservices_auth import MicroservicesJWTBackend

from tasks.models import *
from tasks.serializers import TaskReadCreateSerializer, TaskUpdateSerializer

from tasks.permissions import RUD_TASK_NAME
from tasks.permissions import TaskPermission

logger = logging.getLogger(__name__)


class TaskListView(APIView):
    """
    View to create or get list of projects
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated, TaskPermission]
    filter_backends = [DjangoObjectPermissionsFilter]
    queryset = Task.objects.all()

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('project', openapi.IN_QUERY, "filter tasks by project", type=openapi.TYPE_INTEGER),
            openapi.Parameter('status', openapi.IN_QUERY, "filter tasks by status", type=openapi.TYPE_INTEGER),
            openapi.Parameter('resource', openapi.IN_QUERY, "filter tasks by resource", type=openapi.TYPE_INTEGER)],
        responses={
            200: openapi.Response('response description', TaskReadCreateSerializer),
        }
    )
    @method_decorator(cache_page(60 * 60))
    @method_decorator(vary_on_headers('Authorization'))
    def get(self, request, version):
        """
        API method used to get tasks in the system and create them.

        :param version: api version
        :param request: http request
        :type request: HttpRequest
        :returns: 200 if task created
        """

        if version == "v1":
            tasks = Task.objects.all()

            project = request.query_params.get('project')
            task_status = self.request.query_params.get('status')
            resource = self.request.query_params.get('resource')

            if project is not None:
                tasks = tasks.filter(project=project)

            if task_status is not None:
                tasks = tasks.filter(status=task_status)

            if resource is not None:
                tasks = tasks.filter(resources=resource)

            if tasks.count() == 0:
                return Response(status=status.HTTP_404_NOT_FOUND)

            serializer = TaskReadCreateSerializer(tasks, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(request_body=TaskReadCreateSerializer)
    def post(self, request, version):
        """
        API method used to create new tasks in the system.

        :param version: api version
        :param request: http request
        :type request: HttpRequest
        :returns: 201 if task created, 400 if it was validation errors
        """
        if version == "v1":
            serializer = TaskReadCreateSerializer(data=request.data)
            if serializer.is_valid():
                task = serializer.save()

                assign_perm(RUD_TASK_NAME, request.user, task)

                return_data = TaskReadCreateSerializer(task).data
                return Response(data=return_data, status=status.HTTP_201_CREATED)
            return Response(data=serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class TaskView(APIView):
    """
    View to RUD projects
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated, TaskPermission]
    filter_backends = [DjangoObjectPermissionsFilter]
    queryset = Task.objects.all()

    def get(self, request, version, pk):
        """
        API method used to get user by id

        :param pk: task id
        :param version: api version
        :param request: http request
        :type request: HttpRequest
        :returns: 200 if ok, 400 if wrong api version, 404 if not found
        """
        if version == "v1":
            task = get_object_or_404(Task, pk=pk)
            return_data = TaskReadCreateSerializer(task).data
            return Response(data=return_data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, version, pk):
        """
        API method used to delete user by id

        :param pk: task id
        :param version: api version
        :param request: http request
        :type request: HttpRequest
        :returns: 200 if ok, 400 if wrong api version, 404 if not found
        """
        if version == "v1":
            task = get_object_or_404(Task, pk)
            task.delete()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(request_body=TaskReadCreateSerializer)
    def put(self, request, version, pk):
        """
        API method used to update user by id

        :param pk: task id
        :param version: api version
        :param request: http request
        :type request: HttpRequest
        :returns: 200 if ok, 400 if wrong api version, 404 if not found
        """
        if version == "v1":
            get_object_or_404(Task, pk)
            serializer = TaskUpdateSerializer(data=request.data)
            if serializer.is_valid():
                task = serializer.save()
                return_data = TaskReadCreateSerializer(task).data
                return Response(data=return_data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
