from django.urls import path
from rest_framework.views import APIView

from onelab.views import OnelabWriteView, OnelabDetailView, OnelabListView, AiAPIView

app_name = 'onelab'

urlpatterns = [
    path('write/', OnelabWriteView.as_view(), name='write'),
    path('detail/', OnelabDetailView.as_view(), name='detail'),
    path('list/', OnelabListView.as_view(), name='list'),

]