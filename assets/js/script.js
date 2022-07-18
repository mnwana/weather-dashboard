var historyArr = [];
var apiKey = "a8f5376058c57b89eb2148315aa2f653";
var citySearch = document.getElementById("city-search");
var cityResults = document.getElementById("city-results");
var overviewEl = document.getElementById("overview");
var historyList = document.getElementById("search-history-list");
var forecasts = document.getElementById("forecasts");

// load search history from local storage
var loadHistory = function () {
  // load search history from local storage
  historyArr = JSON.parse(localStorage.getItem("city-history"));
  // if nothing in localStorage, create a new object to load city history
  if (!historyArr) {
    historyArr = [];
  } else {
    for (var i = historyArr.length - 1; i >= 0; i--) {
      createHistoryButton(historyArr[i][0], historyArr[i][1]);
    }
  }
};

// save search history to local storage
var saveHistory = function () {
  // save history to local storage location
  localStorage.setItem("city-history", JSON.stringify(historyArr));
};

// clear history and save
var clearHistory = function () {
  historyArr = [];
  saveHistory();
};

// initialize page using cityData input, otherwise load using last value in search or default
var loadMain = function (cityData, cityName, stateCode) {
  // clear overview & forecast
  removeAllChildren(overviewEl);
  removeAllChildren(forecasts);

  currentStats = cityData.current;
  // update overview
  var overviewHeader = document.createElement("div");
  overviewHeader.className = "row justify-content-center";
  var cityResultsH2 = document.createElement("h2");
  cityResultsH2.textContent =
    cityName +
    " " +
    stateCode +
    " " +
    moment.unix(currentStats.dt).format("MM/DD/YYYY");
  var cityResultsSpan = document.createElement("span");
  cityResultsSpan.className = "oi oi-cloud";
  overviewHeader.append(cityResultsH2);
  overviewHeader.append(cityResultsSpan);
  var overviewBody = document.createElement("div");
  overviewBody.className = "row justify-content-around";
  var currTemp = document.createElement("p");
  currTemp.textContent = "Temp: " + Math.round(currentStats.temp,0) + " F";
  var currWind = document.createElement("p");
  currWind.textContent = "Wind: " + Math.round(currentStats.wind_speed,0) + " MPH";
  var currHumidity = document.createElement("p");
  currHumidity.textContent = "Humidity: " + currentStats.humidity + "%";

  var uvDiv = document.createElement("div");
  var uvLabel = document.createElement("p");
  uvLabel = "UV: ";
  var uvSpan = document.createElement("span");
  uvSpan.textContent = currentStats.uvi;
  uvDiv.append(uvLabel);
  uvDiv.append(uvSpan);

  overviewBody.append(currTemp);
  overviewBody.append(currWind);
  overviewBody.append(currHumidity);
  overviewBody.append(uvDiv);

  overviewEl.append(overviewHeader);
  overviewEl.append(overviewBody);

  // update 5 day forecast
  var forecast = cityData.daily;
  //   var forecasts = document.getElementById("forecasts");
  var forecastH3 = document.createElement("h3");
  forecastH3.textContent = "5 Day Forecast";
  forecastH3.className = "text-center";
  forecasts.append(forecastH3);
  var forecast5EL = document.createElement("div");
  forecast5EL.id = "forecast5";
  forecast5EL.className = "row justify-content-between";
  for (var i = 1; i < 6; i++) {
    daily = forecast[i];
    var card = document.createElement("article");
    card.className = "col-2 card m-0";
    var date = document.createElement("h3");
    // date.className="card-title";
    date.textContent = moment.unix(daily.dt).format("MM/DD/YYYY");

    var icon = document.createElement("span");
    icon.className = "oi oi-cloud";

    var temp = document.createElement("p");
    temp.textContent = "Temp: " + Math.round(daily.temp.day,0) +" F";

    var wind = document.createElement("p");
    wind.textContent = "Wind: " + Math.round(daily.wind_speed,0) + " MPH";

    var humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + daily.humidity+ "%";

    card.append(date);
    card.append(icon);
    card.append(temp);
    card.append(wind);
    card.append(humidity);
    forecast5EL.append(card);
  }
  forecasts.append(forecast5EL);
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
// TODO: don't add button unless results are returned
// TODO: Add clear history button
var createHistoryButton = function (cityName, stateCode) {
  var cityLi = document.createElement("li");
  var cityBtn = document.createElement("button");
  cityBtn.setAttribute("data-city-name", cityName);
  cityBtn.setAttribute("data-state-code", stateCode);
  cityBtn.textContent = cityName + ", " + stateCode;
  cityBtn.className = "btn";
  cityLi.append(cityBtn);
  historyList.append(cityLi);
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

var historyBtnHandler = function (event) {
  event.preventDefault();
  var cityName = event.target.getAttribute("data-city-name");
  var stateCode = event.target.getAttribute("data-state-code");
  getLatLon(cityName, stateCode);
};

var removeAllChildren = function (parentEl) {
  while (parentEl.firstChild) {
    parentEl.removeChild(parentEl.firstChild);
  }
};

// event listener for submit search button
citySearch.addEventListener("submit", submitBtnHandler);
historyList.addEventListener("click", historyBtnHandler);

// load history from local storage and initialize page using historical result or default
loadHistory();
if (historyArr.length < 1) {
  getLatLon("New York", "NY");
} else {
  var lastEl = historyArr.length - 1;
  getLatLon(historyArr[lastEl][0], historyArr[lastEl][1]);
}
