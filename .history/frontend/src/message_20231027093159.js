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
      //发送人
      const messageContainerDom = document.createElement("div");
      messageContainerDom.className = item.sender === userId ? "message-container mine" : "message-container";

      //头像
      const logoDom = document.createElement("div");
      logoDom.className = "message-logo";
      logoDom.textContent = item.sender;

      //消息框
      const messageDom = document.createElement("div");
      messageDom.className = "message";

      // 消息内容
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