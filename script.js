let apiKey = "e8aaf31729c9c9186dc3a1274e0631fd";
const timeElement = document.getElementById("current-time");
const dateElement = document.getElementById("date");
let display = document.querySelector(".display-none");
let forecastDisplay = document.querySelector(".future-forecast");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minute = time.getMinutes();
  const minutes = minute > 9 ? minute : `0${minute}`;
  const ampm = hour >= 12 ? "PM" : "AM";

  timeElement.innerHTML =
    hoursIn12HrFormat + ":" + minutes + " " + `<span>${ampm}</span>`;
  dateElement.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let lon = position.coords.longitude;
      let lat = position.coords.latitude;
      display.style.display = "block";
      forecastDisplay.style.display = "block";

      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      )
        .then((res) => res.json())
        .then((data) => {
          weatherReport(data);
        });
    });
  } else {
    document.getElementById("demo").innerHTML =
      "Geolocation is not supported by this browser.";
  }
});

function getForecast() {
  display.style.display = "block";
  forecastDisplay.style.display = "block";
  let city = document.querySelector(".city-input").value;
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => {
      weatherReport(data);
    });
  document.querySelector(".city-input").value = "";
}

function weatherReport(data) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&units=metric&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then((forecast) => {
      dayForecast(forecast);
      let city = document.getElementById("city");
      let temp = document.getElementById("temp");
      let tempFeel = document.getElementById("temp-feel");
      let humidity = document.getElementById("humidity");
      let wind = document.getElementById("wind");
      let pressure = document.getElementById("pressure");

      city.textContent = data.name + ", " + data.sys.country;
      temp.textContent = Math.round(data.main.temp) + "°C";
      tempFeel.textContent =
        "Feels like " + Math.round(data.main.feels_like) + "°C";
      humidity.textContent = "Humidity: " + data.main.humidity + "%";
      wind.textContent = "Wind: " + data.wind.speed + " m/s";
      pressure.textContent = "Pressure: " + data.main.pressure + " hPa";

      let weatherData = data.weather[0].description;
      let description = document.getElementById("description");
      let icon = document.querySelector(".icon");
      description.textContent = weatherData;
      icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
      document.body.classList.remove("blurred");
    });
}

function dayForecast(forecast) {
  document.querySelector(".future-forecast-wrap").innerHTML = "";
  for (let i = 6; i < forecast.list.length; i += 8) {
    let icon = document.createElement("img");
    icon.src = `https://openweathermap.org/img/wn/${forecast.list[i].weather[0].icon}@2x.png`;
    let div = document.createElement("div");
    div.classList.add("item");

    let day = document.createElement("p");
    day.classList.add("day");
    day.textContent = new Date(forecast.list[i].dt * 1000).toDateString(
      undefined,
      "Vilnius"
    );

    let temp = document.createElement("p");
    temp.textContent = Math.round(forecast.list[i].main.temp) + " °C";

    let description = document.createElement("p");
    description.classList.add("clouds");
    description.textContent = forecast.list[i].weather[0].description;

    document.querySelector(".future-forecast-wrap").appendChild(div);

    div.append(day, icon, temp, description);
  }
}
