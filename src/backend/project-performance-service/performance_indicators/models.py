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
    owner = models.ForeignKey(User, on_delete=models.DO_NOTHING,
                              related_name='project_owner')
    project_service_id = models.IntegerField()


class PerformanceIndicator(models.Model):
    """
    Моdel representing KPI or OKR
    """
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    creator = models.OneToOneField(User, on_delete=models.CASCADE, related_name='creator')
    indicator_name = models.CharField(max_length=100)
    start_date = models.DateField()
    indicator_due_date = models.DateField()
    created_at = models.DateField(auto_now_add=True)
    assignees = models.ManyToManyField(User, related_name='assignees')


class PerformanceIndicatorComponent(models.Model):
    """
    Моdel representing KPI or OKR component
    """

    performance_indicator = models.ForeignKey(PerformanceIndicator, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    component_value = models.CharField(max_length=100, null=True)
    start_date = models.DateField()
    component_due_date = models.DateField()
    created_at = models.DateField(auto_now_add=True)
    assignees = models.ManyToManyField(User)


class PerformanceIndicatorStatus(models.Model):
    """
    Моdel representing KPI or OKR status
    """
    status_name = models.CharField(max_length=100)
    performance_indicator_components = models.ForeignKey(PerformanceIndicatorComponent,
                                                          on_delete=models.DO_NOTHING)
    performance_indicator = models.ForeignKey(PerformanceIndicator,
                                                          on_delete=models.DO_NOTHING)