let email = "", password = "", token = "", userId = "", timer = 600, timerInterval = null;
const API = "https://api.mail.tm";

const emailInput = document.getElementById("email");
const timerDisplay = document.getElementById("timer");

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer--;
    timerDisplay.textContent = formatTime(timer);
    document.title = `(${formatTime(timer)}) AirMail`;
    if (timer <= 0) {
      clearInterval(timerInterval);
      destroySession();
    }
  }, 1000);
}

function destroySession() {
  clearInterval(timerInterval);
  email = token = password = userId = "";
  emailInput.value = "";
  timerDisplay.textContent = "00:00";
  document.title = "AirMail";
  document.getElementById("emails").innerHTML = "";
  document.getElementById("emailContent").innerHTML = "";
}

async function generateEmail() {
  destroySession();
  const len = parseInt(document.getElementById("char-length").value) || 8;
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const local = Array.from({length: len}, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  password = Math.random().toString(36).slice(2, 12);

  const domains = await fetch(`${API}/domains`).then(res => res.json());
  const domain = domains["hydra:member"][0].domain;
  email = `${local}@${domain}`;
  emailInput.value = email;

  // Register
  await fetch(`${API}/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address: email, password })
  });

  // Login
  const loginRes = await fetch(`${API}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address: email, password })
  });
  const loginData = await loginRes.json();
  token = loginData.token;

  // Get user ID
  const userRes = await fetch(`${API}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const userData = await userRes.json();
  userId = userData.id;

  timer = 600;
  updateTimer();
  fetchInbox();
}

async function fetchInbox() {
  if (!token) return;
  const inbox = document.getElementById("emails");
  inbox.innerHTML = "Loading...";
  const res = await fetch(`${API}/messages`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  inbox.innerHTML = "";
  data["hydra:member"].forEach(msg => {
    const div = document.createElement("div");
    div.className = "email";
    div.textContent = `${msg.from.address} — ${msg.subject}`;
    div.onclick = () => loadEmail(msg.id);
    inbox.appendChild(div);
  });
}

async function loadEmail(id) {
  const res = await fetch(`${API}/messages/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const msg = await res.json();
  document.getElementById("emailContent").innerHTML = `
    <b>From:</b> ${msg.from.address}<br/>
    <b>Subject:</b> ${msg.subject}<br/>
    <b>Text:</b><br/>${msg.text || msg.html || "No content"}
  `;
}

document.getElementById("generate").onclick = generateEmail;
document.getElementById("copy").onclick = () => {
  emailInput.select();
  document.execCommand("copy");
};
document.getElementById("reset").onclick = () => timer = 600;
document.getElementById("extend").onclick = () => timer += 1800;
document.getElementById("destroy").onclick = destroySession;
document.getElementById("refresh").onclick = fetchInbox;
