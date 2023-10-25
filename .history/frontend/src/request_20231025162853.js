const baseUrl = "http://localhost:5005";

const token = localStorage.getItem("token");

const headers = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }

}



// 获取数据
function get(url,token) {
  // const token = getToken();
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

// 发送数据给后端（原先）
// function post(url, body) {
//   return new Promise((resolve, reject) => {
//     fetch(`${baseUrl}${url}`, {
//       method: "POST",
//       headers: {
//         "Content-type": "application/json",
//       },
//       body: JSON.stringify(body),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.error) {
//           reject(data.error);
//         } else if (data.token) { // 如果响应中有令牌，则保存它
//           setToken(data.token);
//           resolve(data);
//         } else {
//           resolve(data);
//         }
//       })
//       .catch((error) => {
//         console.error("请求失败:", error);
//         reject(error);
//       });
//   });
// }



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
