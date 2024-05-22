from django.db import models


class PlaceManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(place_post_status=True)

class PlaceReviewManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(review__review_post_status=True)
