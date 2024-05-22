from django.shortcuts import render
from django.views import View

from member.models import Member
from school.models import School


class SchoolMainView(View):
    def get(self, request):
        member = request.session['member']['id']
        if School.objects.filter(member=member, school_member_status=1).exists():
            request.session['school_member_check'] = True
        else:
            request.session['school_member_check'] = False

        return render(request, 'school/main.html')
class SchoolMemberView(View):
    def post(self, request):
        member = Member.objects.get(id=request.session['member']['id'])
        data = request.POST

        context = {
            'school_name': data['school-name'],
            'school_member_address': data['school-input-address'],
        }
        School.objects.create(member=member, **context)
        return render(request,'school/main.html')
