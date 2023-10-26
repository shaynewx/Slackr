
// 获取消息
function fetchChannelMessage(channelId, start = 0) {
  http.get(`/message/${channelId}?start=${start}`).then((res) => {
    console.log(res);
  });
}

// 发送消息
function sendMessage(channelId, content) {
  http.post(`/message/{channelId}/message/${channelId}`, {
    content,
  });
}



const message = {
  fetchChannelMessage,
}

export default messageFunction;