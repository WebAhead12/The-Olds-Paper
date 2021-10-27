const weatherApiKey = '5c44a1eebb8047a8aa165327212610'
const newsApiKey = 'e578049dacd34ecdb9206efe077eec92'

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
const allCards = document.querySelectorAll('.card1, .card2, .card3, .card4, .card5')
const noNews = document.querySelector('.noNews')
const cards = document.querySelector('.cards')


fetchIt('Haifa');

form.addEventListener("submit", event => {

    event.preventDefault();
    let input = weatherInput.value != "" ? weatherInput.value : 'Haifa';
    fetchIt(input);
})

function fetchIt(weatherInputValue) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${weatherInputValue}&days=7&aqi=no&alerts=no`)
        .then(response => {
            if (!response.ok) throw new Error(response.status);
            return response.json();
        })
        .then(weather => {
            let currCountry = countryCodes.find(element => element.Name == weather.location.country).Code.toLowerCase();
            weatherTitle.textContent = weather.location.name + " - " + weather.location.country;
            weatherImg.src = weather.current.condition.icon
            windText.textContent = "Wind: " + weather.current.wind_kph + "Km/h"
            humidityText.textContent = "Humidity: " + weather.current.humidity + "%"
            weatherTemp.textContent = weather.current.temp_c + "\u2103"
            weatherType.textContent = weather.current.condition.text
            date.textContent = weather.forecast.forecastday[0].date

            fetch(`https://newsapi.org/v2/top-headlines?country=${currCountry}&apiKey=${newsApiKey}`)
                .then(response => {
                    if (!response.ok) throw new Error(response.status);
                    return response.json();
                })
                .then(news => {
                    const articlesArr = news.articles;
                    if (!articlesArr.length) {
                        console.log("The News API doesn't provide news for some countries, We deeply apologies")
                        for (let n of allCards) {
                            n.style.display = 'none'
                        }
                        weatherCard.style.margin = '0 auto'
                        noNews.style.display = 'block'
                        cards.style.display = 'flex'
                        cards.style.flexDirection = 'column'
                        return -1;
                    }
                    let fixedArticles = articlesArr.filter(item => item.urlToImage != null && item.description != '');
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
                    } else {
                        console.log(`[NEWS API]: Unexpected Error`)
                    }
                });
        })
        .catch(error => {
            if (error.message === "400") {
                console.log(`[WEATHER API]: ${weatherInput.value} Is not a valid city`)
            } else {
                console.error(error)
                console.log(`[WEATHER API]: Unexpected Error`);
            }
        });
}