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


// 获取消息
function showChannelMessage(channelId, start = 0) {
  console.log("get message");
  const messageListDom = document.getElementById("main-box");
  user.clearNode(messageListDom);
  http.get(`/message/${channelId}?start=${start}`).then((res) => {
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
    });
  };





// 发送消息(监听发送按钮，获取输入框内容，发送消息)
// 
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
  if (messageContent === null || !messageContent.trim()) {
    console.log("message is null");
    showErrorMessage("Message can not be empty");
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


// 监听所有对消息框右键的事件
// 获取所有类名为 'message-body' 的 div 元素
const messageBodies = document.querySelectorAll('.message-body');
const customContextMenu = document.getElementById('customContextMenu');



// 对每个 div 元素添加一个右击事件监听器
messageBodies.forEach(div => {
    div.addEventListener('contextmenu', function(event) {
        event.preventDefault(); // 阻止默认的右键菜单

        // 这里编写你想在右击时执行的代码
        messageBodies.forEach(div => {
          div.addEventListener('contextmenu', function(event) {
              event.preventDefault();
      
              customContextMenu.style.top = event.clientY + 'px';
              customContextMenu.style.left = event.clientX + 'px';
              customContextMenu.style.display = 'block';
      
              const actionElements = customContextMenu.querySelectorAll('.context-menu-option');
              actionElements.forEach(element => {
                  element.addEventListener('click', function() {
                      const action = this.getAttribute('data-action');
                      handleAction(action);
                      customContextMenu.style.display = 'none';
                  });
              });
          });
      });
      
      document.addEventListener('click', function(event) {
          if (!event.target.closest('#customContextMenu') && !event.target.closest('.message-body')) {
              customContextMenu.style.display = 'none';
          }
      });

      
        




    });
});







const messageFunction = {
  showChannelMessage,
}

export default messageFunction;