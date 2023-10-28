function handlePersonalInfoButtonClick() {
    console.log("personal-info-button is clicked");
    window.location.hash = "#/myprofile";
}
export function initializePersonalInfoButtonListener() {
    const personalInfoButton = document.getElementById("personal-info-button");
    if (personalInfoButton) {
        personalInfoButton.addEventListener("click", handlePersonalInfoButtonClick);
    }
}

const userName = localStorage.g

