import os
import csv
import django
from django.utils import timezone

# Django 프로젝트 설정
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "oneLabProject.settings")
django.setup()

from onelab.models import OneLab
from tag.models import Tag
from university.models import University

# 기본값 설정
url = 'https://www.naver.com'
max_count = 10
ask_email = 'dosel70@naver.com'
status = True
post_status = True
university_id = 1

# University 객체 가져오기
try:
    university = University.objects.get(member_id=university_id)
except University.DoesNotExist:
    print('대학교 아이디가 존재하지 않습니다.')
    exit()

# CSV 파일 읽기 및 데이터 삽입

with open('test2.csv', newline='', encoding='utf-8-sig') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        try:
            tag_id = int(row[3])  # 'tag_id'는 네 번째 열에 위치한다고 가정
            tag = Tag.objects.get(id=tag_id)
            onelab = OneLab(
                onelab_main_title=row[0],  # 'onelab_main_title'는 첫 번째 열에 위치한다고 가정
                onelab_content=row[1],  # 'onelab_content'는 두 번째 열에 위치한다고 가정
                onelab_detail_content=row[2],  # 'onelab_detail_content'는 세 번째 열에 위치한다고 가정
                onelab_url=url,
                onelab_max_count=max_count,
                onelab_ask_email=ask_email,
                onelab_status=status,
                onelab_post_status=post_status,
                university=university,
                tag=tag
            )
            onelab.save()
            print(f"Inserted: {onelab.onelab_main_title}")
        except ValueError:
            print("유효하지 않은 tag_id입니다.")
        except IndexError:
            print("데이터가 누락되었습니다.")
        except Tag.DoesNotExist:
            print(f"Tag with id {tag_id} does not exist.")