<h1>🚩 Onelab AI Project</h1>

---

<h2>📃 AI 프로젝트 소개</h2>

- 원랩(모임 커뮤니티) 추천 서비스 시스템 
> 이번 AI 프로젝트에서 제가 구현한 기능은 회원들의 관심사에 따른 원랩목록을 메인화면에서 추천해주는 시스템입니다.

<h2>📃 목차</h2>

- 화면
- 데이터 수집(Data Crowling)
- 수집한 데이터의 다중분류-나이브베이즈 분석
- 사전 훈련 모델을 Django에 업로드 (pkl File)
- Cosine_Similarity 이용하여 유사도 분석
- 서버 배포 및 화면 시연
- Trouble-Shooting
- 느낀점

---

<h3>📌 화면</h3>

<details><summary>👉 AI 적용할 화면 확인</summary>
<br>
<img width="650" alt="슬라이드0001" src="https://github.com/dosel70/django-ai/assets/143694489/92c725ea-affe-4298-b59b-c2c61fd19fdc" style="margin-bottom" : 10px">  
</details>

- 회원의 관심사와 유사한 원랩 목록을 추천해주고, 각 관심사(공부, 친목, 수다, 공모전 및 대회)에 따라서 가장 유사도가 높은 원랩 목록 순으로 (왼쪽-->오른쪽) 4개가 보여집니다.

---

<h3>📌  데이터 수집(Data Crowling)</h3>

<details><summary>👉 수집해야할 데이터 종류</summary>
<br>
  - BeuatifulSoup를 이용하여 데이터를 수집 하였습니다.  
  
  - 우선 데이터 수집 전 관심사 태그가 총 4개이고, 각각의 종류가 다르기 때문에, 각각 주제에 맞는 사이트에서 크롤링을 하였습니다.
    
  - ✏️ 공부 : https://letspl.me/ (랫플 : 프로젝트 & 스터디 모임 문화 플랫폼)
    
  - 😊 친목 : https://www.munto.kr/ (문토 : 취미 모임 문화 플랫폼)
    
  - 😁 수다 : https://onoffmix.com/ (온오프믹스: 각종 모임 문화 플랫폼)
    
  - 👦🏻 공모전/대회 : https://onoffmix.com/ (온오프믹스: 각종 모임 문화 플랫폼)
  
</details>


<h4>📃 사전 훈련 모델 (원랩) 데이터세트 csv</h4>

- 태그별로 수집한 데이터세트를  csv파일로 만들었습니다.

<details><summary>👉 데이터 수집 코드 확인</summary>
<br>
<h5> (관심사 태그 : 공부) 데이터 수집</h5>
<img width="960" alt="file_request_code" src="https://github.com/dosel70/django-ai/assets/143694489/9f05498b-3304-48c2-aa89-81b186bce3e4">  
  
<h5> (관심사 태그 : 친목) 데이터 수집</h5>
<img width="960" alt="file_request_code2" src="https://github.com/dosel70/django-ai/assets/143694489/c7326f0e-82b9-4d97-a4e7-cce80b9556a7">  

<h5> (관심사 태그 : 수다) 데이터 수집</h5>  
<img width="960" alt="file_request_code3" src="https://github.com/dosel70/django-ai/assets/143694489/a42a2fd3-2f9a-4dff-b1dd-75e808aa6660">  

<h5> (관심사 태그 : 공모전/대회) 데이터 수집 </h5>  
<img width="960" alt="file_request_code4" src="https://github.com/dosel70/django-ai/assets/143694489/a2d8d7df-cb50-4602-96f8-900ef1674d3c">

</details>


- 📌 수집한 데이터세트 병합

<details><summary>👉 코드 확인</summary>
<br>
<img width="960" alt="a-ha_page" src="https://github.com/dosel70/django-ai/assets/143694489/e2ae8952-c3ce-4029-8d19-08bb52591e73">
</details>


<details><summary>👉 사전 훈련 모델 csv</summary>
<br>
<img width="960" alt="question_code2" src="https://github.com/dosel70/django-ai/assets/143694489/42ca33db-c191-412a-9cc5-d64177154d3a">
</details>



---

<h3>📌 Sklearn 라이브러리를 통한 다중분류 naive_bayes 분석</h3>  

