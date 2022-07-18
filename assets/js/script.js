var historyArr = [];
var apiKey = "a8f5376058c57b89eb2148315aa2f653";
var citySearch = document.getElementById("city-search");
var cityResults = document.getElementById("city-results");
var overviewEl = document.getElementById("overview");
var historyList = document.getElementById("search-history-list");
var forecasts = document.getElementById("forecasts");

// load search history from local storage
var loadHistory = function () {
  removeAllChildren(historyList);
  // load search history from local storage
  historyArr = JSON.parse(localStorage.getItem("city-history"));
  // if nothing in localStorage, create a new object to load city history
  if (!historyArr) {
    historyArr = [];
  } else {
    var itemCount = 1;
    for (var i = historyArr.length - 1; i >= 0 && itemCount <= 6; i--) {
      createHistoryButton(historyArr[i][0], historyArr[i][1]);
      itemCount++;
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

  var overviewMain = document.createElement("div");
  var overviewImg = document.createElement("div");
  // update overview
  var overviewHeader = document.createElement("div");
//   overviewHeader.className = "row justify-content-center";
  var cityResultsH2 = document.createElement("h2");
  cityResultsH2.textContent =
    cityName +
    ", " +
    stateCode +
    "   (" +
    moment.unix(currentStats.dt).format("M/D/YY") +
    ")";
  cityResultsH2.className = "text-center";
  var cityResultsImg = document.createElement("img");
  cityResultsImg.className = "w-auto";
  var weatherIcon =
    "http://openweathermap.org/img/wn/" +
    currentStats.weather[0].icon +
    "@2x.png";
  var weatherAlt = currentStats.weather[0].description;
  cityResultsImg.setAttribute("src", weatherIcon);
  cityResultsImg.setAttribute("alt", weatherAlt);
  overviewHeader.append(cityResultsH2);
  var overviewBody = document.createElement("div");
  overviewBody.className = "row align-self-center justify-content-around";
  var currTemp = document.createElement("p");
  currTemp.textContent = "Temp: " + Math.round(currentStats.temp, 0) + " F";
  var currWind = document.createElement("p");
  currWind.textContent =
    "Wind: " + Math.round(currentStats.wind_speed, 0) + " MPH";
  var currHumidity = document.createElement("p");
  currHumidity.textContent = "Humidity: " + currentStats.humidity + "%";

  var uvDiv = document.createElement("div");
  var uvLabel = document.createElement("p");
  uvLabel = "UV: ";
  var uvSpan = document.createElement("span");
  uvSpan.textContent = currentStats.uvi;
  if (currentStats.uvi <= 0.5) {
    uvSpan.className = "bg-success rounded";
  } else if (currentStats.uvi <= 0.75) {
    uvSpan.className = "bg-warning rounded";
  } else {
    uvSpan.className = "bg-danger rounded";
  }
  uvDiv.append(uvLabel);
  uvDiv.append(uvSpan);

  overviewBody.append(currTemp);
  overviewBody.append(currWind);
  overviewBody.append(currHumidity);
  overviewBody.append(uvDiv);

  overviewMain.append(overviewHeader);
  overviewMain.append(overviewBody);

  overviewImg.append(cityResultsImg);

  overviewEl.append(overviewMain);
  overviewEl.append(overviewImg);
  // update 5 day forecast
  var forecast = cityData.daily;
  //   var forecasts = document.getElementById("forecasts");
  var forecastH3 = document.createElement("h3");
  forecastH3.textContent = "5 Day Forecast";
  forecastH3.className = "text-center mb-4";
  forecasts.append(forecastH3);
  var forecast5EL = document.createElement("div");
  forecast5EL.id = "forecast5";
  forecast5EL.className = "row justify-content-between";
  for (var i = 1; i < 6; i++) {
    daily = forecast[i];
    console.log(daily);
    var card = document.createElement("article");
    card.className = "col-2 card p-0 bg-dark h-75";
    var date = document.createElement("h3");
    date.className = "p-0 text-center bg-secondary text-white";
    date.textContent = moment.unix(daily.dt).format("ddd M/D/YY");

    var cardBody = document.createElement("div");
    cardBody.className = "pl-2 bg-dark text-light";

    var dailyResultsImg = document.createElement("img");
    var dailyWeatherIcon =
      "http://openweathermap.org/img/wn/" + daily.weather[0].icon + "@2x.png";
    console.log(dailyWeatherIcon);
    var dailyWeatherAlt = daily.weather[0].description;
    dailyResultsImg.setAttribute("src", dailyWeatherIcon);
    dailyResultsImg.setAttribute("alt", dailyWeatherAlt);

    var temp = document.createElement("p");
    temp.textContent = "Temp: " + Math.round(daily.temp.day, 0) + " F";

    var wind = document.createElement("p");
    wind.textContent = "Wind: " + Math.round(daily.wind_speed, 0) + " MPH";

    var humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + daily.humidity + "%";

    cardBody.append(dailyResultsImg);
    cardBody.append(temp);
    cardBody.append(wind);
    cardBody.append(humidity);

    card.append(date);
    card.append(cardBody);
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
  cityLi.className =
    "col-10 list-group-item mt-2 mb-2 rounded  prev-city  bg-info";
  var cityBtn = document.createElement("button");
  cityBtn.setAttribute("data-city-name", cityName);
  cityBtn.setAttribute("data-state-code", stateCode);
  cityBtn.textContent = cityName + ", " + stateCode;
  cityBtn.className = "btn btn-block p-0  text-white";
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
  loadHistory();
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
