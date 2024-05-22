from django.test import TestCase

from community.models import Community


class CommunityTests(TestCase):
    community = Community.objects.create(
        community_title='연금복권이 답이다',
        community_content='연급복권 20년 동안 받으면 개꿀이다',
        member_id=6
    )
