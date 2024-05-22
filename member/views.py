import json
import secrets
import smtplib
import ssl
import string
from datetime import timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import random
from sys import platform

from django.db.models import Sum, F, Q
from rest_framework.templatetags.rest_framework import data

from exhibition.models import Exhibition
from notification.models import Notification
from school.models import School
from visitRecord.models import VisitRecord

ssl._create_default_https_context = ssl._create_unverified_context

from allauth.socialaccount.models import SocialAccount
from django.db import transaction
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.utils import timezone
from django.views import View
from rest_framework.response import Response
from rest_framework.views import APIView

from member.models import Member, MemberFile
from member.serializers import MemberSerializer
from oneLabProject import settings
from university.models import University




class MemberCheckIdView(APIView):
    def get(self, request):
        member_id = request.GET['member-id']
        is_duplicated = Member.objects.filter(member_id=member_id).exists()
        return Response({'isDup': is_duplicated})


class MemberNormalJoinView(View):
    def get(self, request):
        context = {
            'memberEmail': request.GET.get('member_email'),
            'memberSchoolEmail': request.GET.get('member_school_email'),
            'id': request.GET.get('id')
        }

        return render(request, 'login/normal-student-join.html', context)

    @transaction.atomic
    def post(self, request):
        data = request.POST
        university_major = data['university-member-major']
        data = {
            'member_name': data['member-name'],
            'member_password': data['member-password'],
            'member_email': data['member-email'],
            'member_school_email': data['member-school-email'],
            'member_phone': data['member-phone'],

        }

        member = Member.objects.create(**data)

        # member = Member.objects.filter(id=request.POST.get('id'))
        # # OAuth 최초 로그인 후 회원가입 시
        # if member.exists():
        #     del data['member_email']
        #     data['updated_date'] = timezone.now()
        #     member.update(**data)
        #
        # else:
        #     member = Member.objects.create(**data)
        member = Member.objects.get(id=member.id)
        university_info = {
            'university_member_birth': "1999-09-22",
            'university_member_major': university_major,
            'member': member
        }
        print(university_info)

        University.objects.create(**university_info)

        return redirect('member:login')


class MemberJoinView(View):
    def get(self, request):
        print(request.GET.get('member_name'))
        context = {
            'memberEmail': request.GET.get('member_email'),
            'memberType': request.GET.get('member_type'),
            'memberName': request.GET.get('member_name'),
            'memberPhone': request.GET.get('member_phone'),
            'memberSchoolEmail': request.GET.get('member_school_email')
        }
        # member_info = request.session['join-member-data']
        # context = {
        #     'member_email': member_info['member_email'],
        #     'member_name': member_info['member_name']
        # }

        return render(request, 'login/college-student-join.html', context)

    @transaction.atomic
    def post(self, request):
        data = request.POST
        user = SocialAccount.objects.get(user=request.user)
        university_major = data['university-member-major']
        data = {
            # 'member_name': data['member-name'],
            'member_phone': data['member-phone'],
            # 'member_password': data['member-password'],
            # 'member_email': data['member-email'],
            'member_school_email': data['member-school-email'],
        }
        last_member = Member.objects.latest('id')

        # OAuth 검사
        # OAuth 최초 로그인 시 TBL_MEMBER에 INSERT된 회원 ID가 member_id 이다.
        member = Member.objects.filter(id=last_member.id, member_type='naver')
        #   1. 아이디는 중복이 없다
        #   2. 이메일과 타입에 중복이 있다.
        #   3. OAuth로 최초 로그인된 회원을 찾아라

        # OAuth 최초 로그인 후 회원 가입
        if member.exists():
            print("존재함")
            # del data['member_email']
            # data['updated_date'] = timezone.now()
            member.update(**data)

        else:
            print("존재함1")
            member = Member.objects.create(**data)

        member = Member.objects.get(id=last_member.id)
        university_info = {
            'university_member_birth': "1999-09-22",
            'university_member_major': university_major,
            'member': member
        }
        print(university_info, member.__dict__)

        University.objects.create(**university_info)

        return redirect('member:login')


