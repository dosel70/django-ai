from django.db import models


class ReviewManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(Review_post_status=True)
