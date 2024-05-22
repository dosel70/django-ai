from django.urls import path

from community.views import CommunityWriteView, CommunityDetailView, CommunityListView, CommunityDeleteView, \
    CommunityUpdateView


app_name = 'community'

urlpatterns = [
    path('write/', CommunityWriteView.as_view(), name='write'),
    path('detail/', CommunityDetailView.as_view(), name='detail'),
    path('list/', CommunityListView.as_view(), name='list'),
    path('delete/', CommunityDeleteView.as_view(), name='delete'),
    path('update/', CommunityUpdateView.as_view(), name='update'),

]
