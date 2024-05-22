autosize($("textarea"));

const uploads = document.querySelectorAll("input.upload");
const thumbnails = document.querySelectorAll("label.attach img.thumbnail");


uploads.forEach((upload, i) => {
    upload.addEventListener("change", (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.readAsDataURL(e.target.files[0]);
        reader.addEventListener("load", (e) => {
            let url = e.target.result;

            if(url.includes('image')) {
                document.querySelectorAll("label.attach")[i].lastElementChild.style.display = "none"
                document.querySelectorAll("label.attach")[i].lastElementChild.previousElementSibling.style.display = "none"
                document.querySelectorAll("div.x")[i].style.display = "block"
                thumbnails[i].style.display = "block"
                thumbnails[i].src = url;
            }else{
                let modalMessage = "<span>이미지 파일만 등록 가능합니다.</span>"

            }
        });
    });
});

document.querySelectorAll("div.x").forEach((cancel, i) => {
    cancel.addEventListener("click", (e) => {
        e.preventDefault();
        uploads[i].value = "";
        document.querySelectorAll("label.attach")[i].lastElementChild.style.display = "block"
        document.querySelectorAll("label.attach")[i].lastElementChild.previousElementSibling.style.display = "block"
        document.querySelectorAll("div.x")[i].style.display = "none"
        thumbnails[i].src = "";
        thumbnails[i].style.display = "none"
    });
});

function send() {
    document.forms['write-form'].submit();
}

const save_btn = document.querySelector('.btn')
save_btn.addEventListener('click', ()=> {
    send();
})