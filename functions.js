
let searchBox = document.getElementById('search-box');

async function fetchWeather(location) {
    if (!location) {
        location = 'Hong Kong';
    }

    try {
        const res = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=8d3ff23f0882438d82d115648231708&q=${location}&days=7&aqi=no&alerts=no`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (res.ok) {
            return await res.json();
        } else {
            alert("Can't find city");
        }
    }
    catch (err) {
        alert("Can't find city");
    }
}

// display current weather data -----

let currWeatherData = new currWeather();

async function getCurrData(location) {
    try {
        const weatherData = await fetchWeather(location);
        currWeatherData.location = weatherData.location.name;
        currWeatherData.temperature = weatherData.current.temp_c + '°';
        currWeatherData.condition = weatherData.current.condition.text;
        currWeatherData.highestTemp = 'H:' + weatherData.forecast.forecastday[0].day.maxtemp_c + '°';
        currWeatherData.lowestTemp = 'L:' + weatherData.forecast.forecastday[0].day.mintemp_c + '°';
    
        displayCurrWeather();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

function displayCurrWeather() {
    const currLocation = document.getElementById('curr-location');
    currLocation.innerText = currWeatherData.location;
    const currTemperature = document.getElementById('curr-temperature');
    currTemperature.innerText = currWeatherData.temperature;
    const currCondition = document.getElementById('curr-condition');
    currCondition.innerText = currWeatherData.condition;
    const currHighestTemp = document.getElementById('curr-highest-temp');
    currHighestTemp.innerText = currWeatherData.highestTemp;
    const currLowestTemp = document.getElementById('curr-lowest-temp');
    currLowestTemp.innerHTML = currWeatherData.lowestTemp;
}

// display hourly forecast ---------

function getCurrTime(weatherData) {
    const currentDateTime = new Date();
    const timeZone = weatherData.location.tz_id;

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        hour12: false,
        minute: 'numeric',
        timeZone: timeZone,
    };

    const formattedTime = currentDateTime.toLocaleString('en-US', options);

    const [datePart, timePart] = formattedTime.split(', ');
    const [monthPart, dayPart, yearPart] = datePart.split('/');
    const [hourPart, minutePart] = timePart.split(':');
    
    const adjustedTime = `${yearPart}-${monthPart}-${dayPart} ${hourPart}:00`;

    return adjustedTime;
}

let hourForecastList = [];

async function getHourForecast(location) {
    try {
        const weatherData = await fetchWeather(location);
        const forecastList = weatherData.forecast.forecastday;

        let nextTimeDataIndex;
        for (let i = 0; i < forecastList[0].hour.length; i++) {
            if (forecastList[0].hour[i].time == getCurrTime(weatherData)) {
                nextTimeDataIndex = i + 1;
            }
        }
        
        let count = 0;
        let toSearchListIndex = 0;
        while (count < 12) {
            if (forecastList[toSearchListIndex].hour[nextTimeDataIndex]) {
                let hourForecastData = new hourWeather();
                hourForecastData.time = hourForecastData.formattedTime(forecastList[toSearchListIndex].hour[nextTimeDataIndex].time);
                hourForecastData.icon_url = forecastList[toSearchListIndex].hour[nextTimeDataIndex].condition.icon;
                hourForecastData.temperature = forecastList[toSearchListIndex].hour[nextTimeDataIndex].temp_c;
                hourForecastList.push(hourForecastData);
                nextTimeDataIndex++;
                count++;
            } else if (!forecastList[toSearchListIndex].hour[nextTimeDataIndex]) {
                toSearchListIndex++;
                nextTimeDataIndex = 0;
            }
        }

        displayHourForecast();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

function displayHourForecast() {
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    swiperWrapper.innerHTML = '';
    
    hourForecastList.forEach(hourForecast => {
        const swiperSlide = document.createElement('div');
        swiperSlide.classList.add('swiper-slide');

        const hourTime = document.createElement('p');
        hourTime.classList.add('hour-time');
        hourTime.textContent = hourForecast.time;

        const hourWeatherIcon = document.createElement('img');
        hourWeatherIcon.classList.add('hour-weather-icon');
        hourWeatherIcon.src = hourForecast.icon_url;

        const hourTemperature = document.createElement('p');
        hourTemperature.classList.add('hour-temperature');
        hourTemperature.textContent = `${Math.trunc(hourForecast.temperature)}°`;

        swiperSlide.appendChild(hourTime);
        swiperSlide.appendChild(hourWeatherIcon);
        swiperSlide.appendChild(hourTemperature);
        swiperWrapper.appendChild(swiperSlide);
    });

    // Initialize or update the Swiper instance after modifying the content
    swiper.update();
}

// display 7 day forecast ---------

let dayForecastList = [];

async function getDayForecast(location) {
    try {
        const weatherData = await fetchWeather(location);
        const forecastList = weatherData.forecast.forecastday;

        for (let i = 0; i < forecastList.length; i++) {
            let dayForecastData = new dayWeather();
            if (i == 0) {
                dayForecastData.day = 'Today';
            }
            else {
                dayForecastData.day = dayForecastData.toWeekday(forecastList[i].date);
            }
            dayForecastData.icon_url = forecastList[i].day.condition.icon;
            dayForecastData.lowestTemp = forecastList[i].day.mintemp_c;
            dayForecastData.highestTemp = forecastList[i].day.maxtemp_c;
            dayForecastList.push(dayForecastData);
        }

        displayDayForecast();

    } catch (err) {
        console.error('Error:', err.message);
    }
}

function displayDayForecast() {
    const daysBlocksContainer = document.querySelector('.days-blocks-container');
    daysBlocksContainer.innerHTML = '';

    dayForecastList.forEach(dayForecast => {

        const dayBlocks = document.createElement('div');
        dayBlocks.classList.add('days-blocks');

        const day = document.createElement('p');
        day.classList.add('day');
        day.textContent = dayForecast.day;

        const dayWeatherIcon = document.createElement('img');
        dayWeatherIcon.classList.add('day-weather-icon');
        dayWeatherIcon.src = dayForecast.icon_url;

        const dayHLContainer = document.createElement('div');
        dayHLContainer.classList.add('day-h-l-container');

        const dayLowestTemp = document.createElement('p');
        dayLowestTemp.classList.add('day-lowest-temp');
        dayLowestTemp.textContent = `${Math.trunc(dayForecast.lowestTemp)}°`;

        const dayHLLine = document.createElement('div');
        dayHLLine.classList.add('day-h-l-line');

        const dayHighestTemp = document.createElement('p');
        dayHighestTemp.classList.add('day-highest-temp');
        dayHighestTemp.textContent = `${Math.trunc(dayForecast.highestTemp)}°`;

        dayHLContainer.appendChild(dayLowestTemp);
        dayHLContainer.appendChild(dayHLLine);
        dayHLContainer.appendChild(dayHighestTemp);

        dayBlocks.appendChild(day);
        dayBlocks.appendChild(dayWeatherIcon);
        dayBlocks.appendChild(dayHLContainer);

        daysBlocksContainer.appendChild(dayBlocks);
    })
}

// init website --------------------

function startWeatherApp() {
    getCurrData();
    getHourForecast();
    getDayForecast();
}

startWeatherApp()

// other functions -----------------

function clearInput() {
    searchBox.value = '';
}

function handleEnter(event) {
    if (event.key === 'Enter') {
        if(searchBox.value === '') {

        }
        else {
            getCurrData(searchBox.value);
            hourForecastList = [];
            getHourForecast(searchBox.value);
            dayForecastList = [];
            getDayForecast(searchBox.value);
            clearInput(); 
        }
    }
}

var swiper = new Swiper(".hour-blocks-container", {
    slidesPerView: 6,
    spaceBetween: 0,
});