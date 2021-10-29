const weatherApiKey = '5c44a1eebb8047a8aa165327212610'//https://www.weatherapi.com/
const newsApiKey = '54b1e371b99d4e05abcac90ff24ae908'//https://newsapi.org/

const weatherInput = document.getElementById("city-input");
const submitForm = document.getElementById("city-submit")
const form = document.getElementById("news-form")
const allArtTitles = Array.from(document.querySelectorAll(".art1Title"))
const allArtContents = Array.from(document.querySelectorAll(".art1Content"))
const allArtImages = Array.from(document.querySelectorAll(".art1Img"))
const readMore = Array.from(document.querySelectorAll(".button"))
const weatherCard = document.querySelector(".weather6")
const weatherTitle = document.getElementById("weatherTitle")
const weatherImg = document.getElementById("weatherImg")
const windText = document.getElementById("windText")
const humidityText = document.getElementById("humidityText")
const weatherType = document.getElementById("weatherType")
const weatherTemp = document.getElementById("weatherTemp")
const date = document.querySelector('.currDate')
const allCards = document.querySelectorAll('.card1, .card2, .card3, .card4, .card5')//select only articles
const noNews = document.querySelector('.noNews')
const noWeather = document.querySelector('.noWeather')
const userLocation = document.querySelector('.userLocation')
const cards = document.querySelector('.cards')
let currCity

//Identify user location by his IP-Address and load the page with it by defualt
fetch('https://api.db-ip.com/v2/free/self')//https://db-ip.com/
    .then(response => {
        if (!response.ok) throw new Error(response.status)
        return response.json();
    })
    .then(ipLookUp => {
        fetchIt(ipLookUp.city)
        currCity = ipLookUp.city
    })
    .catch(error => {
        console.error(error)
        getWarning("[DB-IP API] We couldn't find your location", 'userLocation')
    });

form.addEventListener("submit", event => {

    event.preventDefault();
    let input = weatherInput.value != "" ? weatherInput.value : currCity;//empty input => get data from api for the city we get from userIP. 
    fetchIt(input);
})

function fetchIt(weatherInputValue) {
    //get data from weather API based on user input
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${weatherInputValue}&days=7&aqi=no&alerts=no`)
        .then(response => {
            if (!response.ok) throw new Error(response.status);
            return response.json();
        })
        .then(weather => {
            //countryCodes has a code name for every country we use it as a manipulation between the country name and it code name.
            //Create a weather card after the api request:
            let currCountry = countryCodes.find(element => element.Name == weather.location.country).Code.toLowerCase();
            weatherTitle.textContent = weather.location.name + " - " + weather.location.country;
            weatherImg.src = weather.current.condition.icon
            windText.textContent = "Wind: " + weather.current.wind_kph + "Km/h"
            humidityText.textContent = "Humidity: " + weather.current.humidity + "%"
            weatherTemp.textContent = weather.current.temp_c + "\u2103"
            weatherType.textContent = weather.current.condition.text
            date.textContent = weather.forecast.forecastday[0].date

            //from weather api we extract the country name and use it for the second API => news api
            fetch(`https://newsapi.org/v2/top-headlines?country=${currCountry}&apiKey=${newsApiKey}`)
                .then(response => {
                    if (!response.ok) throw new Error(response.status);
                    return response.json();
                })
                .then(news => {
                    const articlesArr = news.articles;
                    //api may return an empty string when it doesn't find data for some countries
                    if (!articlesArr.length) {
                        removeWarning();
                        //getWarning handle an error of no data recieved and shows it to the user.
                        getWarning("The News API doesn't provide news for some countries, We deeply apologies", 'news');
                        return -1;
                    } else {
                        removeWarning();//get the old styling back if an error happened before.
                    }
                    //api give us data that sometimes it comes short => without description or image; so we filter the array => we get less data.
                    let fixedArticles = articlesArr.filter(item => item.urlToImage != null && item.description != '');

                    //Create a articles after the api request:
                    allArtTitles.forEach((element, index) => {
                        element.textContent = fixedArticles[index].title;
                    })
                    allArtContents.forEach((element, index) => {
                        element.textContent = fixedArticles[index].description;
                    })
                    allArtImages.forEach((element, index) => {
                        element.src = fixedArticles[index].urlToImage;
                    })
                    readMore.forEach((element, index) => {
                        element.href = fixedArticles[index].url;
                        element.style.display = 'block'
                    })
                })
                .catch(error => {
                    console.error(error)
                    if (error.message === "400") {
                        console.log(`[NEWS API]: Couldnt Find Country with this code ${currCountry}`)
                        getWarning("The News API doesn't provide news for some countries, We deeply apologies", 'news');
                    } else {
                        getWarning('[NEWS API]: Unexpected Error', 'news');
                    }
                });
        })
        .catch(error => {
            console.error(error)
            if (error.message === "400") {
                getWarning(`[WEATHER API]: ${weatherInput.value} Is not a valid city`, 'weather');
            } else {
                getWarning('[WEATHER API]: Unexpected Error', 'weather');
            }
        });
}

function getWarning(str, dataFrom) {//dataFrom is like a flag for APIs
    for (let n of allCards) {
        n.classList.add('allCardsView')//hide all articles
    }
    cards.classList.add('cardsParent')//chnage display
    if (dataFrom == 'news') {
        weatherCard.classList.add('alterWeatherCard')//adjust styling
        noNews.style.display = 'block'
        noWeather.style.display = 'none'
        userLocation.style.display = 'none'
    } else if (dataFrom == 'userLocation') {
        weatherCard.classList.add('allCardsView')//hide weather card
        userLocation.style.display = 'block'
        noNews.style.display = 'none'
        noWeather.style.display = 'none'
    } else {
        weatherCard.classList.add('allCardsView')//hide weather card
        noWeather.style.display = 'block'
        noNews.style.display = 'none'
        userLocation.style.display = 'none'
    }
    return console.log(str);
}

function removeWarning() {
    for (let n of allCards) {
        n.classList.remove('allCardsView')
    }
    weatherCard.classList.remove('alterWeatherCard')
    weatherCard.classList.remove('allCardsView')
    cards.classList.remove('cardsParent')
    noNews.style.display = 'none'
    noWeather.style.display = 'none'
    return -1;
}
