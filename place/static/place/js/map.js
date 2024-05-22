let mapContainer = document.getElementById("map"), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(37.499437, 127.035846), // 지도의 중심좌표
        level: 2, // 지도의 확대 레벨
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
let map = new kakao.maps.Map(mapContainer, mapOption);
// 주소-좌표 변환 객체를 생성합니다
let geocoder = new kakao.maps.services.Geocoder();
let addresses = ["서울 강남구 테헤란로26길 12"];
// 주소로 좌표를 검색합니다
for (let i = 0; i < addresses.length; i++) {
    geocoder.addressSearch(addresses[i], (result, status) => {
        let coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        if (status === kakao.maps.services.Status.OK) {
            // 결과값으로 받은 위치를 마커로 표시합니다
            let marker = new kakao.maps.Marker({
                map: map,
                position: coords,
            });
            // 인포윈도우로 장소에 대한 설명을 표시합니다
            let infowindow = new kakao.maps.InfoWindow({
                content: '<div style="width:150px;text-align:center;padding:6px 0;">원랩</div>',
            });
            infowindow.open(map, marker);
        }
        let positions = new Array();
        positions.push(coords);
        let markerPosition = new kakao.maps.LatLng(result[0].y, result[0].x);
        // 마커를 생성합니다
        let marker = new kakao.maps.Marker({
            position: markerPosition,
        });
        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        map.setCenter(positions[0]);
        // 마커가 지도 위에 표시되도록 설정합니다
        marker.setMap(map);
    });
}