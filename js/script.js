setInterval(updateCountdown, 1000);

function updateCountdown() {
    var now = new Date();
    var lastUpdate = new Date(localStorage.getItem('lastUpdate'));
    var timeLeft = 36 * 60 * 60 - (now - lastUpdate) / 1000; // Time left in seconds
    if (timeLeft <= 0) {
        document.getElementById('countdown').textContent = 'Tijd tot reset: 00:00:00';
    } else {
        var hours = Math.floor(timeLeft / 3600);
        var minutes = Math.floor(timeLeft % 3600 / 60);
        var seconds = Math.floor(timeLeft % 60);
        document.getElementById('countdown').textContent = 'Tijd tot reset: ' +
            (hours < 10 ? '0' : '') + hours + ':' +
            (minutes < 10 ? '0' : '') + minutes + ':' +
            (seconds < 10 ? '0' : '') + seconds;
    }
}

document.getElementById('trainForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var trainNumber = document.getElementById('trainNumber').value;
    if (trainNumber < 1000 || trainNumber > 9999) {
        displayError('Het treinstelnummer dat je hebt ingevoerd is onjuist. Het treinstelnummer is een viercijferig nummer dat je kunt vinden op de buitenkant en binnenkant van het treinstel. Het staat meestal boven of naast de deur, maar het kan ook op een andere plek staan.');
    } else {
        var lastUpdate = localStorage.getItem('lastUpdate');
        var now = new Date();
        if (!lastUpdate || now - new Date(lastUpdate) >= 5 * 60 * 1000) { // 5 minutes
            saveTrainNumber(trainNumber);
            localStorage.setItem('lastUpdate', now.toString());
            displayTrainType(trainNumber);
            if (isNewTrain(trainNumber)) {
                updateStreak();
                updateHighscore();
            } else {
                resetStreak();
            }
            updateTotalNewTrains();
            updateTotalOldTrains();
            document.getElementById('error').style.display = 'none'; // Hide the error message
        } else {
            displayError('Je mag maar eens in de 5 minuten een treinstelnummer invoeren.');
        }
    }
});

document.getElementById('resetButton').addEventListener('click', function() {
    // Ask the user to confirm
    var confirmReset = confirm('Weet je zeker dat je alle treindata wilt resetten?');

    // If the user clicked "OK", reset the train data
    if (confirmReset) {
        // Reset all train data
        localStorage.removeItem('trainNumbers');
        localStorage.removeItem('lastUpdate');
        localStorage.removeItem('streak');
        localStorage.removeItem('highscore');
        localStorage.removeItem('totalNewTrains');
        localStorage.removeItem('totalOldTrains');

        // Refresh the page
        location.reload();
    }
});

function displayError(message) {
    var errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block'; // Show the error message
}

function validateTrainNumber(number) {
    return number >= 1000 && number <= 9999;
}

function isNewTrain(number) {
    return number >= 2700;
}

function saveTrainNumber(number) {
    var trainNumbers = JSON.parse(localStorage.getItem('trainNumbers')) || [];
    trainNumbers.push(number);
    localStorage.setItem('trainNumbers', JSON.stringify(trainNumbers));
}

function resetStreak() {
    localStorage.setItem('streak', '0');
    document.getElementById('streak').textContent = 'Huidige streak: 0';
}

function updateStreak() {
    var streak = parseInt(localStorage.getItem('streak') || '0');
    streak++;
    localStorage.setItem('streak', streak.toString());
    document.getElementById('streak').textContent = 'Huidige streak: ' + streak;
    updateHighscore(); // Update the highscore after updating the streak
}

function updateHighscore() {
    var streak = parseInt(localStorage.getItem('streak') || '0');
    var highscore = parseInt(localStorage.getItem('highscore') || '0');
    if (streak > highscore) {
        localStorage.setItem('highscore', streak.toString());
        document.getElementById('highscore').textContent = 'Highscore: ' + streak;
    }
}

function updateTotalNewTrains() {
    var trainNumbers = JSON.parse(localStorage.getItem('trainNumbers')) || [];
    var newTrainNumbers = trainNumbers.filter(isNewTrain);
    document.getElementById('totalNewTrains').textContent = 'Totaal nieuwe treinen: ' + newTrainNumbers.length;
}

function updateTotalOldTrains() {
    var trainNumbers = JSON.parse(localStorage.getItem('trainNumbers')) || [];
    var oldTrainNumbers = trainNumbers.filter(number => !isNewTrain(number));
    document.getElementById('totalOldTrains').textContent = 'Totaal oude treinen: ' + oldTrainNumbers.length;
}

function displayTrainType(number) {
    var message = isNewTrain(number) ? 'Dit is een nieuwe trein.' : 'Dit is een oude trein.';
    alert(message);
}

function displayStreak() {
    var streak = parseInt(localStorage.getItem('streak') || '0');
    document.getElementById('streak').textContent = 'Huidige streak: ' + streak;
}

function displayHighscore() {
    var highscore = parseInt(localStorage.getItem('highscore') || '0');
    document.getElementById('highscore').textContent = 'Highscore: ' + highscore;
}

function saveTrainNumber(trainNumber) {
    // Save the train number in the array
    var trainNumbers = JSON.parse(localStorage.getItem('trainNumbers')) || [];
    trainNumbers.push(trainNumber);
    localStorage.setItem('trainNumbers', JSON.stringify(trainNumbers));

    // Save the train number in the object
    var trains = JSON.parse(localStorage.getItem('trains') || '{}');
    if (trains[trainNumber]) {
        trains[trainNumber]++;
    } else {
        trains[trainNumber] = 1;
    }
    localStorage.setItem('trains', JSON.stringify(trains));
}

function updateMostFrequentTrains() {
    // Get the array of train numbers from local storage
    var trainNumbers = JSON.parse(localStorage.getItem('trainNumbers')) || [];

    // Count the frequency of each train number
    var frequency = {};
    for (var i = 0; i < trainNumbers.length; i++) {
        var num = trainNumbers[i];
        frequency[num] = frequency[num] ? frequency[num] + 1 : 1;
    }

    // Sort the train numbers by frequency
    var sorted = Object.keys(frequency).sort(function(a, b) {
        return frequency[b] - frequency[a];
    });

    // Get the most frequent train number and its frequency
    var mostFrequent = sorted[0];
    var mostFrequentFrequency = frequency[mostFrequent];

    // Update the display of the most frequent train number and its frequency
    document.getElementById('mostFrequentTrain').textContent = 'Meest voorkomende treinnummer: ' + mostFrequent + ' (aantal keer gezeten: ' + mostFrequentFrequency + ')';
}

console.log(localStorage);

// Update the total counts on page load
updateTotalNewTrains();
updateTotalOldTrains();

// Display the current streak and highscore on page load
displayStreak();
displayHighscore();
updateMostFrequentTrains();