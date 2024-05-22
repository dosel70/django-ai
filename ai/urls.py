from django.urls import path

from ai.views import GetRecommendationsAPIView, PredictAPIView

app_name = 'ai'

urlpatterns = [
    path('recommendations/', GetRecommendationsAPIView.as_view(), name='get-recommendations'),
    path('predict/', PredictAPIView.as_view(), name='predict'),
    # path('detail/', AlarmDetailView.as_view(), name='alarm-detail'),
    # path('detail/api/<int:page>/', AlarmPagiNationAPIView.as_view()),
    # path('detail/agree/api/', AlarmAgreeAPIView.as_view()),
    # path('detail/deny/api/', AlarmDenyAPIView.as_view()),
    # path('detail/cancel/api/', AlarmCancelAPIView.as_view())
]