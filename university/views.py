from django.shortcuts import render
from django.views import View

from member.models import Member


class UnversityMajorView(View):
    def get(self, request):
        member = Member.objects.get(member_name=request.member.member_name)

