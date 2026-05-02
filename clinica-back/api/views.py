from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Modulo
from .serializers import ModuloSerializer

class ModuloListView(APIView):
   permission_classes = [IsAuthenticated]  # requiere JWT

   def get(self, request):
      modulos = Modulo.objects.all()  # ya vienen ordenados por mod_orden
      serializer = ModuloSerializer(modulos, many=True)
      return Response(serializer.data)