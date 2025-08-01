let email = "";
let domain = "";
let timer;
let remaining = 600;

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      destroySession();
      clearInterval(timer);
    }
  }, 1000);
}

function updateEmailField() {
  document.getElementById("email").value = `${email}@${domain}`;
}

function destroySession() {
  email = "";
  domain = "";
  document.getElementById("email").value = "";
  document.getElementById("emails").innerHTML = "";
  document.getElementById("emailContent").innerHTML = "";
  remaining = 600;
  clearInterval(timer);
}

function generateEmail() {
  const chars = "abcdefghijklmnopqrstuvwxyz1234567890";
  email = "";
  for (let i = 0; i < 8; i++) {
    email += chars[Math.floor(Math.random() * chars.length)];
  }
  domain = "1secmail.com"; // or adjust as needed
  updateEmailField();
  remaining = 600;
  startTimer();
  fetchInbox();
}

function copyEmail() {
  const input = document.getElementById("email");
  input.select();
  document.execCommand("copy");
}

function resetTimer() {
  remaining = 600;
}

function extendTimer() {
  remaining += 1800;
}

function fetchInbox() {
  if (!email || !domain) return;
  const apiUrl = document.getElementById("api-url").value.trim();
  const apiKey = document.getElementById("api-key").value.trim();
  const fullUrl = `${apiUrl}?action=getMessages&login=${email}&domain=${domain}`;

  fetch(fullUrl, {
    headers: apiKey !== "NO_API_KEY" ? { "Authorization": `Bearer ${apiKey}` } : {}
  })
    .then(res => res.json())
    .then(data => {
      const inbox = document.getElementById("emails");
      inbox.innerHTML = "";
      if (!Array.isArray(data)) return;
      data.forEach(msg => {
        const div = document.createElement("div");
        div.className = "email";
        div.innerText = `${msg.from}: ${msg.subject}`;
        div.onclick = () => loadMessage(msg.id);
        inbox.appendChild(div);
      });
    })
    .catch(() => {
      document.getElementById("emails").innerHTML = "Error loading inbox.";
    });
}

function loadMessage(id) {
  const apiUrl = document.getElementById("api-url").value.trim();
  const apiKey = document.getElementById("api-key").value.trim();
  const fullUrl = `${apiUrl}?action=readMessage&login=${email}&domain=${domain}&id=${id}`;

  fetch(fullUrl, {
    headers: apiKey !== "NO_API_KEY" ? { "Authorization": `Bearer ${apiKey}` } : {}
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("emailContent").innerHTML = `
        <strong>From:</strong> ${data.from}<br />
        <strong>Subject:</strong> ${data.subject}<br />
        <strong>Date:</strong> ${data.date}<br /><br />
        <div>${data.body}</div>
      `;
    })
    .catch(() => {
      document.getElementById("emailContent").innerHTML = "Error loading message.";
    });
}

document.getElementById("copy").onclick = copyEmail;
document.getElementById("generate").onclick = generateEmail;
document.getElementById("reset").onclick = resetTimer;
document.getElementById("extend").onclick = extendTimer;
document.getElementById("destroy").onclick = destroySession;
document.getElementById("refresh").onclick = fetchInbox;
