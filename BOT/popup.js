let workTime = 45 * 60; // 45 minutes in seconds
let breakTime = 15 * 60; // 15 minutes in seconds
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
        iconUrl: "images/icon48.png",
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
