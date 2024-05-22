from django.db import models

class ShareReviewManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(review__review_post_status=True)

class ShareManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(share_post_status=True)