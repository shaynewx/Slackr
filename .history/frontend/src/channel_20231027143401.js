import http from "./request.js";
import user from "./user.js";
import messageFunction from "./message.js";

// Set whether to expand the channel or not
const toggleButtons = document.querySelectorAll(".toggle");
const lists = document.querySelectorAll(".lists");

toggleButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (
      lists[index].style.display === "none" ||
      lists[index].style.display === ""
    ) {
      lists[index].style.display = "block";
      button.textContent = "▼";
    } else {
      lists[index].style.display = "none";
      button.textContent = "▶";
    }
  });

  lists[index].style.display = "block";
  button.textContent = "▼";
});

// Sign out
document
  .getElementById("signout-button")
  .addEventListener("click", function () {
    console.log("Logout button clicked");
    http
      .post("auth/logout", {}, true)
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("channelsInformation");
        localStorage.removeItem("channelInfo");
        window.location.hash = "#/home";
      })
      .catch((msg) => {
        alert(msg);
      });
  });

// send new channel data to backend
function sendNewChannelData(newChannelData) {
  console.log("newChannelData", newChannelData);
  http
    .post("/channel", newChannelData, true)
    .then((res) => {
      console.log("返回response", res);
      console.log("Channel created successfully");
      //TODO:获取channel list
      getChannelList();

    })
    .catch((msg) => {
      console.log("Failed to create channel");
      alert(msg);
    });
}

// listen to modal to add new channel
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal1");
  const addChannelButton = document.getElementById("add-channel-button");
  const publicChannelList = document.getElementById("public-channel-list");
  const privateChannelList = document.getElementById("private-channel-list");
  const closeModalButton = document.getElementById("create-channel-close");
  // show modal window
  const showModal = () => {
    modal.style.display = "block";
  };
  // hide modal window
  const hideModal = () => {
    modal.style.display = "none";
  };

  addChannelButton.addEventListener("click", showModal);
  const channelLists = [publicChannelList, privateChannelList];
  channelLists.forEach((list) => {
    list.addEventListener("click", (event) => {
      if (event.target.classList.contains("add-join-button")) {
        showModal();
        console.log("channel id已知",channel);
      }
    });
  });

  closeModalButton.addEventListener("click", function () {
    hideModal();
  });

  // click submit button to create a channel
  const inputName = document.getElementById("new-channel-name");
  const inputDescription = document.getElementById("new-channel-description");
  let name = "";
  let description = "";
  inputName.addEventListener("input", function () {
    name = inputName.value;
  });
  inputDescription.addEventListener("input", function () {
    description = inputDescription.value;
  });

  let isPrivate = false;
  const selectElement = document.getElementById("channel-type");
  // add a change event listener for the <select> element
  selectElement.addEventListener("change", function (event) {
    if (event.target.value === "private") {
      isPrivate = true;
    } else if (event.target.value === "public") {
      isPrivate = false;
    }
  });

  const submitButton = document.getElementById("create-channel-submit");
  submitButton.addEventListener("click", () => {
    console.log("Creating channel");
    //Encapsulate data and send get request to the server
    const newChannelData = {
      name: name,
      private: isPrivate,
      description: description,
    };
    sendNewChannelData(newChannelData);
    // get channel list again
    getChannelList();
    hideModal();
  });
});

