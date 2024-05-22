from django.db import models

from member.models import Member
from oneLabProject.models import Period


class Like(Period):
    like_status = models.BooleanField(null=False, blank=False, default=False)
    member = models.ForeignKey(Member, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_like'
