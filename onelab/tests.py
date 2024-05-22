import datetime
from django.utils import timezone

from file.models import File
from onelab.models import OneLab, OneLabFile

# 기본 데이터
data = [
    ('2024-05-21 00:01:58.000000', '2024-05-21 00:02:01.000000', 'onelab/2024/03/18/gongmo.png'),
    ('2024-05-21 00:02:00.000000', '2024-05-21 00:02:02.000000', 'onelab/2024/03/18/exhibition.jpg'),
    ('2024-05-21 00:02:00.000000', '2024-05-21 00:02:03.000000', 'onelab/2024/03/18/gongmo4.jpg'),
    ('2024-05-21 00:02:00.000000', '2024-05-21 00:02:03.000000', 'onelab/2024/03/18/gongmo3_MCCc5ZR.jpg')
]

# 필요한 외래키 인스턴스 가져오기 또는 생성
file_instance = File.objects.get(pk=1)  # 예시로 pk=1인 File 인스턴스 가져오기
onelab_instance = OneLab.objects.get(pk=400)  # 예시로 pk=400인 OneLab 인스턴스 가져오기

# 데이터 삽입
index_counter = 5
for i in range(100):
    for entry in data:
        timestamp_start = datetime.datetime.strptime(entry[0], '%Y-%m-%d %H:%M:%S.%f')
        timestamp_end = datetime.datetime.strptime(entry[1], '%Y-%m-%d %H:%M:%S.%f')
        path = entry[2]
        created_date = timezone.now()  # 현재 시간으로 설정
        updated_date = created_date    # 처음에는 created_date와 동일하게 설정
        onelab_file = OneLabFile(
            file=file_instance,
            path=path,
            onelab=onelab_instance,
            created_date=created_date,
            updated_date=updated_date,
            timestamp_start=timestamp_start,
            timestamp_end=timestamp_end
        )
        onelab_file.save()
        index_counter += 1
