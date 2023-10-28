

const personalInfoButton = document.getElementById("personal-info-button");

personalInfoButton.addEventListener("click", function() {
    console.log("personal-info-button is clicked");
    window.location.hash = "#/myprofile";
});

