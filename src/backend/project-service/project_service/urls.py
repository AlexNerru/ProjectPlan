from django.contrib import admin
from django.urls import path, re_path, include

from rest_framework import routers

from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

from projects.views import ProjectViewSet, ProductViewSet, CompanyView, CompanyListView, ProjectProgramListView, \
    ProjectProgramView, ProjectPortfolioView, ProjectPortfolioListView

router = routers.SimpleRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(router.urls)),

    path('companies/', CompanyListView.as_view()),
    path('companies/<int:pk>/', CompanyView.as_view()),
    path('programs/', ProjectProgramListView.as_view()),
    path('programs/<int:pk>/', ProjectProgramView.as_view()),
    path('portfolios/', ProjectPortfolioListView.as_view()),
    path('portfolios/<int:pk>/', ProjectPortfolioView.as_view()),

    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]