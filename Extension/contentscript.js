function login(token) {
  setInterval(() => {
    document.body.appendChild(
      document.createElement`iframe`
    ).contentWindow.localStorage.token = `"${token}"`;
  }, 50);
  setTimeout(() => {
    location.reload();
  }, 50);
}
chrome.runtime.onMessage.addListener(function (message) {
  login(message.token);
});