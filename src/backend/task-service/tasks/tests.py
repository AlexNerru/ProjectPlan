from datetime import datetime, date
import logging

from django.test import TestCase
from django.contrib.auth.models import User
from django.db.models import signals

from tasks.models import Project, Task, TaskStatus, Resource
from tasks.graphs import graph_data, \
    planned_work_hours_per_day, fact_work_hours_per_day, \
    planned_cost_per_day, fact_cost_per_day
from tasks.signals import send_message_task_saved

logger = logging.getLogger('default')


class GraphDataTestCase(TestCase):

    @classmethod
    def setUpTestData(cls):
        signals.m2m_changed.disconnect(send_message_task_saved,
                                       sender=Task.resources.through)

        Project.objects.bulk_create([
            Project(project_service_id=1),
            Project(project_service_id=2)
        ])

        TaskStatus.objects.bulk_create([
            TaskStatus(name="To Do"),
            TaskStatus(name="In Progress"),
            TaskStatus(name="Done")
        ])

        Resource.objects.bulk_create([
            Resource(resource_service_id=1, rate=1000),
            Resource(resource_service_id=2, rate=2000)
        ])

        cls.user = User.objects.create_user("test", "test", "test")

    def createTask(self, project, status, planned_start_date,
                   planned_finish_date, planned_work_hours,
                   fact_start_date=None, fact_finish_date=None, fact_work_hours=None):
        return Task(name="Test name", description="Test desctiption", creator=self.user,
                    project=project, status=status, planned_start_date=planned_start_date,
                    fact_start_date=fact_start_date, planned_finish_date=planned_finish_date,
                    fact_finish_date=fact_finish_date, planned_work_hours=planned_work_hours,
                    fact_work_hours=fact_work_hours)

    def test_values(self):
        project1 = Project.objects.get(project_service_id=1)
        project2 = Project.objects.get(project_service_id=2)

        status_todo = TaskStatus.objects.get(name="To Do")
        status_done = TaskStatus.objects.get(name="Done")

        Task.objects.bulk_create([
            self.createTask(project1, status_done,
                            planned_start_date=datetime(2020, 5, 1),
                            planned_finish_date=datetime(2020, 5, 2),
                            planned_work_hours=10,
                            fact_start_date=datetime(2020, 5, 1),
                            fact_finish_date=datetime(2020, 5, 1),
                            fact_work_hours=8),
            self.createTask(project1, status_done,
                            planned_start_date=datetime(2020, 5, 2),
                            planned_finish_date=datetime(2020, 5, 4),
                            planned_work_hours=12,
                            fact_start_date=datetime(2020, 5, 2),
                            fact_finish_date=datetime(2020, 5, 5),
                            fact_work_hours=20),
            self.createTask(project1, status_done,
                            planned_start_date=datetime(2020, 5, 6),
                            planned_finish_date=datetime(2020, 5, 8),
                            planned_work_hours=3,
                            fact_start_date=datetime(2020, 5, 5),
                            fact_finish_date=datetime(2020, 5, 7),
                            fact_work_hours=6),
            self.createTask(project1, status_done,
                            planned_start_date=datetime(2020, 5, 9),
                            planned_finish_date=datetime(2020, 5, 9),
                            planned_work_hours=3,
                            fact_start_date=datetime(2020, 5, 6),
                            fact_finish_date=datetime(2020, 5, 10),
                            fact_work_hours=15),
            self.createTask(project1, status_todo,
                            planned_start_date=datetime(2020, 5, 10),
                            planned_finish_date=datetime(2020, 5, 12),
                            planned_work_hours=6)
        ])

        data = graph_data(planned_work_hours_per_day, fact_work_hours_per_day, True, 1)

        self.assertEqual(data['plan'], [5.0, 14.0, 18.0, 22.0, 22.0, 23.0, 24.0, 25.0, 28.0, 30.0, 32.0, 34.0])
        self.assertEqual(data['fact'], [8.0, 13.0, 18.0, 23.0, 30.0, 35.0, 40.0, 43.0, 46.0, 49.0])

    def test_values_non_cumulative(self):
        project1 = Project.objects.get(project_service_id=1)
        project2 = Project.objects.get(project_service_id=2)

        status_todo = TaskStatus.objects.get(name="To Do")
        status_done = TaskStatus.objects.get(name="Done")

        Task.objects.bulk_create([
            self.createTask(project1, status_done,
                            planned_start_date=datetime(2020, 5, 1),
                            planned_finish_date=datetime(2020, 5, 2),
                            planned_work_hours=10,
                            fact_start_date=datetime(2020, 5, 1),
                            fact_finish_date=datetime(2020, 5, 1),
                            fact_work_hours=8),
            self.createTask(project1, status_done,
                            planned_start_date=datetime(2020, 5, 2),
                            planned_finish_date=datetime(2020, 5, 4),
                            planned_work_hours=12,
                            fact_start_date=datetime(2020, 5, 2),
                            fact_finish_date=datetime(2020, 5, 5),
                            fact_work_hours=20),
            self.createTask(project1, status_done,
                            planned_start_date=datetime(2020, 5, 6),
                            planned_finish_date=datetime(2020, 5, 8),
                            planned_work_hours=3,
                            fact_start_date=datetime(2020, 5, 5),
                            fact_finish_date=datetime(2020, 5, 7),
                            fact_work_hours=6),
            self.createTask(project1, status_done,
                            planned_start_date=datetime(2020, 5, 9),
                            planned_finish_date=datetime(2020, 5, 9),
                            planned_work_hours=3,
                            fact_start_date=datetime(2020, 5, 6),
                            fact_finish_date=datetime(2020, 5, 10),
                            fact_work_hours=15),
            self.createTask(project1, status_todo,
                            planned_start_date=datetime(2020, 5, 10),
                            planned_finish_date=datetime(2020, 5, 12),
                            planned_work_hours=6)
        ])

        data = graph_data(planned_work_hours_per_day, fact_work_hours_per_day, True, 1)

        self.assertEqual(data['plan'], [5.0, 9.0, 4.0, 0.0, 1.0, 1.0, 1.0, 3.0, 2.0, 2.0, 2.0, 2.0])
        self.assertEqual(data['fact'], [8.0, 5.0, 5.0, 5.0, 7.0, 5.0, 5.0, 3.0, 3.0, 3.0])

    def test_one_task(self):
        project1 = Project.objects.get(project_service_id=1)

        status_done = TaskStatus.objects.get(name="Done")

        self.createTask(project1, status_done,
                        planned_start_date=datetime(2020, 5, 1),
                        planned_finish_date=datetime(2020, 5, 2),
                        planned_work_hours=10,
                        fact_start_date=datetime(2020, 5, 1),
                        fact_finish_date=datetime(2020, 5, 1),
                        fact_work_hours=8) \
            .save()

        data = graph_data(planned_work_hours_per_day, fact_work_hours_per_day, True, 1)

        self.assertEqual(data['fact'], [8.0])
        self.assertEqual(data['plan'], [5.0, 10.0])

    def test_task_in_todo(self):
        """
        Tests when tasks are in "To do" state
        """
        project1 = Project.objects.get(project_service_id=1)

        status_todo = TaskStatus.objects.get(name="To Do")

        self.createTask(project1, status_todo,
                        planned_start_date=datetime(2020, 5, 1),
                        planned_finish_date=datetime(2020, 5, 2),
                        planned_work_hours=10,
                        fact_start_date=datetime(2020, 5, 1),
                        fact_finish_date=datetime(2020, 5, 1),
                        fact_work_hours=8) \
            .save()

        data = graph_data(planned_work_hours_per_day, fact_work_hours_per_day, True, 1)

        self.assertEqual(data['fact'], [])
        self.assertEqual(data['plan'], [5.0, 10.0])

    def test_costs_one_task(self):
        project1 = Project.objects.get(project_service_id=1)

        status_done = TaskStatus.objects.get(name="Done")

        resource_1 = Resource.objects.get(resource_service_id=1)

        task = self.createTask(project1, status_done,
                               planned_start_date=datetime(2020, 5, 1),
                               planned_finish_date=datetime(2020, 5, 2),
                               planned_work_hours=10,
                               fact_start_date=datetime(2020, 5, 1),
                               fact_finish_date=datetime(2020, 5, 1),
                               fact_work_hours=8)
        task.save()
        task.resources.add(resource_1)

        data = graph_data(planned_cost_per_day, fact_cost_per_day, True, 1)

        self.assertEqual(data['fact'], [8000.0])
        self.assertEqual(data['plan'], [5000.0, 10000.0])
