const point_tabs = document.querySelectorAll(".point-keywords-tab");
const point_list_page = document.querySelectorAll(".point-list");

for (let j=0;j<3;j++) {
    point_tabs[j].addEventListener("click", ()=>{
        for (let i=0;i<3;i++){
            point_tabs[i].classList.remove("active");
            point_list_page[i].classList.remove("show");
        }
        
        point_tabs[j].classList.add("active");
        point_list_page[j].classList.add("show");
    })
}


