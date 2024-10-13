const initialTime = new Date();
initialTime.setHours(22, 45, 0, 0);

const now = new Date();
if (now > initialTime) {
    const difference = now.getTime() - initialTime.getTime();
    const intervalsPassed = Math.floor(difference / (90 * 60 * 1000));
    initialTime.setTime(initialTime.getTime() + intervalsPassed * 90 * 60 * 1000 + 75 * 60 * 1000);
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
            alertSound.play();
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
    alertSound.play(); // Tocar o som
});
