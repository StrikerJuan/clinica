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


class TipoDocumento(models.TextChoices):
   HISTORIA_GENERAL      = 'historia_general',      'Historia Clínica General'
   HISTORIA_DENTAL       = 'historia_dental',       'Historia Clínica Dental'
   CONSENT_EXTRAC        = 'consent_extrac',        'Consentimiento - Extracción'
   CONSENT_OPERATORIA    = 'consent_operatoria',    'Consentimiento - Operatoria Dental'
   CONSENT_ORTODONCIA    = 'consent_ortodoncia',    'Consentimiento - Ortodoncia'
   CONSENT_PROTESIS_FIJA = 'consent_protesis_fija', 'Consentimiento - Prótesis Fija'
   CONSENT_PROTESIS_REM  = 'consent_protesis_rem',  'Consentimiento - Prótesis Removible'
   CONSENT_ACLAR         = 'consent_aclar',         'Consentimiento - Aclaramiento Dental'
   HISTORIA_ENDOD        = 'historia_endod',        'Historia Clínica Endodoncia'
   CONSENT_ENDOD         = 'consent_endod',         'Consentimiento - Endodoncia'
   ENDOD_EVOLUCION       = 'endod_evolucion',       'Endodoncia Evolución'


class Expediente(models.Model):
   expcli_id      = models.AutoField(primary_key=True)
   expcli_cliente = models.ForeignKey(
      Cliente,
      on_delete=models.CASCADE,
      db_column='cli_id',
      related_name='expedientes'
   )
   expcli_tipo    = models.CharField(max_length=30, choices=TipoDocumento.choices)
   expcli_fecha   = models.DateTimeField(auto_now_add=True)
   expcli_datos   = models.JSONField()
   expcli_ruta_pdf = models.CharField(max_length=255, blank=True, null=True)

   class Meta:
      db_table = 'expedientes'

   def __str__(self):
      return f'{self.expcli_tipo} - {self.expcli_cliente}'