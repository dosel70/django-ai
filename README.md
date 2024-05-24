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

- 결과적으로 예측확률이 가장 높게 나온 관심사태그는 '친목'을 나타내는 2가 나왔으며, 그 다음으로 높게 나타난 관심사 태그는 '공부'를 뜻하는 1 이였습니다.

- 결과적으로 사전 훈련모델 에서 예측확률이 가장 높을 것으로 판단되는 관심사는 친목과 공부 일 것입니다.

- 모델의 성능을 평가하기 위해 정확도, 정밀도, 재현율, F1 점수와 같은 지표를 계산하였으며, 정확도는 0.8750로 준수한 성능이 나온 것을 확인 할 수 있었습니다.

<img width="960" alt="cs4" src="https://github.com/dosel70/django-ai/assets/143694489/cbb4eb36-048c-472c-bb24-f7f7953d5e84">  

- 이러한 사전 훈련 모델을 활용하여 Django에서 사용할 수 있도록 onelab.pkl 파일로 만들었으며, Django에 이식하였였습니다.

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

- Django에서는 REST API를 사용하여 메인페이지에 원랩 추천 서비스 및 예측 API를 구현 하였습니다.
- 최종적으로 회원 각각의 관심사를 반영한 맞춤형 원랩 추천을 통해 개인화된 사용자 경험을 제공할 수 있습니다.

- AIView
  - Post 방식으로  사전훈련 모델을 Django에 이식하여 각 원랩목록의 관심사에 따른 예측 결과와 확률을 반환할 수 있습니다.
  
  - <details><summary>👉 코드 보기</summary>
    <img width="800" alt="html1" src="https://github.com/dosel70/django-ai/assets/143694489/75bfdf40-ae78-4721-b4ed-087f234b9d2a">
  </details>

    
  
> 기존 사전 훈련 데이터 csv를 Django Database에 insert 하였습니다.

- `get_index_from_member_tag`
  
- ✨ 해당 메서드는 회원의 관심사 태그 에 관하여 가장 유사한 원랩을 찾아내는 역할을 합니다.
- `CountVectorizer()`를 통해 , 코사인 유사도를 계산하고, 가장 높은 평균 유사도를 가진 원랩을 추출하여 MainView(메인페이지)에 전달합니다.
  - <details><summary>👉 코드 보기</summary>
      <img width="800" alt="html1" src="https://github.com/dosel70/django-ai/assets/143694489/f6bf6d5a-b662-4c67-b5a7-35a10967206a">
    </details>  

- `get_index_from_member_tag`
    
- 다시 AIView로 돌아와서 클래스 내에서 회원의 관심사 태그를 기반으로 가장 유사한 OneLab의 객체들을 데이터베이스에서 가져오는 메서드를 정의 하였습니다.
- 해당 코드는 주어진 회원 관심사 태그에 대해 데이터베이스에서 OneLab 객체를 가져와 해당 원랩의 데이터를 벡터화하여 유사도를 계산합니다. 그리고 각 OneLab 객체의 평균 유사도를 계산하고, 가장 높은 유사도를 가진 OneLab 객체의 인덱스와 벡터를 반환합니다.
  - <details><summary>👉 코드 보기</summary>
      <img width="800" alt="html1" src="https://github.com/dosel70/django-ai/assets/143694489/4ec0bf7a-6c13-422e-8fcc-4a63bcdeb4c7">
    </details>

- `recommend_similar_onelabs(self, member_tag, content_vectors, num_recommendations=3)`

-  recommend_similar_onelabs 메서드를 통해 실제 메인화면에서 회원의 관심사와 유사한 OneLab 목록을 추천해주는 기능을 수행합니다.
-  기본적으로 주어진 회원의 관심사 태그에 가장 유사한 원랩 목록 들을 우선적으로 추천하지만 만약 유사한 객체가 부족하면 무작위로 추가하여 추천 목록을 채우는 방식으로 동작하게 하였습니다.
 
  - <details><summary>👉 코드 보기</summary>
      <img width="400" alt="html1" src="https://github.com/dosel70/django-ai/assets/143694489/7c57293c-e660-49e8-b5bc-ffafc7fff3c1">  

      <img width="400" alt="html1" src="https://github.com/dosel70/django-ai/assets/143694489/86ec6391-2815-4d76-827b-a0dee6ce4ede">
    </details>



<h3>📌 서버 배포 및 화면 시연</h3>

- 로컬에서 구현한 기능이 정상적으로 작동이 되는 것을 확인하고 이를 ubuntu를 이용하여 서버에 배포하였습니다.

---

<h3>📌 Trouble-Shooting</h3>

- MainView에서 RestAPI를 이용하여 기존 AIView에서 정의된 함수들을 불러오지 못하여 메인 페이지에서 오류가 나는 에러
  
- 메인페이지에서 추천 원랩 목록이 나타나지 않은 에러 
  
