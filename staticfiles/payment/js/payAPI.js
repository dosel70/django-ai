const price = document.querySelector(".PaymentLayout_buttonContent");
const apiBtn = document.getElementById('order-button');

// 결제하기 버튼을 클릭하면 async await 비동기 처리를 시작할 수 있고, 콜백함수로 처리
apiBtn.addEventListener('click', async () => {
    // 사용자로부터 가격 입력 받아야함
    const userInput = price.textContent;
    console.log('click!!')

    // 입력된 값이 숫자인지 확인하고, 숫자가 아니거나 비어있으면 default -> 100으로 설정한다.
    // point 컬럼이 biginteger 이기에 문자열은 입력되면 안됨
    const dynamicPrice = isNaN(parseInt(userInput)) || userInput === '' ? 100 : parseInt(userInput);
// f'/point/new?point={point}'

    // Point 객체 생성 후 서버에 전송해야함
    console.log(dynamicPrice)
    //사용자가 입력한 point를 위에 선언한 dynamicPrice 변수로 선언하고 이를 data 변수에 담는다.
    const data = { point: dynamicPrice };

    // 결제 서비스 url인 /point/new/에  data 를 보낸다. POST 방식으로 요청하며, 이는 views.py에서
    // get으로 stringify로 문자열로 변환된 data 값을 추출해야함.

    console.log(data)
    //  부트페이 결제 API 화면 시작 ---> fetch를 이거 뒤에 선언해야 되는지? --> Correct!
        const response = await Bootpay.requestPayment({
            application_id: "59a4d323396fa607cbe75de4",
            price: dynamicPrice,
            order_name: "테스트결제",
            order_id: "TEST_ORDER_ID",
            pg: "나이스페이먼츠",
            method: "카드",
            tax_free: 0,
            user: {
                id: "회원아이디",
                username: "회원이름",
                phone: "01000000000",
                email: "test@test.com",
            },
            items: [
                {
                    id: "item_id",
                    name: "테스트아이템",
                    qty: 1,
                    price: dynamicPrice,
                },
            ],
            extra: {
                open_type: "iframe",
                card_quota: "0,2,3",
                escrow: false,
            },
        });
            fetch('/point/new/',{
                method : 'POST',
                headers : {
                    'X-CSRFToken':csrf_token,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(data)
            }).then(response=>{
                if(response.ok) {
                    window.location.href = '/point/list/';
                }else{
                    console.error('결제 실패',response);
                    window.location.href='/'
                    alert('대학생만 포인트 충전이 가능합니다!')
                }
            }).catch(error => console.error('Error', error))


     //    await fetch(`/point/new/`, {
     //        method: 'POST',
     //        headers: {
     //            'X-CSRFToken' : csrf_token,
     //            'Content-Type': 'application/json',
     //        },
     //        //body에서는 JSON 형식으로 된 data 값을 문자열로 변환한다.
     //        body: JSON.stringify(data),
     //    });
     // // pay();
     // return {data: data}


    });


