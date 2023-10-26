import http from "./request.js";

// 获取消息
function fetchChannelMessage(channelId, start = 0) {
  console.log("");
  http.get(`/message/${channelId}?start=${start}`).then((res) => {
    console.log(res);
  });
}

// TODO:显示消息


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
  fetchChannelMessage,
}

export default messageFunction;