// assets/js/i18n.js
(function () {
  const DEFAULT_LANG = "en";
  const SUPPORTED = ["pl", "en"];

  // 1) Ustal język: najpierw preferencja użytkownika, potem przeglądarka
  function detectLanguage() {
    const saved = localStorage.getItem("lang");
    if (saved && SUPPORTED.includes(saved)) return saved;

    const nav = (
      navigator.language ||
      navigator.userLanguage ||
      ""
    ).toLowerCase();
    if (nav.startsWith("pl")) return "pl";
    return DEFAULT_LANG;
  }

  let currentLang = detectLanguage();

  // 2) Wczytaj JSON z tłumaczeniami
  async function loadTranslations(lang) {
    const path = `assets/locales/${lang}.json`;
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Cannot load ${path}`);
    return res.json();
  }

  // 3) Zastosuj tłumaczenia do DOM
  function applyTranslations(dict) {
    // Zwykłe teksty
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = getByPath(dict, key);
      if (typeof val === "string") el.textContent = val;
    });

    // Placeholdery
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = getByPath(dict, key);
      if (typeof val === "string") el.setAttribute("placeholder", val);
    });

    // Title w <title>
    const titleEl = document.querySelector("title[data-i18n]");
    if (titleEl) {
      const key = titleEl.getAttribute("data-i18n");
      const val = getByPath(dict, key);
      if (typeof val === "string") titleEl.textContent = val;
    }

    // Ustaw lang na <html>
    document.documentElement.setAttribute("lang", currentLang);
  }

  // meta description
  function updateMetaDescription(text) {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = text;
  }

  // przykład z i18next
  document.addEventListener("i18nReady", () => {
    updateMetaDescription(i18next.t("meta.description"));
  });

  // helper: odczyt "kropkowanych" kluczy, np. about.p1
  function getByPath(obj, path) {
    return path
      .split(".")
      .reduce((acc, k) => (acc && acc[k] != null ? acc[k] : undefined), obj);
  }

  // 4) Obsługa przycisków zmiany języka
  function bindLanguageSwitcher() {
    document.querySelectorAll("[data-setlang]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const lang = btn.getAttribute("data-setlang");
        if (!SUPPORTED.includes(lang)) return;
        if (lang === currentLang) return;

        currentLang = lang;
        localStorage.setItem("lang", lang);
        const dict = await loadTranslations(currentLang);
        applyTranslations(dict);
      });
    });
  }

  // 5) Start
  (async function init() {
    try {
      const dict = await loadTranslations(currentLang);
      applyTranslations(dict);
      bindLanguageSwitcher();
    } catch (e) {
      console.error("i18n init error:", e);
      // awaryjnie wymuś EN
      if (currentLang !== DEFAULT_LANG) {
        currentLang = DEFAULT_LANG;
        const dict = await loadTranslations(currentLang);
        applyTranslations(dict);
        bindLanguageSwitcher();
      }
    }
  })();
})();
