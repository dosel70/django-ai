/** 프로필 변경 js 기능 */

/** 버튼태그 클릭하면 드롭다운 메뉴가 나오는 js 기능 */
function toggleDropdown(dropdownId) {
    var dropdownOptions = document.getElementById(dropdownId);
    dropdownOptions.style.display =
        dropdownOptions.style.display === "block" ? "none" : "block";
}

function selectOption(option, buttonId) {
    var selectedOption = document.querySelector(`#${buttonId} span`);
    selectedOption.textContent = option;
    toggleDropdown(`dropdownOptions${buttonId.charAt(buttonId.length - 1)}`);
}
//
// // 버튼 외의 영역을 클릭하면 드롭다운이 사라지도록 이벤트 처리
// document.addEventListener("click", function (event) {
//     var dropdownOptions1 = document.getElementById("dropdownOptions1");
//     var dropdownOptions2 = document.getElementById("dropdownOptions2");
//     var dropdownOptions3 = document.getElementById("dropdownOptions3");
//     var surfaceNoneButtons = document.querySelectorAll(".surface-none");
//
//     if (
//         !surfaceNoneButtons[0].contains(event.target) &&
//         !dropdownOptions1.contains(event.target)
//     ) {
//         dropdownOptions1.style.display = "none";
//     }
//
//     if (
//         !surfaceNoneButtons[1].contains(event.target) &&
//         !dropdownOptions2.contains(event.target)
//     ) {
//         dropdownOptions2.style.display = "none";
//     }
//     if (
//         !surfaceNoneButtons[2].contains(event.target) &&
//         !dropdownOptions3.contains(event.target)
//     ) {
//         dropdownOptions3.style.display = "none";
//     }
// });
