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
  }
  //   create history button starting with most recent search and add buttons until 4 buttons are shown
  else {
    var itemCount = 1;
    for (var i = historyArr.length - 1; i >= 0 && itemCount <= 4; i--) {
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

// clear history array and save to local storage (currently not used)
var clearHistory = function () {
  historyArr = [];
  saveHistory();
};
// TODO: break into 2 sub-functions for overview & forecast
// TODO: remove erroneous nesting
// initialize page using cityData input
var loadMain = function (cityData, cityName, stateCode) {
  // clear children overview & forecast elements
  removeAllChildren(overviewEl);
  removeAllChildren(forecasts);
  // get current city
  var currentStats = cityData.current;
  //  create divs to load within overview split by text & image
  var overviewMain = document.createElement("div");
  var overviewImg = document.createElement("div");
  // create div within overview to hold h2 and add text for location & date
  var overviewHeader = document.createElement("div");
  var cityResultsH2 = document.createElement("h2");
  cityResultsH2.textContent =
    cityName +
    ", " +
    stateCode +
    "   (" +
    moment.unix(currentStats.dt).format("M/D/YY") +
    ")";
  cityResultsH2.className = "text-center";
  //   create image source using open weather by passing icon id from current date
  var cityResultsImg = document.createElement("img");
  cityResultsImg.className = "w-auto";
  var weatherIcon =
    "http://openweathermap.org/img/wn/" +
    currentStats.weather[0].icon +
    "@2x.png";
  cityResultsImg.setAttribute("src", weatherIcon);
  // add alt text if icon description from current date
  var weatherAlt = currentStats.weather[0].description;
  cityResultsImg.setAttribute("alt", weatherAlt);
  overviewHeader.append(cityResultsH2);
  //   create body element to hold current date stats
  var overviewBody = document.createElement("div");
  overviewBody.className = "row align-self-center justify-content-around";
  //   create current temp element  & add relevant classes
  var currTemp = document.createElement("p");
  currTemp.textContent = "Temp: " + Math.round(currentStats.temp, 0) + " F";
  currTemp.className = "ml-2 col-sm-2";
  //   create current wind element  & add relevant classes
  var currWind = document.createElement("p");
  currWind.textContent =
    "Wind: " + Math.round(currentStats.wind_speed, 0) + " MPH";
  currWind.className = "ml-2 col-sm-2";
  //   create current humidity element & add relevant classes
  var currHumidity = document.createElement("p");
  currHumidity.textContent = "Humidity: " + currentStats.humidity + "%";
  currHumidity.className = "ml-2 col-sm-2";
  //   create current UV element & add relevant classes
  var uvDiv = document.createElement("div");
  uvDiv.className = "ml-2 col-sm-2";
  var uvLabel = document.createElement("p");
  uvLabel = "UV: ";
  var uvSpan = document.createElement("span");
  //   add color to UVSpan based on uv index value
  uvSpan.textContent = currentStats.uvi;
  if (currentStats.uvi <= 0.5) {
    uvSpan.className = "bg-success rounded px-2";
  } else if (currentStats.uvi <= 0.75) {
    uvSpan.className = "bg-warning rounded px-2";
  } else {
    uvSpan.className = "bg-danger rounded px-2";
  }
  //   append uv index items to uv index div
  uvDiv.append(uvLabel);
  uvDiv.append(uvSpan);
  // append stats text to overview body
  overviewBody.append(currTemp);
  overviewBody.append(currWind);
  overviewBody.append(currHumidity);
  overviewBody.append(uvDiv);
  // append header and body text elemnts to overview main
  overviewMain.append(overviewHeader);
  overviewMain.append(overviewBody);
  // append image to overviewImg
  overviewImg.append(cityResultsImg);
  // append main and image to overview element
  overviewEl.append(overviewMain);
  overviewEl.append(overviewImg);
  // update 5 day forecast
  //   pull forecast data from citydata object
  var forecast = cityData.daily;
//   create header for 5 day forecast and add relevent classes
  var forecastH3 = document.createElement("h3");
  forecastH3.textContent = "5 Day Forecast";
  forecastH3.className = "text-center mb-4";
//   append h3 to forecasts div
  forecasts.append(forecastH3);
//   create div to hold forecast cards and add relevant attributes & classes
  var forecast5EL = document.createElement("div");
  forecast5EL.id = "forecast5";
  forecast5EL.className = "row justify-content-between";
//   for 5 future days create card and append to forecast card div
  for (var i = 1; i < 6; i++) {
    // get forecast for daily[i]
    daily = forecast[i];
    // create card element and relevant classes
    var card = document.createElement("article");
    card.className = "col-12 col-md-2 my-2 card p-0 bg-dark h-75";
    // create header h3 for date & format
    var date = document.createElement("h3");
    date.className = "p-0 text-center bg-secondary text-white forecast-date";
    date.textContent = moment.unix(daily.dt).format("ddd M/D/YY");
// create card body to hold weather stats & add relevant classes
    var cardBody = document.createElement("div");
    cardBody.className = "pl-2 bg-dark text-light";
// create card image and create link for image source 
    var dailyResultsImg = document.createElement("img");
    var dailyWeatherIcon =
      "http://openweathermap.org/img/wn/" + daily.weather[0].icon + "@2x.png";
    //   get image alt from description & set attributes
    var dailyWeatherAlt = daily.weather[0].description;
    dailyResultsImg.setAttribute("src", dailyWeatherIcon);
    dailyResultsImg.setAttribute("alt", dailyWeatherAlt);
// create p element to hold rounded temp
    var temp = document.createElement("p");
    temp.textContent = "Temp: " + Math.round(daily.temp.day, 0) + " F";
// create p element to hold rounded wind
    var wind = document.createElement("p");
    wind.textContent = "Wind: " + Math.round(daily.wind_speed, 0) + " MPH";
// create p element to hold rounded humidity
    var humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + daily.humidity + "%";
// append image & stats to body of card
    cardBody.append(dailyResultsImg);
    cardBody.append(temp);
    cardBody.append(wind);
    cardBody.append(humidity);
// append date header and body to card div
    card.append(date);
    card.append(cardBody);
    // append card div to forecasts div
    forecast5EL.append(card);
  }
//   append 5 day forcast to forecasts div
  forecasts.append(forecast5EL);
};

// get weather data for a city from API
var getForecast = function (lat, lon, cityName, stateCode) {
  // create api url from lat lon
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
        // call function to load page with forecast data and city text inputs
        loadMain(data, cityName, stateCode);
      });
    } else {
      // alert if there is an error
      alert("Error: " + response.statusText);
    }
  });
};

