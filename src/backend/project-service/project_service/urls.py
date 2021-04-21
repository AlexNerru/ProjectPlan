from django.contrib import admin
from django.urls import path, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from projects.views import ProjectListView, ProjectView, ProductListView, \
    ProductView, CompanyView, CompanyListView

schema_view = get_schema_view(
    openapi.Info(
        title="Projects API",
        default_version='v1',
        description="API for working with projects and products",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('projects/', ProjectListView.as_view()),
    path('projects/<int:pk>/', ProjectView.as_view()),
    path('products/', ProductListView.as_view()),
    path('products/<int:pk>/', ProductView.as_view()),
    path('companies/', CompanyListView.as_view()),
    path('companies/<int:pk>/', CompanyView.as_view()),

    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]