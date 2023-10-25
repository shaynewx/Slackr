const baseUrl = "http://localhost:5005";

const token = localStorage.getItem("token");



// 获取数据
function get(url,token) {
  // const token = localStorage.getItem("token");
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


// post请求
function post(url, body) {
  return fetch(`${baseUrl}${url}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
          return;
        }  else {
          return data;
        }
      })
      .catch((error) => {
        console.error("请求失败:", error);
        alert(error);
      });
  };





const http = {
  get,
  post,
};

export default http;
