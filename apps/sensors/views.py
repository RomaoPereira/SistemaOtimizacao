import logging
from django.db.models import Avg, Min, Max, Count
from rest_framework import viewsets, views, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Environment, Prototype, Reading
from .serializers import EnvironmentSerializer, PrototypeSerializer, ReadingSerializer
from .utils import standard_response

logger = logging.getLogger(__name__)

class EnvironmentViewSet(viewsets.ModelViewSet):
    queryset = Environment.objects.all()
    serializer_class = EnvironmentSerializer
    permission_classes = [IsAuthenticated]

class PrototypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Prototype.objects.all()
    serializer_class = PrototypeSerializer
    permission_classes = [IsAuthenticated]

class ReadingViewSet(viewsets.ModelViewSet):
    queryset = Reading.objects.all().select_related('prototype')
    serializer_class = ReadingSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['prototype']
    http_method_names = ['get', 'post', 'head', 'options']

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        logger.info(f"Dados recebidos do Protótipo: {request.data}")
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            reading = serializer.save()
            logger.info("Leitura salva com sucesso.")
            
            # --- LÓGICA DE NEGÓCIO (RF04, RF06) ---
            prototype = reading.prototype
            environment = prototype.environment
            
            if environment:
                # Ocupação via Sensor PIR (Presence)
                if reading.presence is not None:
                    environment.is_occupied = reading.presence
                    environment.save()
                    logger.info(f"Ambiente '{environment.name}' atualizado via PIR (Ocupado={environment.is_occupied})")
                # Fallback: Ocupação via Distância Ultrassônico (Ex: < 100cm indica pessoa perto)
                elif reading.distance is not None:
                    environment.is_occupied = (reading.distance < 100.0)
                    environment.save()
                    logger.info(f"Ambiente '{environment.name}' atualizado via Ultrassônico (Ocupado={environment.is_occupied})")
                
                # Desperdício de Corrente
                if reading.current is not None:
                    if not environment.is_occupied and reading.current > 0.5:
                        logger.warning(f"DESPERDÍCIO DETECTADO! Ambiente '{environment.name}' está VAZIO mas consumindo {reading.current}A.")

            return standard_response(
                status="success",
                message="Reading saved successfully",
                data=serializer.data,
                http_status=status.HTTP_201_CREATED
            )
        
        logger.warning(f"Falha na validação: {serializer.errors}")
        return standard_response(
            status="error",
            message="Dados inválidos.",
            data=serializer.errors,
            http_status=status.HTTP_400_BAD_REQUEST
        )

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return standard_response(
            status="success",
            message="Leituras recuperadas com sucesso.",
            data=response.data,
            http_status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def latest(self, request):
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
    def get(self, request):
        # Estatísticas focadas em temperatura para o Dashboard
        stats = Reading.objects.aggregate(
            average=Avg('temperature'),
            minimum=Min('temperature'),
            maximum=Max('temperature'),
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
