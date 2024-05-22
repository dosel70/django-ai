from django.urls import path

from alarm.views import AlarmDetailView, AlarmPagiNationAPIView, AlarmAgreeAPIView, AlarmDenyAPIView, AlarmCancelAPIView

app_name = 'alarm'

urlpatterns = [
    path('detail/', AlarmDetailView.as_view(), name='alarm-detail'),
    path('detail/api/<int:page>/', AlarmPagiNationAPIView.as_view()),
    path('detail/agree/api/', AlarmAgreeAPIView.as_view()),
    path('detail/deny/api/', AlarmDenyAPIView.as_view()),
    path('detail/cancel/api/', AlarmCancelAPIView.as_view())

]