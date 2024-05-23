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

<h3>🥕 화면</h3>

<details><summary>👉 AI 적용할 화면 확인</summary>
<br>
<img width="650" alt="슬라이드0001" src="https://github.com/dosel70/django-ai/assets/143694489/92c725ea-affe-4298-b59b-c2c61fd19fdc" style="margin-bottom" : 10px">  
</details>

- 회원의 관심사와 유사한 원랩 목록을 추천해주고, 각 관심사(공부, 친목, 수다, 공모전 및 대회)에 따라 가장 유사도가 높은 원랩 목록 순으로 (왼쪽-->오른쪽) 4개가 보여집니다.

---

<h3>🥕 데이터 수집(Data Crowling)</h3>

<details><summary>👉 수집해야할 데이터 종류</summary>
<br>
  - BeuatifulSoup를 이용하여 데이터를 수집 하였습니다.  
  
  - 우선 데이터 수집 전 관심사 태그가 총 4개이고, 각각의 주제가 다르기 때문에, 각각 다른 사이트에서 크롤링을 하였습니다.
    
  - ✏️ 공부 : https://letspl.me/ (랫플 : 프로젝트 & 스터디 모임 문화 플랫폼)
    
  - 😊 친목 : https://www.munto.kr/ (문토 : 취미 모임 문화 플랫폼)
    
  - 😁 수다 : https://onoffmix.com/ (온오프믹스: 각종 모임 문화 플랫폼)
    
  - 👦🏻 공모전/대회 : https://onoffmix.com/ (온오프믹스: 각종 모임 문화 플랫폼)
  
</details>

- BeautifulSoup을 이용하여 데이터를 수집했습니다.
- 게시글의 유형별로 데이터를 수집하기 위해 다음 사이트를 참고하여 수집했습니다.
- 데이터를 수집하기 위한 코드는 Jupyter Notebook 환경에서 진행하였습니다.

<h4>🥕 자료 요청</h4>

- 위에 해당하는 내용은 사이트에서 크롤링을 하여서 csv파일로 만들었습니다.

<details><summary>👉 코드 확인</summary>
<br>
<img width="960" alt="file_request_code" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/fe05e43a-e561-4b10-aa6c-f0a8206cd59d">
<img width="960" alt="file_request_code2" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/eeec7bb2-42d1-46e9-9ff7-6e8f80a47dc6">
</details>

<h4>🥕 질문</h4>

- https://www.a-ha.io/

<details><summary>👉 a-ha 페이지</summary>
<br>
<img width="960" alt="a-ha_page" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/c05a3592-1146-4d5a-82ac-e2bdf07d114b">
</details>


<details><summary>👉 코드 확인</summary>
<br>
<img width="960" alt="question_code2" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/d06dfcf2-1f7c-4d4a-9c93-692dfbc2ee17">
<img width="960" alt="question_code1" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/6b042a46-ea8a-4405-896a-216f16772bd3">
</details>

<h4>🥕 기타</h4>

- https://news.naver.com/

<details><summary>👉 네이버 뉴스 페이지</summary>
<br>
<img width="960" alt="naver_news" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/59c852c9-e175-4d6a-a128-e635b451c5be">
</details>


<details><summary>👉 코드 확인</summary>
<br>
<img width="960" alt="etc_code" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/a851a9d2-2a6e-4f95-a26c-ff5bf4b9338d">
<img width="960" alt="etc_code1" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/d8f4a62e-6c78-434e-831f-de5b424c9c66">
<img width="960" alt="etc_code2" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/e13469d3-26bf-42d8-ad5a-c3c481c4e7cf">
</details>

---

<h3>🥕 Cosine_Similarity 이용하여 유사도 분석</h3>

- Jupyter Notebook에서 앞서 만든 데이터에서 제목과 내용, 그리고 글의 범주를 이용하여 유사도 분석을 진행했습니다.
- 제목, 내용 그리고 범주를 우선 하나의 긴 문자열로 연결했습니다.
- 긴 문자열로 만들어진 새로운 데이터프레임을 만들고 그 데이터프레임을 CountVectorizer에 fit_transform하여 벡터화를 해주었습니다.
- 벡터화 된 metrix를 Sklearn의 Cosine_Similarity에 넣고 유사도를 나타내었습니다.
- 이때 나타난 유사도는 metrix형태이기에 list로 바꾼 다음 유사도가 높은 순서대로 다시 바꿔주었습니다.
- enumerate를 이용하여 key값을 인덱스로 나타나게 하였습니다.
- 이 인덱스를 토대로 get_title_from_index라는 함수를 만들어 제목을 가져오게 했습니다.

