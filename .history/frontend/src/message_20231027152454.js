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

      function handleAction(action) {
    switch(action) {
        case 'edit':
            console.log('编辑消息');
            break;
        case 'delete':
            console.log('删除消息');
            break;
        case 'emoji':
            console.log('Emoji');
            break;
        case 'pin':
            console.log('固定消息');
            break;
    }
}
此代码示例为你提供了一个基本的上下文菜单实现。你可以根据你的具体需求进行调整和扩展。




User
请帮我逐行解释代码
ChatGPT
当然可以，让我们从头开始逐行解释代码。

HTML部分
html
Copy code
<div id="customContextMenu" class="context-menu">
    <div class="context-menu-option" data-action="edit">编辑消息</div>
    <div class="context-menu-option" data-action="delete">删除消息</div>
    <div class="context-menu-option" data-action="emoji">Emoji</div>
    <div class="context-menu-option" data-action="pin">固定消息</div>
</div>
这是自定义上下文菜单的HTML结构。

顶层的<div>有一个ID为customContextMenu，这让我们可以在JavaScript中轻松地引用它。
下面的每个子<div>代表菜单的一个选项，它们都有一个context-menu-option类，并使用data-action属性来指定每个选项的功能。
CSS部分
css
Copy code
.context-menu {
    display: none;            /* 初始时隐藏菜单 */
    position: absolute;       /* 使用绝对定位，以便在用户右击时动态定位菜单 */
    background-color: #fff;  /* 菜单背景色为白色 */
    border: 1px solid #ccc;  /* 菜单边框 */
    z-index: 1000;            /* 保证菜单显示在其他内容的顶部 */
    box-shadow: 3px 3px 5px rgba(0,0,0,0.2);  /* 给菜单添加轻微的阴影效果 */
}
.context-menu-option {
    padding: 8px 12px;        /* 菜单选项的内边距 */
    cursor: pointer;         /* 当鼠标悬停在菜单选项上时显示为指针 */
}
.context-menu-option:hover {
    background-color: #eee;  /* 当鼠标悬停在菜单选项上时，选项背景色变为浅灰色 */
}
这部分为自定义上下文菜单和其选项设置了样式。

JavaScript部分
javascript
Copy code
const messageBodies = document.querySelectorAll('.message-body');
选择所有类名为message-body的元素。

javascript
Copy code
const customContextMenu = document.getElementById('customContextMenu');
选择ID为customContextMenu的元素，即我们的自定义上下文菜单。

javascript
Copy code
messageBodies.forEach(div => {
    div.addEventListener('contextmenu', function(event) {
为每个message-body元素添加右键事件监听器。

javascript
Copy code
        event.preventDefault();
阻止浏览器的默认右键菜单出现。

javascript
Copy code
        customContextMenu.style.top = event.clientY + 'px';
        customContextMenu.style.left = event.clientX + 'px';
        customContextMenu.style.display = 'block';
设置自定义菜单的位置并显示它。

javascript
Copy code
        const actionElements = customContextMenu.querySelectorAll('.context-menu-option');
选择自定义菜单中的所有选项。

javascript
Copy code
        actionElements.forEach(element => {
            element.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
为每个菜单选项添加点击事件监听器，并从data-action属性中获取要执行的操作。

javascript
Copy code
                handleAction(action);
                customContextMenu.style.display = 'none';
调用handleAction函数来处理菜单选项的功能，并隐藏菜单。

javascript
Copy code
            });
        });
    });
});
结束右键事件和菜单选项点击事件的回调函数。

javascript
Copy code
document.addEventListener('click', function(event) {
为整个文档添加点击事件监听器，以便当用户点击其他地方时隐藏自定义菜单。

javascript
Copy code
    if (!event.target.closest('#customContextMenu') && !event.target.closest('.message-body')) {
        customContextMenu.style


        




    });
});







const messageFunction = {
  showChannelMessage,
}

export default messageFunction;