class MemberLoginView(View):
    def get(self, request):
        return render(request, 'login/login.html')

    def post(self, request):
        data = request.POST
        data = {
            'member_email': data['member-email'],
            'member_password': data['member-password']
        }

        member = Member.objects.filter(member_email=data['member_email'], member_password=data['member_password'])
        # print(member)
        url = '/'
        if member.exists():
            # 성공
            request.session['member'] = MemberSerializer(member.first()).data
            url = '/'
            return redirect('/')

        return render(request, 'login/login.html', {'check': False})


class SendVerificationCodeView(APIView):
    def post(self, request, school):
        data = request.POST
        # data = {
        #     # 'member_email': data['member-email'],
        #     'member_school_email': data['member-school-email'],
        # }
        # print(data['member-school-email'])
        # mail_receiver = data.get('member_school_email')
        # mail_receiver = json.dump(data)
        mail_receiver = school
        print(mail_receiver)
        rn = ''.join(random.choices('0123456789', k=6))


        port = 587
        smtp_server = "smtp.gmail.com"
        sender_email = "wmoon0024@gmail.com"
        receiver_email = mail_receiver
        password = "pqxh ciic adcg numz"
        message = f"<h1>인증번호 6자리 입니다 : {rn}</h1>"

        print("메일 들어옴")
        msg = MIMEText(message, 'html')
        data = MIMEMultipart()
        data.attach(msg)

        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_server, port) as server:
            server.ehlo()
            print("들어옴1")
            server.starttls(context=context)
            print("들어옴2")
            server.ehlo()
            print("들어옴3")
            server.login(sender_email, password)
            print("들어옴4")
            server.sendmail(sender_email, receiver_email, data.as_string())
            # print("들어옴5")
            # server.quit()
        # server.sendmail(sender_email, receiver_email, data.as_string())
        # uri = request.get_full_path()
        # request.session['previous_uri'] = uri
        # previous_page = request.META.get('HTTP_REFERER')
        # return render(previous_page)
        # return JsonResponse({'success': True, 'message': '성공!!!'})

class MemberIdSearchView(View):
    def get(self, request):
        return render(request, 'login/account-find.html')

class MemberActivateEmailView(APIView):
    def get(self,request):
        pass

    def post(self, request, email):
        # data = request.POST
        # data = {
        #     'member_email': data['member_email']
        # }

        members = Member.objects.all()
        member_email = Member.objects.get(member_email=email)
        member_id = member_email.id
        print(member_id)
        print("id 들어옴")
        # print(member_id)


        # 랜덤 숫자랑 문자열 10자리
        # 이메일 링크를 받으면 적어도 그 링크를 통해 접속이 된다.
        code = ''.join(random.choices(string.ascii_letters + string.digits, k=10))

        # 세션에 랜덤 코드 추가
        request.session['random_code'] = code
        # # 세션 저장
        # request.session.save()

        print(request.session['random_code'])

        # if member_email.exists():

        print(email)
        print(request.POST)
        # print(data['member-school-email'])
        mail_receiver = email
        # mail_receiver = json.dump(data)
        # mail_receiver = 'wmoon0024@gmail.com'
        print(mail_receiver)

        port = 587
        smtp_server = "smtp.gmail.com"
        sender_email = "wmoon0024@gmail.com"
        receiver_email = mail_receiver
        password = "pqxh ciic adcg numz"
        message = (f"<h1>비밀번호 계정 링크 입니다.</h1>\n"
                   f"<h2>http://127.0.0.1:10000/member/account-reset/{member_id}/{code}</h2>")

        print("메일 들어옴")
        msg = MIMEText(message, 'html')
        data = MIMEMultipart()
        data.attach(msg)

        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_server, port) as server:
            server.ehlo()
            print("들어옴1")
            server.starttls(context=context)
            print("들어옴2")
            server.ehlo()
            print("들어옴3")
            server.login(sender_email, password)
            print("들어옴4")
            server.sendmail(sender_email, receiver_email, data.as_string())

            return Response('fasjfksa')


