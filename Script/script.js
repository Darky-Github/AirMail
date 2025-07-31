let username = "";
let domain = "1secmail.com";
let timer;
let countdown = 600;
let inboxInterval;

function generateEmail() {
  clearInterval(inboxInterval);
  username = Math.random().toString(36).substring(2, 10);
  document.getElementById("email").textContent = `${username}@${domain}`;
  resetTimer();
  refreshInbox();
  inboxInterval = setInterval(refreshInbox, 5000);
}

function copyEmail() {
  const emailText = document.getElementById("email").textContent;
  navigator.clipboard.writeText(emailText)
    .then(() => alert("Email copied to clipboard!"))
    .catch(() => alert("Failed to copy email."));
}

function resetTimer() {
  clearInterval(timer);
  countdown = 600;
  updateTimer();
  timer = setInterval(() => {
    countdown--;
    updateTimer();
    if (countdown <= 0) {
      clearInterval(timer);
      clearInterval(inboxInterval);
      alert("Email expired.");
      document.getElementById("email").textContent = "-";
      document.getElementById("emails").innerHTML = "No emails.";
      document.getElementById("emailContent").textContent = "";
    }
  }, 1000);
}

function updateTimer() {
  let mins = String(Math.floor(countdown / 60)).padStart(2, '0');
  let secs = String(countdown % 60).padStart(2, '0');
  document.getElementById("timer").textContent = `${mins}:${secs}`;
}

async function refreshInbox() {
  if (!username) return;
  try {
    const url = `https://www.1secmail.com/api/v1/?action=getMessages&login=${username}&domain=${domain}`;
    const res = await fetch(url);
    const data = await res.json();
    const emailsDiv = document.getElementById("emails");
    emailsDiv.innerHTML = "";

    if (data.length === 0) {
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
  } catch (error) {
    console.error("Failed to fetch inbox:", error);
    document.getElementById("emails").innerHTML = "Error loading inbox.";
  }
}

async function loadEmail(id) {
  try {
    const url = `https://www.1secmail.com/api/v1/?action=readMessage&login=${username}&domain=${domain}&id=${id}`;
    const res = await fetch(url);
    const data = await res.json();
    document.getElementById("emailContent").innerHTML = `
      <h4>${data.subject}</h4>
      <p><strong>From:</strong> ${data.from}</p>
      <div>${data.text || data.html || "(No content)"}</div>
    `;
  } catch (error) {
    console.error("Failed to read message:", error);
    document.getElementById("emailContent").textContent = "Error loading message.";
  }
}

window.onload = generateEmail;
