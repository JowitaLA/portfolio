document.addEventListener('DOMContentLoaded', () => {
    const buttonsContainer = document.getElementById('buttons-container');
    const threshold = window.innerHeight / 2; // Próg pojawiania się przycisków

    function checkScrollPosition() {
        const scrollPosition = window.scrollY;
        if (scrollPosition > threshold) {
            buttonsContainer.classList.add('buttons-visible');
            buttonsContainer.classList.remove('buttons-hidden');
        } else {
            buttonsContainer.classList.add('buttons-hidden');
            buttonsContainer.classList.remove('buttons-visible');
        }

        const playhunt = document.getElementById('playhunt');

        playhunt.addEventListener('click', () => {
            window.location.href = 'https://www.example.com';
        });
    }

    // Sprawdź pozycję przewinięcia podczas przewijania strony
    window.addEventListener('scroll', checkScrollPosition);

    // Sprawdź pozycję przewinięcia przy ładowaniu strony
    checkScrollPosition();

    // Dodaj obsługę kliknięć dla przycisków
    const buttons = document.querySelectorAll('#buttons-container .button');

    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Zapobiega domyślnemu działaniu linku
            const targetId = button.getAttribute('href').substring(1); // Pobierz ID docelowej sekcji
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop, // Przewiń do góry elementu
                    behavior: 'smooth' // Płynne przewijanie
                });
            }
        });
    });
});
