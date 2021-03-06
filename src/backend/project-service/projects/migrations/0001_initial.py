# Generated by Django 3.1.4 on 2021-05-04 15:26

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=300)),
            ],
        ),
        migrations.CreateModel(
            name='CompanySubject',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='projects.company')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('companysubject_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='projects.companysubject')),
                ('name', models.CharField(max_length=100)),
            ],
            bases=('projects.companysubject',),
        ),
        migrations.CreateModel(
            name='ProjectPortfolio',
            fields=[
                ('companysubject_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='projects.companysubject')),
                ('name', models.CharField(max_length=100)),
            ],
            bases=('projects.companysubject',),
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_service_id', models.IntegerField()),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ProjectProgram',
            fields=[
                ('companysubject_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='projects.companysubject')),
                ('name', models.CharField(max_length=100)),
                ('portfolio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='projects.projectportfolio')),
            ],
            bases=('projects.companysubject',),
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('companysubject_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='projects.companysubject')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(max_length=1000)),
                ('business_product', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='projects.product')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='project_owner', to=settings.AUTH_USER_MODEL)),
                ('participants', models.ManyToManyField(related_name='project_participants', to=settings.AUTH_USER_MODEL)),
                ('program', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='projects.projectprogram')),
            ],
            bases=('projects.companysubject',),
        ),
        migrations.AddField(
            model_name='product',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='product_owner', to='projects.profile'),
        ),
        migrations.AddField(
            model_name='product',
            name='participants',
            field=models.ManyToManyField(related_name='product_participants', to=settings.AUTH_USER_MODEL),
        ),
    ]
