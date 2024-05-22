from django.db import models


class OnelabManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(onelab_post_status=True)
