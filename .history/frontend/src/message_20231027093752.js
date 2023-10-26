import http from "./request.js";
import user from "./user.js";

function formatTime(isoString) {
  const date = new Date(isoString);
  
  // 获取小时和分钟
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // 转换为12小时制
  hours = hours % 12;
  hours = hours ? hours : 12; // 如果是0，则为12

  // 为分钟小于10的数字添加前导零
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return hours + ':' + minutes + ' ' + ampm;
}


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
      messageTimeDom.textContent = formatTime(item.sentAt);

      messageDom.appendChild(messageContentDom);
      messageContainerDom.appendChild(logoDom);
      messageContainerDom.appendChild(messageDom);
      messageContainerDom.appendChild(messageTimeDom);
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