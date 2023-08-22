document.addEventListener('DOMContentLoaded', () => {
    const authRequestBody = {
        "companyName": "Train Central",
        "ownerName": "Aditya",
        "rollNo": "RA2011033010182",
        "ownerEmail": "aa8219@srmist.edu.in",
        "clientID": "6d669ede-a719-4f32-8130-08ab281ebf3f",
        "clientSecret": "NybHMkNMDctTFWiP"
    };

    fetch('http://20.244.56.144/train/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(authRequestBody)
    })
    .then(response => response.json())
    .then(data => {
        const authToken = data.access_token;
        fetchTrainData(authToken);
    })
    .catch(error => console.error('Error fetching authentication token:', error));
});

function fetchTrainData(authToken) {
    const headers = {
        'Authorization': `Bearer ${authToken}`
    };

    fetch('http://20.244.56.144/train/trains', { headers })
        .then(response => response.json())
        .then(data => {
            displayTrainData(data);
        })
        .catch(error => console.error('Error fetching train data:', error));
}

function displayTrainData(trainData) {
    const trainList = document.querySelector('.train-list');

    trainData.sort((a, b) => {
        // Sort by price (ascending), seats available (descending), and departure time (descending)
        return a.price.sleeper - b.price.sleeper ||
               b.seatsAvailable.sleeper - a.seatsAvailable.sleeper ||
               (b.departureTime.Hours * 60 + b.departureTime.Minutes) -
               (a.departureTime.Hours * 60 + a.departureTime.Minutes);
    });

    trainData.forEach(train => {
        const trainCard = document.createElement('div');
        trainCard.classList.add('train-card');

        trainCard.innerHTML = `
            <h2>${train.trainName}</h2>
            <p>Departure: ${train.departureTime.Hours}:${train.departureTime.Minutes}</p>
            <p>Seat Availability (Sleeper): ${train.seatsAvailable.sleeper}</p>
            <p>Seat Availability (AC): ${train.seatsAvailable.AC}</p>
            <p>Price (Sleeper): ${train.price.sleeper}</p>
            <p>Price (AC): ${train.price.AC}</p>
            <p>Delay: ${train.delayedBy} minutes</p>
        `;

        trainList.appendChild(trainCard);
    });
}
