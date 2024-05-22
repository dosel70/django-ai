from django.db import models
from django.utils import timezone

class Period(models.Model):
    created_date = models.DateTimeField(null=False, auto_now_add=True)
    updated_date = models.DateTimeField(null=False, default=timezone.now)

    class Meta:
        abstract = True

