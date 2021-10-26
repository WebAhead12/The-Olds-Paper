const weatherApiKey = '5c44a1eebb8047a8aa165327212610'
const newsApiKey = 'e578049dacd34ecdb9206efe077eec92'

const weatherInput = document.getElementById("city-input");
const submitForm = document.getElementById("city-submit")
const form = document.getElementById("news-form")

let currCountry = "";

form.addEventListener("submit", event => {
    event.preventDefault();
    if (weatherInput.value != "") {
        fetch(`http://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${weatherInput.value}&days=7&aqi=no&alerts=no`).then(response => {
            if (!response.ok) throw new Error(response.status);
            return response.json();
        }).then(json1 => {
            console.log(json1);
            currCountry = countryCodes.find(element => element.Name == json1.location.country).Code.toLowerCase();
            fetch(`https://newsapi.org/v2/top-headlines?country=${currCountry}&apiKey=${newsApiKey}`).then(response => {
                if (!response.ok) throw new Error(response.status);
                return response.json();
            }).then(json => {
                console.log(json);
                const articlesArr = json.articles;
                let index = 0;
                const allArtTitles = Array.from(document.querySelectorAll(".art1Title"))
                const allArtContents = Array.from(document.querySelectorAll(".art1Content"))
                const allArtImages = Array.from(document.querySelectorAll(".art1Img"))

                allArtTitles.forEach((element) => {
                    element.textContent = articlesArr[index].title;
                    index++;
                })
                index = 0;
                allArtContents.forEach((element) => {
                    element.textContent = articlesArr[index].description;
                    index++;
                })
                index = 0;
                allArtImages.forEach((element) => {
                    element.src = articlesArr[index].urlToImage;
                    element.width = "80"
                    element.height = "30"
                    index++;
                })
            }).catch(error => {
                if (error.message === "400") {
                    console.log(`${weatherInput.value} Is not a real city`)
                } else {
                    console.error(error)
                    console.log(`Unexpected Error 1`);
                }
            });
            const weatherTitle = document.getElementById("weatherTitle")
            const weatherImg = document.getElementById("weatherImg")
            const windText = document.getElementById("windText")
            const humidityText = document.getElementById("humidityText")
            const weatherType = document.getElementById("weatherType")
            const weatherTemp = document.getElementById("weatherTemp")

            weatherTitle.textContent = json1.location.name + " - " + json1.location.country;
            weatherImg.src = json1.current.condition.icon
            windText.textContent = "Wind: " + json1.current.wind_kph + "Km/h"
            humidityText.textContent = "Humidity: " + json1.current.humidity + "%"
            weatherTemp.textContent = json1.current.temp_c + "\u2103"
            weatherType.textContent = json1.current.condition.text
        }).catch(error => {
            if (error.message === "400") {
                console.log(`${weatherInput.value} Is not a real city`)
            } else {
                console.error(error)
                console.log(`Unexpected Error 2`);
            }
        });
    }




})
