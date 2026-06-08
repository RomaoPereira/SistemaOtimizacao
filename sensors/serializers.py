from rest_framework import serializers
from .models import Sensor, Reading

class SensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = ['id', 'name', 'type', 'unit', 'created_at']

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
        if value > 400:
            raise serializers.ValidationError("O valor máximo suportado é de 400.")
        return value
