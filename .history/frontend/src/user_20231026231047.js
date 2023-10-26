import http from "./request.js";

// fetch user infomation
function fetchUserInfo(userId) {
  http
    .get(`/user/${userId}`)
    .then((data) => {
      console.log("userInformation", data);
      const userInfo = {
        email: data.email,
        username: data.name,
        bio: data.bio,
        image: data.image,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    })
    .catch((error) => {
      console.error("Failed to fetch user info:", error);
    });
}

// get un获取用户信息
function getUserInfo() {
  const userInfo = localStorage.getItem("userInfo");
  if (!userInfo) return null;
  return JSON.parse(userInfo);
}

// 获取频道详情
function fetchChannelDetail(channelId) {
  http.get(`/channel/${channelId}`).then((detail) => {
    generateChannelHeader({
      ...detail,
      // 重置 id 为上层参数
      id: channelId,
    });
  });
}

function fetchChannelMessage(channelId, start = 0) {
  http.get(`/message/${channelId}?start=${start}`).then((res) => {
    console.log(res);
  });
}

// clear node function
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
  clearNode,
};

export default user;
