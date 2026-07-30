import logging
from django.db.models import Avg, Min, Max, Count
from rest_framework import viewsets, views, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Environment, Sensor, Reading
from .serializers import EnvironmentSerializer, SensorSerializer, ReadingSerializer
from .utils import standard_response

logger = logging.getLogger(__name__)

class EnvironmentViewSet(viewsets.ModelViewSet):
    """
    Endpoint para gerenciar Ambientes.
    """
    queryset = Environment.objects.all()
    serializer_class = EnvironmentSerializer
    permission_classes = [IsAuthenticated]

class SensorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Endpoint para listar os sensores registrados.
    """
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer
    permission_classes = [IsAuthenticated]


class ReadingViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar medições.
    Permite Listar e Criar (GET e POST em /api/readings/).
    """
    queryset = Reading.objects.all().select_related('sensor')
    serializer_class = ReadingSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['sensor']
    http_method_names = ['get', 'post', 'head', 'options']

    def get_permissions(self):
        """
        Permite que o Arduino envie dados (POST) sem token, mas exige login para ler (GET).
        """
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        """
        Recebe uma nova leitura do Arduino.
        """
        logger.info(f"Dados recebidos: {request.data}")
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            reading = serializer.save()
            logger.info("Leitura salva com sucesso.")
            
            # --- LÓGICA DE NEGÓCIO (RF04, RF06) ---
            sensor = reading.sensor
            environment = sensor.environment
            
            if environment:
                # Se for sensor de presença (PIR)
                if 'PIR' in sensor.type.upper() or 'PRESENÇA' in sensor.name.upper():
                    # Supondo que 1.0 é ocupado e 0.0 é ocioso
                    environment.is_occupied = (reading.value > 0)
                    environment.save()
                    logger.info(f"Ambiente '{environment.name}' atualizado para ocupado={environment.is_occupied}")
                
                # PREPARAÇÃO PARA O SENSOR DE CORRENTE (RF06 - Indícios de Desperdício)
                # if 'CORRENTE' in sensor.type.upper() or 'SCT-013' in sensor.type.upper():
                #     consumo_atual = reading.value
                #     # Se o ambiente está ocioso mas o consumo é maior que o mínimo tolerável (ex: stand-by)
                #     if not environment.is_occupied and consumo_atual > 0.5:
                #         logger.warning(f"DESPERDÍCIO DETECTADO! Ambiente '{environment.name}' está VAZIO mas consumindo {consumo_atual}A.")
                #         # Futuro: Criar um registro na tabela Alert ou disparar notificação

            return standard_response(
                status="success",
                message="Reading saved successfully",
                data=serializer.data,
                http_status=status.HTTP_201_CREATED
            )
        
        logger.warning(f"Falha na validação dos dados: {serializer.errors}")
        return standard_response(
            status="error",
            message="Dados inválidos.",
            data=serializer.errors,
            http_status=status.HTTP_400_BAD_REQUEST
        )

    def list(self, request, *args, **kwargs):
        """
        Lista todas as leituras, ordenadas por mais recente.
        """
        response = super().list(request, *args, **kwargs)
        return standard_response(
            status="success",
            message="Leituras recuperadas com sucesso.",
            data=response.data,
            http_status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def latest(self, request):
        """
        Retorna apenas a leitura mais recente do banco de dados.
        """
        latest_reading = self.get_queryset().first()
        if latest_reading:
            serializer = self.get_serializer(latest_reading)
            return standard_response(
                status="success",
                message="Última leitura recuperada.",
                data=serializer.data,
                http_status=status.HTTP_200_OK
            )
        return standard_response(
            status="success",
            message="Nenhuma leitura encontrada.",
            data=None,
            http_status=status.HTTP_200_OK
        )


class StatisticsView(views.APIView):
    """
    Endpoint para fornecer dados agregados/estatísticos de todas as medições.
    """
    def get(self, request):
        stats = Reading.objects.aggregate(
            average=Avg('value'),
            minimum=Min('value'),
            maximum=Max('value'),
            total_readings=Count('id')
        )
        
        data = {
            "average": round(stats['average'], 2) if stats['average'] is not None else 0.0,
            "minimum": stats['minimum'] if stats['minimum'] is not None else 0.0,
            "maximum": stats['maximum'] if stats['maximum'] is not None else 0.0,
            "total_readings": stats['total_readings']
        }

        return standard_response(
            status="success",
            message="Estatísticas calculadas com sucesso.",
            data=data,
            http_status=status.HTTP_200_OK
        )


class HealthCheckView(views.APIView):
    def get(self, request):
        return standard_response(
            status="success",
            message="API está online e funcionando perfeitamente.",
            http_status=status.HTTP_200_OK
        )
