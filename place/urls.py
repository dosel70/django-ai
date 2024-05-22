from django.urls import path

from place.views import PlaceDetailView, PlaceListView, PlaceWriteView, PlaceUpdateView, \
    PlaceDeleteView, PlaceReviewListView, PlaceReviewListAPIView, PlaceLikeView, PlaceListAPIView

app_name = 'place'

urlpatterns = [
    path('detail/<int:id>/', PlaceDetailView.as_view(), name='detail'),
    path('list/', PlaceListView.as_view(), name='list'),
    path('list/<int:page>/', PlaceListAPIView.as_view(), name='list'),
    path('write/', PlaceWriteView.as_view(), name='write'),
    # path('update/', PlaceUpdateView.as_view(), name='update'),
    path('update/<int:id>', PlaceUpdateView.as_view(), name='update'),
    path('delete/', PlaceDeleteView.as_view(), name='delete'),
    path('review/list/<int:place_id>/<int:page>/', PlaceReviewListAPIView.as_view(), name='review_list_api'),
    path('review/list/', PlaceReviewListView.as_view(), name='review_list'),
    path('like/', PlaceLikeView.as_view(), name='like'),
]