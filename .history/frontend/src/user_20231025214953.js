import http from "./request.js";


// 获取用户信息
function fetchUserInfo(userId) {
  http.get(`/user/${userId}`)
  .then((res) => {
    console.log("userInformation", res);
    const userInfo = {
      email: res.email,
      username: res.name,
      bio: res.bio,
      image: res.image,
    };
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  })
  .catch((error) => {
    console.error("Failed to fetch user info:", error);
  });
}

// 获取用户信息
function getUserInfo() {
  const userInfo = localStorage.getItem("userInfo");
  if (!userInfo) return null;
  return JSON.parse(userInfo); 
  }




// 获取频道详情
function fetchChannelDetail(channelId) {
  http.get(`/channel/${channelId}`).then(detail => {
      generateChannelHeader({
          ...detail,
          // 重置 id 为上层参数
          id: channelId,
      });
  });
}

function fetchChannelMessage(channelId, start = 0) {
  http.get(`/message/${channelId}?start=${start}`).then(res => {
      console.log(res);
  });
}



// 不用innerHTML清空节点

function clearNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

const user = {
  fetchUserInfo,
  getUserInfo,
  fetchChannelDetail,
  fetchChannelMessage,
  clearNode
};

export default user;
