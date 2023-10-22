// 注册时的密码验证
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const passwordMismatchMessage = document.getElementById(
  "passwordMismatchMessage"
);
const registerForm = document.querySelector(".register-form");

// 添加 blur 事件监听器
passwordInput.addEventListener("blur", validatePasswordFormat);
confirmPasswordInput.addEventListener("blur", validatePasswordMatch);

function validatePasswordFormat() {
  const password = passwordInput.value;
  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  if (!passwordPattern.test(password)) {
    showPasswordMismatchMessage("Password format is invalid.");
  } else {
    hidePasswordMismatchMessage();
  }
}

function validatePasswordMatch() {
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (password !== confirmPassword) {
    // 使用弹窗提示密码不匹配
    window.alert("Passwords do not match.");
    registerForm.onsubmit = function (event) {
      event.preventDefault(); // 阻止表单提交
    };
  } else {
    hidePasswordMismatchMessage();
    registerForm.onsubmit = null; // 允许表单提交
  }
}

function showPasswordMismatchMessage(message) {
  passwordMismatchMessage.textContent = message; // 使用textContent设置<textarea>的内容
  passwordMismatchMessage.classList.remove("hidden");
}

function hidePasswordMismatchMessage() {
  passwordMismatchMessage.textContent = ""; // 清空<textarea>的内容
  passwordMismatchMessage.classList.add("hidden");
}