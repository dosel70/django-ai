const tabList = document.querySelectorAll('.TabButton_btnTab');

tabList.forEach((tab) => {
    tab.addEventListener("click", function() {
        tabList.forEach((otherTab) => {
           otherTab.classList.remove("TabButton_active")
         });
            tab.classList.add("TabButton_active")
        });
    });
