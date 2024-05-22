let formData = new FormData()
formData.append("point-number",price)
const totalPrice = document.getElementById('totalPrice')
const button = document.getElementById('order-button')
button.addEventListener('click',()=> {
    fetch('/point/new/', {
    method: 'GET',
    headers: {
        'X-CSRFToken' : csrftoken,
        'Content-Type': 'application/json; charset=utf-8',
        // 필요하다면 추가적인 헤더를 설정할 수 있음
    },
    body: JSON.stringify({
        // POST 요청에 필요한 데이터를 JSON 형식으로 전송
        totalPrice: price,
    }),
    // body: formData
})
    .then(response => response.json())
    .then(data => {
        // 서버에서 받은 JSON 데이터를 처리
        console.log(data);

        // 여기서 모달 창 등을 업데이트하는 로직을 추가할 수 있음
    })
    .catch(error => {
        // 오류 처리
        console.error('Error:', error);
    });


})