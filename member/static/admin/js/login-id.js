const emailInput = document.querySelector(".Input-email");
const emailError = document.querySelector("p#emailError");
// 이메일 input에 blur이벤트가 발생되었는 지 판단하는 FLAG
let isBlur = false;
emailInput.addEventListener("focus", (e) => {
    if (!emailInput.value && !isBlur) {
        e.target.style.border = "1px solid #00c4c4";
    }
});

emailInput.addEventListener("keyup", (e) => {
    if (emailInput.value) {
        e.target.style.border = "1px solid #f66";
    }
});

emailInput.addEventListener("blur", (e) => {
    if (!e.target.value) {
        isBlur = true;
        e.target.classList.add(".Input_error");
        e.target.style.border = "1px solid #f66";
        emailError.style.display = "block";
    }
});

// // emailInputs.forEach((emailInput) => {
// //     // 이메일 커서 클릭시 #00c4c4색상 변경
// //     emailInput.addEventListener("focus", (e) => {
// //         e.target.style.border = "1px solid #00c4c4"
// //     });

// //  // 이메일 입력하지 않고 다른 곳 클릭시 Input_error클래스 생성후 #f66색상으로 변경 및 p태그 메시지 출력
// //     emailInput.addEventListener("blur", (e) => {
// //         emailInput.classList.add(".Input_error");
// //         e.target.style.border = "1px solid #f66";
// //         emailError.style.display = "block";

// //     });
// // });

// // /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
