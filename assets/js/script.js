var history = [];
var apiKey = "a8f5376058c57b89eb2148315aa2f653";
var citySearch = document.getElementById("city-search");
var main = document.getElementById("city-results");

// load search history from local storage
var loadHistory = function () {
      // load search history from local storage
  history = JSON.parse(localStorage.getItem("city-history"));
  // if nothing in localStorage, create a new object to load city history
  if (!history) {
    history = [];
  }
  // loop over array to populate schedule between 9 am and 5 pm
  for (var i = 0; i < history.length; i++) {
      createHistoryBtn(i, history[i]);
  }
};

// save search history to local storage
var saveHistory = function () {
      // save events to local storage location
  localStorage.setItem("city-history", JSON.stringify(history));
};

// load button to seach history
var createHistoryBtn = function(cityName){

};

// initialize page using cityData input, otherwise load using last value in search
var initializePage = function (cityData) {
    console.log(cityData);
};

// get weather data for a city from API
var getForecast = function (lat,lon) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly&appid="+apiKey;
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        initializePage(data);
      });
    } else {
      alert('Error: ' + response.statusText);
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
            getForecast(data[0].lat,data[0].lon);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      });
};

// create history button for a city
var createHistoryButton = function (cityName) {};

// get API data for a city, load API Data to page, add search to history
var submitBtnHandler = function (event) {};

// event listener for submit search button
citySearch.addEventListener("submit", submitBtnHandler);

// load history from local storage and initialize page
// loadHistory();
// initializePage();
getLatLon("Yonkers","NY");
