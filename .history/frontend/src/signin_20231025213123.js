import  http  from "./request.js";
import user from "./user.js";

// 验证email格式
const emailInput = document.getElementById("signin-email");
const errorMessageElement = document.getElementById("signinErrorMessage");

// 添加 blur 事件监听器
emailInput.addEventListener("blur", validateEmailFormat);

function validateEmailFormat() {
  const email = emailInput.value;
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!emailPattern.test(email)) {
    showErrorMessage("Email format is invalid.");
  } else {
    hideErrorMessage();
  }
}

function showErrorMessage(message) {
  errorMessageElement.textContent = message;
  errorMessageElement.classList.remove("hidden");
}

function hideErrorMessage() {
  errorMessageElement.textContent = "";
  errorMessageElement.classList.add("hidden");
}



// 弹窗提示
const errorPopup = document.getElementById('errorPopup');
const closePopupBtn = document.getElementById('closePopup');
const popupMessage = document.getElementById('popupMessage');

function showErrorPopup(message) {
    console.log("showErrorPopup is called with message:", message); 
    popupMessage.textContent = message;
    errorPopup.classList.remove('hidden');
}

function closeErrorPopup() {
    errorPopup.classList.add('hidden');
}

closePopupBtn.addEventListener('click', closeErrorPopup);







// 登录接口
function signIn(data) {
  http.post("/auth/login", data)
    .then((res) => {
      console.log("登录成功");
      console.log("login res", res);
      //store token and check
      localStorage.setItem("token", res.token);
      const token = localStorage.getItem("token");
      console.log("token", token);
      //store ID and check
      localStorage.setItem("userId", res.userId);
      const userId = localStorage.getItem("userId");
      console.log("userId", userId);
      // fetch user information
      user.fetchUserInfo(userId);

      // 跳转页面
      window.location.hash = "#/channels";

    })
    .catch((error) => {
      console.error("出现错误:", error);
      showErrorPopup("Sign in failed : " + error.message);
    });
}

// 绑定登录表单的提交事件
document.querySelector(".signin-form").addEventListener("submit", function (event) {
  event.preventDefault(); // 阻止默认的表单提交行为

  const email = document.querySelector("#signin-email").value;
  const password = document.querySelector("#signin-password").value;
  signIn({ email, password });
});

