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

fetchIt('Haifa');

form.addEventListener("submit", event => {

    event.preventDefault();
    let input = weatherInput.value != "" ? weatherInput.value : 'Haifa';
    fetchIt(input);
})

function fetchIt(weatherInputValue) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${weatherInputValue}&days=7&aqi=no&alerts=no`).then(response => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
    }).then(json1 => {
        let currCountry = countryCodes.find(element => element.Name == json1.location.country).Code.toLowerCase();
        fetch(`https://newsapi.org/v2/top-headlines?country=${currCountry}&apiKey=${newsApiKey}`).then(response => {
            if (!response.ok) throw new Error(response.status);
            return response.json();
        }).then(json => {
            console.log(json);
            const articlesArr = json.articles;
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
        }).catch(error => {
            if (error.message === "400") {
                console.log(`[NEWS API]: Couldnt Find Country with this code ${currCountry}`)
            } else {
                console.error(error)
                console.log(`[NEWS API]: Unexpected Error`);
            }
        });

        weatherTitle.textContent = json1.location.name + " - " + json1.location.country;
        weatherImg.src = json1.current.condition.icon
        windText.textContent = "Wind: " + json1.current.wind_kph + "Km/h"
        humidityText.textContent = "Humidity: " + json1.current.humidity + "%"
        weatherTemp.textContent = json1.current.temp_c + "\u2103"
        weatherType.textContent = json1.current.condition.text
        date.textContent = json1.forecast.forecastday[0].date

    }).catch(error => {
        if (error.message === "400") {
            console.log(`[WEATHER API]: ${weatherInput.value} Is not a valid city`)
        } else {
            console.error(error)
            console.log(`[WEATHER API]: Unexpected Error`);
        }
    });
}
