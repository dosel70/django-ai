const radio = document.querySelectorAll("input[type=radio]");

radio.forEach((like) => {
    like.addEventListener("click", (e) => {
        // console.log(e.target.classList);
        e.target.classList.toggle("active");
        e.ariaPressed = "true";
        // alert("들어옴");
    });
});

// const nPay = document.querySelector("#n_pay");
// const menubars = document.querySelector(".menubars");
// nPay.addEventListener("change", (e) => {
//     if (e.target.checked) {
//         menubars.style.display = "block";
//     }
// });

const all = document.querySelector("#all_check");
const terms = document.querySelectorAll("input.check_on");
const span = document.querySelector(".checkbox-icon");

NodeList.prototype.filter = Array.prototype.filter;
all.addEventListener("click", (e) => {
    e.target.classList.toggle("active");
    e.ariaPressed = "true";
    terms.forEach((term) => {
        // console.log("asgsagsa" + e.target);
        term.checked = e.target.checked;
    });
});

terms.forEach((term) => {
    // console.log(term)
    term.addEventListener("click", (e) => {
        console.log(e.target);
        all.checked = terms.filter((term) => term.checked).length === 3;
    });
});

const label = document.querySelector(".select-menu-hidden-input-box");
const dropdown = document.querySelector(".select_menu_menu_list");
const dropdowns = document.querySelectorAll(".select_menu_option");
const text = document.querySelector(".select-menu__placeholder");
const point = document.querySelector(".point-choice");
const inputDetail = document.getElementById("input_detail");

label.addEventListener("click", (e) => {
    dropdown.style.display = "block";
});

dropdowns.forEach((list) => {
    list.addEventListener("click", () => {
        dropdown.style.display = "none";
        text.innerHTML = list.innerHTML;
        if (list === point) {
            inputDetail.style.display = "block";
        } else if (list !== point) {
            inputDetail.style.display = "none";
        }
    });
});


// const kPay = document.querySelector("#payment_kakao");
// kPay.addEventListener("change", (e) => {
//     if (e.target.checked) {
//         menubars.style.display = "none";
//     }
// });

// const normalPay = document.querySelector("#payment_credit");
// normalPay.addEventListener("change", (e) => {
//     if (e.target.checked) {
//         menubars.style.display = "none";
//     }
// });

// window.onload = function () {
//     const inputDetail = document.getElementById("input_detail");
//     document.getElementById("address_btn").addEventListener("click", function () {
//         //주소입력칸을 클릭하면
//         //카카오 지도 발생
//         new daum.Postcode({
//             oncomplete: function (data) {
//                 //선택시 입력값 세팅
//                 console.log(data);
//                 document.getElementById("zip_code").value = data.zonecode;
//                 document.getElementById("address_input").value = data.address; // 주소 넣기
//                 inputDetail.style.display = "block";
//             },
//         }).open();
//     });
// };
