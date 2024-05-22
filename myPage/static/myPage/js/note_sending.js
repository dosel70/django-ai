const close_btn = document.querySelector(".banner-container-close-button");
const modal = document.querySelector(".bottom-modal-certification-portal");
const openbtn = document.querySelector(".my-page-project-info-payment button");
const sendbtn = document.getElementById("send-button");
const success_message = document.querySelector(".banner-container-modal-success");
const email_box = document.querySelector("input.input-input");

close_btn.addEventListener("click", (e)=> {
    modal.style.display= 'none';

})

openbtn.addEventListener("click", (e)=> {
    modal.style.display = 'block';
})

sendbtn.addEventListener("click", () => {
    
        success_message.style.display = 'block';
    
})
    
