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
    } else{}


      
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