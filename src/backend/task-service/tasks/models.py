from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    """
    Моdel representing user from user service
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_service_id = models.IntegerField()


class Project(models.Model):
    """
    Моdel representing project from project-service
    """
    project_service_id = models.IntegerField()


class Resource(models.Model):
    """
    Моdel representing resource from resource-service
    """
    resource_service_id = models.IntegerField()


class TaskStatus(models.Model):
    """
    Model representing status for task
    """
    name = models.CharField(max_length=100)


class Task(models.Model):
    """
    Model representing general task class
    """
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=100)

    creator = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    status = models.ForeignKey(TaskStatus, on_delete=models.DO_NOTHING)
    resources = models.ManyToManyField(Resource)

    created = models.DateTimeField(auto_now_add=True)
    planned_start_date = models.DateField()
    fact_start_date = models.DateField(null=True)
    planned_finish_data = models.DateField()
    fact_finish_data = models.DateField(null=True)
    planned_work_hours = models.IntegerField()
    fact_work_hours = models.IntegerField()



