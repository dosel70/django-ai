// 알림 버튼 클릭시 목록 나오기
const announceBtn = document.querySelector('.announce-button-icon')
announceBtn.addEventListener("click", function(e) {
    const container = document.querySelector('.announce-list-container')
    container.classList.toggle('active');
});


// 제목 작성시 남은 글자수 계산
const inputField = document.getElementById('title-input');
const helperMsg = document.querySelector('.helper-msg');

inputField.addEventListener('input', function() {
    console.log('ss')
    const maxLength = 30;
    const remainingChars = maxLength - this.value.length;
    helperMsg.textContent = remainingChars + '자 남음';
});


document.addEventListener("DOMContentLoaded", function() {
  var addButton = document.querySelector('.insert-btn');
  var emailInput = document.querySelector('.input-member-email');
  var emailList = document.querySelector('.join-member-emails-list');

  addButton.addEventListener('click', function() {
      var email = emailInput.value.trim(); // 이메일 입력 값 가져오기 및 공백 제거

      if (validateEmail(email)) {
          addEmailToList(email);
          emailInput.value = ''; // 입력 필드 초기화
      } else {
          var helperMessage = document.querySelector('.helper-message-email');
          helperMessage.style.display = 'block';
      }
  });

  function validateEmail(email) {
      // 간단한 이메일 유효성 검사를 수행합니다.
      // 여기서는 간단히 '@' 문자를 포함하는지만을 확인합니다.
      return email.includes('@');
  }

  function addEmailToList(email) {
      var emailBadge = document.createElement('div');
      emailBadge.classList.add('join-member-emails-badge');
      emailBadge.innerHTML = `
          <span>${email}</span>
          <button type="button" class="join-member-emails-remove-btn">
              <svg viewBox="0 0 40 40" focusable="false" role="presentation" class="remove-btn-svg" aria-hidden="true">
                  <path d="M33.4 8L32 6.6l-12 12-12-12L6.6 8l12 12-12 12L8 33.4l12-12 12 12 1.4-1.4-12-12 12-12z"></path>
              </svg>
          </button>
      `;
      emailList.appendChild(emailBadge);
      attachRemoveEventHandler(emailBadge); // remove 버튼에 이벤트 핸들러 추가
  }

  function attachRemoveEventHandler(emailBadge) {
      var removeButton = emailBadge.querySelector('.join-member-emails-remove-btn');
      removeButton.addEventListener('click', function() {
          emailBadge.remove(); // 해당 이메일 요소 제거
      });
  }
});


// 이미지 파일 업로드시 미리보기, x버튼 누르면 사라지고 원상복구
document.addEventListener("DOMContentLoaded", function() {
  const fileDOM = document.querySelector('.file');
  const prevImgField = document.querySelector('.prev-img-field');
  const closeButton = document.querySelector('.close-btn');
  const buttonWrapper = document.querySelector('.img-form-field-btn-wrapper');

  fileDOM.addEventListener('change', () => {
      const reader = new FileReader();

      buttonWrapper.style.display = 'none'; // 등록하기 버튼 숨기기
      prevImgField.style.display = 'block'; // 미리보기 이미지 필드 보이기
      closeButton.style.display = 'inline-block'; // x 버튼 보이기

      reader.onload = ({ target }) => {
          const previewImg = prevImgField.querySelector('.preview-img');
          previewImg.src = target.result; // 선택한 이미지 파일의 데이터 URL을 미리보기 이미지의 src에 할당
      };

      reader.readAsDataURL(fileDOM.files[0]); // 이미지 파일을 읽어들임
  });

  closeButton.addEventListener('click', () => {
      buttonWrapper.style.display = 'block'; // 등록하기 버튼 보이기
      prevImgField.style.display = 'none'; // 미리보기 이미지 필드 숨기기
      closeButton.style.display = 'none'; // x 버튼 숨기기
      fileDOM.value = ''; // 파일 입력 필드 초기화
  });
});

// 배너(이미지 파일 업로드시 미리보기, x버튼 누르면 사라지고 원상복구)
document.addEventListener("DOMContentLoaded", function() {
    const fileDOM = document.querySelector('.file.banner');
    const prevImgField = document.querySelector('.prev-img-field.banner');
    const closeButton = document.querySelector('.close-btn.banner');
    const buttonWrapper = document.querySelector('.img-form-field-btn-wrapper.banner');

    fileDOM.addEventListener('change', () => {
        const reader = new FileReader();

        buttonWrapper.style.display = 'none'; // 등록하기 버튼 숨기기
        prevImgField.style.display = 'block'; // 미리보기 이미지 필드 보이기
        closeButton.style.display = 'inline-block'; // x 버튼 보이기

        reader.onload = ({ target }) => {
            const previewImg = prevImgField.querySelector('.preview-img.banner');
            previewImg.src = target.result; // 선택한 이미지 파일의 데이터 URL을 미리보기 이미지의 src에 할당
        };

        reader.readAsDataURL(fileDOM.files[0]); // 이미지 파일을 읽어들임
    });

    closeButton.addEventListener('click', () => {
        buttonWrapper.style.display = 'block'; // 등록하기 버튼 보이기
        prevImgField.style.display = 'none'; // 미리보기 이미지 필드 숨기기
        closeButton.style.display = 'none'; // x 버튼 숨기기
        fileDOM.value = ''; // 파일 입력 필드 초기화
    });
  });


// 상세 내용 글자 수 계산
const textarea = document.querySelector('.textarea-input textarea');
const textareaA = document.querySelector('.textarea-input.A textarea');
const formFieldHelper = document.querySelector('.form-field-helper');
const formFieldHelperA = document.querySelector('.form-field-helper-A');

textarea.addEventListener('input', function() {
    // textarea에 입력된 글자 수 계산
    const length = textarea.value.length;

    // 최대 글자 수는 100
    const maxLength = 100;

    // 남은 글자 수를 계산합니다.
    const remaining = maxLength - length;

    formFieldHelper.textContent = remaining + '자 남음';
});

textareaA.addEventListener('input', function() {
    // textarea에 입력된 글자 수 계산
    const length = textareaA.value.length;

    // 최대 글자 수는 1000
    const maxLength = 1000;

    // 남은 글자 수를 계산합니다.
    const remaining = maxLength - length;

    formFieldHelperA.textContent = remaining + '자 남음';
});



textarea.addEventListener('focus', function() {
    // textarea가 focus를 받았을 때 border 색을 변경
    textarea.style.borderColor = '#008243';
});

// 문서 전체에 click 이벤트를 추가합니다.
document.addEventListener('click', function(event) {
    // 클릭된 엘리먼트가 textarea가 아닌 경우에만 실행
    if (!event.target.closest('.textarea-input')) {
        // textarea 외부를 클릭했을 때 textarea의 border 색을 변경
        textarea.style.borderColor = '#dde2e6';
    }
});

// 저장하기 버튼
document.querySelector("button.save-btn").addEventListener("click", (e) => {
//     유효성 검사
    document['onelab-form'].submit();
});







