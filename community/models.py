from django.db import models

from community.managers import CommunityManager
from file.models import File
from like.models import Like
from member.models import Member
from oneLabProject.models import Period


class Community(Period):
    COMMUNITY_CATEGORIES = (
        ('1', '자료요청'),
        ('2', '질문'),
        ('3', '기타')
    )
    community_title = models.TextField(null=False, blank=False)
    community_content = models.TextField(null=False, blank=False)
    post_status = models.CharField(max_length=100, choices=COMMUNITY_CATEGORIES, default='3')
    status = models.BooleanField(default=True)
    member = models.ForeignKey(Member, on_delete=models.PROTECT)

    objects = models.Manager()
    enabled_objects = CommunityManager()

    class Meta:
        db_table = 'tbl_community'
        ordering = ['-id']

    def get_absolute_url(self):
        return f'/community/detail/?id={self.id}'


class CommunityFile(models.Model):
    file = models.ForeignKey(File, primary_key=True, on_delete=models.PROTECT, null=False)
    community = models.ForeignKey(Community, on_delete=models.PROTECT, null=False, related_name='files')
    path = models.ImageField(null=False, blank=False, upload_to='community/%y/%m/d')


    class Meta:
        db_table = 'tbl_community_file'

class CommunityLike(Period):
    like = models.ForeignKey(Like, primary_key=True, on_delete=models.PROTECT, null=False)
    community = models.ForeignKey(Community, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_community_like'