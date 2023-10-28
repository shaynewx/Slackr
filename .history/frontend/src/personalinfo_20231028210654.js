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
        if (userInfo.image && userInfo.image.trim() !== "") {
            document.getElementById("profileImage").src = userInfo.image;
        } else {
            // 设置默认头像
            document.getElementById("profileImage").src = "styles/emoji-default-profile-image.svg";
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


// 监听 upload-image-button 的点击事件
const updateProfileButton = document.getElementById("update-profile-button");
if (updateProfileButton) {
    updateProfileButton.addEventListener("click", handleUpdateProfileButtonClick);
}