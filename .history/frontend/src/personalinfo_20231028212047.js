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







// 获取并保存用户信息
function saveUpdatedUserInfo(updatedInfo) {
    const userInfoString = localStorage.getItem("userInfo");
    if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);

        // 合并更新的信息
        const newUserInfo = { ...userInfo, ...updatedInfo };
        localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
        
        // 刷新页面以显示更新的信息
        location.reload();
    }
}




document.addEventListener("DOMContentLoaded", function() {
    const submitButton = document.getElementById("submit-changes");
    const cancelButton = document.getElementById("cancel-changes");
    const changeProfileBox = document.getElementById("change-profile-box");

    if (submitButton) {
        submitButton.addEventListener("click", function() {
            let updatedInfo = {};

            const newPassword = document.getElementById("new-password").value;
            const newUsername = document.getElementById("new-username").value;
            const newEmail = document.getElementById("new-email").value;
            const newBio = document.getElementById("new-bio").value;

            const userInfoString = localStorage.getItem("userInfo");
            const currentInfo = userInfoString ? JSON.parse(userInfoString) : {};

            if (newPassword) {
                updatedInfo.password = newPassword;
            }
            if (newUsername && newUsername !== currentInfo.username) {
                updatedInfo.username = newUsername;
            }
            if (newEmail && newEmail !== currentInfo.email) {
                updatedInfo.email = newEmail;
            }
            if (newBio && newBio !== currentInfo.bio) {
                updatedInfo.bio = newBio;
            }

            if (Object.keys(updatedInfo).length > 0) {
                // 假设你有一个函数 sendToBackend 用于发送数据到后端
                sendToBackend(updatedInfo).then(() => {
                    saveUpdatedUserInfo(updatedInfo);
                });
            }

            // 隐藏更新框
            if (changeProfileBox) {
                changeProfileBox.style.display = "none";
            }
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

// 假设的发送到后端的函数
function sendToBackend(data) {
    return fetch("/your-backend-endpoint", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}
