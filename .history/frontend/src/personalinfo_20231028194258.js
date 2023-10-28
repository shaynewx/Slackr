

// const personalInfoButton = document.getElementById("personal-info-button");

// personalInfoButton.addEventListener("click", function() {
//     console.log("personal-info-button is clicked");
//     window.location.hash = "#/myprofile";
// });

document.body.addEventListener('click', function(e) {
    if (e.target.id === 'personal-info-button') {
        console.log("personal-info-button is clicked");
        window.location.hash = "#/myprofile";
    }
});