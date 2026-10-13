(() => {
  const storageKey = "mattcleary-theme";
  const root = document.documentElement;
  const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
  let mode = "system";

  const readMode = () => {
    try {
      const savedMode = localStorage.getItem(storageKey);
      return ["light", "dark"].includes(savedMode) ? savedMode : "system";
    } catch (error) {
      console.warn("Unable to read the saved color theme preference.", error);
      return "system";
    }
  };

  const saveMode = (themeMode) => {
    try {
      localStorage.setItem(storageKey, themeMode);
    } catch (error) {
      console.warn("Unable to save the selected color theme preference.", error);
    }
  };

  const activeTheme = () => mode === "system"
    ? (colorScheme.matches ? "dark" : "light")
    : mode;

  const applyTheme = () => {
    const theme = activeTheme();
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    return theme;
  };

  mode = readMode();
  applyTheme();

  document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector("nav");
    if (!nav) return;

    const toggle = document.createElement("button");
    toggle.className = "theme-toggle";
    toggle.type = "button";
    toggle.setAttribute("role", "switch");
    toggle.innerHTML = '<span class="theme-toggle-track" aria-hidden="true"></span><span class="theme-toggle-label"></span>';

    const syncToggle = () => {
      const theme = applyTheme();
      toggle.setAttribute("aria-checked", String(theme === "dark"));
      toggle.setAttribute(
        "aria-label",
        mode === "system" ? `Device theme, currently ${theme} mode` : `${theme} mode, manually selected`
      );
      toggle.querySelector(".theme-toggle-label").textContent =
        theme === "dark" ? "Dark" : "Light";
    };

    toggle.addEventListener("click", () => {
      mode = mode === "system"
        ? (colorScheme.matches ? "light" : "dark")
        : "system";
      saveMode(mode);
      syncToggle();
    });

    nav.append(toggle);
    syncToggle();
  });

  colorScheme.addEventListener("change", () => {
    if (mode === "system") {
      applyTheme();
      const toggle = document.querySelector(".theme-toggle");
      if (toggle) {
        const theme = activeTheme();
        toggle.setAttribute("aria-checked", String(theme === "dark"));
        toggle.setAttribute("aria-label", `Device theme, currently ${theme} mode`);
      }
    }
  });
})();
