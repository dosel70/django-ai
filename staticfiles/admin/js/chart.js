const visitRecordsData = JSON.parse(document.getElementById('visitRecords').dataset.visitRecords);
console.log(visitRecordsData);

const labels = visitRecordsData.map(record => record.date);
const data = visitRecordsData.map(record=> record.count);

console.log(labels, data);


// "id값이 "myChart"인 Canvas 태그에서 2D 컨텍스트를 가져온다.
const ctx = document.getElementById("myChart").getContext("2d");

/**  Chart 객체를 생성. */
const myChart = new Chart(ctx, {
    type: "bar", // bar 차트를 사용
    data: {
        labels: labels,
        // X축 레이블
        datasets: [
            {
                label: "# 날짜별 접속한 회원 수",
                // 데이터 세팅 라벨
                data: data,
                // Y축 데이터
                backgroundColor: "#C8E6C9",
                borderColor: "#008244",
                borderWidth: 1,
                // 바의 테두리 두께
            },
        ],
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                // Y축의 값이 0부터 시작하도록 설정
            },
        },
    },
});

/**type: 차트 종류를 지정. ex)bar, bubble, doughnut, line.
 *
data: 차트 데이터를 넣어준다.

labels: 축제목이다.

datasets: 각 축에 들어갈 데이터를 넣어주고 색이나 두께 같은 꾸밈 요소도 지정할 수 있다.

**/
