// 获取消息
function fetchChannelMessage(channelId, start = 0) {
    http.get(`/message/${channelId}?start=${start}`).then((res) => {
      console.log(res);
    });
  }