- 앞서 만든 데이터세트에서 제목,내용,한줄소개 그리고 대표 관심사 태그를 이용하여 다중 분류 나이브 베이즈 분석을 진행하였습니다.  

- 먼저 원랩 데이터가 담겨있는 csv 파일을 읽어옵니다. 데이터에는 제목, 내용, 한줄소개, 관심사 태그 등의 정보가 포함되어 있습니다.
    
- 결측치 및 중복된 데이터를 제거 후 제목, 내용, 한줄 소개 등의 독립변수들을 하나의 긴 문자열로 연결하여 새로운 데이터를 만들고, 이 데이터를 이용하여 모델을 훈련합니다.
    
- 그 다음 데이터를 훈련 세트와 테스트 세트로 분할하여 타겟 데이터인 대표 관심사 태그를 예측 할 수 있도록 합니다.
    
- 파이프 라인을 이용하여 데이터를 벡터화 시키면서 모델 훈련을 동시에 수행할 수 있도록 합니다.
    
- 그 다음 훈련된 모델을 사용하여 테스트 세트에 대한 예측을 수행하고 각 클래스에 대한 예측 확률을 계산합니다.
    
- 모델의 성능을 평가하기 위해 정확도, 정밀도, 재현율, F1 점수와 같은 지표를 계산합니다.
    
- 최종적으로 예측확률이 가장 높게 나온 관심사태그는 '친목'이 나왔으며, 그 다음으로 높게 나타난 관심사 태그는 '공부' 였습니다.

- 결과적으로 '친목', '공부'를 나타내는 관심사 태그를 기준으로, Django에서 CountVectorizer와 코사인 유사도를 활용하여
  전체 원랩을 대상으로 '친목' 및 '공부' 관련 원랩을 찾고, 이와 유사한 다른 원랩을 추천합니다.

- 이러한 유사도 분석 결과를 바탕으로 사용자에게 맞춤형 원랩 추천 시스템을 구축할 수 있으며,
  
- 이를 통해 사용자의 관심사에 맞는 원랩을 보다 정확하게 추천할 수 있는 원랩 서비스를 구현할 수 있습니다.

- 추가적으로 원랩을 이용하는 각각의 회원들의 대표 관심사 태그와도 분석하여, 회원의 관심사에 맞는 알맞는 원랩을 추천 할 수 있습니다.
  
<details><summary>👉 코드 확인</summary>

<br>

- 제목, 내용, 한줄 소개 등의 독립변수들을 하나의 긴 문자열로 연결하여 새로운 데이터를 만들었습니다.

<img width="960" alt="cs1" src="https://github.com/dosel70/django-ai/assets/143694489/c685b9eb-b6eb-4983-87aa-6468c97bc99a">

- 기존 Feature들을 제거 후 하나의 독립변수와 종속변수가 있는 데이터를 훈련 세트와 테스트 세트로 분할하였습니다. 여기서는 타겟 데이터인 대표 관심사 태그를 예측합니다.

<img width="960" alt="cs2" src="https://github.com/dosel70/django-ai/assets/143694489/c6c4fffa-ea47-4ec1-b76d-583ddd3eed87">

- Sklearn의 CountVectorizer와 다중분류 나이브 베이즈 모델인 MultinomialNB을 활용하 파이프라인으로 벡터화와 모델 훈련을 동시에 수행 하였습니다.

<img width="960" alt="cs3" src="https://github.com/dosel70/django-ai/assets/143694489/a28667e0-e6a5-452c-a5e7-e22dcee5a579">

- 그 다음 훈련된 모델을 사용하여 테스트 세트에 대한 예측을 수행하고 각 Feature에 대한 예측 확률을 계산하였습니다.
- 여기서 대표 관심사를 나타내는 타겟 데이터 번호들 중 가장 높은 예측확률을 가진 타겟데이터 순으로 내림차순으로 정렬하였습니다.
- 결과적으로 예측확률이 가장 높게 나온 관심사태그는 '친목'을 나타내는 2이 나왔으며, 그 다음으로 높게 나타난 관심사 태그는 '공부' 였습니다.
- 결과적으로 Django 내에서 유사도 분석 시 가장 높은 유사도를 보일만한 관심사 역시 친목, 공부 와 같은 관심사가 우선적으로 추천됨을 의미합니다.
- 결과적으로 '친목', '공부'를 나타내는 관심사 태그를 기준으로, Django에서 CountVectorizer와 코사인 유사도를 활용하여
  전체 원랩을 대상으로 '친목' 및 '공부' 관련 원랩을 찾고, 이와 유사한 다른 원랩을 추천할 수 있습니다.

