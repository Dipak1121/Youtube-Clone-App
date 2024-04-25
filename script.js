const Base_URL = "https://www.googleapis.com/youtube/v3";
// const API_Key = "AIzaSyCPt3wUkXPfELHcS7ZZKJI8KRL84MZnYe0";
 const API_Key = "AIzaSyA_8eoYYOKzO7NRqXF9Zc1878WYuTvs8t4";
// const API_Key = "AIzaSyDjhHMrJfwkp1TARvKLZb51s4yYIRgG5Oc"
const Form = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
const videoContainer = document.querySelector(".video-container");

function onFormSubmit(e) {
  if (e) {
    e.preventDefault();
    // console.log("Form is submitted");
    // console.log(searchInput.value);
    const searchQuery = searchInput.value;
    fetchVideos(searchQuery, 50);
  } else {
    fetchVideos("random", 50);
  }
}

async function fetchVideos(searchQuery, maxResult) {
  try {
    const response = await fetch(
      Base_URL +
        `/search` +
        `?key=${API_Key}` +
        "&part=snippet" +
        `&q=${searchQuery}` +
        `&maxResults=${maxResult}`
    );
    const data = await response.json();
    // console.log(data.items);
    displayVideos(data.items);
  } catch (err) {
    console.log(err);
  }
}

function removePrevVideos() {
  while (videoContainer.firstChild) {
    videoContainer.removeChild(videoContainer.firstChild);
  }
}

async function fetchChannelLogo(channelId) {
  try {
    const response = await fetch(
      Base_URL +
        "/channels" +
        `?key=${API_Key}` +
        "&part=snippet" +
        `&id=${channelId}`
    );

    const data = await response.json();

      // console.log(data);
    //   console.log(data.items[0].snippet.thumbnails.high.url)
    return data.items[0].snippet.thumbnails.high.url;
  } catch (err) {
    console.log(err);
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

async function fetchVideoStats(videoId, typeOfDetails) {
  try {
    const response = await fetch(
      Base_URL +
        "/videos" +
        `?key=${API_Key}` +
        `&part=${typeOfDetails}` +
        `&id=${videoId}`
    );

    const data = await response.json();

    console.log(data);
    //   console.log(typeof data.items[0].statistics.viewCount);
    return data.items[0].statistics;
  } catch (err) {
    console.log(err);
  }
}

function getViewsString(views) {
  if (views < 1000) {
    return views.toString();
  } else if (views < 1000000) {
    return Math.floor(views / 1000) + "k";
  } else if (views < 1000000000) {
    return Math.floor(views / 1000000) + "M";
  } else if (views < 1000000000000) {
    return Math.floor(views / 1000000000) + "B";
  } else {
    return Math.floor(views / 1000000000000) + "T"; // Trillion and beyond
  }
}

function navigateToVideoPlayer(
  API_Key,
  videoId,
  logoURL,
  channelTitle,
  videoTitle,
  videoDescription,
  channelName,
  likeCount,
  viewsCount
) {
  localStorage.setItem("API_Key", API_Key);;
  localStorage.setItem("videoId", videoId);
  localStorage.setItem("logoURL", logoURL);
  localStorage.setItem("channelTitle", channelTitle);
  localStorage.setItem("videoTitle", videoTitle);
  localStorage.setItem("videoDescription", videoDescription);
  localStorage.setItem("channelName", channelName);
  localStorage.setItem("likeCount", likeCount);
  localStorage.setItem("viewCount", viewsCount);

  window.location.href = "https://dipak1121.github.io/Youtube-Clone-App/videoPlayer.html";
}

function displayVideos(dataArr) {
  removePrevVideos();

  dataArr.forEach(async (item) => {
    // console.log(item.snippet.thumbnails.high.url);
    // console.log(typeof item.snippet.thumbnails.high.url);
    // console.log(item.snippet.channelId);
    // console.log(item);

    const video = document.createElement("div");
    video.classList.add("video");

    const image = document.createElement("img");
    image.setAttribute("src", item.snippet.thumbnails.high.url);
    image.classList.add("video-img");

    const videoInfo = document.createElement("div");
    videoInfo.classList.add("video-info");

    const channelLogo = document.createElement("img");
    const channelLogoUrl = await fetchChannelLogo(item.snippet.channelId);
    // console.log(channelLogoUrl);
    channelLogo.setAttribute("src", channelLogoUrl);
    channelLogo.classList.add("channel-logo");

    const videoStat = document.createElement("div");
    videoStat.classList.add("video-stat");

    const videoDesc = document.createElement("p");
    videoDesc.classList.add("video-title");
    videoDesc.innerText = item.snippet.title;

    const channelName = document.createElement("p");
    channelName.classList.add("channel-name");
    channelName.innerText = item.snippet.channelTitle;

    const stats = document.createElement("div");
    stats.classList.add("stats");

    const timeStat = document.createElement("p");
    timeStat.classList.add("time-stat");
    timeStat.innerText = "•" + findPublishTime(item.snippet.publishTime);

    const viewsStat = document.createElement("p");
    viewsStat.classList.add("views-stat");
    const videoStatistics = await fetchVideoStats(item.id.videoId, "statistics");
    // console.log(views)
    // console.log(getViewsString(parseInt(views)));
    const viewString = getViewsString(parseInt(videoStatistics.viewCount));
    const likeString = getViewsString(parseInt(videoStatistics.likeCount));
    viewsStat.innerText = viewString + " views";

    stats.appendChild(viewsStat);
    stats.appendChild(timeStat);

    videoStat.appendChild(videoDesc);
    videoStat.appendChild(channelName);
    videoStat.appendChild(stats);

    videoInfo.appendChild(channelLogo);
    videoInfo.appendChild(videoStat);

    video.appendChild(image);
    video.appendChild(videoInfo);

    // console.log(videoStatistics.likeCount);
    video.addEventListener("click", () => {
      navigateToVideoPlayer(
        API_Key,
        item.id.videoId,
        channelLogoUrl,
        item.snippet.channelTitle,
        item.snippet.title,
        item.snippet.description,
        item.snippet.channelTitle,
        likeString,
        viewString
      );
    });

    videoContainer.appendChild(video);
  });
}

// console.log(Form);

Form.addEventListener("submit", onFormSubmit);
 onFormSubmit();
