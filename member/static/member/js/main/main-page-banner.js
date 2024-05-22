// let count = 0;
// let num = 0;

        const lastBanner = document.createElement("div");
        const firstBanner = document.createElement("div");
        const btns = document.querySelectorAll("button.btns");
        const banner = document.querySelector("div.slick-track");
        const arrows = document.querySelectorAll("div.keyvisualbanner-arrows");
        const buttons = document.querySelectorAll("div.keyvisualbanner-navigation");
        console.log(1+1);
        let count = 0;
        let num = 0;
        let temp = buttons[0];

        firstBanner.innerHTML = `<div class="slick-slide" aria-hidden="true" style="outline: none; width: 2000px;">
        <div>
            <div>
                <a href="" class="visualslide-container">
                    <img
                        src="/staticfiles/js/main-yujin/images/banner-main3.png"
                        alt=""
                        class="main-banner-img"
                    />
                    <div class="visualslide-wrap">
                        <div class="visualslide-text">
                            <p class="visualslide-title">
                                아이폰 스냅 하나로 월매출 <br />1000 검증 노하우
                            </p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </div>`;


        lastBanner.innerHTML = `<div class="slick-slide slick-cloned" aria-hidden="true" style="width: 2000px;">
        <div>
            <div>
                <a href="" class="visualslide-container">
                    <img
                        src="/staticfiles/js/main-yujin/images/banner-main1.png"
                        alt=""
                        class="main-banner-img"
                    />
                    <div class="visualslide-wrap">
                        <div class="visualslide-text">
                            <p class="visualslide-title">
                                고든램지 픽! 천상의 체리청<br />이탈리아 119년 레시피
                            </p>
                        </div>
                    </div></a
                >
            </div>
        </div>
    </div>`;
        banner.insertBefore(
            firstBanner,
            document.querySelector("div.slick-track div")
        );
        banner.appendChild(lastBanner);

        banner.style.transform = `translate(-2000px)`;

        // 무한 슬라이드
        const autoSlide = () => {
            // 이동되는 데 걸리는 시간은 0.5초
            count++;
            banner.style.transition = "transform 0.5s";
            banner.style.transform = `translate(${-2000 * (count + 1)}px)`;


            if (count == 3) {
                setTimeout(() => {
                    banner.style.transition = "transform 0s";
                    banner.style.transform = `translate(-2000px)`;
                }, 500);
                count = 0;
                document.querySelector(".banner-bar").style.width = `${125 * (count + 1)}px`
                // buttons[count].style.background = "white";
            }else {
                document.querySelector(".banner-bar").style.width = `${125 * (count + 1)}px`
            }

            // if(imgUrl == ("http://127.0.0.1:3000/one-lab-front/staticfiles/js/main-yujin/images/banner03.jpg")) {
            //     // console.log(bannerBar)
            //     // console.log(imgUrl)
            //     bannerBar.style.width = "100px"
            // }
            // buttons[count].style.background = "black";
            // temp.style.backgroundColor = "#f0f0f0";
            // buttons[count].style.background = "black";
            // temp = buttons[count];
        };

        let inter = setInterval(autoSlide, 4000);

        // 이전, 다음 버튼
        let arrowButtonCheck = true;
        btns.forEach((arrow) => {
            arrow.addEventListener("click", (e) => {


                if (arrowButtonCheck) {
                    arrowButtonCheck = false;
                    clearInterval(inter);

                    let arrowType = e.target.classList[1];
                    banner.style.transition = "transform 0.5s";

                    //왼쪽 버튼
                    if (arrowType == "left") {
                        count--;

                        if (count == -1) {
                            banner.style.transform = "translate(0px)";
                            setTimeout(() => {
                                banner.style.transition = "transform 0s";
                                banner.style.transform = `translate(-6000px)`;
                            }, 500);
                            count = 2;
                        } else {
                            banner.style.transform = `translate(${
                                -2000 * (count + 1)
                            }px)`;
                        }
                        document.querySelector(".banner-bar").style.width = `${125 * (count + 1)}px`


                        //오른쪽 버튼
                    } else {
                        count++;
                        banner.style.transform = `translate(${
                            -2000 * (count + 1)
                        }px)`;
                        if (count == 3) {
                            setTimeout(() => {
                                banner.style.transition = "transform 0s";
                                banner.style.transform = `translate(-2000px)`;
                            }, 500);
                            count = 0;
                        }
                    }

                    document.querySelector(".banner-bar").style.width = `${125 * (count + 1)}px`
                    inter = setInterval(autoSlide, 2000);

                    setTimeout(() => {
                        arrowButtonCheck = true;
                    }, 500);
                }
            });
        });

        // 버튼
        // let buttonCheck = true;

        // temp.style.backgroundColor = "black";

        // buttons.forEach((button, i) => {
        //     button.addEventListener("click", () => {
        //         banner.style.transition = "transform 0.5s";
        //         if (buttonCheck) {
        //             buttonCheck = false;
        //             clearInterval(inter);

        //             count = i;
        //             temp.style.backgroundColor = "#f0f0f0";
        //             buttons[count].style.background = "black";
        //             banner.style.transform = `translate(${
        //                 -2000 * (count + 1)
        //             }px)`;
        //             temp = buttons[count];

        //             inter = setInterval(autoSlide, 2000);
        //             setTimeout(() => {
        //                 buttonCheck = true;
        //             }, 500);
        //         }
        //     });
        // });