<img width="960" alt="cs4" src="https://github.com/dosel70/django-ai/assets/143694489/ad3984f9-eb1a-424e-93c4-9bb8d59cc0a8">  

✨ 예측확률 순위 (1 ~ 4 타겟 데이터)  
> 1 : 공부
> 
> 2 : 친목
> 
> 3 : 수다
> 
> 4 : 공모전 및 대회
> 
<img width="960" alt="cs4" src="https://github.com/dosel70/django-ai/assets/143694489/9fd0e6db-e758-4e95-84b5-5854bd7ccbcd">

- 모델의 성능을 평가하기 위해 정확도, 정밀도, 재현율, F1 점수와 같은 지표를 계산하였으며, 정확도는 0.8750로 준수한 성능이 나온 것을 확인 할 수 있었습니다.

<img width="960" alt="cs4" src="https://github.com/dosel70/django-ai/assets/143694489/cbb4eb36-048c-472c-bb24-f7f7953d5e84">  

- 이러한 사전 훈련 모델을 활용하여 Django에서 사용할 수 있도록 onelab.pkl 파일로 만들었으며, Django에 이식하겠습니다.

<img width="960" alt="cs4" src="https://github.com/dosel70/django-ai/assets/143694489/33378ab0-6bce-4a1d-8bce-3a2d06333d70">    

 <h4> ✨ 이 결과를 바탕으로 Django에서 CountVectorizer와 코사인 유사도를 활용하여 유사도 분석을 진행하고, 사용자 맞춤형 원랩 추천 시스템을 구축할 계획입니다. </h4> 

</details>

---

<h3>📌 Django - 코사인 유사도 분석</h3>

- 기존 사전훈련 모델을 pkl 파일은 Django서버에 AI 폴더에 이식하고, 훈련 데이터세트는 서버 데이터베이스에 이식을 하였습니다.
- 우선 목표는 Django에서 CountVectorizer와 코사인 유사도를 활용하여 메인 페이지에 나타날 원랩 데이터들의 유사도 분석을 진행하고,
- 추가적으로 원랩 서비스를 이용하는 각각의 회원들의 대표 관심사 태그와도 유사도 분석을 진행하여 회원의 관심사에 맞는 알맞은 원랩을 추천할 수 있도록 사용자 맞춤형 원랩 추천 시스템을 구축할 계획입니다.

- 구체적인 단계는 다음과 같습니다.
1. Django ai 폴더에 이식한 사전훈련모델 pkl 파일을 활용하여, 다른 원랩과의 유사도를 분석합니다.
2. 마찬가지로 Django에서 CountVectorizer와 코사인 유사도를 활용하여 유사한 다른 원랩을 추천합니다.
3. 최종적으로 회원의 대표 관심사 태그와도 유사도 분석을 진행하여 사용자에게 맞춤형 원랩 추천 시스템을 구축합니다.

<h4>📌 Django</h4>

**상세 설명**

- AIView
  - Post 방식으로 json 형태로 통신된 사전훈련 모델을 Django에 이식하여 각 원랩목록의 예측 결과와 확률을 반환할 수 있습니다.
  - 제목과 내용, 한줄 소개 등을 onelab_main_title과 onelab_content, onelab_detail_content 라는 변수에 할당합니다.
  - 제목, 내용, 한줄소개들을 하나의 문자열로 만들어주고 get_index_from_member_tag 함수를 호출합니다.
  - <details><summary>👉 코드 보기</summary>
    <img width="800" alt="html1" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/f341703e-905a-450c-9c10-416fa3a28638">
  </details>

    
- get_index_from_member_tag
  
> 기존 사전 훈련 데이터 csv를 Django Database에 insert 하였습니다.

