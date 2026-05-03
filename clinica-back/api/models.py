from django.db import models

# Create your models here.
class Modulo(models.Model):
   mod_id     = models.AutoField(primary_key=True)
   mod_nombre = models.CharField(max_length=100)
   mod_orden  = models.IntegerField(default=0)
   mod_icono  = models.CharField(max_length=100)  # ej: "people", "calendar_month"

   class Meta:
      db_table  = 'modulos'
      ordering  = ['mod_orden']  # siempre devuelve ordenados

   def __str__(self):
      return self.mod_nombre
   

class Cliente(models.Model):
   cli_id            = models.AutoField(primary_key=True)
   cli_nombre        = models.CharField(max_length=100)
   cli_apellido_pat  = models.CharField(max_length=100)
   cli_apellido_mat  = models.CharField(max_length=100, blank=True, null=True)
   cli_telefono      = models.CharField(max_length=20, blank=True, null=True)
   cli_correo        = models.EmailField(blank=True, null=True)
   cli_direccion     = models.TextField(blank=True, null=True)
   cli_ruta_ine      = models.CharField(max_length=255, blank=True, null=True)  # ruta física del archivo
   cli_responsable   = models.ForeignKey(
      'self',
      on_delete=models.SET_NULL,
      null=True,
      blank=True,
      related_name='menores'  # responsable.menores.all() → hijos a cargo
   )

   class Meta:
      db_table = 'clientes'

   def __str__(self):
      return f'{self.cli_nombre} {self.cli_apellido_pat}'


class Expediente(models.Model):
   exp_id   = models.AutoField(primary_key=True)
   exp_tipo = models.CharField(max_length=100)

   class Meta:
      db_table = 'expedientes'

   def __str__(self):
      return self.exp_tipo


class ExpedienteCliente(models.Model):
   expcli_id  = models.AutoField(primary_key=True)
   expcli_exp = models.ForeignKey(
      Expediente,
      on_delete=models.CASCADE,
      db_column='exp_id'
   )
   expcli_cli = models.ForeignKey(
      Cliente,
      on_delete=models.CASCADE,
      db_column='cli_id'
   )
   expcli_fecha      = models.DateField(auto_now_add=True)
   expcli_ruta_pdf   = models.CharField(max_length=255, blank=True, null=True)  # ruta del PDF generado

   class Meta:
      db_table = 'expedientes_clientes'

   def __str__(self):
      return f'Expediente {self.expcli_exp} - {self.expcli_cli}'