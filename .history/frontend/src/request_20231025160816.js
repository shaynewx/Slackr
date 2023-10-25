const baseUrl = "http://localhost:5005";

const token = localStorage.getItem("token");

// 获取令牌
function getToken() {
  return localStorage.getItem("token");
}

// 设置令牌
function setToken(token) {
  localStorage.setItem("token", token);
}

// 获取数据
function get(url) {
  const token = getToken();
  return fetch(`${baseUrl}${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      alert(`错误信息：${err.message}`);
    });
}

// 发送数据给后端
function post(url, body) {
  return new Promise((resolve, reject) => {
    fetch(`${baseUrl}${url}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          reject(data.error);
        } else if (data.token) { // 如果响应中有令牌，则保存它
          localStorage.setItem("token", token);
          resolve(data);
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        console.error("请求失败:", error);
        reject(error);
      });
  });
}

const http = {
  get,
  post,
};

export default http;
