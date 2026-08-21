from django.contrib import admin
from .models import Environment, Prototype, Reading

@admin.register(Environment)
class EnvironmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_occupied', 'target_consumption', 'created_at')
    search_fields = ('name',)

@admin.register(Prototype)
class PrototypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'environment', 'created_at')
    list_filter = ('environment',)
    search_fields = ('name', 'description')

@admin.register(Reading)
class ReadingAdmin(admin.ModelAdmin):
    list_display = ('prototype', 'temperature', 'distance', 'presence', 'current', 'created_at')
    list_filter = ('prototype', 'created_at')
    search_fields = ('prototype__name',)
    date_hierarchy = 'created_at'
