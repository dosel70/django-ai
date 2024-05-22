// 이메일
const emailInput = document.querySelector(".ei-input");
const emailValidateMsg = document.querySelector(".email-validate");
const emailSubmitBtn = document.querySelector(".email-submit-btn");
const emailEditBtn = document.querySelector(".email-edit-btn");
// 인증
const certificationInput = document.querySelector(
  ".certification-number-input"
);
const certificationValidateMsg = document.querySelectorAll(
  ".certification-validate"
);
const certificationNumberBtn = document.querySelector(
  ".certification-number-btn"
);
const certificationNumberForm = document.querySelector(
  ".certification-number-form"
);
const timerSpan = document.querySelector(".count-time");
// 인증번호 다시 보내기
const retry = document.querySelector(".retry");
// 인증하기시 모달
const modalContainer = document.querySelector(".modal-container");
const modalSubmitBtn = document.querySelector(".modal-submit-btn");
// 학과명
const departmentInput = document.querySelector(".department-input");
const departmentValidateMsgs = document.querySelector(".department-validate");
// 이름
const nameInput = document.querySelector(".name-input");
const nameValidateMsgs = document.querySelectorAll(".name-validate");
// 비밀번호
const passwordInputs = document.querySelectorAll(".password-input");
const errorToastInner = document.querySelector(".error-toast-inner");
const successToastInner = document.querySelector(".success-toast-inner");
const passwordValidateMsg = document.querySelectorAll(".password-validate");
const passwordCheckValidate = document.querySelector(
  ".password-check-validate"
);
const passwordVisibleBtn = document.querySelectorAll(".password-visible-btn");
const joinSubmitBtn = document.querySelector(".join-submit-btn");

// 메일쪽
const realEmailValue = document.querySelector('.real-email')


// 이메일 유효성 검사
emailInput.addEventListener("keyup", (e) => {
  let inputValue = e.target.value;
  let isValidate = validateEmail(inputValue);
  if (!isValidate) {
    emailInput.style.border = "1px solid #f66";
    emailValidateMsg.classList.add("validate");
    emailSubmitBtn.disabled = true;
  } else {
    emailInput.style.border = "";
    emailValidateMsg.classList.remove("validate");
    emailSubmitBtn.disabled = false;

  }
});

// 이메일 유효성 검사하는 함수
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// 인증하기 시 3분 타이머
let timerInterval;
const defaultCertificationMsg = certificationValidateMsg[0].classList;
const minCertificationMsg = certificationValidateMsg[1].classList;
const timeOverCertificationMsg = certificationValidateMsg[2].classList;
function timer() {
  clearInterval(timerInterval);
  let time = 179;
  let min = "";
  let sec = "";

  timerInterval = setInterval(() => {
    min = parseInt(time / 60);
    sec = time % 60;
    sec = sec < 10 ? "0" + sec : sec;
    timerSpan.innerText = min + ":" + sec;
    --time;

    if (time < 0) {
      clearInterval(timerInterval);
      timerSpan.style.display = "none";
      defaultCertificationMsg.remove("validate");
      minCertificationMsg.classList.remove("validate");
      timeOverCertificationMsg.classList.add("validate");
      certificationInput.disabled = true;
      certificationNumberBtn.disabled = true;
    }
  }, 1000);
}

// 이메일 인증하기 버튼 클릭 시

emailSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (emailInput) {
    realEmailValue.value = emailInput.value
    // console.log(realEmailValue.value)
  }

  modalContainer.classList.add("modal-open");
  emailSubmitBtn.style.display = "none";
  emailEditBtn.style.display = "block";
  emailInput.readOnly = true;
  certificationNumberForm.style.display = "block";
  retry.style.display = "block";
  timer();
});


