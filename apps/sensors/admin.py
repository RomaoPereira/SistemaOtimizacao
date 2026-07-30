from django.contrib import admin
from .models import Environment, Sensor, Reading

@admin.register(Environment)
class EnvironmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'is_occupied', 'target_consumption', 'created_at')
    search_fields = ('name',)
    list_filter = ('is_occupied',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Sensor)
class SensorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'type', 'environment', 'unit', 'created_at')
    search_fields = ('name', 'type')
    list_filter = ('environment', 'type')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Reading)
class ReadingAdmin(admin.ModelAdmin):
    list_display = ('id', 'sensor', 'value', 'created_at')
    list_filter = ('sensor', 'created_at')
    search_fields = ('id',)
    readonly_fields = ('created_at', 'updated_at')