<details><summary>👉 코드 확인</summary>

<br>

- 먼저 만든 3개의 데이터를 하나로 합치고 제목과 내용과 범주를 가져왔습니다.

<img width="960" alt="cs1" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/37969b69-b471-4e5a-ab35-269f2445e34a">

- 합쳐진 데이터가 한 줄로 나타나는 것을 확인했습니다.

<img width="960" alt="cs2" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/116e546e-297a-406a-a1f6-2913c93b4cf5">

- Sklearn의 CountVectorizer와 Cosine_Similarity를 이용하여 CountVector로 만들어준 다음, Cosine_Similarity에 넣어서 확인해 주었습니다.
- 유사도 결과가 잘 나타나는 것을 확인하였습니다.

<img width="960" alt="cs3" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/bd5b9d5d-a4ac-48ea-88d0-915265262b01">

- 인덱스로 제목을 가져오는 함수와 제목으로 인덱스를 가져오는 함수를 만들어 각각 확인해 주었습니다.
- 이 때, 네이버 뉴스에서 수집한 데이터 중 하나를 확인하여 제목과 인덱스 번호를 확인하였고, 그 제목과 유사한 내용을 가져오는 지 확인했습니다.

<img width="960" alt="cs4" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/67b25334-c58c-4e75-902d-000cbc2aee1c">

- 유사한 제목을 가져오는 것을 확인할 수 있었습니다.
- 위의 로직을 이용하여 Django에 넣어 주었습니다.

</details>

---

<h3>🥕 Django</h3>

- 제목과 범주주만 입력한 다음 자동완성 버튼을 누르면 데이터 베이스 내의 모든 커뮤니티 게시글을 확인하고 유사도 검사를 진행한 다음, 가장 유사도가 높은 제목의 내용을 화면상으로 나타내는 것이 목표입니다.
- 위 목표를 위해 수정할 파일들은 다음과 같습니다.
  
  1. HTML, CSS
  2. JS
  3. View


<h4>🥕 HTML, CSS</h4>

- 화면상에서 자동완성 버튼을 눌렀을 때, View를 통해 가장 유사도가 높은 3개의 내용을 추천하는 Div 태그를 새로 만들었습니다.
- 비동기 방식으로 내용을 불러오는 동안 Loading 하는 이미지도 포함하였습니다.
- 내용을 수정하지 않으면 저장하기 버튼을 비활성화해서 내용을 수정하게끔 했습니다.
- CSS 파일은 따로 표기하지 않았습니다.

<details><summary>👉 화면 확인</summary>
<br>
<img width="600" alt="html1" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/cf5feeb7-f4a6-4b2a-9e25-383797c16b8b">

- 표기한 부분에 제목을 입력하고 해당되는 범주를 고른 다음 오른쪽의 ai 자동추천 버튼을 누릅니다.

<img width="600" alt="html1" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/fee5aefc-a1ec-41e2-b9b2-d60aecb6e4ac">

- 유사도가 가장 높은 내용 중 상위 3개의 내용을 표현합니다.
- 이 중 하나를 선택합니다.

<img width="600" alt="html1" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/e34ec4ae-a084-4ef7-a8c3-539ed7d0c2b2">

- 선택한 내용이 게시글 작성 부분으로 들어갑니다.
- 이 때, 내용을 수정하지 않으면 저장되지 않도록 저장버튼을 비활성화합니다.
</details>


<details><summary>👉 코드 확인</summary>
<br>
  <img width="600" alt="html1" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/49600bc6-da17-489b-b752-7ec9cfef8474">
  <img width="600" alt="html2" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/35a37548-b074-4dd0-adac-999c431227df">
</details>

<h4>🥕 JS</h4>

- 내용 추천 버튼을 눌렀을 때 view로 보내기 위해 비동기 방식을 이용하여 JavaScript를 구성했습니다. 
> 상세 설명은 주석을 통해 확인하실 수 있습니다.

