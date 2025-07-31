# AirMail - Temporary Email

AirMail is a lightweight temporary email generator and inbox viewer built using pure HTML, CSS, and JavaScript. No backend. No database. Fully privacy-respecting and user-controlled.

[AirMail](darky-github.github.io/AirMail)

---

## Features

- Generate random temporary email addresses
- Use your own email API (supports Mail.tm)
- View inbox and read messages (real-time)
- 10-minute session timer (auto-expiry)
- Extend timer by +30 minutes
- Copy email to clipboard
- Refresh inbox without reloading page
- Destroy session manually
- Auto-delete on:
  - Timer expiry
  - New email generation
  - Page unload/exit

---

## Built With

- HTML
- CSS
- JavaScript

---

## How to Use

1. **Open `index.html` in a browser (supports Chrome, Firefox, Edge, Brave, etc.)**
2. **Enter API Details:**

| Field         | Example                        |
|---------------|--------------------------------|
| API Base URL  | `https://api.mail.tm`          |
| API Key       | `NO_API_KEY`                   |

3. **Click “Set API” to generate your temp email**
4. **Use the buttons to:**
   - Copy email
   - Refresh inbox
   - Extend time
   - Destroy session manually

---

## ⚙️ Mail.tm Integration

> This service is currently optimized for [Mail.tm](https://docs.mail.tm/)

- **Base URL:** `https://api.mail.tm`
- **API Key:** Use `NO_API_KEY`
- Email accounts and inboxes are deleted securely after use via their REST API.

---

## Privacy & Security

- No tracking or data collection
- Everything happens in the browser
- Session data (email, tokens, inbox) cleared on exit
- Temp emails are deleted via API when possible

---

## Pro Tips

- Extend your session using the "+30 Min" button if you're still using the email
- Use "Destroy Session" to manually nuke everything
- Do **not** use this for anything sensitive — it’s still temp mail

---

## License

MIT License

> Free to use, fork, and modify.

---

## Author

Made by **[Darky-Github](https://github.com/Darky-Github)**  
© 2025 Darky-Github. All rights reserved.
