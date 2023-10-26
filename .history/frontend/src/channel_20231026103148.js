import  http  from "./request.js";
import user from "./user.js";
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
  const publicChannelListDom = document.getElementById("public-channel-list");
  const privateChannelListDom = document.getElementById("private-channel-list");
  const channelUserNameDom = document.getElementById("channel-username");
  // 获取用户信息
  const userInfo = user.getUserInfo();
  console.log("userInfo",userInfo);
  //userId是字符串
  const userId = Number(localStorage.getItem("userId"));  
  console.log("userId",userId)
  // 清空节点
  user.clearNode(publicChannelListDom);
  user.clearNode(privateChannelListDom);

  // 修改用户姓名
  user.clearNode(channelUserNameDom);
  const textNode = document.createTextNode(userInfo.username);
  channelUserNameDom.appendChild(textNode);

  // 已加入和未加入的列表
  const joinedChannels = channelList.filter((channel) => 
    channel.members.includes(userId)
  );
  const unjoinedChannels = channelList.filter((channel) =>
    !channel.members.includes(userId)
  );
  console.log("joinedChannels",joinedChannels);
  console.log("unjoinedChannels",unjoinedChannels);

  // 创建频道列表
  const createChannelElement = (channel, joinBtn = false) => {
    const channelElementDom = document.createElement("li");
    channelElementDom.className = "channel-content";
    channelElementDom.textContent = channel.name;
    channelElementDom
  }




  joinedChannels.forEach((channel) => {
    createChannelElement(channel, active);
  });

  unjoinedChannels.forEach((channel) => {
    createChannelElement(channel, active, true);
  });


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

