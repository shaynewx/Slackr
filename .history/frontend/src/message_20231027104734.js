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
      console.log("There is No message ");
      const emptyMessageDom = document.createElement("div");
      emptyMessageDom.className = "empty-message";
      emptyMessageDom.textContent = "There is No message";
      messageListDom.appendChild(emptyMessageDom);
    } else
    // TODO:渲染消息
    const userId = Number(localStorage.getItem("userId"));
    console.log(userId);

    const { messages } = res;
    messages.forEach(item => {
      // 发送人
      const messageContainerDom = document.createElement("div");
      messageContainerDom.className = item.sender === userId ? "message-container mine" : "message-container";

      // 头像
      const logoDom = document.createElement("div");
      logoDom.className = "message-logo";
      logoDom.textContent = item.sender;

      // 消息框
      const messageDom = document.createElement("div");
      messageDom.className = "message";

      // 消息内容
      const messageContentDom = document.createElement("div");
      messageContentDom.className = "message-content-text";
      messageContentDom.textContent = item.message;

      // 消息时间
      const messageTimeDom = document.createElement("div");
      messageTimeDom.className = "message-time";
      // messageTimeDom.textContent = item.sentAt;
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







// TODO:发送消息
function sendMessage(channelId, content) {
  http.post(`/message/${channelId}`, {
    content,
  });
}

// TODO:删除消息
function deleteMessage(channelId, messageId) {
  http.delete(`/message/${channelId}/${messageId}`);
}



const messageFunction = {
  showChannelMessage

}

export default messageFunction;