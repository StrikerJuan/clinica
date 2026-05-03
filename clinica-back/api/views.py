from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Modulo, Cliente, Expediente, ExpedienteCliente
from .serializers import (
   ModuloSerializer, ClienteSerializer,
   ExpedienteSerializer, ExpedienteClienteSerializer
)

class ModuloListView(APIView):
   permission_classes = [IsAuthenticated]  # requiere JWT

   def get(self, request):
      modulos = Modulo.objects.all()  # ya vienen ordenados por mod_orden
      serializer = ModuloSerializer(modulos, many=True)
      return Response(serializer.data)
   

class ClienteListView(APIView):
   permission_classes = [IsAuthenticated]

   def get(self, request):
      clientes = Cliente.objects.all().order_by('cli_apellido_pat')
      return Response(ClienteSerializer(clientes, many=True).data)

   def post(self, request):
      serializer = ClienteSerializer(data=request.data)
      if serializer.is_valid():
         serializer.save()
         return Response(serializer.data, status=status.HTTP_201_CREATED)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClienteDetailView(APIView):
   permission_classes = [IsAuthenticated]

   def get_object(self, pk):
      try:
         return Cliente.objects.get(pk=pk)
      except Cliente.DoesNotExist:
         return None

   def get(self, request, pk):
      obj = self.get_object(pk)
      if not obj:
         return Response(status=status.HTTP_404_NOT_FOUND)
      return Response(ClienteSerializer(obj).data)

   def put(self, request, pk):
      obj = self.get_object(pk)
      if not obj:
         return Response(status=status.HTTP_404_NOT_FOUND)
      serializer = ClienteSerializer(obj, data=request.data, partial=True)
      if serializer.is_valid():
         serializer.save()
         return Response(serializer.data)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

   def delete(self, request, pk):
      obj = self.get_object(pk)
      if not obj:
         return Response(status=status.HTTP_404_NOT_FOUND)
      obj.delete()
      return Response(status=status.HTTP_204_NO_CONTENT)


class ExpedienteListView(APIView):
   permission_classes = [IsAuthenticated]

   def get(self, request):
      return Response(ExpedienteSerializer(
         Expediente.objects.all(), many=True
      ).data)


class ExpedienteClienteListView(APIView):
   permission_classes = [IsAuthenticated]

   def get(self, request):
      qs = ExpedienteCliente.objects.select_related('expcli_cli', 'expcli_exp').all()
      return Response(ExpedienteClienteSerializer(qs, many=True).data)

   def post(self, request):
      serializer = ExpedienteClienteSerializer(data=request.data)
      if serializer.is_valid():
         serializer.save()
         return Response(serializer.data, status=status.HTTP_201_CREATED)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)