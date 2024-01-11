const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.querySelector('#locationInput'); // Corrected the form selector
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city'); // Corrected the cities selector

let cityInput = "London"; // Set default city

cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        cityInput = e.target.innerHTML;
        fetchWeatherData(cityInput);
        app.style.opacity = "0";
    });
});

form.addEventListener('submit', (e) => {
    if (search.value.length === 0) {
        alert('Please type in a city name');
    } else {
        cityInput = search.value;
        fetchWeatherData(cityInput);
        search.value = "";
        app.style.opacity = "0";
    }
    e.preventDefault();
});

function dayOfTheWeek(day, month, year) {
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return weekday[new Date(`${year}-${month}-${day}`).getDay()];
}
// map 
const map = L.map('map').setView([51.505, -0.09], 13); // Set initial coordinates and zoom level

// OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// OpenWeatherMap layer 
const weatherLayer = L.tileLayer('https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid=005b8b02f83c98d98e12eededf868dbd', {
    attribution: '© OpenWeatherMap contributors',
    layer: 'clouds_new'
}).addTo(map);


// ...

function fetchWeatherData(cityName) {
    const apiKey = "005b8b02f83c98d98e12eededf868dbd"; // Replace with your OpenWeather API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            // Check if the elements exist before updating their content
            if (temp) temp.innerHTML = data.main.temp + "&#176;C";
            if (conditionOutput) conditionOutput.innerHTML = data.weather[0].description;

            const date = new Date(data.dt * 1000);
            if (dateOutput) dateOutput.innerHTML = `${dayOfTheWeek(date.getDate(), date.getMonth() + 1, date.getFullYear())} ${date.getDate()}, ${date.getMonth() + 1}, ${date.getFullYear()}`;
            if (timeOutput) timeOutput.innerHTML = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

            if (nameOutput) nameOutput.innerHTML = data.name;

            const iconId = data.weather[0].icon;
            if (icon) icon.src = `http://openweathermap.org/img/wn/${iconId}.png`;

            if (cloudOutput) cloudOutput.innerHTML = data.clouds.all + "%";
            if (humidityOutput) humidityOutput.innerHTML = data.main.humidity + "%";
            if (windOutput) windOutput.innerHTML = data.wind.speed + "m/s";

            let timeOfDay = "day";

            if (date.getHours() < data.sys.sunrise || date.getHours() > data.sys.sunset) {
                timeOfDay = "night";
            }

            setBackgroundImage(timeOfDay, data.weather[0].id);
            if (app) app.style.opacity = "1"; 

            
            // Set the map's center to the coordinates of the city
            map.setView([data.coord.lat, data.coord.lon], 13);

            // Add a marker to the map at the city's coordinates
            L.marker([data.coord.lat, data.coord.lon]).addTo(map);
        })
        .catch(error => {
            alert(`Error fetching weather data: ${error.message}`);
            if (app) app.style.opacity = "1";
        }); 

}
function setBackgroundImage(timeOfDay, conditionCode) {
    if (timeOfDay === "day") {
        app.style.backgroundImage = `url(./images/day/img1.jpg)`;
        btn.style.background = "#e5ba92";
        if (timeOfDay === "night") {
            btn.style.background = "#181e27";
        }
    } else if (conditionCode === 800) {
        // Clear sky
        app.style.backgroundImage = `url(./images/${timeOfDay}/img2.jpg)`;
        btn.style.background = timeOfDay === "night" ? "#181e27" : "#fa6d1b";
    } else if (conditionCode >= 801 && conditionCode <= 804) {
        // Clouds
        app.style.backgroundImage = `url(./images/${timeOfDay}/img1.jpg)`;
        btn.style.background = timeOfDay === "night" ? "#181e27" : "#fa6d1b";
    } else if (conditionCode >= 500 && conditionCode <= 531) {
        // Rain/Drizzle
        app.style.backgroundImage = `url(./images/${timeOfDay}/img3.jpg)`;
        btn.style.background = timeOfDay === "night" ? "#181e27" : "#fa6d1b";
    } else if (conditionCode >= 600 && conditionCode <= 622) {
        // Snow
        app.style.backgroundImage = `url(./images/${timeOfDay}/img4.jpg)`;
        btn.style.background = timeOfDay === "night" ? "#181e27" : "#fa6d1b";
    } else if (conditionCode >= 701 && conditionCode <= 781) {
        // Atmosphere (Fog, Mist, etc.)
        app.style.backgroundImage = `url(./images/${timeOfDay}/img2.jpg)`;
        btn.style.background = timeOfDay === "night" ? "#181e27" : "#fa6d1b";
    } else {
        // Default background for other conditions
        app.style.backgroundImage = `url(./images/${timeOfDay}/img1.jpg)`;
        btn.style.background = timeOfDay === "night" ? "#181e27" : "#fa6d1b";
    }
}
// ...

fetchWeatherData(cityInput);
app.style.opacity = "1";