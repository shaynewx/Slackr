import http from "./request.js";
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

// 登出
document
  .getElementById("signout-button")
  .addEventListener("click", function () {
    console.log("Logout button clicked");
    http
      .post("auth/logout", {}, true)
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.hash = "#/home";
      })
      .catch((msg) => {
        alert(msg);
      });
  });

// 连接到后端创建频道
function sendNewChannelData(newChannelData) {
  http
    .post("/channel", newChannelData, true)
    .then((res) => {
      console.log("返回response", res);
      console.log("Channel created successfully");
    })
    .catch((msg) => {
      console.log("Failed to create channel");
      alert(msg);
    });
}

// 添加频道
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector(".modal");
  const addChannelButton = document.getElementById("add-channel-button");
  const publicChannelList = document.getElementById("public-channel-list");
  const privateChannelList = document.getElementById("private-channel-list");
  const closeModalButton = document.getElementById("create-channel-close");

  // 显示模态窗口
  const showModal = () => {
    modal.style.display = "block";
  };

  // 隐藏模态窗口
  const hideModal = () => {
    modal.style.display = "none";
  };

  addChannelButton.addEventListener("click", showModal);

  const channelLists = [publicChannelList, privateChannelList];

  channelLists.forEach((list) => {
    list.addEventListener("click", (event) => {
      if (event.target.classList.contains("add-join-button")) {
        showModal();
      }
    });
  });

  closeModalButton.addEventListener("click", hideModal);

  // 点击submit按钮，创建频道
  const name = document.getElementById("new-channel-name").value;
  const description = document.getElementById("new-channel-description").value;
  let isPrivate = false; // 默认为public
  const selectElement = document.getElementById("channel-type");
  // 为<select>元素添加change事件监听器
  selectElement.addEventListener("change", function (event) {
    if (event.target.value === "private") {
      isPrivate = true;
    } else if (event.target.value === "public") {
      isPrivate = false;
    }
  });


  const submitButton = document.getElementById("create-channel-submit");
  submitButton.addEventListener("click", () => {
    console.log("Creating channel");
    //TODO: 封装数据，发送geit请求给服务器
    const newChannelData = { name, isPrivate, description };
    sendNewChannelData(newChannelData);
    // TODO:创建频道之后，是否需要再次获取频道列表？
    // getChannelList();
  });
});




// 生成频道列表
// 第一个参数是channellist，第二个参数是channelId
// 如果不传入channelId，默认显示第一个频道
function generateChannelList(channelList, channelId) {
  const publicChannelListDom = document.getElementById("public-channel-list");
  const privateChannelListDom = document.getElementById("private-channel-list");
  const channelUserNameDom = document.getElementById("channel-username");
  // 获取用户信息
  const userInfo = user.getUserInfo();
  console.log("userInfo", userInfo);
  //userId是字符串
  const userId = Number(localStorage.getItem("userId"));
  console.log("userId", userId);
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
  const unjoinedChannels = channelList.filter(
    (channel) => !channel.members.includes(userId)
  );
  console.log("joinedChannels", joinedChannels);
  console.log("unjoinedChannels", unjoinedChannels);

  //创建频道列表
  const createChannelElement = (channel, joinBtn = false) => {
    // 创建频道列表的DOM
    // 创建一个li元素
    const channelElementDom = document.createElement("li");
    channelElementDom.id = `channel_${channel.id}`;
    channelElementDom.className = "channel-content";

    //在li标签中添加span标签，显示频道名称
    const channelTitle = document.createElement("span");
    channelTitle.className = "channel-title";
    channelElementDom.textContent = `# ${channel.name}`;
    channelElementDom.appendChild(channelTitle);

    if (joinBtn) {
      const joinButton = document.createElement("button");
      joinButton.className = "join-button";
      joinButton.textContent = "Join";
      joinButton.addEventListener("click", () => {
        console.log(`Joining channel: ${channel.name}`);
        // TODO: 添加其他加入频道的逻辑
      });

      // 在li标签中添加button标签，显示加入按钮
      channelElementDom.appendChild(joinButton);
    }

    if (channel.private === true) {
      privateChannelListDom.appendChild(channelElementDom);
    } else {
      publicChannelListDom.appendChild(channelElementDom);
    }
  };

  joinedChannels.forEach((channel) => {
    createChannelElement(channel);
  });

  unjoinedChannels.forEach((channel) => {
    createChannelElement(channel, true);
  });

  //TODO:获取频道列表后再获取频道信息
}

// 获取频道列表
export function getChannelList() {
  http.get("/channel").then((res) => {
    console.log("channels", res.channels);
    //渲染频道列表
    generateChannelList(res.channels);
  });
}
