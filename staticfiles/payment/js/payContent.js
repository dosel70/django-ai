const clickableDivs = document.querySelectorAll('.select_menu_option');
const priceDisplay = document.getElementById('priceDisplay');
const totalDisplay = document.querySelector('#totalPrice');
const buttonContentDiv = document.querySelector('.PaymentLayout_buttonContent');
const inputPriceDisplay = document.querySelector('#input_detail');

clickableDivs.forEach(div => {
    div.addEventListener('click', () => {
        const newPrice = div.getAttribute('data-price');
        priceDisplay.textContent = newPrice;
        totalDisplay.value = newPrice;
        console.log(totalDisplay)
        // totalDisplay.value = newPrice + 'P';
        buttonContentDiv.textContent = newPrice + '원 결제하기';
    });
});

inputPriceDisplay.addEventListener('keyup', (e) => {
    const inputPrice = e.target.value.trim();
    priceDisplay.innerText = inputPrice;
    // totalDisplay.innerText = inputPrice;
    totalDisplay.value = inputPrice;
    buttonContentDiv.textContent = inputPrice + '원 결제하기';
    console.log(inputPrice)
});

