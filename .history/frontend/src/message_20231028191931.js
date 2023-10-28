import http from "./request.js";
import user from "./user.js";

// format time
function formatTime(isoString) {
  const date = new Date(isoString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${month}/${day} ${hours}:${minutes}:${seconds}`;
}

let currentChannelId;
let currentMessageId;

// right click on the message, options will appear
function addContextMenuListeners() {
  const messageBodies = document.querySelectorAll(".message-body");
  const contextMenu = document.getElementById("contextMenu");

  messageBodies.forEach(function (message) {
    message.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      currentMessageId = e.currentTarget.getAttribute("data-id");
      contextMenu.style.top = e.pageY + "px";
      contextMenu.style.left = e.pageX + "px";
      contextMenu.style.display = "block";
    });
  });

  document.addEventListener("click", function (e) {
    if (e.target.closest(".message-body") === null) {
      contextMenu.style.display = "none";
    }
  });

  contextMenu.addEventListener("click", function (e) {
    e.stopPropagation();
  });
}

// show message 
function showChannelMessage(channelId, start = 0) {
  console.log("get message");
  const messageListDom = document.getElementById("main-box");
  user.clearNode(messageListDom);
  http.get(`/message/${channelId}?start=${start}`).then((res) => {
    console.log(res);
    if (!res.messages || res.messages.length === 0) {
      console.log("There is No message in this channel ");
      const emptyMessageDom = document.createElement("div");
      emptyMessageDom.className = "empty-message";
      emptyMessageDom.textContent = "There is No message in this channel";
      messageListDom.appendChild(emptyMessageDom);
    }
    // render message
    const userId = Number(localStorage.getItem("userId"));
    console.log(userId);
    const { messages } = res;
    messages.forEach((item) => {
      // Sender
      const messageContainerDom = document.createElement("div");
      messageContainerDom.className =
        item.sender === userId ? "message-container mine" : "message-container";
      // Profile photo
      const photoDom = document.createElement("div");
      photoDom.className = "profile-photo";
      photoDom.textContent = item.image;
      // Name
      const logoDom = document.createElement("div");
      logoDom.className = "message-logo";
      logoDom.textContent = item.sender;
      // message body
      const messageDom = document.createElement("div");
      messageDom.className = "message-body";
      messageDom.setAttribute("data-id", item.id);
      // message content
      const messageContentDom = document.createElement("div");
      messageContentDom.className = "message-content-text";
      messageContentDom.textContent = item.message;
      // message time
      const messageTimeDom = document.createElement("div");
      messageTimeDom.className = "message-time";
      messageTimeDom.textContent = formatTime(item.sentAt);
      // edit message
      if (item.edited) {
        // edited label
        const editedDom = document.createElement("div");
        editedDom.className = "message-edited";
        editedDom.textContent = "Edited";
        // add edited time
        const editedAtDom = document.createElement("div");
        editedAtDom.className = "message-edited-at";
        editedAtDom.textContent = formatTime(item.editedAt);
        // add "edited" label and editing time to message content
        messageDom.appendChild(editedDom);
        messageDom.appendChild(editedAtDom);
      }
      // react
      if (item.reacts && item.reacts.length > 0) {
        const reactionsContainerDom = document.createElement("div");
        reactionsContainerDom.className = "message-reactions-container";
        item.reacts.forEach((reactObj) => {
          const reactionDom = document.createElement("span");
          reactionDom.className = "message-reaction";
          reactionDom.textContent =
            reactObj.react + " " + (reactObj.count || 1);
          reactionsContainerDom.appendChild(reactionDom);
        });
        messageDom.appendChild(reactionsContainerDom);
      }

      // pined
      if (item.pinned) {
        const pinnedDom = document.createElement("div");
        pinnedDom.className = "message-pinned";
        pinnedDom.textContent = "Pinned";
        messageDom.appendChild(pinnedDom);
      }
      messageDom.appendChild(messageContentDom);
      messageContainerDom.appendChild(photoDom);
      messageContainerDom.appendChild(logoDom);
      messageContainerDom.appendChild(messageDom);
      messageContainerDom.appendChild(messageTimeDom);
      if (messageListDom.children.length) {
        messageListDom.insertBefore(
          messageContainerDom,
          messageListDom.children[0]
        );
      } else {
        messageListDom.appendChild(messageContainerDom);
      }
    });
    // scroll bar bottom
    messageListDom.scrollTop = messageListDom.scrollHeight;
    addContextMenuListeners();
  });
}

// send message
const sendMessageButton = document.getElementById("send-message-button");
const messageInput = document.getElementById("input-message-box");
const errorDom = document.getElementById("send-message-empty-error");

function showErrorMessage(message) {
  errorDom.textContent = message;
  errorDom.classList.remove("hidden");
}

function hideErrorMessage() {
  errorDom.textContent = "";
  errorDom.classList.add("hidden");
}

// listen to input, obtain the content of the input box, and send the message
messageInput.addEventListener("click", function () {
  hideErrorMessage();
});

sendMessageButton.addEventListener("click", () => {
  const messageContent = messageInput.value;
  if (!messageContent.trim() || messageContent === messageInput.defaultValue) {
    console.log("message is null");
    showErrorMessage("Message can not be empty");
    return;
  }

  const channelId = localStorage.getItem("Current channelId");
  currentChannelId = channelId;
  console.log("currentChannelId", currentChannelId);
  http
    .post(
      `/message/${channelId}`,
      {message: messageContent,},
      true
    )
    .then((res) => {
      console.log(res);
      hideErrorMessage();
      messageInput.value = "";
      showChannelMessage(channelId);
    });
});

// listen to right-click message menu
document.addEventListener("DOMContentLoaded", function () {
  const contextOptions = document.querySelectorAll(".context-option");
  const reactionMenu = document.getElementById("reactionMenu");
  const modal = document.getElementById("modal3");
  const editMessageSubmit = document.getElementById("edit-new-message-submit");
  const editMessageInput = document.getElementById("edit-new-message-input");
  const closeEditMessage = document.getElementById("edit-new-message-close");

  // show modal window
  const showModal = () => {
    modal.style.display = "block";
  };
  // hide modal window
  const hideModal = () => {
    modal.style.display = "none";
  };

  closeEditMessage.addEventListener("click", () => {
    hideModal();
  });
  const showReactionMenu = (x, y) => {
    reactionMenu.style.top = y + "px";
    reactionMenu.style.left = x + "px";
    reactionMenu.style.display = "block";
  };

  // Add event listener for "React" option
  document
    .querySelector(".context-option.react")
    .addEventListener("click", function (e) {
      e.stopPropagation();
      const contextMenu = document.getElementById("contextMenu");
      contextMenu.style.display = "none";

      showReactionMenu(e.pageX, e.pageY);
    });
  // Add click event listener for each emoji
  reactionMenu.querySelectorAll(".emoji").forEach((emoji) => {
    emoji.addEventListener("click", function () {
      const reaction = this.getAttribute("data-emoji");
      console.log(
        `User reacted with ${reaction} to message ${currentMessageId}`
      );
      http
        .post(
          `/message/react/${currentChannelId}/${currentMessageId}`,
          { react: reaction },
          true
        )
        .then((res) => {
          console.log(res);
          showChannelMessage(currentChannelId);
        });
      reactionMenu.style.display = "none";
    });
  });

  contextOptions.forEach((option) => {
    option.addEventListener("click", function (e) {
      e.stopPropagation();
      currentChannelId = localStorage.getItem("Current channelId");
      if (this.classList.contains("delete")) {
        // delete the message
        console.log("Delete the message");
        console.log(currentChannelId, currentMessageId);
        http
          .deleteReq(`/message/${currentChannelId}/${currentMessageId}`, true)
          .then((res) => {
            showChannelMessage(currentChannelId);
          });
      } else if (this.classList.contains("edit")) {
        console.log("Edit the message");
        showModal();

        // Monitor the submit button of the edit message 
        // (you need to first monitor whether the input is empty and whether it is consistent with the current message content)
        editMessageSubmit.addEventListener("click", () => {
          const newMessageContent = editMessageInput.value;
          const currentMessageContent = document.querySelector(
            `[data-id="${currentMessageId}"]`
          ).textContent;
          if (!newMessageContent.trim()) {
            console.log("message is null");
            alert("Message can not be empty.");
            return;
          } else if (newMessageContent === currentMessageContent) {
            console.log("message repeat");
            alert("Message content unchanged.");
            return;
          }
          http
            .put(
              `/message/${currentChannelId}/${currentMessageId}`,
              {
                message: newMessageContent,
              },
              true
            )
            .then((res) => {
              console.log(res);
              hideModal();
              showChannelMessage(currentChannelId);
            });
        });
      } else if (this.classList.contains("pin")) {
        // TODO:Perform pinned message operations
        console.log("Pin the message");
      } else if (this.classList.contains("unpin")) {
        //TODO:Perform pinned message operations
        console.log("Unpin the message");
      }
    });
  });
});

const messageFunction = {
  showChannelMessage,
};

export default messageFunction;