- onelabs = list(OneLab.objects.filter(tag__tag_name=member_tag)): 주어진 멤버 태그와 관련된 OneLab 객체들을 데이터베이스에서 쿼리합니다.
  
- onelabs_list = [f"{onelab.onelab_main_title} {onelab.onelab_content} {onelab.onelab_detail_content}" for onelab in onelabs]: OneLab 객체들의 콘텐츠를 문자열 리스트로 만듭니다. 이 리스트는 각 OneLab 객체의 주요 제목, 내용, 한줄 소개 등 으로 구성됩니다.
  

- vectorizer = CountVectorizer(): CountVectorizer를 사용하여 텍스트 데이터를 벡터화할 준비를 합니다.
  

- content_vectors = vectorizer.fit_transform(onelabs_list): 벡터화된 원랩 콘텐츠를 생성합니다.
  

- similarity_matrix = cosine_similarity(content_vectors): 콘텐츠 간의 유사도 행렬을 계산합니다. 이 행렬은 각 콘텐츠 쌍 간의 코사인 유사도를 포함합니다.
  

- mean_similarity_scores = np.mean(similarity_matrix, axis=1): 각 OneLab 객체의 콘텐츠와 다른 모든 콘텐츠 간의 평균 유사도 점수를 계산합니다.

  

- max_similarity_index = np.argmax(mean_similarity_scores): 가장 높은 평균 유사도 점수를 가진 OneLab 객체의 인덱스를 찾습니다.
  

- ✨ 해당 함수는 최종적으로 가장 높은 유사도를 가진 OneLab 객체의 인덱스와 벡터화된 콘텐츠를 반환하며, 메인 페이지에 반환된 원랩 목록들을 보여줄 수 있습니다. 
  - <details><summary>👉 코드 보기</summary>
      <img width="800" alt="html1" src="https://github.com/dosel70/django-ai/assets/143694489/f6bf6d5a-b662-4c67-b5a7-35a10967206a">
    </details>


- AIView
  - 다시 AIView로 돌아와서 get_similar_communities 함수로 return 된 similar_content를 similar_communities라는 변수에 할당해줍니다.
  - JsonResponse를 통해 similar_communities를 return하고 비동기통신을 종료합니다.
  - <details><summary>👉 코드 보기</summary>
      <img width="800" alt="html1" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/009b8d77-f6ec-4f35-94e1-0b10ed6dcc9f">
    </details>

- make_dataframe
  - 불러온 community의 데이터 중 제목과 내용 그리고 범주를 list로 묶은 다음 데이터프레임으로 만듭니다.
  - post_status가 수치형이기 때문에 translate_status 함수로 문자로 변환해줍니다.
  - combined_features 라는 새로운 feature로 concatenate 라는 함수를 통해 하나의 문자열로 만들어줍니다.
  - 그 데이터프레임을 return으로 반환합니다.
  - <details><summary>👉 코드 보기</summary>
      <img width="800" alt="html1" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/b8d2379d-2572-4247-bc75-cd53fcfaebe9">
    </details>

- translate_status & concatenate
  - 수치형인 범주값을 문자로 변환해주는 함수와 하나의 문자열로 만들어주는 함수입니다.
  - <details><summary>👉 코드 보기</summary>
      <img width="800" alt="html1" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/233658ce-adeb-4059-8b2e-55c526552835">
    </details>

---

<h3>📌 서버 배포 및 화면 시연</h3>

- 로컬에서 구현한 기능이 정상적으로 작동이 되는 것을 확인하고 이를 ubuntu를 이용하여 서버에 배포하였습니다.

---

<h3>📌 Trouble-Shooting</h3>

- MainView에서 RestAPI를 이용하여 기존 GetRecommendationsAPIView에서 정의된 함수들을 불러오지 못하여 메인 페이지에 원랩 목록들이 출력이 되지 않은 ISSUE
- 
  - CSRF-Token을 찾지 못하여 Not Certificated Token 에러
  - View로 넘어왔지만 같이 넘어온 데이터가 None 인 에러
  - Django에서 비동기 방식으로 데이터를 불러오는 중 발생한 문제
 
<h4>📌 await fetch() 를 이용하여 url을 통해 view로 넘어갈 때 url을 찾지 못하는 Not Found 에러</h4>

