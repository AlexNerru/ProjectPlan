from django.db import models
from django.contrib.auth.models import User


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
    program = models.ForeignKey(ProjectProgram, on_delete=models.CASCADE)

    # TODO: Подумать убрать Null
    business_product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)

    # TODO: Переделать на админа по умолчанию и убрать нуль
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='owner', null=True)

    participants = models.ManyToManyField(User, related_name='participants')



