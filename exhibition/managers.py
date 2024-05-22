from django.db import models


class ExhibitionManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(exhibition_post_status=True)
