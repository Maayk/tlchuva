const rainTimes = [
    "04:15", "05:45", "06:15", "06:45", "08:15", "09:15", "09:45",
    "10:45", "11:15", "12:45", "13:15", "14:15", "15:15", "15:45", 
    "16:15", "18:15", "19:15", "21:15", "22:15", "22:45",
    "23:15", "00:15", "01:15", "02:15", "03:15"
];

// Função para converter uma string "HH:MM" em um objeto Date para o mesmo dia
function getTimeFromString(timeString) {
    const now = new Date();
    const [hours, minutes] = timeString.split(":").map(Number);
    const time = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
    
    // Se o horário já passou hoje, retorna o horário para o próximo dia
    if (time < now) {
        time.setDate(time.getDate() + 1);
    }
    
    return time;
}

// Função para obter o próximo horário de chuva
function getNextRainTime() {
    const now = new Date();
    for (let timeString of rainTimes) {
        const rainTime = getTimeFromString(timeString);
        if (rainTime > now) {
            return rainTime;
        }
    }
    // Caso todos os horários de hoje tenham passado, retorna o primeiro horário de amanhã
    return getTimeFromString(rainTimes[0]);
}

// Função para formatar o tempo restante
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Função para adicionar entrada ao histórico
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
    const rainMessageElement = document.getElementById("rain-message");

    let nextRainTime = getNextRainTime();

    function updateTimer() {
        const now = new Date();
        const timeDiff = nextRainTime - now;

        if (timeDiff <= 0) {
            if (isAudioEnabled()) {
                alertSound.currentTime = 0;
                alertSound.play();
                setTimeout(() => {
                    alertSound.pause();
                }, 6000);
            }

            const rainTime = nextRainTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            addHistoryEntry(rainTime);

            // Atualiza o próximo horário de chuva
            nextRainTime = getNextRainTime();

            // Exibe a mensagem de chuva
            rainMessageElement.textContent = "O Portão está aberto (Chovendo)";
            rainMessageElement.style.display = 'block';

            setTimeout(() => {
                rainMessageElement.textContent = "Portão Está Fechado, Aguarde!";
            }, 15 * 60 * 1000); // Após 15 minutos, muda a mensagem
        }

        countdownElement.textContent = formatTime(Math.max(timeDiff, 0));
        nextRainTimeElement.textContent = nextRainTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    setInterval(updateTimer, 1000);
}

startCountdown();

document.getElementById('test-sound').addEventListener('click', () => {
    const alertSound = document.getElementById('alert-sound');
    if (isAudioEnabled()) {
        alertSound.currentTime = 0;
        alertSound.play();
        setTimeout(() => {
            alertSound.pause();
        }, 5000);
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
