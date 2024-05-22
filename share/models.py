from django.db import models
from django.urls import reverse

from file.models import File
from like.models import Like
from oneLabProject.models import Period
from point.models import Point
from review.models import Review
from share.managers import ShareManager, ShareReviewManager
from university.models import University


class Share(Period):
    share_title = models.TextField(null=False, blank=False)
    share_content = models.TextField(null=False, blank=False)
    share_points = models.BigIntegerField(null=True, default=1000)
    share_choice_major = models.CharField(null=False, max_length=30)
    share_choice_grade = models.CharField(null=False, max_length=30)
    share_type = models.CharField(null=False, max_length=30)
    share_text_major = models.CharField(null=False, max_length=30)
    share_text_name = models.CharField(null=False, max_length=30)
    university = models.ForeignKey(University, on_delete=models.PROTECT, null=False)
    share_post_status = models.BooleanField(default=True, null=False)

    objects = models.Manager()
    enabled_objects = ShareManager()

    class Meta:
        db_table = 'tbl_share'
        ordering = ['id']

    def get_absolute_url(self):
        return reverse('share:detail', args=[self.id])


    def get_absolute_url(self):
        return reverse('share:detail', args=[self.id])
class ShareFile(Period):
    file = models.ForeignKey(File, primary_key=True, on_delete=models.PROTECT, null=False)
    path = models.ImageField(null=False, blank=False, upload_to='share/%Y/%m/%d')
    share = models.ForeignKey(Share, on_delete=models.PROTECT, null=False)
    name = models.CharField(max_length=255)  # 이름 필드 추가
    file_extension = models.CharField(max_length=10)    # 확장자 필드 추가

    class Meta:
        db_table = 'tbl_share_file'

    def save(self, *args, **kwargs):
        if self.path:
            file_name = self.path.name
            file_extension = file_name.split('.')[-1].lower()  # 파일 확장자 추출
            self.file_extension = file_extension
        super(ShareFile, self).save(*args, **kwargs)

class ShareLike(Period):
    like = models.ForeignKey(Like, primary_key=True, on_delete=models.PROTECT, null=False)
    share = models.ForeignKey(Share, on_delete=models.PROTECT, null=False, default=1)

    class Meta:
        db_table = 'tbl_share_like'

class SharePoints(Period):
    points = models.ForeignKey(Point, primary_key=True, on_delete=models.PROTECT, null=False)
    share = models.ForeignKey(Share, on_delete=models.PROTECT, null=False)
    class Meta:
        db_table = 'tbl_share_points'

class ShareReview(Period):
    review = models.ForeignKey(Review, primary_key=True, on_delete=models.PROTECT, null=False)
    share = models.ForeignKey(Share, on_delete=models.PROTECT, null=False)

    objects = models.Manager()
    enabled_objects = ShareReviewManager()

    class Meta:
        db_table = 'tbl_share_review'