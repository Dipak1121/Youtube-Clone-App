const Base_URL = "https://www.googleapis.com/youtube/v3";
const API_Key = "AIzaSyA_8eoYYOKzO7NRqXF9Zc1878WYuTvs8t4";

function onPlayerReady() {
  player.playVideo();
}

let data = {};
var player;

async function sideVideos() {
  const endPoint = `${Base_URL}/videos?part=snippet&chart=mostPopular&regionCode=IN&key=${API_Key}&maxResults=20`;
  try {
    const response = await fetch(endPoint);
    const result = await response.json();
    console.log(result);

    const rightSide = document.querySelector(".right-side");
    console.log(rightSide);

    result.items.forEach((item)=>{
      // console.log(item);

      const sideVideo = document.createElement("div");
      sideVideo.classList.add("side-video");
      
      sideVideo.innerHTML = `<img class="side-video-img" src=${item.snippet.thumbnails.high.url} />
          <div class="side-video-info">
              <p class="side-video-title">${item.snippet.title}</p>
              <p class="side-video-channel-name">${item.snippet.channelTitle}</p>
         </div>`;

         rightSide.appendChild(sideVideo);
    })

  } catch (error) {
    console.log("Error Occured", error);
  }
}

function findPublishTime(publishTime) {
  let currentTime = new Date();
  let publishDate = new Date(publishTime);
  let difference = currentTime - publishDate;
  let seconds = Math.floor(difference / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  let months = Math.floor(days / 30); // Approximation
  let years = Math.floor(months / 12); // Approximation

  if (seconds < 60) {
    return seconds + " seconds ago";
  } else if (minutes < 60) {
    return minutes + " minutes ago";
  } else if (hours < 24) {
    return hours + " hours ago";
  } else if (days < 30) {
    return days + " days ago";
  } else if (months < 12) {
    return months + " months ago";
  } else {
    return years + " years ago";
  }
}

async function fetchVideoComments(videoId) {
  try {
    const response = await fetch(
      Base_URL +
        "/commentThreads" +
        `?key=${API_Key}` +
        `&videoId=${videoId}` +
        "&maxResults=30&part=snippet"
    );

    const result = await response.json();

    // console.log(result);
    return result.items;
  } catch (err) {
    console.log(err);
  }
}

async function addVideoComments() {
  const commentsData = await fetchVideoComments(data.videoId);
  const comment = document.querySelector(".comment");

  console.log(commentsData);
  commentsData.forEach((item) => {
    // console.log(item.snippet.topLevelComment.snippet.textOriginal);
    // console.log(item.snippet.topLevelComment.snippet.authorProfileImageUrl);
    const commentTime = findPublishTime(
      item.snippet.topLevelComment.snippet.updatedAt
    );
    // console.log(commentTime);

    const comment1 = document.createElement("div");
    comment1.classList.add("comment-1");
    comment1.innerHTML = `
      <img class="auther-image" src=${item.snippet.topLevelComment.snippet.authorProfileImageUrl} />
      <div>
      <div class="auther-info">
        <p class="auther-name">${item.snippet.topLevelComment.snippet.authorDisplayName}</p>
        <p class="comment-time">${commentTime}</p>
      </div>
      <p class="comment-text">${item.snippet.topLevelComment.snippet.textOriginal}</p>
      <div class="comment-likes">
        <i class="fa-regular fa-thumbs-up"></i>
        <p class="comment-like-count">${item.snippet.topLevelComment.snippet.likeCount}</p>
      </div>
      </div>
      `;

      comment.appendChild(comment1);
  });
}

function addVideoInfo() {
  const videoInfo = document.querySelector(".video-info");

  videoInfo.innerHTML = `<p class="video-title">${data.videoTitle}</p>
    <div class="other-info">
        <div class="channel-info">
            <img class="channel-logo" src=${data.logoURL} />
            <div class="channel-stat">
                <p class="channel-name">${data.channelName}</p>
            </div>
        </div>
            <div class="played-video-info">
            <div class="likes">
             <i class="fa-regular fa-thumbs-up"></i>
             <p class="like-count">${data.likeCount}</p>
            </div>
            <div class="views">
            <i class="fa-regular fa-eye"></i>
            <p class="views-count">${data.viewCount}</p>
            </div>
            <div class="share">
            <i class="fa-solid fa-share"></i>
            <p class="share-para">Share</p>
            </div>
            <div class="download">
            <i class="fa-solid fa-download"></i>
            <p class="download-para">Download</p>
            </div>
            </div>
    </div>`;
  // console.log(data.channelName);
  // console.log(data.logoURL);
  addVideoComments();
}

document.addEventListener("DOMContentLoaded", () => {
  data.API_Key = localStorage.getItem("API_Key");
  data.videoId = localStorage.getItem("videoId");
  data.logoURL = localStorage.getItem("logoURL");
  data.channelTitle = localStorage.getItem("channelTitle");
  data.videoTitle = localStorage.getItem("videoTitle");
  data.videoDescription = localStorage.getItem("videoDescription");
  data.channelName = localStorage.getItem("channelName");
  data.likeCount = localStorage.getItem("likeCount");
  data.viewCount = localStorage.getItem("viewCount");

  window.YT.ready(function () {
    player = new YT.Player("video-player", {
      height: "400",
      width: "800",
      videoId: data.videoId,
      events: {
        onReady: onPlayerReady,
      },
    });
    sideVideos();
  });

  addVideoInfo();
});
