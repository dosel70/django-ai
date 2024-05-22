// 프로필 설정창 닫기
const close_profile_modal_btn = document.querySelector("#profile-close-button");
close_profile_modal_btn.addEventListener("click", ()=>{
    profile_modal.style.display="none";
})

// 프로필 이미지 바꾸기
const input = document.getElementById("attach");
const thumbnail = document.querySelector("div.image")
const input2 = document.querySelector("#btn_updatePhoto")
const cancel = document.getElementById("btn_deletePhoto")

// // console.log(input2)

input.addEventListener("change", (e) => {
    const [file] = e.target.files;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", (e) => {
        const path = e.target.result;
        if (path.includes("image")) {
            thumbnail.style.backgroundImage = `url(${path})`;
        } else {
            thumbnail.style.backgroundImage = `url('https://static.wadiz.kr/assets/icon/profile-icon-1.png')`;
        }
    })
})

input2.addEventListener("click", () => {
    input.click();
})


cancel.addEventListener("click", (e) => {
    thumbnail.style.backgroundImage = "url('\https://static.wadiz.kr/assets/icon/profile-icon-1.png')"
    input.value = "";
})

// 취소 눌렀을 때 닫히는 기능
const close_profile_modal_btn2 = document.querySelector("#close-profile-modal-btn");
close_profile_modal_btn2.addEventListener("click", ()=>{
    close_profile_modal_btn.click();
})

// 저장 눌렀을 때 저장되었다는 모달창
const profile_change_confirm_modal = document.querySelector("#confirm-modal-container");
const save_profile_change_btn = document.querySelector("#save-profile-modal-btn");

save_profile_change_btn.addEventListener("click", ()=> {
    profile_change_confirm_modal.style.display = "block";
})

