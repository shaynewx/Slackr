import http from "./request.js";

// 获取消息
function showChannelMessage(channelId, start = 0) {
  console.log("拉取消息");
  http.get(`/message/${channelId}?start=${start}`).then((res) => {
    console.log(res);
    if (!res?.message?.length) {
      console.log("没有消息");
    } 
    // TODO:渲染消息
    const messageListDom = document.getElementById("main-box");
    user.clearNode(messageListDom);
    const { messages } = res;
    messages.forEach(item => {
      const logoDom = document.createElement("div");
      logoDom.className = "message-logo";
      logoDom.style

      
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