from django.urls import path

from exhibition.views import ExhibitionWriteView, ExhibitionDetailView, ExhibitionListView, ExhibitionUpdateView

app_name = 'exhibition'

urlpatterns = [
    path('write/', ExhibitionWriteView.as_view(), name='write'),
    path('detail/', ExhibitionDetailView.as_view(), name='detail'),
    path('list/', ExhibitionListView.as_view(), name='list'),
    path('update/<int:id>/', ExhibitionUpdateView.as_view(), name='update')
]