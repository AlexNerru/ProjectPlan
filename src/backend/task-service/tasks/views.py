import logging

from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from django.shortcuts import get_object_or_404

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from rest_framework.permissions import IsAuthenticated
from task_service.microservices_auth import MicroservicesJWTBackend

from tasks.models import *
from tasks.serializers import TaskSerializer


class TaskListView(APIView):
    """
    View to create or get list of projects
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('project', openapi.IN_QUERY, "filter tasks by project", type=openapi.TYPE_INTEGER),
            openapi.Parameter('status', openapi.IN_QUERY, "filter tasks by status", type=openapi.TYPE_INTEGER),
            openapi.Parameter('resource', openapi.IN_QUERY, "filter tasks by resource", type=openapi.TYPE_INTEGER)],
        responses={
            200: openapi.Response('response description', TaskSerializer),
        }
    )
    @method_decorator(cache_page(60 * 60))
    def get(self, request: Request, version):
        """
        API method used to get new tasks in the system.

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

            serializer = TaskSerializer(tasks, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(request_body=TaskSerializer)
    def post(self, request: Request):
        """
        API method used to create new tasks in the system.

        :param request: http request
        :type request: HttpRequest
        :returns: 201 if task created, 400 if it was validation errors
        """
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            task = serializer.save()
            return_data = TaskSerializer(task).data
            return Response(data=return_data, status=status.HTTP_201_CREATED)
        return Response(data=serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)


class TaskView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to RUD projects
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated]

    queryset = Resource.objects.all()
    serializer_class = TaskSerializer

class TaskViewNew(APIView):
    """
    View to RUD projects
    """
    authentication_classes = [MicroservicesJWTBackend]
    permission_classes = [IsAuthenticated]

    def get(self, request, version, pk):
        """
        API method used to get user by id

        :param request: http request
        :type request: HttpRequest
        :returns: 200 if ok
        """
        if version == "v1":
            user = get_object_or_404(Task, pk)
            return_data = TaskSerializer(user).data
            return Response(data=return_data, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

