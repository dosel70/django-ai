from django.db.models import Q
from django.test import TestCase

from alarm.models import Alarm


class AlarmTestCase(TestCase):
    # data= {
    #     'alarm_message': '가입대기',
    #     'alarm_receiver': '양현',
    #     'alarm_sender': '김규산',
    #     'member_id': 21,
    #     'onelab_id': 1,
    # }

    data = {
        'alarm_message': '가입대기',
        'alarm_receiver': '김규산',
        'alarm_sender': '이기영',
        'member_id': 1,
        'onelab_id': 1,
    }

    Alarm.objects.create(**data)

    pass