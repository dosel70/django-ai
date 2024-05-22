from django.db import models


class UsePointManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(point_status=1)
