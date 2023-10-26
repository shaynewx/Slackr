const baseUrl = "http://localhost:5005";
const token = localStorage.getItem("token");

// Get request
function get(url) {
  return fetch(`${baseUrl}${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      } else {
        return data;
      }
    })
    .catch((err) => {
      console.log(err);
      alert(`Error:${err.message}`);
    });
}

// Post request
function post(url, body, authed = false) {
  return fetch(`${baseUrl}${url}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: authed
        ? `Bearer ${localStorage.getItem("token")}`
        : undefined,
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      } else {
        return data;
      }
    })
    .catch((error) => {
      console.error("Failed:", error);
      alert(error);
    });
}


// Put request
function put(url, body) {
  return fetch(`${baseUrl}${url}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      } else {
        return data;
      }
    })
    .catch((error) => {
      console.error("Failed:", error);
      alert(error);
    });
}



const http = {
  get,
  post,
  put
};

export default http;
