import  http  from "./request.js";
// 设置频道的展开与否
const toggleButtons = document.querySelectorAll(".toggle");
const lists = document.querySelectorAll(".lists");

toggleButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (
      lists[index].style.display === "none" ||
      lists[index].style.display === ""
    ) {
      lists[index].style.display = "block";
      button.textContent = "▼";
    } else {
      lists[index].style.display = "none";
      button.textContent = "▶";
    }
  });

  // 默认展开
  lists[index].style.display = "block";
  button.textContent = "▼";
});

// 添加频道
const channelContentItems = document.querySelectorAll(".channel-content");
const channelInformation = document.querySelector(".channel-information");

channelContentItems.forEach((contentItem) => {
  contentItem.addEventListener("click", () => {
    // 获取点击的频道的内容
    const channelContent = contentItem.textContent;
    channelInformation.textContent = channelContent; // 将内容设置到频道信息区域
  });
});

// 登出
document.getElementById("signout-button").addEventListener("click", function () {
  console.log("Logout button clicked");
  http.post('auth/logout', {}, true)
  .then(() => {
    localStorage.removeItem("token");
    window.location.hash = "#/home";
  })
  .catch((msg) => {
    alert(msg);
  });
});


// 生成频道列表
function generateChannelList(channelList, channelId){
  console.log("channelList",channelList, channelId);

}

// 获取频道列表
export function getChannelList() {
  generateChannelList(res.channels);
  http.get("/channel").then((res) => {
    //渲染频道列表
    console.log("res",res.channels);
  });
}

if (window.location.hash === "#/channels" && localStorage.getItem("token")) {
console.log("channel 界面正常加载")}