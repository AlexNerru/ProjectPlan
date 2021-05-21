import logging

from resources.models import Resource

logger = logging.getLogger('default')


def resources_skills_level_graph():
    resources = Resource.objects.all()

    if resources.exists():
        data = {}
        for resource in resources:
            if resource.get_skill_level_display() in data:
                data[resource.get_skill_level_display()] += 1
            else:
                data[resource.get_skill_level_display()] = 1

        return {'keys': data.keys(), 'values': data.values()}
    else:
        return {}


def resources_skills_graph():
    resources = Resource.objects.all()

    if resources.exists():
        data = {}
        for resource in resources:
            if resource.skill_name in data:
                data[resource.skill_name] += 1
            else:
                data[resource.skill_name] = 1

        return {'keys': data.keys(), 'values': data.values()}
    else:
        return {}


