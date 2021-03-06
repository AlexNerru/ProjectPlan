from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _


class Profile(models.Model):
    """
    Моdel representing user from user service
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_service_id = models.IntegerField()


class Project(models.Model):
    """
    Моdel representing project from pro service
    """
    project_service_id = models.IntegerField()


class Grade(models.Model):
    """
    Model representing human-resource grade in company
    """
    name = models.CharField(max_length=100)


class Resource(models.Model):
    """
    Model representing general resource class
    """
    class Level (models.TextChoices):
        JUNIOR = 'JR', _('Junior')
        MIDDLE = 'MI', _('Middle')
        SENIOR = 'SE', _('Senior')

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    grade = models.IntegerField()
    rate = models.IntegerField()
    project = models.ManyToManyField(Project, null=True)
    skill_name = models.CharField(max_length=100)
    skill_level = models.CharField(max_length=2, choices=Level.choices, default=Level.MIDDLE)


