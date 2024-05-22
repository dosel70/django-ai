const button = document.querySelector("button.surface-none");
const button1 = document.querySelector("button.surface-none1");
const menu = document.querySelector(".dropdown-content");
const menu1 = document.querySelector(".dropdown-content1");
const spanText = document.querySelector(".over-nowrap");
const spanText1 = document.querySelector(".over-nowrap1");

button1.addEventListener("click", () => {
    menu1.style.display = menu1.style.display === "block" ? "none" : "block";
});
button.addEventListener("click", () => {
    // 각 클릭마다 display 속성을 토글
    menu.style.display = menu.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", (e) => {
    // 클릭된 요소가 버튼과 메뉴 모두에 속하지 않으면
    if (
        !button.contains(e.target) &&
        !menu.contains(e.target) &&
        !button1.contains(e.target) &&
        !menu1.contains(e.target)
    ) {
        menu.style.display = "none";
        menu1.style.display = "none";
        // 메뉴 숨김
    }
});

// 각 <a> 태그에 클릭 이벤트 리스너 추가
const aTags = document.querySelectorAll(".dropdown-content a");
const aTags1 = document.querySelectorAll(".dropdown-content1 a");
aTags.forEach((aTag) => {
    aTag.addEventListener("click", (e) => {
        e.preventDefault();
        // a 태그의 기본 동작 방지
        const selectedValue = e.target.textContent;
        // 클릭된 값 가져오기

        spanText.textContent = selectedValue;
        // span 태그의 내용을 선택된 값으로 업데이트

        menu.style.display = "none";
        // 옵션 선택 후 메뉴 숨김
    });
});

aTags1.forEach((aTag) => {
    aTag.addEventListener("click", (e) => {
        e.preventDefault();
        // a 태그의 기본 동작 방지
        const selectedValue = e.target.textContent;
        // 클릭된 값 가져오기

        spanText.textContent = selectedValue;
        // span 태그의 내용을 선택된 값으로 업데이트

        menu.style.display = "none";
        // 옵션 선택 후 메뉴 숨김
    });
});
