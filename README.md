# Weather Dashboard, Server-Side API's - Homework 6, UW Coding Bootcamp

## Description

For the sixth week of the UW Coding Bootcamp my homework invited me to create a weather dashboard application that uses a third-party API to access specific weather data and functionality by making requests with specific parameters to a URL. It runs in the browser and features dynamically updated HTML, CSS and Javascript.

To use the application, the user will enter the name of a city in a search field where by clicking the 'search button' usinging the Open Weather Map data API the application will populate the current weather conditions in that city. The information will include temperature, humidity, UV index, along with pictures representing the weather conditions. In addition, there will be a 5-day forecast for the city entered.

## User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

## Built With

* [Bootstrap](https://stackpath.bootstrapcdn.com)
* [Font Awesome](https://kit.fontawesome.com)
* [Google Fonts](https://fonts.googleapis.com)
* [Open Weather Map API](https://api.openweathermap.org)
* [Developer Mozilla](https://developer.mozilla.org)

## Deployed Link

* [See Live Site](https://spencee1315.github.io/hw_wk6/)

## Preview of Working Site

![Image1](/assets/WeatherDashboard.png)

## Code Snippet
This a code snippet using jquery...........

```javascript
function getWeather(cityName) {
//  Using saved city name, execute a current condition get request from open weather map api
      let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
      axios.get(queryURL)
      .then(function(response){
          console.log(response);
//  Parse response to display current conditions
      //  Method for using "date" objects obtained from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
          const currentDate = new Date(response.data.dt*1000);
          console.log(currentDate);
          const day = currentDate.getDate();
          const month = currentDate.getMonth() + 1;
          const year = currentDate.getFullYear();
          nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
          let weatherPic = response.data.weather[0].icon;
          currentPicEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
          currentPicEl.setAttribute("alt",response.data.weather[0].description);
          currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
          currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
          currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
      let lat = response.data.coord.lat;
      let lon = response.data.coord.lon;
      let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
      axios.get(UVQueryURL)
      .then(function(response){
          let UVIndex = document.createElement("span");
          UVIndex.setAttribute("class","badge badge-danger");
          UVIndex.innerHTML = response.data[0].value;
          currentUVEl.innerHTML = "UV Index: ";
          currentUVEl.append(UVIndex);
      });
```

### Authors

* **Elliott Spencer**

### Contact Information

* [Link to Portfolio Site](https://spencee1315.github.io/hw_wk2/)

* [Link to Github](https://github.com/spencee1315)

* [Link to LinkedIn](https://www.linkedin.com/in/elliott-spencer-886a9818/)
