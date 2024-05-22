// 문서가 로드되면 실행되는 이벤트 핸들러
document.addEventListener("DOMContentLoaded", function () {
    // 버튼 요소를 가져온다
    const btn1 = document.querySelector("#btn-a");

    // 메뉴 요소를 가져온다. (드롭다운 메뉴)
    const layOut = document.querySelector(".menu-a");

    // 버튼 클릭 이벤트 핸들러
    btn1.addEventListener("click", function (event) {
        // 이벤트 전파 방지
        event.stopPropagation();

        // MoreMenu 클래스를 토글
        if (layOut.classList.contains("MoreMenu")) {
            layOut.classList.remove("MoreMenu");
        } else {
            layOut.classList.add("MoreMenu");
        }

        // 메뉴 요소의 디스플레이 상태를 변경하여 보이거나 숨기기
        if (
            layOut.style.display === "none" ||
            layOut.style.display === ""
        ) {
            layOut.style.display = "block";
        } else {
            layOut.style.display = "none";
        }

        // 콘솔에 MoreMenu 출력한다.
        console.log("MoreMenu");
    });

    // 문서의 다른 영역을 클릭할 때 숨김 이벤트 핸들러
    document.addEventListener("click", function (event) {
        // 버튼이나 메뉴 영역 외의 곳을 클릭했을 때
        if (event.target !== btn1 && !layOut.contains(event.target)) {
            // 메뉴 숨기기
            layOut.style.display = "none";

            // MoreMenu 클래스 제거
            layOut.classList.remove("MoreMenu");
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const btn2 = document.querySelector("#btn-b");
    const layOut = document.querySelector(".menu-b");

    btn2.addEventListener("click", function (event) {

        event.stopPropagation();
        if (layOut.classList.contains("MoreMenu")) {
            layOut.classList.remove("MoreMenu");
        } else {
            layOut.classList.add("MoreMenu");
        }

        if (
            layOut.style.display === "none" ||
            layOut.style.display === ""
        ) {
            layOut.style.display = "block";
        } else {
            layOut.style.display = "none";
        }

        console.log("MoreMenu");
    });

    document.addEventListener("click", function (event) {
        if (event.target !== btn2 && !layOut.contains(event.target)) {
            layOut.style.display = "none";
            layOut.classList.remove("MoreMenu");
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const btn3 = document.querySelector("#btn-c");
    const layOut = document.querySelector(".menu-c");

    btn3.addEventListener("click", function (event) {
        event.stopPropagation();
        if (layOut.classList.contains("MoreMenu")) {
            layOut.classList.remove("MoreMenu");
        } else {
            layOut.classList.add("MoreMenu");
        }

        if (
            layOut.style.display === "none" ||
            layOut.style.display === ""
        ) {
            layOut.style.display = "block";
        } else {
            layOut.style.display = "none";
        }

        console.log("MoreMenu");
    });

    document.addEventListener("click", function (event) {
        if (event.target !== btn3 && !layOut.contains(event.target)) {
            layOut.style.display = "none";
            layOut.classList.remove("MoreMenu");
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const btn4 = document.querySelector("#btn-d");
    const layOut = document.querySelector(".menu-d");

    btn4.addEventListener("click", function (event) {
        event.stopPropagation();

        if (layOut.classList.contains("MoreMenu")) {
            layOut.classList.remove("MoreMenu");
        } else {
            layOut.classList.add("MoreMenu");
        }

        if (
            layOut.style.display === "none" ||
            layOut.style.display === ""
        ) {
            layOut.style.display = "block";
        } else {
            layOut.style.display = "none";
        }

        console.log("MoreMenu");
    });

    document.addEventListener("click", function (event) {
        if (event.target !== btn4 && !layOut.contains(event.target)) {
            layOut.style.display = "none";
            layOut.classList.remove("MoreMenu");
        }
    });
});