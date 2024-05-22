from django.db import models
from member.models import Member
from oneLabProject.models import Period


class HighSchool(Period):
    high_school_member_birth = models.DateField(null=False, blank=False, default='2008-01-01')
    member = models.ForeignKey(Member, primary_key=True, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_high_school'
        ordering = ['-created_date']
