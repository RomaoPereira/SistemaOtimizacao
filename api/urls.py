from django.urls import path, include

urlpatterns = [
    # Rotas do app sensors
    path('', include('apps.sensors.urls')),

    # Rotas do app ...
]
