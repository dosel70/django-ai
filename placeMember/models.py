from django.db import models
from member.models import Member
from oneLabProject.models import Period
from place.models import Place
from university.models import University

class PlaceMember(Period):
    PLACE_MEMBER_STATUS = [
        (0, '결제'),
        (1, '환불'),
    ]
    place_member_status = models.SmallIntegerField(choices=PLACE_MEMBER_STATUS, default=0)
    university = models.ForeignKey(University, on_delete=models.PROTECT)
    place = models.ForeignKey(Place, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_place_member'