// generate channel list
function generateChannelList(channelList) {
  const publicChannelListDom = document.getElementById("public-channel-list");
  const privateChannelListDom = document.getElementById("private-channel-list");
  const channelUserNameDom = document.getElementById("channel-username");
  // get user information
  const userInfo = user.getUserInfo();
  console.log("userInfo", userInfo);
  const userId = Number(localStorage.getItem("userId"));
  console.log("userId", userId);
  // clear node
  user.clearNode(publicChannelListDom);
  user.clearNode(privateChannelListDom);
  user.clearNode(channelUserNameDom);
  const textNode = document.createTextNode(userInfo.username);

  channelUserNameDom.appendChild(textNode);

  // create joined channel list and unjoined channel list
  const joinedChannels = channelList.filter((channel) =>
    channel.members.includes(userId)
  );
  const unjoinedChannels = channelList.filter(
    (channel) => !channel.members.includes(userId)
  );
  console.log("joinedChannels", joinedChannels);
  console.log("unjoinedChannels", unjoinedChannels);

  // create channel element
  const createChannelElement = (channel, joinBtn = false) => {
    // Create the DOM of the channel list
    const channelElementDom = document.createElement("li");
    channelElementDom.id = `channel_${channel.id}`;
    channelElementDom.className = "channel-content";
    // Add a span tag to the li tag to display the channel name
    const channelTitle = document.createElement("span");
    channelTitle.className = "channel-title";
    channelElementDom.textContent = `# ${channel.name}`;
    channelElementDom.appendChild(channelTitle);

    if (joinBtn) {
      const joinButton = document.createElement("button");
      joinButton.className = "join-button";
      joinButton.textContent = "Join";
      joinButton.addEventListener("click", () => {
        console.log(`Joining channel: ${channel.name}`);
        // TODO: Add additional function for joining channels
      });

      // Add a button tag to the li tag to display the join button
      channelElementDom.appendChild(joinButton);
    }

    if (channel.private === true) {
      privateChannelListDom.appendChild(channelElementDom);
    } else {
      publicChannelListDom.appendChild(channelElementDom);
    }
  };

  // Display channel details
  function showChannelDetails(channelInfo, channelId, stat) {
    console.log("showChannelDetails is called with channel:", channelInfo);

    const mainBox = document.getElementById("main-box");
    user.clearNode(mainBox);

    const channelDetails = document.createElement("div");
    channelDetails.className = "channel-details";

    // Name
    const namePara = document.createElement("p");
    namePara.textContent = `Name: ${channelInfo.name}`;
    channelDetails.appendChild(namePara);
    // Description
    const descriptionPara = document.createElement("p");
    descriptionPara.textContent = `Description: ${channelInfo.description}`;
    channelDetails.appendChild(descriptionPara);

    // Private
    const privatePara = document.createElement("p");
    privatePara.textContent = `Channel Tpye: ${
      channelInfo.private ? "Private Channel" : "Public Channel"
    }`;
    channelDetails.appendChild(privatePara);

    // Create Time
    // Parse ISO format string into Date object
    const dateObj = new Date(channelInfo.createdAt);

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      dateObj
    );

    const createTimePara = document.createElement("p");
    createTimePara.textContent = `Create Time: ${formattedDate}`;
    channelDetails.appendChild(createTimePara);

    // Creator
    const creatorPara = document.createElement("p");
    creatorPara.textContent = `Creator: ${channelInfo.creator}`;
    channelDetails.appendChild(creatorPara);

    mainBox.appendChild(channelDetails);

    // If the user is a member of this channel
    if (stat === true) {
      // Add editing functionality
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.id = "channel-edit-button";

      const modal = document.getElementById("modal2");
      const closeModalButton2 = document.getElementById("edit-channel-close");
      const editChannelButton = document.getElementById("edit-channel-submit");

      // show modal window
      const showModal = () => {
        modal.style.display = "block";
      };

      // hide modal window
      const hideModal = () => {
        modal.style.display = "none";
      };

      editButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        showModal();
      });

      closeModalButton2.addEventListener("click", function () {
        hideModal();
        //refresh messages
        messageFunction.showChannelMessage();
      });

      editChannelButton.addEventListener("click", function () {
        const inputName = document.getElementById("edit-channel-name").value;
        const inputDescription = document.getElementById(
          "edit-channel-description"
        ).value;

        http
          .put(`/channel/${channelId}`, {
            name: inputName,
            description: inputDescription,
          })
          .then((res) => {
            console.log("Successfully update!");
            location.reload();
            //TODO:refresh channeldetail
          })
          .catch((error) => {
            console.log("Error:", error);
          });

        hideModal();
      });

      const closeButton = document.createElement("button");
      closeButton.textContent = "Close";
      closeButton.addEventListener("click", function () {
        user.clearNode(mainBox);
      });

      mainBox.appendChild(editButton);
      mainBox.appendChild(closeButton);
    }
  }

  function createChannelHearder(channel, stat = false) {
    // When the li tag is clicked, find the channel.id of this channel,
    // and then send a get request to obtain the channel information and store it.
    const channelId = channel.id;
    const channelElementDom = document.getElementById(`channel_${channel.id}`);
    channelElementDom.addEventListener("click", () => {
      // window.location.hash = `#/channel/${channel.id}`;
      console.log(`Clicked channel: ${channel.name}`);
      console.log(`Clicked channel id: ${channel.id}`);
  

      
      
      http.get(`/channel/${channelId}`).then((channelInfo) => {
        console.log("channelInfo", channelInfo);
        localStorage.setItem("channelInfo", JSON.stringify(channelInfo));
      });

      const storedChannelInfo = localStorage.getItem("channelInfo");

      // Ensure that the stored data is not null before parsing
      const channelInfo = storedChannelInfo
        ? JSON.parse(storedChannelInfo)
        : null;
      console.log("storedChannelInfo", channelInfo);

      // add channel information to the div with the ID channel-information-header
      const channelHeaderContainer = document.getElementById(
        "channel-information-header"
      );
      user.clearNode(channelHeaderContainer);
      // Generate a div to store the channel name
      const channelNameDiv = document.createElement("div");
      channelNameDiv.className = "single-channel-name";
      channelNameDiv.id = `channel_${channel.id}`;
      channelNameDiv.textContent = `# ${channel.name}`;
      channelHeaderContainer.appendChild(channelNameDiv);
      // Generate a div to store the buttons
      const buttonsDiv = document.createElement("div");
      buttonsDiv.className = "channel-buttons";
      //TODO:Complete the functions corresponding to the four buttons
      const buttonsInfo = [
        {
          text: "Details",
          className: "channel-detail-button",
          action: showChannelDetails,
        },
        { text: "Members", className: "channel-users-button" },
        { text: "Search", className: "channel-search-button" },
        { text: "Invite", className: "channel-invite-button" },
      ];

      buttonsInfo.forEach((btnInfo) => {
        const button = document.createElement("button");
        button.className = btnInfo.className;
        button.id = `channel-${btnInfo.className}`;
        button.textContent = btnInfo.text;
        if (btnInfo.action) {
          button.addEventListener("click", function () {
            btnInfo.action(channelInfo, channelId, stat);
          });
        }
        buttonsDiv.appendChild(button);
      });
      const actionButton = document.createElement("button");
      // The fifth button displays different content depending on whether it is in the channel
      if (stat === true) {
        actionButton.textContent = "Leave channel";
        actionButton.className = "channel-leave-button";
        actionButton.addEventListener("click", function () {
          // TODO:Here is the function for exiting the channel
        });
      } else {
        actionButton.textContent = "Join channel";
        actionButton.className = "channel-join-button";
        actionButton.addEventListener("click", function () {
          // TODO:Here is the function for joining the channel
        });
      }
      buttonsDiv.appendChild(actionButton);

      channelHeaderContainer.appendChild(buttonsDiv);

      //TODO: 拉取message
      messageFunction.showChannelMessage(channelId);
    });
  }

  joinedChannels.forEach((channel) => {
    // Generate a joined channel and information header
    
    createChannelElement(channel);
    createChannelHearder(channel, true);
  });

  unjoinedChannels.forEach((channel) => {
    // Generate an unjoined channel and information header
    createChannelElement(channel, true);
    createChannelHearder(channel);
  });



 //监听是否发送消息？
 

}

// get channel list
export function getChannelList() {
  http.get("/channel").then((res) => {
    console.log("channels", res.channels);
    localStorage.setItem("channelsInformation", JSON.stringify(res.channels));
    // Read data from localStorage and convert to JavaScript object
    const channelsInformation = JSON.parse(
      localStorage.getItem("channelsInformation")
    );
    console.log("channelsInformation", channelsInformation);
    generateChannelList(res.channels);
  });
}