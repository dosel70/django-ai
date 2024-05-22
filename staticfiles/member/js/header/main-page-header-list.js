const headerList = document.querySelectorAll('.GNBCategoryBar_mainCategory');

headerList.forEach((tab) => {
    tab.addEventListener("click", function() {
        headerList.forEach((otherTab) => {
           otherTab.classList.remove("active")
         });
            tab.classList.add("active")
        });
    });
