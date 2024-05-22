from django.db import models

from member.models import Member
from point.managers import UsePointManager
from oneLabProject.models import Period
from point.managers import UsePointManager

class Point(Period):
    POINT_STATUS = [
        (1, '사용 중'),
        (2, '결제 완료'),
        (3, '결제 취소')

    ]

    point_status = models.SmallIntegerField(choices=POINT_STATUS)
    point = models.IntegerField(null=False, default=0)
    member = models.ForeignKey(Member, null=False, on_delete=models.PROTECT)

    objects = models.Manager()
    enabled_objects = UsePointManager()

    class Meta:
        db_table = 'tbl_point'
        ordering = ['-id']

    def get_absolute_url(self):
        return f'/point/detail?id={self.id}'