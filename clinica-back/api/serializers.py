from rest_framework import serializers
from .models import Modulo, Cliente, Expediente

class ModuloSerializer(serializers.ModelSerializer):
   class Meta:
      model  = Modulo
      fields = '__all__'


class ClienteSerializer(serializers.ModelSerializer):
   responsable_nombre = serializers.SerializerMethodField()
   menores            = serializers.SerializerMethodField()

   class Meta:
      model  = Cliente
      fields = '__all__'

   def get_responsable_nombre(self, obj):
      if obj.cli_responsable:
         return f'{obj.cli_responsable.cli_nombre} {obj.cli_responsable.cli_apellido_pat}'
      return None

   def get_menores(self, obj):
      return [
         {
               'cli_id':   m.cli_id,
               'nombre':   f'{m.cli_nombre} {m.cli_apellido_pat}'
         }
         for m in obj.menores.all()
      ]
   

class ExpedienteSerializer(serializers.ModelSerializer):
   cliente_nombre = serializers.SerializerMethodField()
   tipo_display   = serializers.SerializerMethodField()

   class Meta:
      model  = Expediente
      fields = '__all__'

   def get_cliente_nombre(self, obj):
      c = obj.expcli_cliente
      return f'{c.cli_nombre} {c.cli_apellido_pat} {c.cli_apellido_mat or ""}'.strip()

   def get_tipo_display(self, obj):
      return obj.get_expcli_tipo_display()