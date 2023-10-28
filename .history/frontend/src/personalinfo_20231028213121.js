import http from "./request.js";

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

function loadUserInfo() {
    const userInfoString = localStorage.getItem("userInfo");
    if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);

        if (userInfo.image && userInfo.image.trim() !== "") {
            document.getElementById("profileImage").src = userInfo.image;
        } else {
            document.getElementById("profileImage").src = "styles/emoji-default-profile-image.svg";
        }
        
        if (userInfo.username) {
            document.getElementById("usernameDisplay").textContent = userInfo.username;
        }

        if (userInfo.email) {
            document.getElementById("emailDisplay").textContent = userInfo.email;
        }

        if (userInfo.bio) {
            document.getElementById("bioDisplay").textContent = userInfo.bio;
        }
    }
}

// load user information
document.addEventListener("DOMContentLoaded", loadUserInfo);


// listen to upload-image-button
const updateProfileButton = document.getElementById("update-profile-button");
if (updateProfileButton) {
    updateProfileButton.addEventListener("click", function () {
        const changeProfileBox = document.getElementById("change-profile-box");
        if (changeProfileBox) {
            changeProfileBox.style.display = "block";
        }
    });
}







// save updated information
function saveUpdatedUserInfo(updatedInfo) {
    const userInfoString = localStorage.getItem("userInfo");
    if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        // merge new information
        const newUserInfo = { ...userInfo, ...updatedInfo };
        localStorage.setItem("userInfo", JSON.stringify(newUserInfo));

        location.reload();
    }
}




document.addEventListener("DOMContentLoaded", function() {
    const submitButton = document.getElementById("submit-changes");
    const cancelButton = document.getElementById("cancel-changes");
    const changeProfileBox = document.getElementById("change-profile-box");


    function validateRegisterEmailFormat(email) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      
        if (!emailPattern.test(email)) {
          alert("Email format is invalid.");
          return false;
        } 
        return true;
      }
      
      function validatePasswordFormat(password) {
        const passwordPattern =
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      
        if (!passwordPattern.test(password)) {
          alert("Password format is invalid.");
          return false;
        }
        return true;
      }







      if (submitButton) {
        submitButton.addEventListener("click", function() {
            let updatedInfo = {};
            let hasEmptyFields = false;
    
            const newPassword = document.getElementById("new-password").value;
            const newUsername = document.getElementById("new-username").value;
            const newEmail = document.getElementById("new-email").value;
            const newBio = document.getElementById("new-bio").value;
    
            // 检查每个字段是否为空
            if (!newPassword) {
                alert("New password cannot be empty!");
                hasEmptyFields = true;
            }
            if (!newUsername) {
                alert("New username cannot be empty!");
                hasEmptyFields = true;
            }
            if (!newEmail) {
                alert("New email cannot be empty!");
                hasEmptyFields = true;
            }
            if (!newBio) {
                alert("New bio cannot be empty!");
                hasEmptyFields = true;
            }
    
            // 如果有任何空字段，则直接返回
            if (hasEmptyFields)
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", function() {
            if (changeProfileBox) {
                changeProfileBox.style.display = "none";
            }
        });
    }
});
