import http from "./request.js";
import user from "./user.js";

// check email format
const emailInput = document.getElementById("signin-email");
const errorMessageElement = document.getElementById("signinErrorMessage");

// Add blur event listener
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

// Popup
const errorPopup = document.getElementById("errorPopup");
const closePopupBtn = document.getElementById("closePopup");
const popupMessage = document.getElementById("popupMessage");

function showErrorPopup(message) {
  console.log("showErrorPopup is called with message:", message);
  popupMessage.textContent = message;
  errorPopup.classList.remove("hidden");
}

function closeErrorPopup() {
  errorPopup.classList.add("hidden");
}

closePopupBtn.addEventListener("click", closeErrorPopup);

// Sign in function
function signIn(data) {
  http
    .post("/auth/login", data)
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
      // jump to channels page
      window.location.hash = "#/channels";
    })
    .catch((error) => {
      console.error("Error:", error);
      showErrorPopup("Sign in failed : " + error.message);
    });
}

// 绑定登录表单的提交事件
document
  .querySelector(".signin-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); 

    const email = document.querySelector("#signin-email").value;
    const password = document.querySelector("#signin-password").value;
    signIn({ email, password });
  });
