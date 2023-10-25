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



//
export function getChannelList() {
  http.get("/channel").then((res) => {
    console.log(res.channels);
    generateChannelList(res.channels);
    // 获取第一个频道的ID作为currentChannelId
    let currentChannelId = res.channels.length > 0 ? res.channels[0].id : null;

    generateChannelList(res.channels, currentChannelId);
  });
}