<details><summary>👉 코드 확인</summary>
<br>
  <img width="800" alt="html1" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/eceb48bd-980d-4be0-8f83-ab598fa2c431">
  <img width="800" alt="html1" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/f80d5beb-34e1-40ee-86e4-02a07ed9eb28">
  <img width="800" alt="html1" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/18c27fbe-cdd2-4b3d-b82b-ea8ddc27f1b9">
</details>

<h4>🥕 Django</h4>

- JavaScript로 비동기통신 방식을 이용하기 위해 view 와 url을 작성하였습니다.
- 앞선 JupyterNotebook으로 작성한 코드를 View에 모듈화하였습니다.

**상세 설명**

- AIView
  - Post 방식으로 json 형태로 통신된 데이터를 data에 담아줍니다.
  - 제목과 범주를 title과 radio_active 라는 변수에 할당합니다.
  - radio_active는 수치형이기에 translate_status 함수를 통해 범주이름으로 변경합니다.
  - 제목과 범주를 하나의 문자열로 만들어주고 get_similar_communities 함수를 호출합니다.
  - <details><summary>👉 코드 보기</summary>
    <img width="800" alt="html1" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/f341703e-905a-450c-9c10-416fa3a28638">
  </details>

    
- get_similar_communities
  - community.objects.all을 통해 커뮤니티의 모든 내용을 가져옵니다.
  - 가져온 community를 make_dataframe 함수를 통해 df라는 데이터프레임으로 만들어줍니다.
  - Sklearn의 CountVectorizer()를 호출합니다.
  - df 데이터프레임에 make_dataframe 함수를 통해 미리 만들어진 combined_features 를 CountVectorizer에 담아 Count_Matrix로 만들어줍니다.
  - 앞서만든 하나의 문자열 (제목과 범주) 또한 CountVectorizer에 담아 title_vector_matrix로 만들어줍니다.
  - Sklearn의 Cosine_Similarity를 호출하여 데이터프레임으로 만들어진 Count_Matrix와 title_vector_matrix간의 유사도를 구합니다.
  - 구해진 유사도를 enumerate를 통해 index를 나타나게 하고, list에 담아 similar_community라는 변수에 할당합니다.
  - 할당된 similar_community를 다시 유사도가 높은 순서로 정렬하여 similar_community_sorted라는 변수에 할당합니다.
  - 유사도가 가장 높은 3개를 추출합니다.
  - 이때, 기존의 데이터프레임에 유사도가 가장 높은 상위 3개의 인덱스를 참조하여 similar_content라는 리스트에 append하여 return 해줍니다.
  - <details><summary>👉 코드 보기</summary>
      <img width="800" alt="html1" src="https://github.com/Respec-Do/django_with_AI/assets/105579519/8a40cacb-6fc9-498a-b436-e901c9ddd475">
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

<h3>🥕 서버 배포 및 화면 시연</h3>

- 로컬에서 구현한 기능이 정상적으로 작동이 되는 것을 확인하고 이를 ubuntu를 이용하여 서버에 배포하였습니다.

---

<h3>🥕 Trouble-Shooting</h3>

- JavaScript에서 비동기 통신을 이용하여 view로 원하는 데이터를 넘길 때 다음과 같은 에러를 경험했습니다.
  - await fetch() 를 이용하여 url을 통해 view로 넘어갈 때 url을 찾지 못하는 Not Found 에러
  - CSRF-Token을 찾지 못하여 Not Certificated Token 에러
  - View로 넘어왔지만 같이 넘어온 데이터가 None 인 에러
  - Django에서 비동기 방식으로 데이터를 불러오는 중 발생한 문제
 
<h4>🥕 await fetch() 를 이용하여 url을 통해 view로 넘어갈 때 url을 찾지 못하는 Not Found 에러</h4>

- url 경로를 제대로 설정해 주었는데도 불구하고 Not Found 에러가 나타났습니다.
- 경로를 다시 추적을 해보니, Main url 파일에 새로이 만든 ai url을 추가하지 않아 못 찾는 것을 파악하고 추가해주었습니다.
- 수정한 다음 다시 확인하니 View로 넘어가는 것을 파악했으나, CSRF-Token 에러가 나타났습니다.

<h4>🥕 CSRF-Token을 찾지 못하여 Not Certificated Token 에러</h4>

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