// 모달창 안에 버튼 클릭 시
modalSubmitBtn.addEventListener("click", async (e, school)=>{
  e.preventDefault();
  // CSRF 토큰 가져오기
  const csrftoken = getCookie('csrftoken');

  // const data = {
  //   'member-email': emailInput.value
  // };

  school = emailInput.value
  console.log(school)

  try {
    const response = await fetch(`/member/activate/${school}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-CSRFToken': csrftoken // CSRF 토큰 포함
      },
      body: JSON.stringify(school)
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log("요청이 성공적으로 처리되었습니다.", responseData);
      window.location.href = '/member/login';
    } else {
      console.error('요청이 실패했습니다.', responseData);
      window.location.href = '/';
    }
  } catch (error) {
    console.error('오류 발생:', error);
  }
})

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

// 이메일 수정하기 버튼 클릭 시
emailEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  modalContainer.classList.remove("modal-open");
  emailSubmitBtn.style.display = "block";
  emailEditBtn.style.display = "none";
  emailInput.readOnly = false;
  certificationNumberForm.style.display = "none";
  retry.style.display = "none";
  emailInput.value = "";
  clearInterval(timerInterval);
});

// 인증번호 입력 시
certificationInput.addEventListener("keyup", (e) => {
  let inputValue = e.target.value;
  if (inputValue) {
    certificationInput.style.border = "1px solid #f66";
    defaultCertificationMsg.remove("validate");
    minCertificationMsg.add("validate");
  }
  if (inputValue.length === 6) {
    certificationInput.style.border = "";
    defaultCertificationMsg.add("validate");
    minCertificationMsg.remove("validate");
  }
});

// 인증번호 다시 보내기 버튼 클릭 시
retry.addEventListener("click", () => {
  modalContainer.classList.add("modal-open");
  timer();
  certificationInput.value = "";
  certificationInput.style.border = "";
  defaultCertificationMsg.add("validate");
  minCertificationMsg.remove("validate");
  certificationInput.disabled = false;
  certificationNumberBtn.disabled = false;
  passwordInputs.forEach((input) => {
    input.disabled = true;
  });
});

// 인증하기 버튼 클릭시 생기는 모달
modalContainer.addEventListener("click", (e) => {
  if (e.target.closest(".modal-submit-btn")) {
    modalContainer.classList.remove("modal-open");
  }
  if (
    !(e.target.closest(".modal-submit-btn") || e.target.closest(".modal-box"))
  ) {
    modalContainer.classList.remove("modal-open");
  }
});
// 학과명 입력 시
departmentInput.addEventListener("keyup", (e) => {
  let inputValue = e.target.value;
  const emptyDepartmentMsg = departmentValidateMsgs.classList;
  departmentInput.style.border = "1px solid #f66";

  if (!inputValue) {
    emptyDepartmentMsg.add("validate");
  } else {
    departmentInput.style.border = "";
    emptyDepartmentMsg.remove("validate");
  }
});
// 이름 입력 시
nameInput.addEventListener("keyup", (e) => {
  let inputValue = e.target.value;
  const emptyNameMsg = nameValidateMsgs[0].classList;
  const minNameMsg = nameValidateMsgs[1].classList;
  nameInput.style.border = "1px solid #f66";

  if (!inputValue) {
    emptyNameMsg.remove("validate");
    minNameMsg.add("validate");
  } else if (inputValue.length === 1) {
    emptyNameMsg.add("validate");
    minNameMsg.remove("validate");
  } else {
    nameInput.style.border = "";
    emptyNameMsg.remove("validate");
    minNameMsg.remove("validate");
  }
});

// 인증 확인 버튼 클릭시
let isCertification = false;
let timeoutId;
certificationNumberBtn.addEventListener("click", (e) => {
  e.preventDefault();
  //  isCertification는 인증 여부를 담는 변수입니다.
  // 인증이 안되었을시 이벤트를 보고 싶으면 false로 변경하세요
  isCertification = true;
  let animationTarget;
  if (isCertification) {
    passwordInputs.forEach((input) => {
      input.disabled = false;
    });

    certificationInput.disabled = true;
    certificationNumberBtn.disabled = true;
    clearInterval(timerInterval);
    timerSpan.innerText = "";
    animationTarget = successToastInner;
  } else if (!isCertification) {
    animationTarget = errorToastInner;
  }

  animationTarget.classList.remove("hide-animation");
  animationTarget.classList.add("show-animation");
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    animationTarget.classList.remove("show-animation");
    animationTarget.classList.add("hide-animation");
  }, 3000);
});

// 비밀번호 유효성 검사
const passwordInput = passwordInputs[0];
passwordInput.addEventListener("click", (e) => {
  let inputValue = e.target.value;
  let isValidate = validatePassWord(inputValue);
  const emptyPWmsg = passwordValidateMsg[0].classList;
  const minPWmsg = passwordValidateMsg[1].classList;
  const validatePWmsg = passwordValidateMsg[2].classList;
  passwordInput.style.border = "1px solid #f66";
  if (!inputValue) {
    emptyPWmsg.add("validate");
    minPWmsg.remove("validate");
    validatePWmsg.remove("validate");
  } else if (inputValue.length <= 8) {
    emptyPWmsg.remove("validate");
    minPWmsg.add("validate");
    validatePWmsg.remove("validate");
  } else if (!isValidate) {
    emptyPWmsg.remove("validate");
    minPWmsg.remove("validate");
    validatePWmsg.add("validate");
  } else {
    passwordInput.style.border = "";
    emptyPWmsg.remove("validate");
    minPWmsg.remove("validate");
    validatePWmsg.remove("validate");
  }
});
// 비밀번호 유효성 검사 함수
function validatePassWord(password) {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  return passwordPattern.test(password);
}

// 비밀번호 확인 검사
const passwordCheckInput = passwordInputs[1];
passwordCheckInput.addEventListener("keyup", (e) => {
  let inputValue = e.target.value;
  let inputCheckValue = passwordInput.value;
  passwordCheckInput.style.border = "1px solid #f66";
  if (inputValue != inputCheckValue) {
    passwordCheckValidate.classList.add("validate");
    joinSubmitBtn.disabled = true;
  } else if (inputValue === inputCheckValue) {
    passwordCheckInput.style.border = "";
    passwordCheckValidate.classList.remove("validate");
    joinSubmitBtn.disabled = false;
  }
});
// 비밀번호 보기(눈 아이콘) 클릭시
passwordVisibleBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const visibleIcon = btn.querySelector(".visible-icon");
    const unvisibleIcon = btn.querySelector(".unvisible-icon");
    visibleIcon.classList.toggle("on");
    unvisibleIcon.classList.toggle("on");

    if (!visibleIcon.classList.contains("on")) {
      btn.previousElementSibling.type = "text";
    } else {
      btn.previousElementSibling.type = "password";
    }
  });
});
// 체크박스 선택
//전체 선택
NodeList.prototype.filter = Array.prototype.filter;
const checkboxCheckbox = document.querySelectorAll(".Checkbox_checkbox");
const allCheckBox = document.querySelector(".all-check-box");
const checkboxInputs = document.querySelectorAll(".Checkbox_input");
const serviceCheck = document.querySelector(".service-check");
const childrenInputs = document.querySelectorAll(".children");
const confSubmitBtn = document.querySelector(".Button_button");
checkboxCheckbox.forEach((label) => {
  label.addEventListener("click", () => {
    let count = 0;
    const input = label.querySelector("input");
    if (input.classList.contains("all-check-box")) {
      if (input.checked) {
        checkboxInputs.forEach((item) => {
          item.checked = true;
        });
      } else {
        checkboxInputs.forEach((item) => {
          item.checked = false;
        });
      }
    } else if (!input.classList.contains("all-check-box")) {
      allCheckBox.checked = false;
      if (input.classList.contains("service-check")) {
        if (input.checked) {
          childrenInputs.forEach((item) => {
            item.checked = true;
          });
        } else {
          childrenInputs.forEach((item) => {
            item.checked = false;
          });
        }
      } else if (!input.classList.contains("service-check")) {
        serviceCheck.checked = false;
        let miniCount = 0;
        childrenInputs.forEach((item) => {
          if (item.checked) {
            miniCount += 1;
          } else {
            miniCount -= 1;
          }
        });
        if (miniCount === 3) {
          serviceCheck.checked = true;
        }
      }
    }
    let possibleCount = 0;
    checkboxInputs.forEach((item) => {
      if (item.checked) {
        count += 1;
        if (item.classList.contains("possible")) {
          possibleCount += 1;
        } else {
          possibleCount -= 1;
        }
      } else {
        count -= 1;
      }
    });
    if (count >= 5) {
      allCheckBox.checked = true;
    }
    if (count >= 5 || possibleCount >= 5) {
      confSubmitBtn.classList.remove("Button_disabled");
      confSubmitBtn.disabled = false;
    } else {
      confSubmitBtn.classList.add("Button_disabled");
      confSubmitBtn.disabled = true;
    }
  });
});

// 회원 서비스 가입란 선택 시 나오는 상세보기
// const services = document.querySelector(".AccordionCheckbox_accordionButton");
// const detailJoin = document.querySelector(".detail-join");
//
// services.addEventListener("click", function () {
//   detailJoin.classList.toggle("active");
// });

// 회원가입 약관, 서포터 이용약관, 개인정보 수집 및 이용 동의 선택시 나오는 상세보기
const terms = document.querySelectorAll(".TermsAgreementCheckbox_children");
const buttons = document.querySelectorAll(".AccordionCheckbox_text");

buttons.forEach((button) => {
  const parent = button.parentElement;
  const sibling = parent.nextElementSibling;
  button.addEventListener("click", function () {
    sibling.classList.toggle("active");
  });
});

// 화살표 누를시 방향 전환

const arrows = document.querySelectorAll(".AccordionCheckbox_accordionButton");

arrows.forEach((arrow) => {
  arrow.addEventListener("click", function () {
    arrow.classList.toggle("active");
  });
});

// 약관동의 모달 띄우기
// const reactModalPortal = document.querySelector(".ReactModalPortal");
// joinSubmitBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   if (e.target.closest(".join-submit-btn")) {
//     reactModalPortal.classList.add("terms-modal-open");
//   }
// });

//약관동의 모달 업애기(밖에 클릭시)
// reactModalPortal.addEventListener("click", (e) => {
//   if (!e.target.closest(".ReactModal__Content")) {
//     reactModalPortal.classList.remove("terms-modal-open");
//   }
//   if (e.target.closest(".ConfirmModal_closeIconWrapper")) {
//     reactModalPortal.classList.remove("terms-modal-open");
//   }
//   if (e.target.closest(".Button_block")) {
//     reactModalPortal.classList.remove("terms-modal-open");
//   }
// });

const radioInputs = document.querySelectorAll(".radio-label");
const emailsInput = document.querySelector(".email-work-input");
const majorInput = document.querySelector(".major-input");
const titleInput = document.querySelector(".easy-join-title");
const schoolInput = document.querySelector(".school-input");

radioInputs.forEach((item) => {
  console.log(radioInputs);
  item.addEventListener("click", (e) => {
    console.log(item)
    if(item.classList.contains("radio-high-school")) {
      schoolInput.style.display = "none";
      emailsInput.style.display = "block";
      majorInput.style.display ="none";
      certificationInput.disabled = false;
      certificationNumberBtn.disabled = false;
      titleInput.innerHTML = '고등학생 간편가입'
      passwordInputs.forEach((input) => {
        input.disabled = false;
      });
    }
    else {
      schoolInput.style.display = "block";
      emailsInput.style.display = "block";
      majorInput.style.display = "block";
      passwordInputs.forEach((input) => {
        input.disabled = false;
      });
      titleInput.innerHTML = '대학생 간편가입'
    }
    radioInputs.forEach((radio) => {
      radio
        .querySelector(".outer-radio-box")
        .classList.remove("outer-radio-choice");
      radio
        .querySelector(".inner-radio-box")
        .classList.remove("inner-radio-choice");
    });
    e.target
      .closest("label")
      .querySelector(".outer-radio-box")
      .classList.add("outer-radio-choice");
    e.target
      .closest("label")
      .querySelector(".inner-radio-box")
      .classList.add("inner-radio-choice");
  });
});

const infoHelps = document.querySelectorAll("div.easy-join-box")
const infoInputs = document.querySelectorAll("input[type='text']");
const phoneRegex = /^01([0|1|6|7|8|9])\-?([0-9]{3,4})\-?([0-9]{4})$/;
const sendButton = document.querySelector("button.send");
const infos = document.querySelectorAll("div.basic-info-container dd");
const info = new Object();
infoInputs.forEach((input, i) => {
    info[`${input.id}`] = {input: input, help: infoHelps[i]};
});
let phoneCheck = false;
let phone = null;

/*휴대폰 번호 형식 변경*/
info.phone.input.addEventListener("blur", (e) => {
    if(!e.target.value){
        e.target.parentElement.nextElementSibling.innerText = "휴대폰 번호를 입력하세요.";
        showHelp(e.target, "error.png");
        phoneCheck = false;
        return;
    }
    phoneCheck = phoneRegex.test(e.target.value);
    if(phoneCheck) {
        e.target.value = e.target.value.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
        phone = e.target.value;
        // infos[2].innerText = phone;
        e.target.parentElement.nextElementSibling.innerText = "";
        showHelp(e.target, "pass.png");
    }
    else{
        e.target.parentElement.nextElementSibling.innerText = "휴대폰 번호를 확인하세요.";
        showHelp(e.target, "error.png");
        phoneCheck = false;
    }
});

info.phone.input.addEventListener("focus", (e) => {
    e.target.value = e.target.value.replaceAll("-", "")
});

sendButton.addEventListener("click", (e) => {
    console.log(idCheck, passwordCheck, emailFirstCheck, emailLastCheck)
     if(!idCheck || !passwordCheck || !emailFirstCheck || !emailLastCheck) {
         let modalMessage =
            "<span>모든 정보를 정확히 입력하셔야</span><span>가입이 완료됩니다.</span>";
        showWarnModal(modalMessage);
        return;
     }
    const passhash = CryptoJS.SHA256(passwordInput.value);
    passwordInput.value = passhash.toString(CryptoJS.enc.Hex);

    const passCheckhash = CryptoJS.SHA256(passwordCheckInput.value);
    passwordCheckInput.value =  passCheckhash.toString(CryptoJS.enc.Hex);

    /*휴대폰 번호 형식 변경*/
    info.phone.input.value = info.phone.input.value.replaceAll("-", "")
    /*날짜 형식 변경*/
    document.join['member-birth'].value = info.birth.input.value.replaceAll(".", "-")
    /*이메일 합치기*/
    document.join['member-email'].value = emailFirstInput.value + "@" + emailLastInput.value;
    document.join.submit();
});

const showHelp = (input, fileName) => {
    input.nextElementSibling.style.display = "block";
    input.nextElementSibling.setAttribute("src", "/static/public/images/" + fileName);

    if (fileName === "pass.png") {
        input.style.border = "1px solid rgba(0, 0, 0, 0.1)";
        input.style.background = "rgb(255, 255, 255)";
        input.nextElementSibling.setAttribute("width", "18px");
    } else {
        input.style.border = "1px solid rgb(255, 64, 62)";
        input.style.background = "rgb(255, 246, 246)";
    }
}