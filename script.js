const initialTime = new Date();
initialTime.setHours(0, 15, 0, 0); // Ajuste para 00:15

const now = new Date();
if (now > initialTime) {
    const difference = now.getTime() - initialTime.getTime();
    const intervalsPassed = Math.floor(difference / (90 * 60 * 1000));
    initialTime.setTime(initialTime.getTime() + intervalsPassed * 90 * 60 * 1000 + 90 * 60 * 1000);
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function addHistoryEntry(time) {
    const historyList = document.getElementById('history-list');
    const listItem = document.createElement('li');
    listItem.textContent = `Choveu às ${time} no Throne`;
    historyList.appendChild(listItem);
}

function startCountdown() {
    const countdownElement = document.getElementById("timer");
    const nextRainTimeElement = document.getElementById("next-rain-time");
    const alertSound = document.getElementById("alert-sound");

    function updateTimer() {
        const now = new Date();
        const timeDiff = initialTime - now;

        if (timeDiff <= 0) {
            if (isAudioEnabled()) {
                alertSound.currentTime = 0; // Reinicia o áudio
                alertSound.play();
                
                // Para o áudio após 6 segundos
                setTimeout(() => {
                    alertSound.pause();
                }, 6000); // 6000 milissegundos = 6 segundos
            }

            const rainTime = initialTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            addHistoryEntry(rainTime);
            initialTime.setTime(initialTime.getTime() + 75 * 60 * 1000);
        }

        countdownElement.textContent = formatTime(Math.max(timeDiff, 0)); // Atualiza o timer
        nextRainTimeElement.textContent = initialTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Atualiza horário da próxima chuva
    }

    setInterval(updateTimer, 1000); // Atualiza a cada segundo
}

startCountdown(); // Iniciar o countdown

document.getElementById('test-sound').addEventListener('click', () => {
    const alertSound = document.getElementById('alert-sound');
    
    if (isAudioEnabled()) {
        alertSound.currentTime = 0; // Reinicia o áudio
        alertSound.play(); // Tocar o som

        // Para o áudio após 5 segundos
        setTimeout(() => {
            alertSound.pause();
        }, 5000); // 5000 milissegundos = 5 segundos
    }
});

// Verifica se o áudio está ativado
function isAudioEnabled() {
    return localStorage.getItem('audioEnabled') !== 'false';
}

// Alterna a configuração de áudio
const audioToggle = document.createElement('input');
audioToggle.type = 'checkbox';
audioToggle.id = 'audio-toggle';
audioToggle.checked = isAudioEnabled();
audioToggle.addEventListener('change', () => {
    localStorage.setItem('audioEnabled', audioToggle.checked);
});

const audioLabel = document.createElement('label');
audioLabel.htmlFor = 'audio-toggle';
audioLabel.textContent = 'Ativar Áudio';

const controlsDiv = document.querySelector('.controls');
controlsDiv.appendChild(audioToggle);
controlsDiv.appendChild(audioLabel);

// Modo Escuro
const toggleDarkModeButton = document.getElementById('toggle-dark-mode');
const body = document.body;

// Verifica se o modo escuro está salvo nas preferências
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
}

// Alterna o modo escuro
toggleDarkModeButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});
