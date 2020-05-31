const api = {
  key: "a85ee271ec9823541536b357c1f041a0",
  base: "https://api.openweathermap.org/data/2.5/",
};

let toggler = document.querySelector("#toggler");

const defaultCityValue = "Srinagar";
document.onload = defaultCity(defaultCityValue);

const searchBox = document.querySelector(".search-box");
searchBox.addEventListener("keypress", setQuery);

function setQuery(e) {
  if (e.keyCode == 13) {
    getResults(searchBox.value);
  }
}

function getResults(query) {
  let units;
  if (toggler.checked === false) {
    units = "units=metric";
  } else {
    units = "units=imperial";
  }
  fetch(`${api.base}weather?q=${query}&${units}&APPID=${api.key}`)
    .then((weather) => handleErrors(weather))
    .then((weather) => {
      return weather.json();
    })
    .then(displayResults)
    .catch((error) => console.log(error));
}

function displayResults(weather) {
  let tempUnit;
  if (toggler.checked === false) {
    tempUnit = "°C";
  } else {
    tempUnit = "°F";
  }
  console.log(weather);
  let city = document.querySelector(".location .city");
  city.innerText = `${weather.name}, ${weather.sys.country}`;
  let now = new Date();
  let date = document.querySelector(".location .date");
  date.innerHTML = dateBuilder(now);

  var iconcode = weather.weather[0].icon;
  var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
  document.getElementById("wicon").setAttribute("src", iconurl);

  let temp = document.querySelector(".current .temp");
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>${tempUnit}</span>`;
  let weather_el = document.querySelector(".current .weather");
  weather_el.innerText = weather.weather[0].main;
  let hilow = document.querySelector(".current .hi-low");
  hilow.innerHTML = `${Math.round(
    weather.main.temp_min
  )}<span>${tempUnit}</span>/${Math.round(
    weather.main.temp_max
  )}<span>${tempUnit}</span>`;
}

function dateBuilder(now) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let date = now.getDate();
  let month = months[now.getMonth()];
  let year = now.getFullYear();
  return `${day}, ${date} ${month} ${year}`;
}

function defaultCity(city) {
  getResults(city);
}

toggler.addEventListener("change", convertCurrent);
function convertCurrent(e) {
  currentCity = document.querySelector(".location .city").innerText;
  getResults(currentCity);
}

function handleErrors(weather) {
  // console.log(weather);
  if (!weather.ok) {
    if (weather.status === 404) {
      throw new Error("City Not Found");
    } else {
      throw new Error(weather.status + " : " + weather.statusText);
    }
  }
  return weather;
}
