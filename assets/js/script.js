const apiKey = 'c3c64d4e3c7178c77500675eda2f6e2d'
var cities = {}
var prefs = {}

var citySearchInput = $('#city-search-input')
var citySearchButton = $('#city-search-button')
var cityList = $('#city-list')

var unitSwitch = $('#unit-switch')

var cityNameDisplay = $('#city-name-display')
var currentWeatherIcon = $('#current-weather-icon')
var currentWeather = $('#current-weather')
var dateDisplay = $('#date-display')
var currentTemperature = $('#current-temperature')
var currentHumidity = $('#current-humidity')
var currentWindSpeed = $('#current-wind-speed')
var currentUVI = $('#current-uvi')

function init() {
    cities = JSON.parse(localStorage.getItem('WeatherDashboardCities') || '{}')
    prefs = JSON.parse(localStorage.getItem('WeatherDashboardPrefs') || 'null') || {
        units: 'metric',
        city: ''
    }
    unitSwitch.prop('checked', prefs.units != 'metric')
    for (let city of Object.values(cities)) {
        addCityToList(city)
    }
    if (prefs.city)
        getCityByID(prefs.city.id)

    citySearchButton.on('click', event => {
        event.preventDefault()
        var value = citySearchInput.val().split(',').map(v => v.trim())
        getCityByName(...value)
        citySearchInput.val('')
    })
    
    cityList.on('click', '.city-item', event => {
        var cityItem = $(event.target)

        if (event.target.matches('button')) {
            cityItem = cityItem.parent()
            delete cities[cityItem.attr('data-id')]
            cityItem.remove()
            localStorage.setItem('WeatherDashboardCities', JSON.stringify(cities))
            return
        }
        
        let id = cityItem.attr('data-id')
        getCityByID(id)
        cityItem.blur()
    })

    unitSwitch.on('change', event => {
        let checked = event.target.checked

        prefs.units = checked ? 'imperial' : 'metric'

        localStorage.setItem('WeatherDashboardPrefs', JSON.stringify(prefs))

        getCityByID(prefs.city.id)
    })
} init()

function getCityByName(city, region, country) {
    city = city ? city.toProperCase() : ''
    region = region ? region.toUpperCase() : ''
    country = country ? country.toUpperCase() : ''

    let value = (city + (region ? ',' + region : '') + (country ? ',' + country : '')).replace(' ', '+')
    let urlQuery = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${value}&units=${prefs.units}`
    console.log(urlQuery);
    $.ajax({
        url: urlQuery,
        method: 'GET'
    })
    .done(data => {
        var id = data.id
        if (!(id in cities)) {
            var city = {
                id: id,
                lat: data.coord.lat,
                lon: data.coord.lon,
                city: data.name,
                region: region,
                country: country,
                name: data.name + 
                    (region ? ', ' + region : '') + 
                    (country ? ', ' + country : '')
            }
            cities[id] = city
            localStorage.setItem('WeatherDashboardCities', JSON.stringify(cities))
            addCityToList(city)
        }
        getCityByID(id)
    })
    .fail(failedToGetData)
}

function getCityByID(id) {
    let city = cities[id]

    let urlQuery = `https://api.openweathermap.org/data/2.5/onecall?appid=${apiKey}&lat=${city.lat}&lon=${city.lon}&units=${prefs.units}`

    $.ajax({
        url: urlQuery,
        method: 'GET'
    })
    .done(data => {
        displayCity(city, data)
    })
    .fail(failedToGetData)
}

function addCityToList(city) {
    cityList.prepend(
        $(`<div class='city-item' data-id=${city.id} data-name='${city.name}' tabindex='0'></div>`).append(
            $(`<button tabindex='-1'></button>`)
        )
    )
}

const icons = {
    sunny: '☀️',
    cloudy: '☁️',
    partlyCloudy: '⛅',
    rain: '🌧️',
    lightning: '🌩️',
    tornado: '🌪️',
    fog: '🌫',
    fog: '🌫',
}

function displayCity(city, data) {
    let units = prefs.units != 'metric'
    prefs.city = city
    localStorage.setItem('WeatherDashboardPrefs', JSON.stringify(prefs))

    let now = moment.unix(data.current.dt)

    cityNameDisplay.text(city.name)
    let iconPath = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`
    currentWeatherIcon.attr('src', iconPath)
    currentWeather.text(data.current.weather[0].description)
    dateDisplay.text(now.format('dddd, MMMM Do, YYYY'))
    let tempSym =  '°' + (units ? 'F' : 'C')
    currentTemperature.text(Math.round(data.current.temp) + tempSym)
    currentHumidity.text(data.current.humidity + '%')
    currentWindSpeed.text(data.current.wind_speed + ' ' + (units ? 'mph' : 'kph'))

    let uvi = data.current.uvi
    let uviColor = uvi < 3 ? 'green'
                :  uvi < 6 ? 'yellow'
                :  uvi < 8 ? 'orange'
                :  uvi < 11 ? 'red' : 'purple'

    currentUVI.text(data.current.uvi).css('backgroundColor', uviColor)

    for (let i = 1; i < 6; i++) {
        let day = data.daily[i]
        let date = moment.unix(day.dt)
        let card = $(`#forcast-day-${i}`)
        card.find('.forcast-day-of-week').text(date.format('dddd'))
        card.find('.forcast-date').text(date.format('MMM D'))

        let iconPath = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`
        card.find('.forcast-icon').attr('src', iconPath)
        
        card.find('.forcast-temp').text('Temp: ' + Math.round(day.temp.day) + tempSym)
        card.find('.forcast-humidity').text('Humidity: ' + day.humidity + '%')
    }
}

function failedToGetData(x, s, e) {
    console.log({x:x, s:s, e:e});
}