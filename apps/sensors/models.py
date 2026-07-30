from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class BaseModel(models.Model):
    """
    Classe base abstrata com carimbos de data/hora automáticos.
    """
    created_at = models.DateTimeField(auto_now_add=True, help_text="Data e hora de criação")
    updated_at = models.DateTimeField(auto_now=True, help_text="Data e hora da última modificação")

    class Meta:
        abstract = True

class Environment(BaseModel):
    """
    Representa um ambiente monitorado (ex: Sala de Reuniões, Laboratório).
    """
    name = models.CharField(max_length=255, help_text="Nome do ambiente")
    is_occupied = models.BooleanField(default=False, help_text="Status de ocupação atual")
    target_consumption = models.FloatField(null=True, blank=True, help_text="Meta de consumo em kWh")
    
    class Meta:
        verbose_name = "Ambiente"
        verbose_name_plural = "Ambientes"
        ordering = ['name']

    def __str__(self):
        return self.name

class Sensor(BaseModel):
    """
    Representa um sensor registrado no sistema IoT.
    """
    environment = models.ForeignKey(Environment, on_delete=models.CASCADE, related_name='sensors', null=True, blank=True, help_text="Ambiente onde o sensor está instalado")
    name = models.CharField(max_length=255, help_text="Nome descritivo do sensor")
    type = models.CharField(max_length=100, help_text="Tipo do sensor (Ex: HC-SR04, PIR, DS18B20)")
    unit = models.CharField(max_length=50, blank=True, null=True, help_text="Unidade de medida (Ex: cm, °C, bool, kWh)")

    class Meta:
        verbose_name = "Sensor"
        verbose_name_plural = "Sensores"
        ordering = ['-created_at']

    def __str__(self):
        env_name = self.environment.name if self.environment else "Sem Ambiente"
        return f"{self.name} ({self.type}) - {env_name}"

class Reading(BaseModel):
    """
    Modelo que armazena as leituras recebidas dos sensores.
    """
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name='readings')
    value = models.FloatField(
        validators=[
            MinValueValidator(0.0, message="O valor não pode ser negativo")
        ],
        help_text="Valor lido pelo sensor (distância, temperatura, estado PIR, etc)"
    )

    class Meta:
        verbose_name = "Leitura"
        verbose_name_plural = "Leituras"
        ordering = ['-created_at']

    def __str__(self):
        return f"Leitura: {self.value} {self.sensor.unit} do sensor '{self.sensor.name}'"
