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