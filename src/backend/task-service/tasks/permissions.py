from rest_framework import permissions

RUD_TASK_NAME = 'rud_task'
RUD_TASK_DESCRIPTION = "Read, update, delete task"


class TaskPermission(permissions.DjangoObjectPermissions):
    """
    Global permission to task
    """
    perms_map = {
        'GET': ['%(app_label).view_%(model_name)s'],
        'OPTIONS': ['%(app_label).view_%(model_name)s'],
        'HEAD': ['%(app_label).view_%(model_name)s'],
        'POST': ['%(app_label).add_%(model_name)s'],
        'PUT': ['%(app_label).change_%(model_name)s'],
        'PATCH': ['%(app_label).change_%(model_name)s'],
        'DELETE': ['%(app_label).delete_%(model_name)s'],
    }

