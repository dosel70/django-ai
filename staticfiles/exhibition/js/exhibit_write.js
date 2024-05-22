autosize($("textarea"));

const uploads = document.querySelectorAll("input.upload");
const thumbnails = document.querySelectorAll("label.attach img.thumbnail");

const upload_file = document.querySelector("input.upload-download");
console.log(upload_file);
upload_file.addEventListener("change", (e)=>{
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.readAsDataURL(e.target.files[0]);
    reader.addEventListener("load", (e)=>{
        let url = e.target.result;
        if(!url.includes('image')) {
            let filename = file.name;
            let extension = filename.split('.').pop();
            let filenameElement = document.querySelector(".download-wrap h6");
            filenameElement.textContent = filename;
            // let extensionElement = document.createElement("span");
            // extensionElement.textContent = `.${extension}`;
            // filenameElement.appendChild(extensionElement);
        }
        else{
            let modalMessage = "<span>hwp, pdf, txt, word 파일만 등록 가능합니다.</span>"

        }
    })
})


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


// 제목 글자수 계산
let input_title = document.querySelector('.input-input');
let helperMsg = document.querySelector('.helper-msg');

input_title.addEventListener('input', function() {
    // input에 입력된 글자 수 계산
    const length = input_title.value.length;

    // 최대 글자 수는 40
    const maxLength = 40;

    // 남은 글자 수 계산
    const remaining = maxLength - length;

    // helper-msg의 텍스트를 업데이트
    helperMsg.textContent = remaining + '자 남음';
});

// 내용 글자세기
let input_content = document.querySelector('.content-input');
let content_helperMsg = document.querySelector('.content-helper');

input_content.addEventListener('input', function() {
    // input에 입력된 글자 수 계산
    const length = input_content.value.length;

    // 최대 글자 수는 300
    const maxLength = 1000;

    // 남은 글자 수 계산
    const remaining = maxLength - length;

    // helper-msg의 텍스트를 업데이트
    content_helperMsg.textContent = remaining + '자 남음';
});

// submit 지정

function send() {
    document.forms['write-form'].submit();
}

const save_btn = document.querySelector('.save-btn')
save_btn.addEventListener('click', ()=> {
    send();
})
