from django.db import models

from file.models import File
from member.models import Member
from oneLabProject.models import Period
from review.managers import ReviewManager


class Review(Period):
    review_content = models.TextField(null=False, blank=False)
    review_rating = models.FloatField(null=False, blank=False, default=0.0)
    member = models.ForeignKey(Member, on_delete=models.PROTECT, null=False)
    review_post_status = models.BooleanField(null=False, default=True)

    objects = models.Manager()
    enabled_objects = ReviewManager()

    class Meta:
        db_table = 'tbl_review'
        ordering = ['-id']

class ReviewFile(Period):
    file = models.ForeignKey(File, primary_key=True, on_delete=models.PROTECT, null=False)
    path = models.ImageField(null=False, blank=False, upload_to='review/%Y/%m/%d')
    review = models.ForeignKey(Review, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_review_file'
