from django.urls import path

from review.views import ReviewPlaceWriteView, ReviewShareWriteView

app_name = 'review'

urlpatterns = [
    path('place/write/', ReviewPlaceWriteView.as_view(), name='place-write'),
    path('share/write/', ReviewShareWriteView.as_view(), name='share-write')
]
