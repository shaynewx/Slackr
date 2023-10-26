import  http  from "./request.js";
import user from "./user.js";
// // 设置频道的展开与否
// const toggleButtons = document.querySelectorAll(".toggle");
// const lists = document.querySelectorAll(".lists");

// toggleButtons.forEach((button, index) => {
//   button.addEventListener("click", () => {
//     if (
//       lists[index].style.display === "none" ||
//       lists[index].style.display === ""
//     ) {
//       lists[index].style.display = "block";
//       button.textContent = "▼";
//     } else {
//       lists[index].style.display = "none";
//       button.textContent = "▶";
//     }
//   });

//   // 默认展开
//   lists[index].style.display = "block";
//   button.textContent = "▼";
// });

// // 添加频道
// const channelContentItems = document.querySelectorAll(".channel-content");
// const channelInformation = document.querySelector(".channel-information");

// channelContentItems.forEach((contentItem) => {
//   contentItem.addEventListener("click", () => {
//     // 获取点击的频道的内容
//     const channelContent = contentItem.textContent;
//     channelInformation.textContent = channelContent; // 将内容设置到频道信息区域
//   });
// });


// 登出
document.getElementById("signout-button").addEventListener("click", function () {
  console.log("Logout button clicked");
  http.post('auth/logout', {}, true)
  .then(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.hash = "#/home";
  })
  .catch((msg) => {
    alert(msg);
  });
});


// // 生成频道列表
// 第一个参数是channellist，第二个参数是channelId
// 如果不传入channelId，默认显示第一个频道
function generateChannelList(channelList,channelId) {
  const channelListDom = document.getElementById("channel-list");
  // 获取用户信息
  const userInfo = user.getUserInfo();
  console.log("userInfo",userInfo);
  //userId是字符串
  const userId = Number(localStorage.getItem("userId"));  
  console.log("userId",userId)
  // 清空节点
  user.clearNode(channelListDom);
  //TODO:这里的channel是什么
  const joinedChannels = channelList.filter((channel) => 
    channel.members.includes(userId)
  );
  const unjoinedChannels = channelList.filter((channel) =>
    !channel.members.includes(userId)
  );
  console.log("joinedChannels",joinedChannels);
  console.log("unjoinedChannels",unjoinedChannels);

  // 创建频道lie'bi'a
  


}

// 获取频道列表
export function getChannelList() {
  http.get("/channel")
  .then((res) => {
    console.log("channels",res.channels);
    //渲染频道列表
    generateChannelList(res.channels);
  });
}

