let workTime = 45 * 60;
let breakTime = 15 * 60;
let timerActive = false;

function startTimer(duration) {
  if (timerActive) return;

  chrome.notifications.clear("pomodoro-notification");
  timerActive = true;
  const endTime = Date.now() + duration * 1000;

  const timerInterval = setInterval(function () {
    const remainingTime = Math.max(0, (endTime - Date.now()) / 1000);
    if (remainingTime === 0) {
      clearInterval(timerInterval);
      timerActive = false;
      const notificationOptions = {
        type: "basic",
        title: "Pomodoro Timer",
        message: "Time's up! Take a break.",
        iconUrl: "https://images.search.yahoo.com/images/view;_ylt=AwriiRRzUTllmXsB_OuJzbkF;_ylu=c2VjA3NyBHNsawNpbWcEb2lkA2E4NzA5YTExOTdhMDYxNTM5NDYzYzNiZjI4MDFkMjVlBGdwb3MDNzcEaXQDYmluZw--?back=https%3A%2F%2Fimages.search.yahoo.com%2Fsearch%2Fimages%3Fp%3Dhourglass%2Bpng%26type%3DE211US714G0%26fr%3Dmcafee%26fr2%3Dpiv-web%26nost%3D1%26tab%3Dorganic%26ri%3D77&w=690&h=980&imgurl=pngimg.com%2Fuploads%2Fhourglass%2Fhourglass_PNG53.png&rurl=https%3A%2F%2Fpngimg.com%2Fimage%2F93138&size=45.3KB&p=hourglass+png&oid=a8709a1197a061539463c3bf2801d25e&fr2=piv-web&fr=mcafee&tt=Hourglass+PNG+transparent+image+download%2C+size%3A+690x980px&b=61&ni=21&no=77&ts=&tab=organic&sigr=3lrySwP0jruv&sigb=cT.hVDsMH7nj&sigi=BlTrbxbPkwSf&sigt=Vq_TZyuq_Hnp&.crumb=RyHu0i2IM6i&fr=mcafee&fr2=piv-web&type=E211US714G0",
      };
      chrome.notifications.create("pomodoro-notification", notificationOptions);
    }
  }, 1000);
}

document.getElementById("start-work").addEventListener("click", function () {
  startTimer(workTime);
});

document.getElementById("start-break").addEventListener("click", function () {
  startTimer(breakTime);
});

function createNotification() {
  const notificationOptions = {
    type: "basic",
    title: "Pomodoro Timer",
    message: "Time's up! Take a break.",  
    iconUrl: "images/icon48.png",
  };

  chrome.notifications.create("pomodoro-notification", notificationOptions);
}

chrome.notifications.onClicked.addListener(function (notificationId) {
  if (notificationId === "pomodoro-notification") {
  }
});

chrome.notifications.onClicked.addListener(function (notificationId) {
  if (notificationId === "pomodoro-notification") {
    chrome.notifications.clear("pomodoro-notification");
    print("Distraction!!");
  }
});