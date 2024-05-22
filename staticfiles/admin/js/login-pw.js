const pwInputs = document.querySelectorAll(".Input-pw");

pwInputs.forEach((pwInput) => {
    pwInput.addEventListener("focus", (e) => {
        e.target.style.border = "1px solid #00c4c4"
    });
    pwInput.addEventListener("blur", (e) => {
        e.target.style.border = "1px solid #dde2e6"
    });
});