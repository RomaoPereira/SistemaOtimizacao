from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EnvironmentViewSet, PrototypeViewSet, ReadingViewSet, StatisticsView, HealthCheckView

router = DefaultRouter()
router.register(r'environments', EnvironmentViewSet, basename='environment')
router.register(r'prototypes', PrototypeViewSet, basename='prototype')
router.register(r'readings', ReadingViewSet, basename='reading')

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health_check'),
    path('statistics/', StatisticsView.as_view(), name='statistics'),
    path('', include(router.urls)),
]
