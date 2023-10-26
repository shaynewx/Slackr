import http from "./request.js";
import user from "./user.js";

// 获取消息
function showChannelMessage(channelId, start = 0) {
  console.log("拉取消息");
  http.get(`/message/${channelId}?start=${start}`).then((res) => {
    console.log(res);
    if (!res?.message?.length) {
      console.log("There is No message ");
    } 
    // TODO:渲染消息
    const userInfo = user.getUserInfo();
    const {userId} = userInfo;
    const messageListDom = document.getElementById("main-box");
    user.clearNode(messageListDom);
    const { messages } = res;
    messages.forEach(item => {
      const messageContainerDom = document.createElement("div");
      messageContainerDom.className = "message-container";


      const logoDom = document.createElement("div");
      logoDom.className = "message-logo";
      logoDom.textContent = item.sender;

      const messageDom = document.createElement("div");
      messageDom.className =item.sender === userId ? "message";

      const messageContentDom = document.createElement("div");
      messageContentDom.className = "message-content-text";
      messageContentDom.textContent = item.message;

      messageDom.appendChild(messageContentDom);
      messageContainerDom.appendChild(logoDom);
      messageContainerDom.appendChild(messageDom);
      messageListDom.appendChild(messageContainerDom);



      
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