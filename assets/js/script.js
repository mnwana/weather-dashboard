var history = [];
var apiKey = 'a8f5376058c57b89eb2148315aa2f653';
var submitBtn = document.getElementById("submit-btn");

// load search history from local storage
var loadHistory = function() {
    
};

// save search history to local storage
var saveHistory = function(){

};

// initialize page using cityData input, otherwise load using last value in search
var initializePage = function(cityData){

};

// get weather data for a city from API
var getApiData = function(cityName,stateCode){
    var cityName="Yonkers";
    var stateCode="NY";
    var latLon = getLatLon(cityName,stateCode);
};

var getLatLon = function(cityName,stateCode){
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+cityName+","+stateCode+",US&appid="+apiKey;
    fetch(apiUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
        console.log(data[0].lat+","+data[0].lon);
        });
      } else {
        return false;
      }
    });
};

// create history button for a city
var createHistoryButton = function(cityName){

};

// get API data for a city, load API Data to page, add search to history
var submitBtnHandler = function(event){

};

// event listener for submit search button
submitBtn.addEventListener("submit",submitBtnHandler);


// load history from local storage and initialize page
// loadHistory();
// initializePage();
getApiData("hello");