// get lat lon from city and state
var getLatLon = function (cityName, stateCode) {
  // create api url from city name and state to retrieve lat lon
  var apiUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "," +
    stateCode +
    ",US&appid=" +
    apiKey;
  // fetch api url
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        // upon reponse, get forecast data through passing lat, lon and city text inputs
        getForecast(data[0].lat, data[0].lon, cityName, stateCode);
      });
    } else {
      // alert if there is an error
      alert("Error: " + response.statusText);
    }
  });
};

// TODO: don't add button unless results are returned
// TODO: Add clear history button
// TODO: Make entire button clickable

// create history button for a city
var createHistoryButton = function (cityName, stateCode) {
  // create city list element ad add relevant classes for formatting
  var cityLi = document.createElement("li");
  cityLi.className =
    "col-5 mx-1 col-lg-10 list-group-item mt-2 mb-2 rounded  prev-city  bg-info";
  // create button to go inside element
  var cityBtn = document.createElement("button");
  //   add city & state attributes to button for use when loading results from history
  cityBtn.setAttribute("data-city-name", cityName);
  cityBtn.setAttribute("data-state-code", stateCode);
  //   set text content to city & state
  cityBtn.textContent = cityName + ", " + stateCode;
  //   add relevant classes
  cityBtn.className = "btn btn-block p-0  text-white";
  //   append button to list item and list item to history list
  cityLi.append(cityBtn);
  historyList.append(cityLi);
};

// submit button handler load forecast of new search
var submitBtnHandler = function (event) {
  event.preventDefault();
  //   split input into city & state code from city input
  var inputEl = document.getElementById("city");
  var inputString = inputEl.value;
  var cityName = inputString.split(",")[0].trim();
  var stateCode = inputString.split(",")[1].trim();
  //   add new search to history list
  historyArr.push([cityName, stateCode]);
  //   save history to history array and update history list buttons
  saveHistory();
  loadHistory();
  //   call function to get lat lon of city state
  getLatLon(cityName, stateCode);
};

// history button handler that loads forecast of previous search
var historyBtnHandler = function (event) {
  event.preventDefault();
  var cityName = event.target.getAttribute("data-city-name");
  var stateCode = event.target.getAttribute("data-state-code");
  getLatLon(cityName, stateCode);
};

// remove all children from an element
var removeAllChildren = function (parentEl) {
  while (parentEl.firstChild) {
    parentEl.removeChild(parentEl.firstChild);
  }
};

// event listener for submit search button
citySearch.addEventListener("submit", submitBtnHandler);
// event listener for history button click
historyList.addEventListener("click", historyBtnHandler);

// load history from local storage and initialize page using historical result or default of nyc
loadHistory();
if (historyArr.length < 1) {
  getLatLon("New York", "NY");
} else {
  var lastEl = historyArr.length - 1;
  getLatLon(historyArr[lastEl][0], historyArr[lastEl][1]);
}
