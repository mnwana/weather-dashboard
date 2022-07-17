var historyArr = [];
var apiKey = "a8f5376058c57b89eb2148315aa2f653";
var citySearch = document.getElementById("city-search");
var main = document.getElementById("city-results");
var overviewEl = document.getElementById("overview");

// load search history from local storage
var loadHistory = function () {
  // load search history from local storage
  historyArr = JSON.parse(localStorage.getItem("city-history"));
  // if nothing in localStorage, create a new object to load city history
  if (!historyArr) {
    historyArr = [];
  }
  // loop over array to populate schedule between 9 am and 5 pm
  for (var i = 0; i < historyArr.length; i++) {
    createHistoryButton(i, historyArr[i]);
  }
};

// save search history to local storage
var saveHistory = function () {
  // save history to local storage location
  localStorage.setItem("city-history", JSON.stringify(historyArr));
};

// initialize page using cityData input, otherwise load using last value in search or default
var loadMain = function (cityData, cityName, stateCode) {
  console.log(cityData);
  currentStats = cityData.current;
  // update overview
  var overviewHeader = document.createElement("div");
  var mainH2 = document.createElement("h2");
  mainH2.textContent =
    cityName + " " + stateCode + " " + moment.unix(currentStats.dt).format("MM/DD/YYYY");
  var mainSpan = document.createElement("span");
  mainSpan.className = "oi oi-cloud";
  overviewHeader.append(mainH2);
  overviewHeader.append(mainSpan);

  var currTemp = document.createElement("p");
  currTemp.textContent = "Temp: " + currentStats.temp;
  var currWind = document.createElement("p");
  currWind.textContent = "Wind: " + currentStats.wind_speed;
  var currHumidity = document.createElement("p");
  currHumidity.textContent = "Humidity: " + currentStats.humidity + "%";

  var uvDiv = document.createElement("div");
  var uvLabel = document.createElement("p");
  uvLabel = "UV: ";
  var uvSpan = document.createElement("span");
  uvSpan.textContent = currentStats.uvi;
  uvDiv.append(uvLabel);
  uvDiv.append(uvSpan);

  overviewEl.append(overviewHeader);
  overviewEl.append(currTemp);
  overviewEl.append(currWind);
  overviewEl.append(currHumidity);
  overviewEl.append(uvDiv);

  // update 5 day forecast
  var forecast =cityData.daily; 
  var forecast5EL = document.getElementById("forecasts");
  for (var i = 1; i < 6; i++) {
    daily = forecast[i];
    var card = document.createElement("article");
    var date = document.createElement("h3");
    date.textContent = moment.unix(daily.dt).format("MM/DD/YYYY");
    
    var icon = document.createElement("span");
    icon.className = 'oi oi-cloud';

    var temp = document.createElement("p");
    temp.textContent = "Temp: " + daily.temp.day;

    var wind = document.createElement("p");
    wind.textContent = "Wind: " + daily.wind_speed;

    var humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + daily.humidity;

    card.append(date);
    card.append(icon);
    card.append(temp);
    card.append(wind);
    card.append(humidity);
    forecast5EL.append(card);
  }
};

// get weather data for a city from API
var getForecast = function (lat, lon, cityName, stateCode) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=minutely,hourly&units=imperial&appid=" +
    apiKey;
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        loadMain(data, cityName, stateCode);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};

// get lat lon from city and state
var getLatLon = function (cityName, stateCode) {
  var apiUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "," +
    stateCode +
    ",US&appid=" +
    apiKey;
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        getForecast(data[0].lat, data[0].lon, cityName, stateCode);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};

// create history button for a city
var createHistoryButton = function (cityName) {
  // console.log(cityName);
};

// get API data for a city, load API Data to page, add search to history
var submitBtnHandler = function (event) {
  event.preventDefault();
  var inputEl = document.getElementById("city");
  var inputString = inputEl.value;
  var cityName = inputString.split(",")[0].trim();
  var stateCode = inputString.split(",")[1].trim();
  historyArr.push([cityName, stateCode]);
  saveHistory();
  createHistoryButton(cityName, stateCode);
  getLatLon(cityName, stateCode);
};

// event listener for submit search button
citySearch.addEventListener("submit", submitBtnHandler);

// load history from local storage and initialize page
loadHistory();
// loadMain();
