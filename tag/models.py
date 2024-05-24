from django.db import models
from oneLabProject.models import Period



class Tag(Period):
    TAG_STATUS = [
        (1, "공부"),
        (2, "친목"),
        (3, "수다"),
        (4, "공모전/대회")
    ]

    # TAG
    tag_name = models.SmallIntegerField(blank=False, null=False)

    class Meta:
        db_table = 'tbl_tag'
        ordering = ['created_date']

