const defaultOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
};

//获取数据
function get(url) {
  return fetch(url, {
    ...defaultOptions,
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => {
      console.log(err);
      alert(`错误信息：${err.message}`);
    });
}

//发送数据
// function post(url, data) {
//     return fetch(url, {
//         ...defaultOptions,
//         method: "POST",
//         body: JSON.stringify(data),
//     })
//         .then((res) => res.json())
//         .then((data) => {
//             if (data.error) {
//                 alert("error message", data.error);
//                 return;
//             }
//             return data;

//         })
//         .catch((err) => {
//             console.log(err);
//             alert(`错误信息：${err.message}`);
//         });
// }



function post(url, data) {
    return new Promise((resolve, reject) => {
      // 发起HTTP POST请求到指定路径（url）
      fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json", // 指定请求体的内容类型为JSON
        },
        body: JSON.stringify(data), // 将JavaScript对象转换为JSON字符串并作为请求体
      })
        .then((response) => response.json()) // 解析响应为JSON格式
        .then((data) => {
          if (data.error) {
            alert(data.error); // 如果API响应包含错误信息，显示警告
            reject(data.error); // 失败时，使用 reject 方法拒绝 Promise
          } else {
            resolve(data); // 成功时，使用 resolve 方法解决 Promise 并传递数据
          }
        })
        .catch((error) => {
          console.error("请求失败:", error);
          reject(error); // 处理请求错误并拒绝 Promise
        });
    });
  }
  

  


const http = {
  get,
  post,
};

export default http;
