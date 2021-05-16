from django.contrib import admin
from django.urls import path, re_path, include

from rest_framework import permissions
from rest_framework import routers

from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

from tasks.views import TaskViewSet, PlanFactGraphView

router = routers.SimpleRouter()
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(router.urls)),
    path('api/v1/projects/<int:pk>/plan_fact', PlanFactGraphView.as_view()),

    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
