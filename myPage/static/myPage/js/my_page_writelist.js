function myFunction() {
    // console.log(1+1);
    document.getElementById("my-dropdown").classList.toggle("show");
  }
  

  window.onclick = function(event) {
    if (!event.target.matches('.select-menu-hidden-input-box')) {
      var dropdowns = document.getElementsByClassName("select-menu-menu-list");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

const mainText = document.querySelector(".select-menu-single-value")
const options = document.querySelectorAll(".select-menu-option")
console.log(options);
options.forEach(option => {
option.addEventListener("click", function() {
    options.forEach(option => {
        option.classList.remove("select-menu-option--is-selected")
    });
    this.classList.add("select-menu-option--is-selected");
    mainText.textContent = this.textContent;
    document.getElementById("my-dropdown").classList.toggle("show");
})
})