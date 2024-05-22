import math

from django.db import transaction
from django.db.models import F, Q
from django.shortcuts import render, redirect
from django.views import View
from django.utils import timezone
from datetime import datetime

from rest_framework.response import Response
from rest_framework.views import APIView

from alarm.models import Alarm
from member.models import Member


# 마이페이지 알람 클릭했을 떄 데이터를 가져오는 view (마이페이지에서 클릭했을 때 페이지가 이동 됌)
class AlarmDetailView(View):
    def get(self, request):
        data = request.GET
        return render(request, 'alarm/alarm.html', data)


class AlarmPagiNationAPIView(APIView):
    def get(self, request, page):
        login_id = request.session['member'].get('id')
        login_name = request.session['member'].get('member_name')
        receiver_name = Member.objects.get(id=login_id).member_name
        sender_name = Member.objects.get(id=login_id).member_name

        row_count = 5
        offset = (page - 1) * row_count
        limit = page * row_count

        alarm_total_count = Alarm.objects.filter(((Q(alarm_receiver=receiver_name)|Q(alarm_sender=sender_name)) & ~Q(alarm_status=-1))).count()
        page_count = 5
        end_page =math.ceil(page / page_count) * page_count
        start_page = end_page - page_count + 1
        real_end = math.ceil(alarm_total_count / row_count)
        end_page = real_end if end_page > real_end else end_page

        # 보낸사람이 나이거나 작성한 사람이 나일때 보여줘야함(반정규화)
        alarm_objects = Alarm.objects.filter(((Q(alarm_receiver=receiver_name)|Q(alarm_sender=sender_name)) & ~Q(alarm_status=-1)) & Q(status=1)).\
                            values\
                            ('id', 'alarm_receiver','alarm_sender','alarm_message', 'alarm_status','created_date','member__member_name',
                             'member_id','onelab__university_id', 'onelab__onelab_main_title', ).\
                            order_by('-created_date')[offset:limit]


        alarm_list = [{
            'id': alarm.get('id'),
            'alarm_receiver': alarm.get('alarm_receiver'),
            'alarm_sender': alarm.get('alarm_sender'),
            'member_name': alarm.get('member__member_name'),
            'alarm_message': alarm.get('alarm_message'),
            'alarm_status': alarm.get('alarm_status'),
            'created_date': alarm.get('created_date').strftime('%y-%m-%d'),
            'member_id': alarm.get('member_id'),
            'onelab_owner': alarm.get('onelab__university_id'),
            'onelab_titie': alarm.get('onelab__onelab_main_title')
        } for alarm in alarm_objects]

        context = {
            'alarm_list': alarm_list,
            'alarm_total_count': alarm_total_count,
            'start_page': start_page,
            'end_page':end_page,
            'page': page,
            'real_end': real_end,
            'page_count': page_count,
            'login_id': login_id,
            'login_name': login_name
        }
        return Response(context)

class AlarmAgreeAPIView(APIView):
    @transaction.atomic
    def post(self, request):
        data = request.data
        alarm_id = data['alarmClickId']
        click_value = data['buttonResult']

        # 가입 승인
        Alarm.objects.filter(id=alarm_id, alarm_status=2).update(alarm_status=0, alarm_message = click_value)

        return Response("success")

class AlarmDenyAPIView(APIView):
    @transaction.atomic
    def post(self, request):
        data = request.data
        alarm_id = data['alarmClickId']
        click_value = data['buttonResult']

        # 가입 거절
        Alarm.objects.filter(id=alarm_id, alarm_status=2).update(alarm_status=1, alarm_message=click_value)

        return Response("success")

class AlarmCancelAPIView(APIView):
    @transaction.atomic
    def post(self, request):
        data = request.data
        alarm_id = data['alarmClickId']

        # 알람 안보이게하기
        Alarm.objects.filter(id=alarm_id,alarm_status=2).update(status=0)

        return Response("success")





