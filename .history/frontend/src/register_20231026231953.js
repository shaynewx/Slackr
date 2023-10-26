import http from "./request.js";

const registerEmailInput = document.getElementById("register-email");
const passwordInput = document.getElementById("register-password");
const nameInput = document.getElementById("register-username")
const confirmPasswordInput = document.getElementById("confirm-password");
const wrongMessageElement = document.getElementById("wrongMessage"); 
const registerForm = document.querySelector(".register-form");
const errorPopup = document.getElementById("errorPopup");
const closeErrorPopupButton = document.getElementById("closePopup");

// add blur listener
registerEmailInput.addEventListener("blur", validateRegisterEmailFormat);
passwordInput.addEventListener("blur", validatePasswordFormat);
confirmPasswordInput.addEventListener("blur", validatePasswordMatch);

// check email format
function validateRegisterEmailFormat() {
    const email = registerEmailInput.value;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailPattern.test(email)) {
        showMessageInTextarea("Email format is invalid.");
    } else {
        hideMessageInTextarea();
    }
}

// check passward format
function validatePasswordFormat() {
    const password = passwordInput.value;
    const passwordPattern =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!passwordPattern.test(password)) {
        showMessageInTextarea("Password format is invalid.");
    } else {
        hideMessageInTextarea();
    }
}

// check whether passwords are consistent 
// 验证两次输入的密码是否一致
function validatePasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
        showMessageInTextarea("Passwords do not match.");
        registerForm.onsubmit = function(event) {
            event.preventDefault(); 
        };
    } else {
        hideMessageInTextarea();
        registerForm.onsubmit = null; // 允许表单提交
    }
}

// 显示错误信息在textarea
function showMessageInTextarea(message) {
    wrongMessageElement.textContent = message;  // 修改此处
    wrongMessageElement.classList.remove("hidden");  // 修改此处
}

// 隐藏textarea中的错误信息
function hideMessageInTextarea() {
    wrongMessageElement.textContent = "";  
    wrongMessageElement.classList.add("hidden"); 
}


// 添加弹窗
function showErrorPopup(message) {
    const popupMessage = document.getElementById("popupMessage");
    popupMessage.textContent = message;
    errorPopup.classList.remove("hidden");
}

closeErrorPopupButton.addEventListener("click", function() {
    errorPopup.classList.add("hidden");
});






// 处理注册表单提交
registerForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = registerEmailInput.value;
    const password = passwordInput.value;
    const name = nameInput.value;

    // 可以调用后端的注册接口
    http.post("/auth/register", {
        email,
        password,
        name
    }).then(res => {
        // 注册成功后的处理，跳转到频道页面
        console.log("注册成功");
      //TODO:注意这一行
        console.log("sign res", res);
      //缓存token
        localStorage.setItem("token", res.token);
      // 查看token
        const token = localStorage.getItem("token");
        console.log(token);
        window.location.hash = "#/channels";
        
    }).catch(error => {
        // 如果注册失败，pop up错误消息
        showErrorPopup("Registration failed: " + error.message);
        
    });
});