- url 경로를 제대로 설정해 주었는데도 불구하고 Not Found 에러가 나타났습니다.
- 경로를 다시 추적을 해보니, Main url 파일에 새로이 만든 ai url을 추가하지 않아 못 찾는 것을 파악하고 추가해주었습니다.
- 수정한 다음 다시 확인하니 View로 넘어가는 것을 파악했으나, CSRF-Token 에러가 나타났습니다.

<h4>📌 CSRF-Token을 찾지 못하여 Not Certificated Token 에러</h4>

- View로 넘어간 것을 확인하고자 했으나 개발자 도구에서 Token과 관련된 에러가 나타나는 것을 확인했습니다.
- HTML상 form태그안에 CSRF-Token 있었으나, 비동기 통신 방식으로 통신할 때 token이 포함되지 않는 것을 확인했습니다.
- Javascript에서 CSRF-Token을 가져오는 함수를 만들어 직접 가져와서 csrftoken 이라는 변수에 할당하여 await fetch()에 headers에 담아주었습니다.
- <details><summary>👉 코드 보기</summary>
    <img width="800" alt="html1" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/c1fdb71c-52c4-4b26-b5c7-64e23991511f">
    <img width="800" alt="html1" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/e27b21e2-2a27-4a1f-88a2-3c9686b99ae8">
  </details>

<h4>🥕 View로 넘어왔지만 같이 넘어온 데이터가 None 인 에러</h4>

- CSRF-Token 문제를 해결한 다음 다시 확인했으나, View를 통해 받아와 함수로 넘긴 데이터가 없다고 나타났습니다.
- print를 하나씩 찍어보면서 확인한 결과, Javascript에서 비동기통신으로 받아온 데이터가 None으로 확인이 되었습니다.
- 다시 Javascript로 넘어가서 문제를 확인했을 때, 데이터를 <code>body: JSON.stringify </code>의 형태로 담아서 전달했는데 View에서는 request.post로 데이터를 받아오고 있던 것이었습니다.
- 이를 확인하여 다시 json.loads(requests.body)로 바꿔주고 다시 print하여 확인한 결과 정상적으로 원하는 데이터가 넘어오게 되었습니다.

<h4>🥕 Django에서 비동기 방식으로 데이터를 불러오는 중 발생한 문제</h4>

- 데이터를 불러오는 중, 화면이 빈 상태로 있는 문제가 발생하였습니다.
- 이를 해결하기 위해 로딩을 의미하는 GIF를 화면상에 표기하는 로직을 추가하여 개선하였습니다.

---

<h3>🥕 느낀점</h3>

- 이번 프로젝트를 통해 Django와 AI를 결합한 웹 애플리케이션을 개발하는 귀중한 경험을 할 수 있었습니다.
- 데이터 수집부터 유사도 분석, 그리고 실제 서버 배포까지 전 과정을 직접 경험하며, 다양한 시행착오를 겪으면서 많은 것을 배웠습니다.
- Cosine Similarity를 이용한 유사도 분석을 통해 사용자가 원하는 내용을 자동으로 추천하는 기능을 성공적으로 구현할 수 있었습니다.
- 특히 Trouble-Shooting 과정에서 여러 에러들을 하나씩 확인하고 수정하면서, 문제 해결 능력과 디버깅 역량을 크게 향상시켰습니다.
- 또한, 비동기 통신을 활용하여 사용자 경험을 향상시키는 방법을 익히고, 비동기 통신의 중요성과 이를 효과적으로 구현하는 방법에 대한 깊은 이해를 얻을 수 있었습니다.

<h3>🥕 앞으로의 포부</h3>

- 이번 프로젝트를 바탕으로 더 복잡하고 다양한 AI 모델을 웹 애플리케이션에 통합하는 방법을 연구하고 개발하고 싶습니다.
- 머신러닝과 딥러닝을 활용한 데이터 분석 및 예측 모델을 개발하여 더욱 정교한 추천 시스템을 만들고자 합니다.
- 대규모 데이터를 처리하고 분석하는 능력을 키워, 실시간으로 사용자에게 맞춤형 콘텐츠를 제공하는 시스템을 구축하고 싶습니다.

