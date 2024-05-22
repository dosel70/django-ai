let modalCheck;

const showWarnModal2 = (modalMessage) => {
    modalCheck = false;
    document.getElementById("content-wrap2").innerHTML = modalMessage;
    document.querySelector("div.warn-modal2").style.animation = "popUp 0.5s";
    document.querySelector("div.modal2").style.display = "flex";
    setTimeout(()=>{
        modalCheck = true;
    }, 500)
}

document.querySelector("div.modal2").addEventListener("click", (e) => {
    if(modalCheck) {
        document.querySelector("div.warn-modal2").style.animation = "popDown 0.5s";
        setTimeout(()=>{
            document.querySelector("div.modal2").style.display = "none";
        }, 450)
    }
});

const showWarnModal = (modalMessage) => {
    modalCheck = false;
    document.querySelector(".content-wrap").innerHTML = modalMessage;
    document.querySelector("div.warn-modal").style.animation = "popUp 0.5s";
    document.querySelector("div.modal").style.display = "flex";
    setTimeout(()=>{
        modalCheck = true;
    }, 500)
}

document.querySelector("div.modal").addEventListener("click", (e) => {
    if(modalCheck) {
        if (e.target === document.querySelector('.school-submit-btn')){
            document.querySelector("div.warn-modal").style.animation = "popDown 0.5s";
            setTimeout(()=>{
            document.querySelector("div.modal").style.display = "none";
        }, 450)
        }
        if(e.target === document.querySelector('.close-btn')) {
            document.querySelector("div.warn-modal").style.animation = "popDown 0.5s";
            setTimeout(()=>{
            document.querySelector("div.modal").style.display = "none";
        }, 450)
        }
    }
});


