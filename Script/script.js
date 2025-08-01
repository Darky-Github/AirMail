document.addEventListener("DOMContentLoaded", () => {
  const settingsIcon = document.getElementById("settings-icon");
  const settingsPanel = document.getElementById("settings-panel");
  const themeSelector = document.getElementById("theme-selector");
  const fontSizeSlider = document.getElementById("font-size");

  settingsIcon.addEventListener("click", () => {
    settingsPanel.classList.toggle("open");
  });

  themeSelector.addEventListener("change", () => {
    document.body.className = themeSelector.value;
    localStorage.setItem("theme", themeSelector.value);
  });

  fontSizeSlider.addEventListener("input", () => {
    document.body.style.fontSize = fontSizeSlider.value + "px";
    localStorage.setItem("fontSize", fontSizeSlider.value);
  });

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.className = savedTheme;
    themeSelector.value = savedTheme;
  }

  const savedFontSize = localStorage.getItem("fontSize");
  if (savedFontSize) {
    document.body.style.fontSize = savedFontSize + "px";
    fontSizeSlider.value = savedFontSize;
  }

  const exportBtn = document.getElementById("export-inbox");
  exportBtn.addEventListener("click", () => {
    const emails = document.getElementById("emails").innerText;
    const blob = new Blob([emails], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "inbox.txt";
    a.click();
  });

  setInterval(() => {
    document.title = `[00:00] AirMail`; // Replace with actual countdown logic
  }, 1000);
});