class MemberResetPasswordView(View):
    def get(self, request, id, random):
        del request.session['random_code']
        print("아이디", id)
        print("랜덤", random)


        member = Member.objects.get(id=id)
        print("아이디13들어옴")
        print(member.id)

        data = {
            'id': member.id,
            'random': random
        }
        print("여기까지 들어옴")

        # if member.id == id:
        #     member.save(update_fields=['member_password'])
        # 수정된 정보가 있을 수 있기 때문에 세션 정보 최신화
        # request.session['member'] = MemberSerializer(Member.objects.get(id=request.session['member']['id'])).data
        # check = request.GET.get('check')
        # context = {'check': check}
        return render(request, 'login/reset-link.html', data)

    def post(self, request, id, random):
        print("패스워드쪽 들어옴")
        data = request.POST
        data = {

            'member_id': data['member-id'],
            'member_password': data['member-password'],
        }
        print("패스워드 들어옴1")

        member = Member.objects.get(id=id)
        member.member_password = data['member_password']
        print("패스워드 들어옴2")

        member.save(update_fields=['member_password'])
        print("패스워드 들어옴3")
        return render(request, 'login/login.html')


class MemberMainView(View):
    def get(self, request):
        # member_name = request.session.get('member_name')
        request.session['member_name'] = MemberSerializer(Member.objects.get(id=request.session['member']['id'])).data
        print(request.session['member_name'])
        member = request.session['member']['id']
        profile = MemberFile.objects.filter(member_id=member).first()

        default_profile_url = 'https://static.wadiz.kr/assets/icon/profile-icon-1.png'

        if profile is None :
            profile = default_profile_url
            context = {
                'profile' : profile
            }
            return render(request, 'main/main-page.html', context)
        else :
            context = {
                'profile': profile
            }

            return render(request, 'main/main-page.html',context)



# 관리자 VIEW

class AdminMemberLoginView(View):
    def get(self, request):
        return render(request, 'admin/login.html')

    def post(self, request):
        data = request.POST
        data = {
            'member_email': data['member-email'],
            'member_password': data['member-password'],
        }

        # exists() 를 사용하기 위해서 QuerySet 객체로 조회
        member = Member.objects.filter(**data)
        url = 'member:admin_login'
        if member.exists():
            # 성공
            request.session['member'] = MemberSerializer(member.first()).data
            return redirect('member:admin_main')
        # 일괄처리한 것임.
        return redirect(url)

class AdminMainView(View):
    def get(self, request):
        today = timezone.now().date()
        seven_days_ago = today - timedelta(days=6)
        visit_records = VisitRecord.objects.filter(date__range=[seven_days_ago, today])
        today_records = VisitRecord.objects.get(date = today)

        visit_records_total = VisitRecord.objects.filter(date__range=[seven_days_ago, today]).aggregate(total=Sum('count'))
        total_count = visit_records_total['total'] if visit_records_total['total'] is not None else 0

        # 각 visit_records의 date 필드를 문자열로 변환하여 직렬화
        visit_records_data = [{'date': record.date.strftime('%Y-%m-%d'), 'count': record.count} for record in
                              visit_records]
        visit_records_json = json.dumps(visit_records_data)

        context = {
            'visit_records_json': visit_records_json,
            'today_records': today_records,
            'visit_records_total': total_count
        }

        return render(request, 'admin/main.html', context)

class AdminMainUserView(View):
    def get(self, request):
        return render(request, 'admin/main_user.html')



class AdminMainUserListAPI(APIView):
    def get(self, request, page):
        row_count = 5
        offset = (page -1) * row_count
        limit = page * row_count

        columns = [
            'id',
            'member_email',
            'member_name',
            'member_phone',
            'created_date'
        ]

        keyword = request.GET.get('keyword', '')
        condition = Q()
        condition |= Q(member_name__icontains=keyword)

        members = Member.objects.filter(condition).values(*columns)[offset:limit]
        total_count = Member.objects.count()
        university_member_ids = list(University.objects.values_list('member', flat=True))
        school_members = School.objects.values_list('member', 'school_member_status')

        for member in members:
            member.setdefault('member-type', '일반회원')
            for school_member in school_members:
                if member['id'] == school_member[0]:
                    if school_member[1] == 0:
                        member['member-type'] = '학교 승인대기중'
                    elif school_member[1] == 1:
                        member['member-type'] = '학교회원'
                    break
                elif member['id'] in university_member_ids:
                    member['member-type'] = '대학생회원'

        member_info = {
            'members' : members,
            'total_count' : total_count,

        }

        return Response(member_info)

