from django.urls import path
from .views import (
   ModuloListView,
   ClienteListView, ClienteDetailView,
   ExpedienteListView, ExpedienteDetailView
)

urlpatterns = [
   path('modulos/',              ModuloListView.as_view()),
   path('clientes/',             ClienteListView.as_view()),
   path('clientes/<int:pk>/',    ClienteDetailView.as_view()),
   path('expedientes/',          ExpedienteListView.as_view()),
   path('expedientes/<int:pk>/', ExpedienteDetailView.as_view()),
]