from django.contrib import admin
from .models import Sensor, Reading

@admin.register(Sensor)
class SensorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'type', 'unit', 'created_at')
    search_fields = ('name', 'type')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Reading)
class ReadingAdmin(admin.ModelAdmin):
    list_display = ('id', 'sensor', 'value', 'created_at')
    list_filter = ('sensor', 'created_at')
    search_fields = ('id',)
    readonly_fields = ('created_at', 'updated_at')
