from collections import OrderedDict
import operator
import logging
from datetime import date, timedelta

from tasks.models import Task, Project

logger = logging.getLogger('default')


def dates_between(start_date, end_date):
    """
    Creats a list of all days between two dates

    :param start_date: start calculation date
    :param end_date: end calculation date
    :return: list(Date)
    """

    dates = [start_date + timedelta(days=x) for x in range((end_date - start_date).days + 1)]
    logger.debug("Dates between start date {0!r} and {1!r} are: {2!r}".format(start_date,
                                                                              end_date,
                                                                              dates))
    return dates


def earliest_planned_start_date(tasks_queryset):
    return tasks_queryset \
        .earliest('planned_start_date').planned_start_date


def earliest_fact_start_date(tasks_queryset):
    tasks = tasks_queryset \
        .filter(fact_start_date__isnull=False)

    if tasks.exists():
        return tasks.earliest('fact_start_date').fact_start_date

    return None


def latest_plan_finish_date(tasks_queryset):
    latest_planned_finish = tasks_queryset \
        .latest('planned_finish_date').planned_finish_date
    return latest_planned_finish


def latest_fact_finish_date(tasks_queryset):
    tasks = tasks_queryset \
        .filter(fact_finish_date__isnull=False)

    if tasks.exists():
        return tasks.latest('fact_finish_date').fact_finish_date

    return None


def graph_data_labels(tasks_queryset):
    earliest_planned_start = earliest_planned_start_date(tasks_queryset)
    earliest_fact_start = earliest_fact_start_date(tasks_queryset)

    latest_planned_finish = latest_plan_finish_date(tasks_queryset)
    latest_fact_finish = latest_fact_finish_date(tasks_queryset)

    dates = [earliest_planned_start, earliest_fact_start,
             latest_planned_finish, latest_fact_finish]

    clear_dates = [x for x in dates if x is not None]
    clear_dates.sort()

    start_date = clear_dates[0]

    end_date = clear_dates[-1]

    return dates_between(start_date, end_date)


def planned_work_hours_per_day(task, planned_days):
    """Calculates planned work hours that was spend on task

    :param task: task to be processed
    :type task: Task
    :param planned_days: Days that was planned to spend on task
    :type planned_days: list
    :returns: Average work hours per day
    :rtype: float
    """

    return task.planned_work_hours / len(planned_days)


def fact_work_hours_per_day(task, fact_days):
    """Calculates fact work hours that was spend on task

    :param task: task to be processed
    :type task: Task
    :param fact_days: Days that was by fact spend on task
    :type fact_days: list
    :returns: Average work hours per day
    :rtype: float
    """

    return task.fact_work_hours / len(fact_days)


def planned_cost_per_day(task, planned_days):
    """
    Calculates planned cost that was spend on task.
    Note: now it is assumed that every resource assigned to task works for full planned_work_house

    :param task: task to be processed
    :type task: Task
    :param planned_days: Days that was by fact spend on task
    :type planned_days: list
    :returns: Average work hours per day
    :rtype: float
    """

    # TODO: think if resources has different work hours
    result = 0
    for resource in task.resources.all():
        result += resource.rate * task.planned_work_hours
    return result/len(planned_days)


def fact_cost_per_day(task, fact_days):
    """
        Calculates planned cost that was spend on task.
        Note: now it is assumed that every resource assigned to task works for full planned_work_house

        :param task: task to be processed
        :type task: Task
        :param fact_days: Days that was by fact spend on task
        :type fact_days: list
        :returns: Average work hours per day
        :rtype: float
        """

    # TODO: think if resources has different work hours
    result = 0
    for resource in task.resources.all():
        result += resource.rate * task.fact_work_hours
    return result/len(fact_days)


def cumulative_graph_data(planned_function, fact_function, project_id=None):
    """
    Calculates data to create cumulative line graphs with provided function

    :param project_id: id of project for calculation
    :type project_id: int
    :param planned_function: function to calculate value for plan
    :type planned_function: callable (Task, list[datetime.date]) => float
    :param fact_function: function to calculate value for fact
    :type fact_function: callable (Task, list[datetime.date]) => float
    :returns: Data labels for x axis, planned project values, fact project values
    :rtype: dict {labels: [datetime.date], plan: [float], fact: [float]}
    """

    projects = Project.objects.all()

    if project_id:
        projects = Project.objects.filter(project_service_id=project_id)

    if projects.exists():

        tasks = Task.objects.all()
        if project_id:
            tasks = Task.objects.filter(project=project_id)

        if tasks.exists():

            labels = graph_data_labels(tasks)

            d = {el: {'fact': 0, 'plan': 0} for el in labels}
            data = OrderedDict(sorted(d.items(), key=operator.itemgetter(0)))

            logger.debug("Ordered dict for plan-fact graph for project {0!r} is: {1!r}"
                         .format(project_id,
                                 data))

            for task in tasks:
                # TODO: remove holidays
                planned_days_for_task = dates_between(task.planned_start_date,
                                                      task.planned_finish_date)

                for day in planned_days_for_task:
                    data[day]['plan'] += planned_function(task, planned_days_for_task)

                if task.fact_start_date and task.fact_finish_date and task.fact_work_hours:

                    fact_days_for_task = dates_between(task.fact_start_date, task.fact_finish_date)

                    for day in fact_days_for_task:
                        data[day]['fact'] += fact_function(task, fact_days_for_task)

            labels = data.keys()
            plan = []
            fact = []

            previous_plan_value = 0
            previuos_fact_value = 0
            for item in data.items():
                current_plan_value = item[1]['plan']
                plan.append(previous_plan_value + current_plan_value)
                previous_plan_value += current_plan_value

                latest_fact_finish = latest_fact_finish_date(tasks)
                if latest_fact_finish and item[0] <= latest_fact_finish:
                    current_fact_value = item[1]['fact']
                    fact.append(previuos_fact_value + current_fact_value)
                    previuos_fact_value += current_fact_value

            return_data = {'labels': labels, 'plan': plan, 'fact': fact}

            logger.debug("Data for graph for project {0!r} is: {1!r}".format(project_id,
                                                                             return_data))

            return return_data
        else:
            return {'labels': [], 'plan': [], 'fact': []}
    else:
        raise Exception("Project with id {0!r} was not found".format(project_id))


# TODO: remove if not usable
def gannt_chart_date(project_id):
    if Project.objects.filter(project_service_id=project_id).exists():
        tasks = Task.objects.filter(project=project_id)
        if tasks.exists():

            data = {}

        else:
            raise Exception("There is no tasks for project {0!r}".format(project_id))
    else:
        raise Exception("Project with id {0!r} was not found".format(project_id))
