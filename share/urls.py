from django.urls import path

from share.views import ShareWriteView, ShareDetailView, ShareDownloadView, ShareLikeView, ShareUpdateView, \
    ShareDeleteView, ShareListView, ShareListAPIView, ShareReviewListView, ShareReviewListAPIView

app_name = 'share'

urlpatterns = [
    path('detail/<int:id>/', ShareDetailView.as_view(), name='detail'),
    path('list/', ShareListView.as_view(), name='list'),
    path('list/<int:page>', ShareListAPIView.as_view(), name='list'),
    path('write/', ShareWriteView.as_view(), name='write'),
    path('update/', ShareUpdateView.as_view(), name='update'),
    path('update/<int:id>', ShareUpdateView.as_view(), name='update'),
    path('delete/', ShareDeleteView.as_view(), name='delete'),
    path('review/list/<int:share_id>/<int:page>/', ShareReviewListAPIView.as_view(), name='review_list_api'),
    path('review/list/', ShareReviewListView.as_view(), name='review_list'),
    path('like/', ShareLikeView.as_view(), name='like'),
]