def translate(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        selected_items = data.get("selected_items")
        print(selected_items)

        for item_id in selected_items:
            try:
                School.objects.filter(member=item_id).update(school_member_status=True)

            except School.DoesNotExist:
                pass  # 항목이 존재하지 않는 경우 무시

        return JsonResponse({'message': '선택된 항목이 성공적으로 전환되었습니다.'})

    return JsonResponse({'error': 'POST 요청이 필요합니다.'}, status=400)

class AdminMainNotificationView(View):
    def get(self, request):
        return render(request, 'admin/main_notification.html')


class AdminNotificationListAPI(APIView):
    def get(self, request, page):
        row_count = 5
        offset = (page - 1) * row_count
        limit = page * row_count

        columns = [
            'id',
            'notification_title',
            'notification_status',
            'created_date',
            'notification_view_count'
        ]

        option = request.GET.get('option')

        if option == '커뮤니티':
            notifications = Notification.enabled_objects.filter(notification_status=0).values(*columns)[offset:limit]
            total_count = Notification.enabled_objects.filter(notification_status=0).count()
        elif option == '원랩':
            notifications = Notification.enabled_objects.filter(notification_status=1).values(*columns)[offset:limit]
            total_count = Notification.enabled_objects.filter(notification_status=1).count()
        elif option == '장소공유':
            notifications = Notification.enabled_objects.filter(notification_status=2).values(*columns)[offset:limit]
            total_count = Notification.enabled_objects.filter(notification_status=2).count()
        elif option == '공모전':
            notifications = Notification.enabled_objects.filter(notification_status=3).values(*columns)[offset:limit]
            total_count = Notification.enabled_objects.filter(notification_status=3).count()
        else:
            notifications = Notification.enabled_objects.values(*columns)[offset:limit]
            total_count = Notification.enabled_objects.count()



        notification_info= {
            'notifications' : notifications,
            'total_count' : total_count
        }

        return Response(notification_info)

def soft_delete(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        selected_items = data.get("selected_items")
        print(selected_items)
        # 선택된 항목들의 상태를 0으로 변경하는 코드 작성
        for item_id in selected_items:
            try:
                Notification.objects.filter(id=item_id).update(notification_post_status=False)

            except Notification.DoesNotExist:
                pass  # 항목이 존재하지 않는 경우 무시

        return JsonResponse({'message': '선택된 항목이 성공적으로 삭제되었습니다.'})

    return JsonResponse({'error': 'POST 요청이 필요합니다.'}, status=400)


class AdminMainExhibitionView(View):
    def get(self, request):
        return render(request, 'admin/main_exhibition.html')


class AdminMainExhibitionListAPI(APIView):
    def get(self, request, page):
        row_count = 5
        offset = (page -1) * row_count
        limit = page * row_count

        columns = [
            'id',
            'exhibition_title',
            'exhibition_view_count',
            'school__member__member_name',
            'created_date'
        ]

        exhibitions = Exhibition.enabled_objects\
                          .annotate(school_member_name=F('school__member__member_name')).values(*columns)[offset:limit]
        total_count = Exhibition.enabled_objects.count()
        exhibition_info = {
            'exhibitions' : exhibitions,
            'total_count' : total_count
        }

        return Response(exhibition_info)

def soft_delete_exhibition(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        selected_items = data.get("selected_items")
        print(selected_items)
        # 선택된 항목들의 상태를 0으로 변경하는 코드 작성
        for item_id in selected_items:
            try:
                Exhibition.objects.filter(id=item_id).update(exhibition_post_status=False)

            except Exhibition.DoesNotExist:
                pass  # 항목이 존재하지 않는 경우 무시

        return JsonResponse({'message': '선택된 항목이 성공적으로 삭제되었습니다.'})

    return JsonResponse({'error': 'POST 요청이 필요합니다.'}, status=400)


class AdminMainLogoutView(View):
    def get(self, request):
        request.session.clear()
        return redirect('/')
