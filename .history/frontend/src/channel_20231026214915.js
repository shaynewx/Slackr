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
        localStorage.removeItem("userInfo");
        localStorage.removeItem("channelsInformation");
        localStorage.removeItem("channelInfo");
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
  const modal = document.getElementById("modal1");
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

  // 创建频道元素
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







 // 展示频道详情信息
  function showChannelDetails(channelInfo,channelId,stat) {
    console.log("showChannelDetails is called with channel:", channelInfo);

    const mainBox = document.getElementById('main-box');
    user.clearNode(mainBox);

    const channelDetails = document.createElement('div');
    channelDetails.className = 'channel-details';
    
    // Name
    const namePara = document.createElement('p');
    namePara.textContent = `Name: ${channelInfo.name}`;
    channelDetails.appendChild(namePara);
    // Description
    const descriptionPara = document.createElement('p');
    descriptionPara.textContent = `Description: ${channelInfo.description}`;
    channelDetails.appendChild(descriptionPara);

    // Private
    const privatePara = document.createElement('p');
    // privatePara.textContent = `Private: ${channel.private}`;
    privatePara.textContent = channelInfo ? "Type: Private Channel" : "Type: Public Channel";
    channelDetails.appendChild(privatePara);

    // Create Time
    // 解析ISO格式的字符串为Date对象
    const dateObj = new Date(channelInfo.createdAt);

    // 使用Date对象的方法来获取日期的各个部分
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObj);

    const createTimePara = document.createElement('p');
    createTimePara.textContent = `Create Time: ${formattedDate}`;
    channelDetails.appendChild(createTimePara);

    // Creator
    const creatorPara = document.createElement('p');
    creatorPara.textContent = `Creator: ${channelInfo.creator}`;
    channelDetails.appendChild(creatorPara);

    mainBox.appendChild(channelDetails);


  // 如果用户是这个频道的成员
  if (stat === true) {
    // 添加编辑功能
    const editButton = document.createElement('button');
    editButton.textContent = "Edit";
    editButton.id = "channel-edit-button";
    
    const modal = document.getElementById("modal2");
    const closeModalButton2 = document.getElementById("edit-channel-close");
    const editChannelButton = document.getElementById("edit-channel-submit");

    // 显示模态窗口
    const showModal = () => {
        modal.style.display = "block";
    };

    // 隐藏模态窗口
    const hideModal = () => {
        modal.style.display = "none";
    };

    editButton.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        showModal();
    });

    closeModalButton2.addEventListener("click", hideModal);

    editChannelButton.addEventListener("click", function() {
        const inputName = document.getElementById("edit-channel-name").value;
        const inputDescription = document.getElementById("edit-channel-description").value;

        http.put(`/channel/${channelId}`, {
            name: inputName, 
            description: inputDescription
        }).then(res => {
          console.log("Successfully update!");
          //TODO:刷新页面
          location.reload();
          hideModal()
          //
        }).catch(error => {
            console.log("Error:", error);
        });

        hideModal();
    });

    const closeButton = document.createElement('button');
    closeButton.textContent = "Close";
    closeButton.addEventListener('click', function() {
        user.clearNode(mainBox);
    });

    mainBox.appendChild(editButton);
    mainBox.appendChild(closeButton);
  }

  
  }










  function createChannelHearder(channel, stat = false) {
    //TODO:生成channel information header
    // 写一个监听事件，当点击li标签时，找到这个channel的channel.id，然后发送get请求，获取频道信息并储存
    const channelId = channel.id;
    const channelElementDom = document.getElementById(`channel_${channel.id}`);
    channelElementDom.addEventListener("click", () => {
      http.get(`/channel/${channelId}`).then((channelInfo) => {
        console.log("channelInfo", channelInfo);
        localStorage.setItem("channelInfo", JSON.stringify(channelInfo));
      });

      const storedChannelInfo = localStorage.getItem("channelInfo");

      // Ensure that the stored data is not null before parsing
      const channelInfo = storedChannelInfo ? JSON.parse(storedChannelInfo) : null;
      console.log("storedChannelInfo", channelInfo);

      // 生成频道信息，即在id为channel-information-header的div中添加频道信息
      const channelHeaderContainer = document.getElementById("channel-information-header");
      user.clearNode(channelHeaderContainer);
      // 首先生成一个div存放channel name，再生成一个div存放四个button，包括频道详情、人员列表、搜索、邀请
      const channelNameDiv = document.createElement("div");
      channelNameDiv.className = "single-channel-name";
      channelNameDiv.id = `channel_${channel.id}`;
      channelNameDiv.textContent = `# ${channel.name}`;
      channelHeaderContainer.appendChild(channelNameDiv);
      //再生成一个div存放四个button
      const buttonsDiv = document.createElement("div");
      buttonsDiv.className = "channel-buttons";
      //TODO:补全四个button对应的函数
      const buttonsInfo = [
          { text: "Details", className: "channel-detail-button", action: showChannelDetails },
          { text: "Members", className: "channel-users-button" },
          { text: "Search", className: "channel-search-button" },
          { text: "Invite", className: "channel-invite-button" }
      ];
  
      buttonsInfo.forEach(btnInfo => {
          const button = document.createElement("button");
          button.className = btnInfo.className;
          button.id = `channel-${btnInfo.className}`;
          button.textContent = btnInfo.text;
          if (btnInfo.action) {
              button.addEventListener('click', function() {
                  btnInfo.action(channelInfo,channelId, stat);
              });
          }
          buttonsDiv.appendChild(button);
      });
      const actionButton = document.createElement("button");
      // 第五个按钮根据是否在该频道中显示不同的内容
      if (stat===true) { 
          actionButton.textContent = "退出频道";
          actionButton.className = "channel-leave-button";
          actionButton.addEventListener("click", function() {
            // TODO:这里是退出频道的逻辑
        });
      } else {
          actionButton.textContent = "加入频道";
          actionButton.className = "channel-join-button";
          actionButton.addEventListener("click", function() {
            // TODO:这里是加入频道的逻辑
            
        });
      }
      buttonsDiv.appendChild(actionButton);
  
      channelHeaderContainer.appendChild(buttonsDiv);

    });
  }

  joinedChannels.forEach((channel) => {
    // 生成已经加入的channel
    createChannelElement(channel);
    //生成channel information header
    createChannelHearder(channel, true);
  });

  unjoinedChannels.forEach((channel) => {
    // 生成没有加入的channel
    createChannelElement(channel, true);
    //生成channel information header
    createChannelHearder(channel);
  });
}



// 获取频道列表
export function getChannelList() {
  http.get("/channel").then((res) => {
    console.log("channels", res.channels);

    localStorage.setItem("channelsInformation", JSON.stringify(res.channels));

    // 从localStorage中读取数据并转换为JavaScript对象
    const channelsInformation = JSON.parse(
      localStorage.getItem("channelsInformation")
    );
    console.log("channelsInformation", channelsInformation);

    //生成频道列表
    generateChannelList(res.channels);
  });
}
