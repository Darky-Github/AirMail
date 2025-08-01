let email = "", domain = "mail.tm", token = "", timerInterval;
let remaining = 600;

const emailBox = document.getElementById("email");
const timerText = document.getElementById("timer");

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    remaining--;
    timerText.textContent = formatTime(remaining);
    document.title = `(${formatTime(remaining)}) AirMail`;
    if (remaining <= 0) {
      clearInterval(timerInterval);
      destroySession();
    }
  }, 1000);
}

function destroySession() {
  email = "";
  token = "";
  emailBox.value = "";
  document.getElementById("emails").innerHTML = "";
  document.getElementById("emailContent").innerHTML = "";
  timerText.textContent = "00:00";
  document.title = "AirMail";
}

function generateEmail() {
  const len = parseInt(document.getElementById("char-length").value) || 8;
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  email = Array.from({length: len}, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  emailBox.value = email + "@mail.tm";
  remaining = 600;
  timerText.textContent = formatTime(remaining);
  startTimer();
  fetchInbox();
}

function fetchInbox() {
  const api = document.getElementById("api-url").value || "https://api.mail.tm";
  const key = document.getElementById("api-key").value || "NO_API_KEY";
  const inbox = document.getElementById("emails");
  inbox.innerHTML = "Loading...";

  // This is just placeholder logic; actual Mail.tm needs account creation + token
  fetch(`${api}/messages`, {
    headers: key !== "NO_API_KEY" ? { Authorization: `Bearer ${key}` } : {}
  })
  .then(res => res.json())
  .then(data => {
    inbox.innerHTML = "";
    (data || []).forEach(msg => {
      const div = document.createElement("div");
      div.className = "email";
      div.textContent = `${msg.from.address} — ${msg.subject}`;
      div.onclick = () => loadEmail(api, msg.id, key);
      inbox.appendChild(div);
    });
  }).catch(() => inbox.innerHTML = "Inbox fetch error");
}

function loadEmail(api, id, key) {
  fetch(`${api}/messages/${id}`, {
    headers: key !== "NO_API_KEY" ? { Authorization: `Bearer ${key}` } : {}
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("emailContent").innerHTML = `
      <b>From:</b> ${data.from.address}<br/>
      <b>Subject:</b> ${data.subject}<br/>
      <b>Date:</b> ${data.intro}<br/><hr/>
      ${data.text || data.html}
    `;
  });
}

document.getElementById("generate").onclick = generateEmail;
document.getElementById("reset").onclick = () => remaining = 600;
document.getElementById("extend").onclick = () => remaining += 1800;
document.getElementById("destroy").onclick = destroySession;
document.getElementById("copy").onclick = () => {
  emailBox.select();
  document.execCommand("copy");
};
document.getElementById("refresh").onclick = fetchInbox;
