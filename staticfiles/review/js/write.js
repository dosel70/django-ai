$("a.select-product-box").on("click", function(e) {
    e.preventDefault();
    console.log('dd')
    // console.log($("#registration-review option"))
    if($("a.select-product-box").attr('aria-expanded') === 'false'){
        $("a.select-product-box").attr('aria-expanded', 'true')
        $("div.select-product-panel").css('display', 'block')
    }else {
        $("a.select-product-box").attr('aria-expanded', 'false')
        $("div.select-product-panel").css('display', 'none')
    }
    // console.log($("a.select-product-box"));

})

$("div.select-product-panel").on("click", function(e) {
    $("a.select-product-box").attr('aria-expanded', 'false')
    $("div.select-product-panel").css('display', 'none')
})

// $("div.select-product-panel").on("mouseout", function(e) {
//     $("a.select-product-box").attr('aria-expanded', 'false')
//     $("div.select-product-panel").css('display', 'none')
// })

$(document).ready(function(){
    $("span.star").on("click", function(e) {
        $("div.choice-text").css('display', 'none');

        let one = $("div.choice-text.one")
        let two = $("div.choice-text.two")
        let three = $("div.choice-text.three")
        let four = $("div.choice-text.four")
        let five = $("div.choice-text.five")

        $(this).parent().children('span').removeClass('on');
        $(this).addClass('on').prevAll('span').addClass('on');

        if ($(this).attr('value') === "1") {
            one.css('display', 'block');
        }else if ($(this).attr('value') === "2") {
            two.css('display', 'block');
        }else if ($(this).attr('value') === "3") {
            three.css('display', 'block');
        }else if ($(this).attr('value') === "4") {
            four.css('display', 'block');
        }else if ($(this).attr('value') === "5") {
            five.css('display', 'block');
        }
    });
});


// 파일 입력 필드에 변화가 있을 때 실행될 함수
document.getElementById("file-input").addEventListener('change', function(event) {
    var fileList = document.getElementById('file-list');
    var files = event.target.files;

    for (var i = 0; i < files.length; i++) {
        var file = files[i];

        if (file.type.startsWith('image/')) {
            var reader = new FileReader();
            reader.onload = (function(f) {
                return function(e) {
                    var cancelButton = document.createElement('button');
                    cancelButton.textContent = 'X';
                    cancelButton.className = 'cancel-upload';

                    var thumbnail = document.createElement('img');
                    thumbnail.src = e.target.result;
                    thumbnail.alt = 'Thumbnail';
                    thumbnail.style.display = 'block';
                    thumbnail.width = 100;

                    var listItem = document.createElement('li');
                    listItem.appendChild(thumbnail);


                    cancelButton.addEventListener('click', function() {
                        fileList.removeChild(listItem); // 취소된 파일 제거
                    });
                    listItem.appendChild(cancelButton);

                    fileList.appendChild(listItem);
                };
            })(file);
            reader.readAsDataURL(file);
        } else {
            $("div.upload-error").css('display', 'block'); // 이미지 파일이 아닌 경우 에러 메시지 표시
        }
    }
});

// 업로드 취소 버튼에 클릭 이벤트 추가
$(document).on('click', 'button.cancel-upload', function(event) {
    $(this).closest('li.upload-item').remove(); // 해당 파일 제거
});


