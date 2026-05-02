from django.urls import path
from .views import ModuloListView

urlpatterns = [
   path('modulos/', ModuloListView.as_view(), name='modulos-list'),
]