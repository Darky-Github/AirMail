document.addEventListener("DOMContentLoaded", () => {
  const settingsIcon = document.getElementById("settings-icon");
  const settingsModal = document.getElementById("settings-modal");
  const overlay = document.getElementById("overlay");
  const closeSettings = document.getElementById("close-settings");

  // Show settings modal
  settingsIcon.addEventListener("click", () => {
    settingsModal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  });

  // Hide settings modal
  closeSettings.addEventListener("click", () => {
    settingsModal.classList.add("hidden");
    overlay.classList.add("hidden");
  });

  const themeSelector = document.getElementById("theme-selector");
  const fontSizeSlider = document.getElementById("font-size");

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

  document.getElementById("export-inbox").addEventListener("click", () => {
    const emails = document.getElementById("emails").innerText;
    const blob = new Blob([emails], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "inbox.txt";
    a.click();
  });
});
