if(check){
    let modalMessage = "<span>아이디 또는 비밀번호를</span><span>확인해주세요!</span>";
    showWarnModal(modalMessage)
}

document.querySelector("button.login").addEventListener("click", () => {
   const member_id = document.querySelector("input[name=member-email]");
   const member_password = document.querySelector("input[name=member-password]")
   // const passhash = CryptoJS.SHA256(member_password.value);

   member_id.addEventListener("keyup", (e) => {
       if(member_id.value){
           showHelp(member_id, "pass.png");
           member_id.parentElement.nextElementSibling.innerText = "";
       }
   });

   member_password.addEventListener("keyup", (e) => {
       if(member_password.value){
           showHelp(member_password, "pass.png");
           member_password.nextElementSibling.nextElementSibling.innerText = "";
       }
   });

   if(!member_id.value){
       member_id.parentElement.nextElementSibling.innerText = "아이디를 입력하세요.";
       showHelp(member_id, "error.png");
       return;
   }

   if(!member_password.value){
       member_password.parentElement.nextElementSibling.innerText = "비밀번호를 입력하세요.";
       showHelp(member_password, "error.png");
       return;
   }
   // member_password.value = passhash.toString(CryptoJS.enc.Hex);

    document.login.submit();
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