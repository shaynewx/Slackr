
// 获取消息
function fetchChannelMessage(channelId, start = 0) {
  http.get(`/message/${channelId}?start=${start}`).then((res) => {
    console.log(res);
  });
}

// TODO发送消息
function sendMessage(channelId, content) {
  http.post(`/message/${channelId}`, {
    content,
  });
}

// 



const message = {
  fetchChannelMessage,
}

export default messageFunction;