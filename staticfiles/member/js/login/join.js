const backButton = document.getElementById("back");
const termLayouts = document.querySelectorAll("div.term");
const infoLayouts = document.querySelectorAll("div.info");
const joinLayouts = document.querySelectorAll("div.join");

const nextButtonToGoInfo = document.querySelector("button.go-info")
const nextButtonToGoJoin = document.querySelector("button.go-join")
const sendButton = document.querySelector("button.send");

let step = 1;
backButton.style.display = "none";
infoLayouts.forEach((infoLayout) => {infoLayout.style.display = "none";});
joinLayouts.forEach((joinLayout) => {joinLayout.style.display = "none";});

// term
nextButtonToGoInfo.addEventListener("click", (e) => {
    const requiredChecks = document.querySelectorAll("input[type='checkbox'].required");
    let check = true;

    requiredChecks.forEach((requireCheck) => {
        if (!requireCheck.checked){
            check = false;
        }
    });

    if(!check) {
        let modalMessage =
            "<span>서비스를 이용하기 위해서는</span><span>필수 약관에 동의해주세요!</span>";
        showWarnModal(modalMessage);
        return;
    }

    step = 2;
    termLayouts.forEach((termLayout) => {termLayout.style.display = "none";});
    infoLayouts.forEach((infoLayout) => {infoLayout.style.display = "block";});
    backButton.style.display = "block";
});

// info
const infoInputs = document.querySelectorAll("div.info input[type='text']");
const infoHelps = document.querySelectorAll("div.info p.help")
const infos = document.querySelectorAll("div.basic-info-container dd");
const info = new Object();
infoInputs.forEach((input, i) => {
    info[`${input.id}`] = {input: input, help: infoHelps[i]};
});

const nameRegex = /^[가-힣|a-z|A-Z|]+$/;
const specialCharacterRegex = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gim;
const birthRegex =
    /^(19[0-9][0-9]|20\d{2})\.?(0[0-9]|1[0-2])\.?(0[1-9]|[1-2][0-9]|3[0-1])$/;
const phoneRegex = /^01([0|1|6|7|8|9])\-?([0-9]{3,4})\-?([0-9]{4})$/;

let nameCheck = false;
let birthCheck = false;
let phoneCheck = false;

let name = null;
let birth = null;
let phone = null;

info.name.input.addEventListener("blur", (e) => {
    if(!e.target.value){
        e.target.parentElement.nextElementSibling.innerText = "이름을 입력하세요.";
        showHelp(e.target, "error.png");
        nameCheck = false;
        return;
    }

    nameCheck = e.target.value.length > 1 &&
                e.target.value.length < 21 &&
                nameRegex.test(e.target.value) &&
                !specialCharacterRegex.test(e.target.value);

    if(nameCheck){
        name = e.target.value;
        infos[0].innerText = name;
        e.target.parentElement.nextElementSibling.innerText = "";
        showHelp(e.target, "pass.png");
    }else{
        e.target.parentElement.nextElementSibling.innerText = "영문 혹은 한글로 2자~20자로 입력해주세요.";
        showHelp(e.target, "error.png");
        nameCheck = false;
    }

});

info.birth.input.addEventListener("blur", (e) => {
    if(!e.target.value){
        e.target.parentElement.nextElementSibling.innerText = "생년월일을 입력하세요.";
        showHelp(e.target, "error.png");
        birthCheck = false;
        return;
    }

    birthCheck = birthRegex.test(e.target.value);
    if(birthCheck) {
        e.target.value = e.target.value.replace(/^(\d{4})(\d{2})(\d{2})$/, `$1.$2.$3`)
        birth = e.target.value;
        infos[1].innerText = birth;
        e.target.parentElement.nextElementSibling.innerText = "";
        showHelp(e.target, "pass.png");
    }else{
        e.target.parentElement.nextElementSibling.innerText = "생년월일을 확인하세요.";
        showHelp(e.target, "error.png");
        birthCheck = false;
    }
});

info.birth.input.addEventListener("focus", (e) => {
    e.target.value = e.target.value.replaceAll(".", "")
});

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
        infos[2].innerText = phone;
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



nextButtonToGoJoin.addEventListener("click", () => {
    if (!nameCheck || !birthCheck || !phoneCheck) {
        let modalMessage =
            "<span>모든 정보를 정확히 입력하셔야</span><span>다음 단계로 진행됩니다.</span>";
        showWarnModal(modalMessage);
        return;
    }

    step = 3;

    infoLayouts.forEach((termLayout) => {termLayout.style.display = "none";});
    joinLayouts.forEach((infoLayout) => {infoLayout.style.display = "block";});
});

