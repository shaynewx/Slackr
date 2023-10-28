import http from "./request.js";
import user from "./user.js";

// format time
function formatTime(isoString) {
  const date = new Date(isoString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${month}/${day} ${hours}:${minutes}:${seconds}`;
}

let currentChannelId;
let currentMessageId;

// right click on the message, options will appear
function addContextMenuListeners() {
  const messageBodies = document.querySelectorAll(".message-body");
  const contextMenu = document.getElementById("contextMenu");

  messageBodies.forEach(function (message) {
    message.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      currentMessageId = e.currentTarget.getAttribute("data-id");
      contextMenu.style.top = e.pageY + "px";
      contextMenu.style.left = e.pageX + "px";
      contextMenu.style.display = "block";
    });
  });

  document.addEventListener("click", function (e) {
    if (e.target.closest(".message-body") === null) {
      contextMenu.style.display = "none";
    }
  });

  contextMenu.addEventListener("click", function (e) {
    e.stopPropagation();
  });
}

// show message 
function showChannelMessage(channelId, start = 0) {
  console.log("get message");
  const messageListDom = document.getElementById("main-box");
  user.clearNode(messageListDom);
  http.get(`/message/${channelId}?start=${start}`).then((res) => {
    console.log(res);
    if (!res.messages || res.messages.length === 0) {
      console.log("There is No message in this channel ");
      const emptyMessageDom = document.createElement("div");
      emptyMessageDom.className = "empty-message";
      emptyMessageDom.textContent = "There is No message in this channel";
      messageListDom.appendChild(emptyMessageDom);
    }
    // render message
    const userId = Number(localStorage.getItem("userId"));
    console.log(userId);
    const { messages } = res;
    messages.forEach((item) => {
      // Sender
      const messageContainerDom = document.createElement("div");
      messageContainerDom.className =
        item.sender === userId ? "message-container mine" : "message-container";

      // Profile photo
      const photoDom = document.createElement("div");
      photoDom.className = "profile-photo";
      photoDom.textContent = item.image;

      // Name
      const logoDom = document.createElement("div");
      logoDom.className = "message-logo";
      logoDom.textContent = item.sender;

      // message body
      const messageDom = document.createElement("div");
      messageDom.className = "message-body";
      messageDom.setAttribute("data-id", item.id);

      // message content
      const messageContentDom = document.createElement("div");
      messageContentDom.className = "message-content-text";
      messageContentDom.textContent = item.message;

      // message time
      const messageTimeDom = document.createElement("div");
      messageTimeDom.className = "message-time";
      messageTimeDom.textContent = formatTime(item.sentAt);

      // edit message
      if (item.edited) {
        // edited label
        const editedDom = document.createElement("div");
        editedDom.className = "message-edited";
        editedDom.textContent = "Edited";

        // 添加编辑时间
        const editedAtDom = document.createElement("div");
        editedAtDom.className = "message-edited-at";
        editedAtDom.textContent = formatTime(item.editedAt);

        // 将"已编辑"标签和编辑时间追加到消息内容后
        messageDom.appendChild(editedDom);
        messageDom.appendChild(editedAtDom);
      }
      //TODO:消息是否被反应
      if (item.reacts && item.reacts.length > 0) {
        // 添加反应
        // 添加反应容器
        const reactionsContainerDom = document.createElement("div");
        reactionsContainerDom.className = "message-reactions-container";

        // 遍历每个反应，并添加到容器中
        item.reacts.forEach((reactObj) => {
          // 反应符号
          const reactionDom = document.createElement("span");
          reactionDom.className = "message-reaction";
          reactionDom.textContent =
            reactObj.react + " " + (reactObj.count || 1);
          reactionsContainerDom.appendChild(reactionDom);
        });
        messageDom.appendChild(reactionsContainerDom);
      }

      // 消息是否被固定
      if (item.pinned) {
        // 添加固定标签
        const pinnedDom = document.createElement("div");
        pinnedDom.className = "message-pinned";
        pinnedDom.textContent = "Pinned";
        messageDom.appendChild(pinnedDom);
      }

      messageDom.appendChild(messageContentDom);
      messageContainerDom.appendChild(photoDom);
      messageContainerDom.appendChild(logoDom);
      messageContainerDom.appendChild(messageDom);
      messageContainerDom.appendChild(messageTimeDom);
      if (messageListDom.children.length) {
        messageListDom.insertBefore(
          messageContainerDom,
          messageListDom.children[0]
        );
      } else {
        messageListDom.appendChild(messageContainerDom);
      }
    });
    // 滚动条置底
    messageListDom.scrollTop = messageListDom.scrollHeight;
    // 在所有消息都被添加到页面后，调用此函数为它们添加事件监听器
    addContextMenuListeners();
  });
}

// 发送消息
const sendMessageButton = document.getElementById("send-message-button");
const messageInput = document.getElementById("input-message-box");
const errorDom = document.getElementById("send-message-empty-error");

function showErrorMessage(message) {
  errorDom.textContent = message;
  errorDom.classList.remove("hidden");
}

function hideErrorMessage() {
  errorDom.textContent = "";
  errorDom.classList.add("hidden");
}

// 监听input
messageInput.addEventListener("click", function () {
  hideErrorMessage();
});

// 监听发送按钮，获取输入框内容，发送消息
sendMessageButton.addEventListener("click", () => {
  // 先查看messageInput是否为空
  const messageContent = messageInput.value;
  //input没有被编辑时，发送按钮不可用
  if (!messageContent.trim() || messageContent === messageInput.defaultValue) {
    console.log("message is null");
    showErrorMessage("Message can not be empty");
    return;
  }

  // 发送消息
  const channelId = localStorage.getItem("Current channelId");
  currentChannelId = channelId;
  console.log("currentChannelId", currentChannelId);
  http
    .post(
      `/message/${channelId}`,
      {
        message: messageContent,
      },
      true
    )
    .then((res) => {
      console.log(res);
      hideErrorMessage();
      messageInput.value = "";
      showChannelMessage(channelId);
    });
});

// 监听右键消息菜单
document.addEventListener("DOMContentLoaded", function () {
  const contextOptions = document.querySelectorAll(".context-option");
  const reactionMenu = document.getElementById("reactionMenu");

  const modal = document.getElementById("modal3");
  const editMessageSubmit = document.getElementById("edit-new-message-submit");
  const editMessageInput = document.getElementById("edit-new-message-input");
  const closeEditMessage = document.getElementById("edit-new-message-close");

  // show modal window
  const showModal = () => {
    modal.style.display = "block";
  };
  // hide modal window
  const hideModal = () => {
    modal.style.display = "none";
  };

  // 监听关闭按钮的点击事件
  closeEditMessage.addEventListener("click", () => {
    hideModal();
  });

  const showReactionMenu = (x, y) => {
    reactionMenu.style.top = y + "px";
    reactionMenu.style.left = x + "px";
    reactionMenu.style.display = "block";
  };

  // 为"React"选项添加事件监听器
  // 注意：这里我们移到了外部，以确保监听器在页面加载时就被添加
  document
    .querySelector(".context-option.react")
    .addEventListener("click", function (e) {
      // 停止事件冒泡，防止其他可能的事件处理程序干扰
      e.stopPropagation();
      const contextMenu = document.getElementById("contextMenu");
      contextMenu.style.display = "none"; // 隐藏右键菜单

      showReactionMenu(e.pageX, e.pageY);
    });

  // 为每个表情符号添加点击事件监听器
  reactionMenu.querySelectorAll(".emoji").forEach((emoji) => {
    emoji.addEventListener("click", function () {
      const reaction = this.getAttribute("data-emoji");
      console.log(
        `User reacted with ${reaction} to message ${currentMessageId}`
      );
      // TODO: 根据需要保存或显示反应
      http
        .post(
          `/message/react/${currentChannelId}/${currentMessageId}`,
          { react: reaction },
          true
        )
        .then((res) => {
          console.log(res);
          showChannelMessage(currentChannelId);
        });
      reactionMenu.style.display = "none";
    });
  });

  contextOptions.forEach((option) => {
    option.addEventListener("click", function (e) {
      e.stopPropagation();
      currentChannelId = localStorage.getItem("Current channelId");
      if (this.classList.contains("delete")) {
        // 执行删除消息的操作
        console.log("Delete the message");
        // currentChannelId = localStorage.getItem("Current channelId");
        console.log(currentChannelId, currentMessageId);
        http
          .deleteReq(`/message/${currentChannelId}/${currentMessageId}`, true)
          .then((res) => {
            // 渲染消息
            showChannelMessage(currentChannelId);
          });
      } else if (this.classList.contains("edit")) {
        // 执行编辑消息的操作
        console.log("Edit the message");
        showModal();
        // 监听编辑消息的提交按钮（需要先监听input是否为空，以及是否与当前的消息内容一致）
        editMessageSubmit.addEventListener("click", () => {
          const newMessageContent = editMessageInput.value;
          const currentMessageContent = document.querySelector(
            `[data-id="${currentMessageId}"]`
          ).textContent;
          //input没有被编辑时，发送按钮不可用
          if (!newMessageContent.trim()) {
            console.log("message is null");
            alert("Message can not be empty.");
            return;
            // 消息内容与当前消息内容一致时的处理
          } else if (newMessageContent === currentMessageContent) {
            console.log("message repeat");
            alert("Message content unchanged.");
            return;
          }
          // 发送请求，并且关闭modal，渲染新消息，新消息指明已经被编辑，以及时间戳
          http
            .put(
              `/message/${currentChannelId}/${currentMessageId}`,
              {
                message: newMessageContent,
              },
              true
            )
            .then((res) => {
              console.log(res);
              hideModal();
              showChannelMessage(currentChannelId);
            });
        });
      } else if (this.classList.contains("pin")) {
        // TODO:执行固定消息的操作
        console.log("Pin the message");
      } else if (this.classList.contains("unpin")) {
        //TODO:执行取消消息的操作
        console.log("Unpin the message");
      }
    });
  });
});

const messageFunction = {
  showChannelMessage,
};

export default messageFunction;
