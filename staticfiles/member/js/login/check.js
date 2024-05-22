NodeList.prototype.filter = Array.prototype.filter;

const checkboxes = document.querySelectorAll(".checkbox-wrap input[type='checkbox']");
const checkAll = document.querySelector("input[name='check-all']");
const checks = document.querySelectorAll("input[name='check']");
const optionsAll = document.querySelector(".options-title input[name='check']");
const options = document.querySelectorAll(".options-list input[name='check']");

checkAll.addEventListener("click", (e) => {
    let isChecked = e.target.checked;
    isChecked ? checkedAll() : notCheckedAll();
    checks.forEach((check) => {
        check.checked = isChecked;
        check.dispatchEvent(new Event('change'));
    });
});

checks.forEach((check) => {
   check.addEventListener("change", (e) => {
       let isChecked = e.target.checked;
       let img = e.target.nextElementSibling.firstElementChild;
       isChecked ? checked(img) : notChecked(img);
   });
});

optionsAll.addEventListener("change", (e) => {
    options.forEach((option) => {
        option.checked = e.target.checked;
        const img = option.nextElementSibling.firstElementChild;
        option.checked ? checked(img) : notChecked(img)
    });
});

options.forEach((option) => {
   option.addEventListener("click", (e) => {
       optionsAll.checked = options.filter((option) => option.checked).length > 0;
       const img = optionsAll.nextElementSibling.firstElementChild;
       optionsAll.checked ? checked(img) : notChecked(img)
   });
});

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        if(checkboxes.length === checkboxes.filter((checkbox) => checkbox.checked).length) {
            checkAll.checked = true;
            checkedAll();
            return
        }
        checkAll.checked = false;
        notCheckedAll();
    })
})

const checkedAll = () => {
    document.querySelectorAll("#check-all-wrap span.checkbox").forEach((checkbox) => {
        with(checkbox.style){
            borderColor = "rgb(235 124 120)";
            backgroundColor = "rgb(235 124 120)";
        }
    });
}

const notCheckedAll = () => {
    document.querySelectorAll("#check-all-wrap span.checkbox").forEach((checkbox) => {
        with(checkbox.style){
            borderColor = "";
            backgroundColor = "";
        }
    });
}

const checked = (img) => {
    img.src = "/static/public/images/checked.png";
    checkAvailable();
}

const notChecked = (img) => {
    img.src = "/static/public/images/check.png";
    checkAvailable();
}

const checkAvailable = () => {
    if(document.getElementById("enable").checked) {
        document.querySelectorAll("li.options").forEach((option) => {
           option.classList.remove("disable");
        });
        return;
    }

    document.querySelectorAll("li.options").forEach((option) => {
       option.classList.add("disable");
    });
    document.querySelectorAll(".options input[type='checkbox']").forEach((checkbox) => {
       checkbox.checked = false;
    });
    document.querySelectorAll(".options span.checkbox img").forEach((img) => {
        img.src = "/static/public/images/check.png";
    });
}