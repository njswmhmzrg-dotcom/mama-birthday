const openButton = document.getElementById("openButton");

const envelope = document.getElementById("envelope");


/* Кнопка "Открыть подарок" */

openButton.addEventListener("click", function () {

    document.querySelector(".greeting").scrollIntoView({
        behavior: "smooth"
    });

});


/* Открытие конверта */

envelope.addEventListener("click", function () {

    envelope.classList.toggle("open");

});