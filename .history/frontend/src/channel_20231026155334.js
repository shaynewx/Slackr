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
  console.log("newChannelData", newChannelData);
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

// 添加频道（监听modal）
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
  const inputName = document.getElementById("new-channel-name");
  const inputDescription = document.getElementById("new-channel-description");
  let name = "";
  let description = "";
  inputName.addEventListener("input", function () {
    name = inputName.value;
  });
  inputDescription.addEventListener("input", function () {
    description = inputDescription.value;
  });

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
    //封装数据，发送get请求给服务器
    const newChannelData = {
      name: name,
      private: isPrivate,
      description: description,
    };
    sendNewChannelData(newChannelData);
    // 再次获取频道列表
    getChannelList();
    hideModal();
  });


    });
  // });
// });

// 生成频道列表
function generateChannelList(channelList) {
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

    // 在li标签中添加SVG图片，点击时可以查看频道消息
    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElement.setAttributeNS(null, "width", "16");
    svgElement.setAttributeNS(null, "height", "16");
    svgElement.setAttributeNS(null, "fill", "currentColor");
    svgElement.setAttributeNS(null, "viewBox", "0 0 16 16");
    svgElement.classList.add("bi", "bi-info-circle");

    // 添加类
    svgElement.classList.add("channel-info-icon");
    // 添加ID
    svgElement.id = `info_${channel.id}`;

    const path1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path1.setAttributeNS(
      null,
      "d",
      "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
    );
    svgElement.appendChild(path1);

    const path2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path2.setAttributeNS(
      null,
      "d",
      "m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
    );
    svgElement.appendChild(path2);

    channelElementDom.appendChild(svgElement);

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
