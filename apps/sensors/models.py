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

class Prototype(BaseModel):
    """
    Representa um Protótipo IoT (Nó) que contém múltiplos sensores embarcados.
    """
    environment = models.ForeignKey(Environment, on_delete=models.CASCADE, related_name='prototypes', null=True, blank=True, help_text="Ambiente onde o protótipo está instalado")
    name = models.CharField(max_length=255, help_text="Nome descritivo do Protótipo (Ex: NodeMCU_Lab01)")
    description = models.TextField(blank=True, null=True, help_text="Descrição ou anotações extras")

    class Meta:
        verbose_name = "Protótipo"
        verbose_name_plural = "Protótipos"
        ordering = ['-created_at']

    def __str__(self):
        env_name = self.environment.name if self.environment else "Sem Ambiente"
        return f"{self.name} - {env_name}"

class Reading(BaseModel):
    """
    Modelo que armazena as leituras recebidas do protótipo (pacote de dados).
    """
    prototype = models.ForeignKey(Prototype, on_delete=models.CASCADE, related_name='readings')
    temperature = models.FloatField(null=True, blank=True, help_text="Temperatura em °C")
    distance = models.FloatField(null=True, blank=True, help_text="Distância em cm")
    presence = models.BooleanField(null=True, blank=True, help_text="Detectou Presença? (PIR)")
    current = models.FloatField(null=True, blank=True, help_text="Corrente elétrica em Amperes")

    class Meta:
        verbose_name = "Leitura"
        verbose_name_plural = "Leituras"
        ordering = ['-created_at']

    def __str__(self):
        return f"Leitura do Protótipo '{self.prototype.name}' em {self.created_at.strftime('%Y-%m-%d %H:%M')}"
