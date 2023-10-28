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

        // 设置图片
        if (userInfo.image) {
            document.getElementById("profileImage").src = userInfo.image;
        }
        
        // 设置用户名
        if (userInfo.username) {
            document.getElementById("usernameDisplay").textContent = userInfo.username;
        }

        // 设置电子邮件
        if (userInfo.email) {
            document.getElementById("emailDisplay").textContent = userInfo.email;
        }

        // 设置个人简介
        if (userInfo.bio) {
            document.getElementById("bioDisplay").textContent = userInfo.bio;
        }
    }
}

// 在页面加载时加载用户信息
document.addEventListener("DOMContentLoaded", loadUserInfo);
