from collections import OrderedDict
import operator
import logging
from datetime import date, timedelta

from tasks.models import Task, Project

logger = logging.getLogger('default')


def get_dates_between(start_date, end_date):
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


def get_plan_fact_graph_data(project_id):
    if Project.objects.filter(project_service_id=project_id).exists():
        tasks = Task.objects.filter(project=project_id)
        if tasks.exists():

            earliest_planned_start_date = tasks \
                .earliest('planned_start_date').planned_start_date
            earliest_fact_start_date = tasks \
                .filter(fact_start_date__isnull=False) \
                .earliest('fact_start_date').fact_start_date

            latest_planned_finish_date = tasks \
                .latest('planned_finish_date').planned_finish_date
            latest_fact_finish_date = tasks \
                .filter(fact_finish_date__isnull=False) \
                .latest('fact_finish_date').fact_finish_date

            start_date = earliest_planned_start_date \
                if earliest_planned_start_date < earliest_fact_start_date \
                else earliest_fact_start_date

            end_date = latest_fact_finish_date \
                if latest_fact_finish_date > latest_planned_finish_date \
                else latest_planned_finish_date

            labels = get_dates_between(start_date, end_date)

            d = {el: {'fact': 0, 'plan': 0} for el in labels}
            data = OrderedDict(sorted(d.items(), key=operator.itemgetter(0)))

            logger.debug("Ordered dict for plan-fact graph for project {0!r} is: {1!r}"
                         .format(project_id,
                                 data))

            # calculating planned work hours per day:
            # for each day
            #   save (work hours divided by count of days)
            for task in tasks:
                # TODO: remove holidays
                # planned calculations
                planned_days_for_task = get_dates_between(task.planned_start_date,
                                                          task.planned_finish_date)

                planned_work_hours_per_day = task.planned_work_hours / len(planned_days_for_task)

                for day in planned_days_for_task:
                    data[day]['plan'] += planned_work_hours_per_day

                if task.fact_start_date and task.fact_finish_date and task.fact_work_hours:
                    fact_days_for_task = get_dates_between(task.fact_start_date, task.fact_finish_date)
                    fact_work_hours_per_day = task.fact_work_hours / len(fact_days_for_task)

                    for day in fact_days_for_task:
                        data[day]['fact'] += fact_work_hours_per_day

            labels = data.keys()
            plan = []
            fact = []

            previous_plan_value = 0
            previuos_fact_value = 0
            for item in data.items():
                current_plan_value = item[1]['plan']
                current_fact_value = item[1]['fact']

                plan.append(previous_plan_value + current_plan_value)
                fact.append(previuos_fact_value + current_fact_value)

                previous_plan_value += current_plan_value
                previuos_fact_value += current_fact_value

            graph_data = {'labels': labels, 'plan': plan, 'fact': fact}

            logger.debug("Data for plan-fact graph for project {0!r} is: {1!r}".format(project_id,
                                                                                       graph_data))

            return graph_data
        else:
            raise Exception("There is no tasks for project {0!r}".format(project_id))
    else:
        raise Exception("Project with id {0!r} was not found".format(project_id))
