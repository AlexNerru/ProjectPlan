from rest_framework import permissions

RUD_TASK_NAME = 'rud_task'
RUD_TASK_DESCRIPTION = "Read, update, delete task"


class TaskPermission(permissions.BasePermission):
    """
    Global permission check rud permissions.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in ['GET', 'PUT', 'DELETE']:
            return request.user.has_perm(RUD_TASK_NAME, obj)
        else:
            return True

