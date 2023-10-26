
// 获取消息
function fetchChannelMessage(channelId, start = 0) {
  http.get(`/message/${channelId}?start=${start}`).then((res) => {
    console.log(res);
  });
}

// TODO:发送消息
function sendMessage(channelId, content) {
  http.post(`/message/${channelId}`, {
    content,
  });
}

// TODO:删除消息
func



const message = {
  fetchChannelMessage,
}

export default messageFunction;