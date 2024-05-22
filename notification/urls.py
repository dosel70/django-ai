from django.urls import path

from notification.views import NotificationWriteView, NotificationDetailView, NotificationListView, NotificationListAPI, \
    NotificationUpdateView

app_name = 'notification'

urlpatterns = [
    path('write/', NotificationWriteView.as_view(), name='write'),
    path('detail/', NotificationDetailView.as_view(), name='detail'),
    path('list/', NotificationListView.as_view(), name='list'),
    path('list/<int:page>/', NotificationListAPI.as_view(), name='list-api'),
    path('update/<int:id>/', NotificationUpdateView.as_view(), name='update')
]