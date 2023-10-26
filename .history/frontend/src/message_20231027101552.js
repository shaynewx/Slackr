import http from "./request.js";
import user from "./user.js";

// format time
function formatTime(isoString) {
  const date = new Date(isoString);
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}


// 获取消息
function showChannelMessage(channelId, start = 0) {
  console.log("拉取消息");
  http.get(`/message/${channelId}?start=${start}`).then((res) => {
    console.log(res);
    const messageListDom = document.getElementById("main-box");
    user.clearNode(messageListDom);
    if (!res?.message?.length) {
      console.log("There is No message ");
      // const emptyMessageDom = document.getElementById("main-box");
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
      messageTimeDom.textContent = item.sentAt;
      // messageTimeDom.textContent = formatTime(item.sentAt);

      messageDom.appendChild(messageContentDom);
      messageContainerDom.appendChild(logoDom);
      messageContainerDom.appendChild(messageDom);
      messageContainerDom.appendChild(messageTimeDom);
      // messageListDom.appendChild(messageContainerDom);
      if (messageListDom.children.length){
        messageListDom.insertBefore(messageContainerDom, messageListDom.children[0]);
    ) else {
        messageListDom.appendChild(messageContainerDom);
      }

  
      
    });
  });
}






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