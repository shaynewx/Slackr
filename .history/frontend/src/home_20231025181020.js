import { getChannelList } from "./channel.js";

function showHomePage() {
  console.log("这是首页");
  document.querySelector(".page.home").style.display = "block";
  document.querySelector(".page.register").style.display = "none";
  document.querySelector(".page.channels").style.display = "none";
  document.querySelector(".page.myprofile").style.display = "none";
  document.querySelector(".page.signin").style.display = "none";
}

function showLoginPage() {
  console.log("这是注册页面");
  document.querySelector(".page.home").style.display = "none";
  document.querySelector(".page.register").style.display = "block";
  document.querySelector(".page.channels").style.display = "none";
  document.querySelector(".page.myprofile").style.display = "none";
  document.querySelector(".page.signin").style.display = "none";
}

function showChannelsPage() {
  console.log("这是频道页面");
  document.querySelector(".page.home").style.display = "none";
  document.querySelector(".page.register").style.display = "none";
  document.querySelector(".page.channels").style.display = "block";
  document.querySelector(".page.myprofile").style.display = "none";
  document.querySelector(".page.signin").style.display = "none";
}

function showMyprofilePage() {
  console.log("这是我的页面");
  document.querySelector(".page.home").style.display = "none";
  document.querySelector(".page.register").style.display = "none";
  document.querySelector(".page.channels").style.display = "none";
  document.querySelector(".page.myprofile").style.display = "block";
  document.querySelector(".page.signin").style.display = "none";
}

function showSigninPage() {
  console.log("这是登录页面");
  document.querySelector(".page.home").style.display = "none";
  document.querySelector(".page.register").style.display = "none";
  document.querySelector(".page.channels").style.display = "none";
  document.querySelector(".page.myprofile").style.display = "none";
  document.querySelector(".page.signin").style.display = "block";
}


function isLogin () {
  return localStorage.getItem("token")!==null;

}

function listenRouteChange() {
   const login = isLogin();
   if(!login && window.location.hash !== "#/signin") {
      window.location.hash = "#/signin";
      showSigninPage();
    }

  //  if (login && window.location.hash === "#/channels") {
  //   getChannelList();
  //   }

  const hash = window.location.hash;
  switch (hash) {
    case "#/register":
      showLoginPage();
      break;
    case "#/channels":
      showChannelsPage();
      break;
    case "#/myprofile":
      showMyprofilePage();
      break;
    case "#/signin":
      showSigninPage();
      break;

    default:
      showHomePage();
      break;
  }
}

// 监听hash的变化
window.onload = listenRouteChange;
window.onhashchange = listenRouteChange;


