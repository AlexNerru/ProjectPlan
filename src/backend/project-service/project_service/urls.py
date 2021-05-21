from django.contrib import admin
from django.urls import path, re_path, include

from rest_framework import routers

from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

from projects.views import ProjectViewSet, ProductViewSet, CompanyViewSet, \
    ProjectPortfolioViewSet, ProjectProgramViewSet

router = routers.SimpleRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'products', ProductViewSet)
router.register(r'companies', CompanyViewSet)
router.register(r'programs', ProjectProgramViewSet)
router.register(r'portfolios', ProjectPortfolioViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(router.urls)),

    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]