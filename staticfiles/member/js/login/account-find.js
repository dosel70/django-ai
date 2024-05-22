// 이메일 입력칸
const emailInputs = document.querySelectorAll('.input-text');
// 이메일 형식 에러 알림 텍스트
const emailError = document.querySelector('#email-error');
// 이메일 가입 에러 알림 텍스트
const sendFalied = document.querySelector('#email-notjoined');
// 이메일 가입 에러 알림 텍스트
const inputValue = document.querySelector('.input');
// 확인 버튼
const emailCheck = document.querySelector('#btn-check');
// '원랩은 이메일을 계정으로....' 텍스트
const messageBoxA = document.querySelector('.body1');
// '입력하신 이메일로...' 텍스트
const messageBoxB = document.querySelector('.body2');
// 재발송 버튼
const reSendbtn = document.querySelector('#btn-resend');

// 이메일 유효성 검사

// 입력칸에 키를 치고 나면, 입려칸의 테두리 메인색으로 변한다.
// 입력칸에 입력 하지 않고 다른 곳을 선택하면 테두리가 빨간색으로 변한다.

emailInputs.forEach((emailInput) => {
    emailInput.addEventListener('keyup', (e) => {
        if (e.target.value.length === 0) {
            e.target.style.border = '2px solid #f66';
            sendFalied.style.display = 'block';
            emailError.style.display = 'block';
        } else {
            e.target.style.border = '2px solid #008243';
            sendFalied.style.display = 'none';
            emailError.style.display = 'none';
        }
    });
    emailInput.addEventListener('blur', (e) => {
        if (e.target.value.length === 0) {
            e.target.style.border = '2px solid #f66';
            emailError.style.display = 'block';
            emailError.style.display = 'block';
        } else {
            e.target.style.border = '2px solid #008243';
        }
    });
});

// 화면의 '확인' 버튼을 누르면 이메일 가입 여부에 따라
// 메세지 박스와 입력칸이 사라지고
// 비밀번호 성공 메시지와 해당 이메일로 링크 발송 메시지가 출력 된다.

emailCheck.addEventListener('click', () => {
    messageBoxA.style.display = 'none';
    emailCheck.style.display = 'none';
    inputValue.style.display = 'none';
    messageBoxB.style.display = 'block';
    reSendbtn.style.display = 'block';
    sendFalied.style.display = 'none';
    emailError.style.display = 'none';
});

// 재발송 버튼을 누르면 다시 이메일을 입력할 수 있는 입력칸이 나오며 위의 과정을 반복하게 된다.
reSendbtn.addEventListener('click', () => {
    messageBoxA.style.display = 'block';
    emailCheck.style.display = 'block';
    inputValue.style.display = 'block';
    messageBoxB.style.display = 'none';
    reSendbtn.style.display = 'none';
});


const checkBtn = document.getElementById("btn-check")
const emailInput = document.querySelector("input.input-text")

checkBtn.addEventListener("click", async (e, email)=>{
  e.preventDefault();

  // CSRF 토큰 가져오기
  const csrftoken = getCookie('csrftoken');

  // const data = {
  //   'member-email': emailInput.value
  // };

  email = emailInput.value

  console.log("들어옴2")
    console.log(email)

  try {
    const response = await fetch(`/member/account-activate/${email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-CSRFToken': csrftoken // CSRF 토큰 포함
      },
      body: JSON.stringify(email)
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log("요청이 성공적으로 처리되었습니다.", responseData);
    } else {
      console.error('요청이 실패했습니다.', responseData);
      window.location.href = '/';
      alert('실패하였습니다. 다시시도해주세요')
    }
  } catch (error) {
    alert("해당 이메일로 가입 되어있는 계정이 없습니다.")
    console.error('오류 발생:', error);
  }
});

// CSRF 토큰을 가져오는 함수
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}