- 위 오류를 수정하고 원랩 목록들이 출력이 되었지만, 회원의 관심사와 맞지 않은 원랩 목록들이 출력 
 

 
<h4>✨ MainView에서 RestAPI를 이용하여 기존 AIView에서 정의된 메서드 들을 불러오지 못하여 메인 페이지에서 오류가 나는 에러</h4>

- url 경로를 제대로 설정해 주었는데도 불구하고 Not Found 에러가 나타났습니다.
- 경로를 다시 추적을 해보니, Main url 파일에 새로이 만든 ai url을 추가하지 않아 못 찾는 것을 파악하고 추가해주었습니다.
- 수정한 다음 다시 확인하니 View로 넘어가는 것을 파악했으나, 메인페이지에서 회원의 관심사 태그와 맞지 않는 원랩 목록이 더 많이 보여지는 에러가 발생하였습니다.

<h4>✨ 메인페이지에서 추천 원랩 목록이 나타나지 않은 에러 </h4>

- View로 넘어간 것을 확인하였지만, 실제 원랩 목록들이 나오지 않는 것을 확인 하였습니다.
- AI View 내에 recommend_similar_onelabs 라는 메서드 내에 `recommended_onelabs.append(OneLab.objects.get(id=idx + 1))` 라고 코드를 작성한 부분이 있었습니다.
- id = idx + 1이라고 명시한부분에서 + 1 을 더한 것 때문에 인덱스 오류가 발생하여서 전체적인 로직 구성에 오류가 발생하였던 문제 였습니다.
- 그래서 `recommended_onelabs.append(OneLab.objects.get(id=idx))`로 수정하여서 추천 원랩목록들이 나왔지만, 회원의 관심사와는 맞지 않은 원랩 목록들이 추천되는 이슈가 발생하였습니다.
- <details><summary>👉 코드 보기</summary>
    <img width="800" alt="html1" src="https://github.com/dosel70/django-ai/assets/143694489/f00945fc-3ba1-4b22-9d35-853e005d3f7b">
  </details>

<h4>✨ 회원의 관심사와 맞지 않은 원랩 목록들이 출력되 에러</h4>

- 원랩목록들이 나오지 않았던 문제를 해결한 다음 다시 확인했으나, View를 통해 받아온 추천 원랩 목록 기능 로직이 잘못 구성되어있다는 것을 알게 되었습니다.
- 유사도가 높은 순으로 정렬된 원랩 객체가 사용자의 태그와 일치하지 않을 수 있는 문제를 해결하기 위해, 기존에는 밑에 있었던 `get_index_from_member_tag`라는 회원 관심사 태그가 주어지는 메서드를 먼저 호출 하여  원랩 유사도 계산 메서드에서 사용하게끔 하였습니다.  
- 최종적으로 사용자의 태그와 일치하는 원랩 객체를 우선적으로 추천하도록 로직을 수정했습니다.
- 이를 확인하여 다시 메인 화면을 확인한 결과 정상적으로 회원의 관심사와 유사한 원랩 목록들이 출력 되는 것을 확인 할 수 있었습니다.
  
- <details><summary>👉 코드 보기</summary>
    <img width="800" alt="html1" src="https://github.com/dosel70/django-ai/assets/143694489/f45d1891-c25f-49dc-9900-e25f517ab9ea">
  </details> 


<h3>📌 느낀점</h3>

- 이번 프로젝트를 통해 AI와 Django를 같이 활용해보면서, 많은 시행착오 과정들이 있었지만, 오류를 하나씩 해결해나가고 직접 AI 시스템을 구현해보니 정말 재밌었고 값진 경험이였습니다.
- 데이터 수집부터 유사도 분석, 그리고 실제 서버 배포까지 전 과정을 직접 경험하며, 다양한 시행착오를 겪으면서 많은 것을 배웠습니다.
- Cosine Similarity, Naybe Bayse 등 다양한 텍스트 분류 기법을 직접 서버에 적용을 해보고, 유사한 원랩 콘텐츠를 찾아내는 과정에서 높은 유사도 점수를 얻을 때마다 큰 만족감을 느꼈습니다.
- 특히 Trouble-Shooting 과정에서 사용자 관심사 기반 원랩 목록을 완전 정확하지는 않지만, 오류를 해결하여 유사하게 추천하는 기능을 구현하며, 이러한 AI 시스템이 실제 시중에서 어떤 흐름으로 사용되는지 알 수 있게 되었습니다!

<h3>📌 개선 사항</h3>

- 처음 비회원으로 메인화면에 접속 했을 경우, 원랩 목록들의 이미지가 나오지 않는 점이 아쉬웠습니다. 추후에 이 부분은 수정하도록 하겠습니다. 
- 추가로 추천된 원랩 목록들을 클릭하면 그 경로로 이동해야 하는데, 구현이 되지 않았습니다. 이 부분 역시 추가로 수정하도록 하겠습니다.


