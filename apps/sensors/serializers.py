from rest_framework import serializers
from .models import Environment, Prototype, Reading

class EnvironmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Environment
        fields = ['id', 'name', 'is_occupied', 'target_consumption', 'created_at']

class PrototypeSerializer(serializers.ModelSerializer):
    environment_name = serializers.CharField(source='environment.name', read_only=True)
    
    class Meta:
        model = Prototype
        fields = ['id', 'name', 'description', 'environment', 'environment_name', 'created_at']

class ReadingSerializer(serializers.ModelSerializer):
    prototype = serializers.PrimaryKeyRelatedField(
        queryset=Prototype.objects.all(), write_only=True
    )
    prototype_name = serializers.CharField(source='prototype.name', read_only=True)
    timestamp = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Reading
        fields = ['id', 'prototype', 'prototype_name', 'temperature', 'distance', 'presence', 'current', 'timestamp']
