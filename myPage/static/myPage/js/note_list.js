const onclick = document.querySelectorAll("#article-list-25448181617305 ul li div .media-body")
console.log(onclick)
const innerText = document.querySelectorAll("#article-list-25448181617305 ul li div div a")
console.log(innerText)
for (let i=0;i<onclick.length;i++){
    let originalColors = innerText[i].style.color;
    onclick[i].addEventListener('mouseover', function(e){
        e.preventDefault();
        onclick[i].style.filter ="brightness(90%)"
        innerText[i].style.color = "black"
        // onclick[i].style.transform ="scale(2)"
    })
    onclick[i].addEventListener('mouseout', function(e){
        
        onclick[i].style.filter ="brightness(100%)"
        innerText[i].style.color = originalColors;
        // onclick[i].style.transform ="scale(2)"
    })

}