from django.db import models

from member.models import Member
from oneLabProject.models import Period


class University(Period):
    university_member_school = models.CharField(null=False, blank=False, max_length=100)
    university_member_major = models.CharField(null=False, blank=False, max_length=100)
    university_member_points = models.BigIntegerField(null=False, blank=False, default=0)
    university_member_birth = models.DateField(null=False, blank=False, default="2005-01-01")
    member = models.ForeignKey(Member, primary_key=True, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_university'
        ordering = ['-created_date']

