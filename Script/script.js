let username = "";
let domain = "1secmail.com";
let emailTimer;
let timeLeft = 600;
let apiUrl = "";
let apiKey = "";

function initService() {
  apiUrl = document.getElementById("apiBaseUrl").value.trim();
  apiKey = document.getElementById("apiKey").value.trim();
  if (!apiUrl) return alert("Please enter an API Base URL");
  alert("Service initialized! Now generate your email.");
}

function generateEmail() {
  username = Math.random().toString(36).substring(2, 10);
  const email = `${username}@${domain}`;
  document.getElementById("emailDisplay").value = email;
  resetTimer();
  refreshInbox();
}

function copyEmail() {
  const emailInput = document.getElementById("emailDisplay");
  emailInput.select();
  document.execCommand("copy");
  alert("Email copied!");
}

function resetTimer() {
  clearInterval(emailTimer);
  timeLeft = 600;
  updateTimer();
  emailTimer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(emailTimer);
      document.getElementById("emailDisplay").value = "Expired";
      document.getElementById("emails").innerHTML = "Email expired.";
    }
  }, 1000);
}

function updateTimer() {
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");
  document.getElementById("timer").textContent = `Expires in: ${mins}:${secs}`;
}

async function refreshInbox() {
  if (!username || !apiUrl) return;
  const inboxURL = `${apiUrl}?action=getMessages&login=${username}&domain=${domain}`;
  try {
    const res = await fetch(inboxURL, {
      headers: apiKey !== "NO_API_KEY" ? { 'Authorization': apiKey } : {}
    });
    const data = await res.json();
    const emailsDiv = document.getElementById("emails");
    emailsDiv.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      emailsDiv.innerHTML = "No emails yet.";
      return;
    }

    data.forEach(msg => {
      const div = document.createElement("div");
      div.className = "email";
      div.textContent = `📩 ${msg.from} - ${msg.subject}`;
      div.onclick = () => loadEmail(msg.id);
      emailsDiv.appendChild(div);
    });
  } catch (err) {
    document.getElementById("emails").innerHTML = "Error loading inbox.";
    console.error("Inbox error:", err);
  }
}

async function loadEmail(id) {
  if (!username || !apiUrl) return;
  const readURL = `${apiUrl}?action=readMessage&login=${username}&domain=${domain}&id=${id}`;
  try {
    const res = await fetch(readURL, {
      headers: apiKey !== "NO_API_KEY" ? { 'Authorization': apiKey } : {}
    });
    const data = await res.json();
    document.getElementById("emailContent").innerHTML = `
      <h4>${data.subject}</h4>
      <p><strong>From:</strong> ${data.from}</p>
      <div>${data.text || data.html || "(No content)"}</div>
    `;
  } catch (err) {
    document.getElementById("emailContent").innerHTML = "Error loading message.";
    console.error("Read error:", err);
  }
}

// Set year in footer
document.getElementById("year").textContent = new Date().getFullYear();
