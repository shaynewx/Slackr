import { getChannelList } from "./channel.js";

function showHomePage() {
  document.querySelector(".page.home").style.display = "block";
  document.querySelector(".page.register").style.display = "none";
  document.querySelector(".page.channels").style.display = "none";
  document.querySelector(".page.myprofile").style.display = "none";
  document.querySelector(".page.signin").style.display = "none";
}

function showLoginPage() {
  document.querySelector(".page.home").style.display = "none";
  document.querySelector(".page.register").style.display = "block";
  document.querySelector(".page.channels").style.display = "none";
  document.querySelector(".page.myprofile").style.display = "none";
  document.querySelector(".page.signin").style.display = "none";
}

function showChannelsPage() {
  document.querySelector(".page.home").style.display = "none";
  document.querySelector(".page.register").style.display = "none";
  document.querySelector(".page.channels").style.display = "block";
  document.querySelector(".page.myprofile").style.display = "none";
  document.querySelector(".page.signin").style.display = "none";
}

function showMyprofilePage() {
  document.querySelector(".page.home").style.display = "none";
  document.querySelector(".page.register").style.display = "none";
  document.querySelector(".page.channels").style.display = "none";
  document.querySelector(".page.myprofile").style.display = "block";
  document.querySelector(".page.signin").style.display = "none";
}

function showSigninPage() {
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
   if(login===false && window.location.hash !== "#/signin") {
      window.location.hash = "#/home";
      showSigninPage();
    }

   if (login && window.location.hash === "#/channels") {
    getChannelList();
    initializePersonalInfoButtonListener();
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

// listen to hash change
window.onload = listenRouteChange;
window.onhashchange = listenRouteChange;