// join
const idRegex = /^(?!(?:[0-9]+)$)([a-zA-Z]|[0-9a-zA-Z]){4,}$/;
const passwordNumberRegex = /[0-9]/g;
const passwordEnglishRegex = /[a-z]/gi;
const passwordSpecialCharacterRegex = /[`~!@@#$%^&*|\\\'\";:\/?]/gi;
const emailFirstRegex = /[`~!@#$%^&*|\\\'\";:\/?]/;
const emailLastRegex = /[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const idInput = document.getElementById("id");
const passwordInput = document.getElementById("password");
const passwordCheckInput = document.getElementById("password-check");
const emailFirstInput = document.getElementById("email-first");
const emailLastInput = document.getElementById("email-last");

let idCheck = false;
let passwordCheck = false;
let emailFirstCheck = false;
let emailLastCheck = false;

idInput.addEventListener("blur", async (e) => {
    if(!e.target.value){
        e.target.parentElement.nextElementSibling.innerText = "아이디를 입력하세요.";
        showHelp(e.target, "error.png");
        idCheck = false;
        return;
    }

    // 아이디 중복검사
    const response = await fetch(`/member/check-id/?member-id=${e.target.value}`)
    const status = await response.json()
    const isDup = status.isDup
    if(isDup) {
        e.target.parentElement.nextElementSibling.innerText = "중복된 아이디입니다.";
        showHelp(e.target, "error.png");
        idCheck = false;
        return;
    }

    idCheck = e.target.value.length > 3 &&
                e.target.value.length < 21 &&
                idRegex.test(e.target.value) &&
                !specialCharacterRegex.test(e.target.value)

    if(idCheck){
        e.target.parentElement.nextElementSibling.innerText = "";
        showHelp(e.target, "pass.png");
    }else{
        // if(!idDbCheck){}
        e.target.parentElement.nextElementSibling.innerText = "영문 혹은 영문과 숫자를 조합하여 4자~20자로 입력해주세요.";
        showHelp(e.target, "error.png");
        idCheck = false;
    }
});

passwordInput.addEventListener("blur", (e) => {
    if(!e.target.value){
        e.target.nextElementSibling.nextElementSibling.innerText = "비밀번호를 입력하세요.";
        showHelp(e.target, "error.png");
        passwordCheck = false;
        return;
    }

    passwordCheck = e.target.value.length > 9 &&
                    e.target.value.length < 21 &&
                    passwordNumberRegex.test(e.target.value) &&
                    passwordEnglishRegex.test(e.target.value) &&
                    passwordSpecialCharacterRegex.test(e.target.value) &&
                    !/\s/g.test(e.target.value);

    if(passwordCheck){
        e.target.nextElementSibling.nextElementSibling.innerText = "";
        showHelp(e.target, "pass.png");
    }else{
        e.target.nextElementSibling.nextElementSibling.innerText = "공백 제외 영어 및 숫자, 특수문자 모두 포함하여 10~20자로 입력해주세요.";
        showHelp(e.target, "error.png");
        passwordCheck = false;
    }
});

passwordCheckInput.addEventListener("blur", (e) => {
    if(!passwordCheck){
        e.target.nextElementSibling.nextElementSibling.innerText = "비밀번호를 다시 확인해주세요.";
        showHelp(e.target, "error.png");
        return;
    }

    if(!e.target.value){
        e.target.nextElementSibling.nextElementSibling.innerText = "비밀번호 확인을 위해 한번 더 입력하세요.";
        showHelp(e.target, "error.png");
        passwordCheck = false;
        return;
    }
    passwordCheck = passwordInput.value === e.target.value
    if(passwordCheck) {
        e.target.nextElementSibling.nextElementSibling.innerText = "";
        showHelp(e.target, "pass.png");
    }else{
        e.target.nextElementSibling.nextElementSibling.innerText = "위 비밀번호와 일치하지 않습니다. 다시 입력해주세요.";
        showHelp(e.target, "error.png");
        passwordCheck = false;
    }
});

if(memberEmail) {
    emailFirstCheck = true;
    emailLastCheck = true;
    const email = memberEmail.split("@");
    emailFirstInput.value = email[0]
    emailLastInput.value = email[1]

    emailFirstInput.readOnly = true;
    emailLastInput.readOnly = true;

    document.querySelector("div.email-select-wrap").style.display = "none";
}

emailFirstInput.addEventListener("blur", (e) => {
    if(memberEmail) {return;}

    if(!e.target.value){
        document.getElementById("email-help").innerText = "이메일을 입력하세요.";
        showHelp(e.target, "error.png");
        emailFirstCheck = false;
        return;
    }

    emailFirstCheck = !emailFirstRegex.test(e.target.value);

    if(emailFirstCheck){
        document.getElementById("email-help").innerText = "";
        showHelp(e.target, "pass.png");
    } else {
        document.getElementById("email-help").innerText = "이메일 주소를 확인해주세요.";
        showHelp(e.target, "error.png");
        passwordCheck = false;
    }
});

document.querySelector("select.email").addEventListener("change", (e) => {
    emailLastInput.value = e.target.value;
    emailLastInput.dispatchEvent(new Event("blur"));

    if(!e.target.value) {
        emailLastInput.readOnly = false;
        document.getElementById("email-help").innerText = "";
        emailLastInput.nextElementSibling.style.display = "none";
        emailLastInput.style.border = "1px solid rgba(0, 0, 0, 0.1)";
        emailLastInput.style.background = "rgb(255, 255, 255)";
        return;
    }
    emailLastInput.readOnly = true;
});

emailLastInput.addEventListener("blur", (e) => {
    if(memberEmail) {return;}

    if(!e.target.value){
        document.getElementById("email-help").innerText = "이메일을 입력하세요.";
        showHelp(e.target, "error.png");
        emailLastCheck = false;
        return;
    }

    emailLastCheck = emailLastRegex.test(e.target.value);

    if(emailLastCheck){
        document.getElementById("email-help").innerText = "";
        showHelp(e.target, "pass.png");
    } else {
        document.getElementById("email-help").innerText = "이메일 주소를 확인해주세요.";
        showHelp(e.target, "error.png");
        passwordCheck = false;
    }
});

sendButton.addEventListener("click", (e) => {
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

// help message and style
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

// back
document.getElementById("back").addEventListener("click", () => {
    step--;

    switch (step){
        case 1:
            backButton.style.display = "none";
            infoLayouts.forEach((infoLayout) => {infoLayout.style.display = "none";});
            termLayouts.forEach((termLayout) => {termLayout.style.display = "block";});
            break;
        case 2:
            joinLayouts.forEach((termLayout) => {termLayout.style.display = "none";});
            infoLayouts.forEach((infoLayout) => {infoLayout.style.display = "block";});
            break;
    }

});