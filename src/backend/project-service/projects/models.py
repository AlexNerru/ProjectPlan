from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    """
    Моdel representing user from user service
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_service_id = models.IntegerField()

    @classmethod
    def default_profile(cls):
        return Profile.objects.get(username='admin').pk


class Company(models.Model):
    """
    Model representing company
    """
    name = models.CharField(max_length=300)


class CompanySubject(models.Model):
    """
    Model representing something inside a company
    """
    company = models.ForeignKey(Company, on_delete=models.CASCADE)


class Product(CompanySubject):
    """
    Model representing business-product
    """
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(Profile, on_delete=models.SET_DEFAULT,
                              related_name='product_owner', default=Profile.default_profile)
    participants = models.ManyToManyField(User, related_name='product_participants')


class ProjectPortfolio(CompanySubject):
    """
    Model representing portfolio of different projects
    """
    name = models.CharField(max_length=100)


class ProjectProgram(CompanySubject):
    """
    Model representing program of several projects
    """
    name = models.CharField(max_length=100)
    portfolio = models.ForeignKey(ProjectPortfolio, on_delete=models.CASCADE)


class Project(CompanySubject):
    """
    Model representing project in the system
    """
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=1000)
    program = models.ForeignKey(ProjectProgram, on_delete=models.CASCADE, null=True)
    business_product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    owner = models.ForeignKey(User, on_delete=models.SET_DEFAULT,
                              related_name='project_owner', default=Profile.default_profile)
    participants = models.ManyToManyField(User, related_name='project_participants')



