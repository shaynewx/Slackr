import { getChannelList } from "./channel.js";

function showHomePage() {
  console.log("HomePage");
  document.querySelector(".page.home").style.display = "block";
  document.querySelector(".page.register").style.display = "none";
  document.querySelector(".page.channels").style.display = "none";
  document.querySelector(".page.myprofile").style.display = "none";
  document.querySelector(".page.signin").style.display = "none";
}

function showLoginPage() {
  console.log("LoginPage");
  document.querySelector(".page.home").style.display = "none";
  document.querySelector(".page.register").style.display = "block";
  document.querySelector(".page.channels").style.display = "none";
  document.querySelector(".page.myprofile").style.display = "none";
  document.querySelector(".page.signin").style.display = "none";
}

function showChannelsPage() {
  console.log("ChannelsPage");
  document.querySelector(".page.home").style.display = "none";
  document.querySelector(".page.register").style.display = "none";
  document.querySelector(".page.channels").style.display = "block";
  document.querySelector(".page.myprofile").style.display = "none";
  document.querySelector(".page.signin").style.display = "none";
}

function showMyprofilePage() {
  console.log("MyprofilePage");
  document.querySelector(".page.home").style.display = "none";
  document.querySelector(".page.register").style.display = "none";
  document.querySelector(".page.channels").style.display = "none";
  document.querySelector(".page.myprofile").style.display = "block";
  document.querySelector(".page.signin").style.display = "none";
}

function showSigninPage() {
  console.log("SigninPage");
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
      window.location.hash = "#/home";
      showSigninPage();
    }

   if (login && window.location.hash === "#/channels") {
    getChannelList();
    }

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

// listen hash change and then
window.onload = listenRouteChange;
window.onhashchange = listenRouteChange;


