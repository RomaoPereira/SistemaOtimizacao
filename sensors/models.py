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

class Sensor(BaseModel):
    """
    Representa um sensor registrado no sistema IoT.
    """
    name = models.CharField(max_length=255, help_text="Nome descritivo do sensor (Ex: Water Tank Sensor)")
    type = models.CharField(max_length=100, help_text="Tipo do sensor (Ex: HC-SR04)")
    unit = models.CharField(max_length=50, help_text="Unidade de medida (Ex: cm, °C, %)")

    class Meta:
        verbose_name = "Sensor"
        verbose_name_plural = "Sensores"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.type})"

class Reading(BaseModel):
    """
    Modelo que armazena as leituras recebidas dos sensores.
    """
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name='readings')
    value = models.FloatField(
        validators=[
            MinValueValidator(0.0, message="O valor não pode ser negativo"),
            MaxValueValidator(400.0, message="O valor não pode ser maior que 400 (para sensores de 400cm)")
        ],
        help_text="Valor lido pelo sensor"
    )

    class Meta:
        verbose_name = "Leitura"
        verbose_name_plural = "Leituras"
        ordering = ['-created_at']

    def __str__(self):
        return f"Leitura: {self.value} {self.sensor.unit} do sensor '{self.sensor.name}'"
