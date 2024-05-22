const input = document.getElementById("attach");
const thumbnail = document.querySelector("div.image");
const cancel = document.querySelector("div.cancel");
const plusicon = document.querySelector("svg.simple-pay-card-add-icon");

input.addEventListener("change", (e) => {
    const [file] = e.target.files;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", (e) => {
        const path = e.target.result;
        cancel.style.display = "block";
        if (path.includes("image")) {
            thumbnail.style.backgroundImage = `url(${path})`;
            plusicon.style.display = "none";
        } else {
            thumbnail.style.backgroundImage = `url('images/attach.png')`;
        }
    });
});

cancel.addEventListener("click", (e)=> {
    thumbnail.style.backgroundImage = `url('')`
    e.target.style.display = "none";
    plusicon.style.display = "block";
    input.value = "";
})