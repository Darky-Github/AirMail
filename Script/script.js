let apiBase = "";
let apiKey = "";
let token = "";
let email = "";
let password = "";
let userId = "";
let timer = 600;
let timerInterval;

function generateRandom(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function setupAPI() {
  apiBase = document.getElementById("apiBase").value;
  apiKey = document.getElementById("apiKey").value;
  destroySession(); // Clear any existing session
  startSession();
}

async function startSession() {
  if (apiBase.includes("mail.tm")) {
    const domain = await (await fetch(`${apiBase}/domains`)).json();
    const domainName = domain["hydra:member"][0].domain;
    email = `${generateRandom()}@${domainName}`;
    password = generateRandom(12);

    // Create account
    const reg = await fetch(`${apiBase}/accounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: email, password }),
    }).catch(() => {});

    if (reg?.status === 201) {
      const regData = await reg.json();
      userId = regData.id;
    }

    // Login
    const login = await fetch(`${apiBase}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: email, password }),
    });

    const loginData = await login.json();
    token = loginData.token;

    document.getElementById("emailDisplay").textContent = email;
    startTimer();
    refreshInbox();
  } else {
    alert("Only Mail.tm supported for session deletion.");
  }
}

function startTimer() {
  timer = 600;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer--;
    if (timer <= 0) {
      document.getElementById("timer").textContent = "Expired";
      clearInterval(timerInterval);
      destroySession();
    } else {
      const m = Math.floor(timer / 60).toString().padStart(2, '0');
      const s = (timer % 60).toString().padStart(2, '0');
      document.getElementById("timer").textContent = `Timer: ${m}:${s}`;
    }
  }, 1000);
}

function resetTimer() {
  timer = 600;
}

function extendTimer() {
  timer += 1800; // +30 min
}

function copyEmail() {
  if (email)
    navigator.clipboard.writeText(email).then(() => alert("Email copied to clipboard!"));
}

async function refreshInbox() {
  if (!token || !apiBase.includes("mail.tm")) return;

  const res = await fetch(`${apiBase}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  const emailsDiv = document.getElementById("emails");
  emailsDiv.innerHTML = "";

  data["hydra:member"].forEach(msg => {
    const div = document.createElement("div");
    div.className = "email";
    div.textContent = `📧 ${msg.from.address} - ${msg.subject}`;
    div.onclick = () => loadEmail(msg.id);
    emailsDiv.appendChild(div);
  });
}

async function loadEmail(id) {
  const res = await fetch(`${apiBase}/messages/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  const contentDiv = document.getElementById("emailContent");
  contentDiv.innerHTML = `
    <h3>${data.subject}</h3>
    <p><strong>From:</strong> ${data.from.address}</p>
    <p>${data.text}</p>
  `;
}

async function destroySession() {
  clearInterval(timerInterval);
  document.getElementById("emailDisplay").textContent = "-";
  document.getElementById("timer").textContent = "Expired";
  document.getElementById("emails").innerHTML = "";
  document.getElementById("emailContent").innerHTML = "";

  if (token && userId && apiBase.includes("mail.tm")) {
    await fetch(`${apiBase}/accounts/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).catch(() => {});
  }

  token = "";
  email = "";
  password = "";
  userId = "";
}

// Cleanup when page is closed or reloaded
window.addEventListener("beforeunload", destroySession);
