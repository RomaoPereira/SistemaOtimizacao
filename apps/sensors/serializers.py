from rest_framework import serializers
from .models import Environment, Sensor, Reading

class EnvironmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Environment
        fields = ['id', 'name', 'is_occupied', 'target_consumption', 'created_at']

class SensorSerializer(serializers.ModelSerializer):
    environment_name = serializers.CharField(source='environment.name', read_only=True)
    
    class Meta:
        model = Sensor
        fields = ['id', 'name', 'type', 'unit', 'environment', 'environment_name', 'created_at']

class ReadingSerializer(serializers.ModelSerializer):
    sensor_id = serializers.PrimaryKeyRelatedField(
        queryset=Sensor.objects.all(), source='sensor', write_only=True
    )
    sensor_name = serializers.CharField(source='sensor.name', read_only=True)
    timestamp = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Reading
        fields = ['id', 'sensor_id', 'sensor_name', 'value', 'timestamp']
        
    def validate_value(self, value):
        if value < 0:
            raise serializers.ValidationError("O valor não pode ser negativo.")
        return value
