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

// fetch sender infomation
function fetchSenderInfo(senderUserId) {
  http
    .get(`/user/${senderUserId}`)
    .then((data) => {
      console.log("Sender Information", data);
      const SenderUserInfo = {
        email: data.email,
        username: data.name,
        bio: data.bio,
        image: data.image,
      };
      console.log("SenderuserInfo", SenderuserInfo);
    })
    .catch((error) => {
      console.error("Failed to fetch user info:", error);
    });
}



// get user information
function getUserInfo() {
  const userInfo = localStorage.getItem("userInfo");
  if (!userInfo) return null;
  return JSON.parse(userInfo);
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
  clearNode,
};

export default user;
