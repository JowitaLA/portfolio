document.addEventListener("DOMContentLoaded", () => {
  // ====== Konfiguracja przycisków pływających (pokazywanie po scrollu) ======
  const buttonsContainer = document.getElementById("buttons-container");
  const threshold = window.innerHeight / 2; // Próg pojawiania się przycisków

  function checkScrollPosition() {
    const scrollPosition = window.scrollY;

    if (!buttonsContainer) return; // Bezpiecznik, gdy kontener nie istnieje

    if (scrollPosition > threshold) {
      buttonsContainer.classList.add("buttons-visible");
      buttonsContainer.classList.remove("buttons-hidden");
    } else {
      buttonsContainer.classList.add("buttons-hidden");
      buttonsContainer.classList.remove("buttons-visible");
    }
  }

  // Reaguj na scroll i wykonaj raz na starcie
  window.addEventListener("scroll", checkScrollPosition, { passive: true });
  checkScrollPosition();

  // ====== Obsługa kliknięcia dla przycisku PlayHunt (jednorazowa rejestracja) ======
  const playhunt = document.getElementById("playhunt");
  if (playhunt) {
    playhunt.addEventListener("click", (e) => {
      // Jeśli to link i ma być nawigacja – można pominąć preventDefault
      // e.preventDefault();
      window.location.href = "https://www.example.com";
    });
  }

  // ====== Smooth scroll dla przycisków w #buttons-container ======
  const buttons = document.querySelectorAll("#buttons-container .button");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      // Jeśli button to <a>, zapobiegamy domyślnemu skokowi
      event.preventDefault();

      const href = button.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // ====== Rok w stopce ======
  // Uwaga: Ustawiamy po i18n, dlatego robimy to tutaj, na końcu DOMContentLoaded.
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (window.AOS) {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
  }

  // (Opcjonalnie) Jeżeli i18n nadpisuje stopkę ASYNCHRONICZNIE po chwili,
  // można dodać krótkie opóźnienie, aby mieć pewność:
  //
  // setTimeout(() => {
  //   const y = document.getElementById("currentYear");
  //   if (y) y.textContent = new Date().getFullYear();
  // }, 0);
});