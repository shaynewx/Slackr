import http from "./request.js";
import user from "./user.js";

// format time
function formatTime(isoString) {
  const date = new Date(isoString);

  // 获取年、月、日、小时、分钟和秒
  const year = date.getFullYear().toString().substr(-2);  // 获取最后两位年份
  const month = (date.getMonth() + 1).toString().padStart(2, '0');  // 月份是从0开始的，所以加1
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${month}/${day} ${hours}:${minutes}:${seconds}`;
}






// TODO:监听点击消息框，如果点击出现选项
function addContextMenuListeners() {
  const messageBodies = document.querySelectorAll('.message-body');
  console.log(messageBodies);
  const contextMenu = document.getElementById('contextMenu');

  messageBodies.forEach(function(message) {
    message.addEventListener('contextmenu', function(e) {
      e.preventDefault(); // 阻止浏览器的默认操作

      // 设置菜单的位置为鼠标点击的位置
      contextMenu.style.top = e.pageY + 'px';
      contextMenu.style.left = e.pageX + 'px';
      contextMenu.style.display = 'block';
    });
  });

  // 点击页面的其他地方隐藏菜单
  document.addEventListener('click', function(e) {
    if (e.target.closest('.message-body') === null) { // 如果点击的不是 message-body
      contextMenu.style.display = 'none';
    }
  });

  // 阻止在菜单上点击时再次触发 click 事件
  contextMenu.addEventListener('click', function(e) {
    e.stopPropagation();
  });
}





// 获取消息
function showChannelMessage(channelId, start = 0) {
  console.log("get message");
  const messageListDom = document.getElementById("main-box");
  user.clearNode(messageListDom);
  http.get(`/message/${channelId}?start=${start}`)
  .then((res) => {
    console.log(res);
    if (!res.message || res.message.length === 0) {
      // console.log("There is No message ");
      // const emptyMessageDom = document.createElement("div");
      // emptyMessageDom.className = "empty-message";
      // emptyMessageDom.textContent = "There is No message";
      // messageListDom.appendChild(emptyMessageDom);
    } 
    // TODO:渲染消息
    const userId = Number(localStorage.getItem("userId"));
    console.log(userId);

    const { messages } = res;
    messages.forEach(item => {
      // 发送人
      const messageContainerDom = document.createElement("div");
      messageContainerDom.className = item.sender === userId ? "message-container mine" : "message-container";

      //头像
      const photoDom = document.createElement("div");
      photoDom.className = "profile-photo";
 
      // 用户姓名来填充（需要额外头像？）
      const logoDom = document.createElement("div");
      logoDom.className = "message-logo";
      logoDom.textContent = item.sender;

      // 消息框
      const messageDom = document.createElement("div");
      messageDom.className = "message-body";

      // 消息内容
      const messageContentDom = document.createElement("div");
      messageContentDom.className = "message-content-text";
      messageContentDom.textContent = item.message;

      // 消息时间
      const messageTimeDom = document.createElement("div");
      messageTimeDom.className = "message-time";
      messageTimeDom.textContent = formatTime(item.sentAt);

      messageDom.appendChild(messageContentDom);
      messageContainerDom.appendChild(logoDom);
      messageContainerDom.appendChild(messageDom);
      messageContainerDom.appendChild(messageTimeDom);
      if (messageListDom.children.length){
        messageListDom.insertBefore(messageContainerDom, messageListDom.children[0]);
       } else {
        messageListDom.appendChild(messageContainerDom);
      }
      });
      // TODO:滚动条置底
      messageListDom.scrollTop = messageListDom.scrollHeight;
      // 在所有消息都被添加到页面后，调用此函数为它们添加事件监听器
      addContextMenuListeners();

    });


  };





// 发送消息(监听发送按钮，获取输入框内容，发送消息)
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
messageInput.addEventListener('click', function() {
  hideErrorMessage();
});



// 监听发送按钮
sendMessageButton.addEventListener("click", () => {
  // 先查看messageInput是否为空
  const messageContent = messageInput.value;
  //TODO:input没有被编辑时，发送按钮不可用
  if (!messageContent.trim() || messageContent === messageInput.defaultValue) {
    console.log("message is null");
    showErrorMessage("Message can not be empty");
    return;
  }

  // 发送消息
  const channelId = localStorage.getItem("Current channelId");
  console.log("channelId", channelId);
  http.post(`/message/${channelId}`, {
    message: messageContent
  }, true)
  .then((res) => {
    console.log(res);
    hideErrorMessage();
    messageInput.value = "";
    showChannelMessage(channelId);
  });
});




// TODO:删除消息
function deleteMessage(channelId, messageId) {
  http.delete(`/message/${channelId}/${messageId}`);
}



document.addEventListener('DOMContentLoaded', function() {
  const contextOptions = document.querySelectorAll('.context-option');

  contextOptions.forEach(option => {
      option.addEventListener('click', function(e) {
          e.stopPropagation();

          if (this.classList.contains('delete')) {
              // TODO:执行删除消息的操作
              const messageId = messa
              deleteMessage(channelId, messageId)
              console.log("Delete the message");
          } else if (this.classList.contains('edit')) {
              // TODO:执行编辑消息的操作
              console.log("Edit the message");
          } else if (this.classList.contains('react')) {
              // TODO:执行对消息添加反应的操作
              console.log("React the this message");
          } else if (this.classList.contains('pin')) {
              // TODO:执行固定消息的操作
              console.log("Pin the message");
          }
      });
  });
});





const messageFunction = {
  showChannelMessage,
}

export default messageFunction;