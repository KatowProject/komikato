/* Back to Top */
let mybutton = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
    ) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}
// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", backToTop);

function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


/* Navigator with Arrow Keyboard */
$(document).on('keyup', function (e) {
    switch (e.keyCode) {
        case 37:
            window.location.href = $('#prev').attr('href');
            break;

        case 39:
            window.location.href = $('#next').attr('href');
            break;
    }
});
