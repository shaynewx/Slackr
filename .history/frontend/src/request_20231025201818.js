const baseUrl = "http://localhost:5005";
const token = localStorage.getItem("token");

// 获取数据
function get(url,token) {
  return fetch(`${baseUrl}${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })
    .then((res) => res.json())
    .then(res => console.log(res))
    .catch((err) => {
      console.log(err);
      alert(`Error:${err.message}`);
    });
}


// post请求
function post(url, body, authed=false) {
  return fetch(`${baseUrl}${url}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        'Authorization': authed ? `Bearer ${token}` : undefined,
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
        console.error("Failed:", error);
        alert(error);
      });
  };





const http = {
  get,
  post,
};

export default http;
