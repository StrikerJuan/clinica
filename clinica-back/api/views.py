from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Modulo, Cliente, Expediente
from .serializers import (
   ModuloSerializer, ClienteSerializer, ExpedienteSerializer
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
      cli_id = request.query_params.get('cliente')
      qs = Expediente.objects.all().order_by('-expcli_fecha')
      if cli_id:
         qs = qs.filter(expcli_cliente_id=cli_id)
      return Response(ExpedienteSerializer(qs, many=True).data)

   def post(self, request):
      serializer = ExpedienteSerializer(data=request.data)
      if serializer.is_valid():
         serializer.save()
         return Response(serializer.data, status=status.HTTP_201_CREATED)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExpedienteDetailView(APIView):
   permission_classes = [IsAuthenticated]

   def get(self, request, pk):
      try:
         exp = Expediente.objects.get(pk=pk)
      except Expediente.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      return Response(ExpedienteSerializer(exp).data)