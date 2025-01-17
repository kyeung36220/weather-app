import "./styles.css"
import sunnySvg from "./icons/sunny.svg"
import snowySvg from "./icons/snowy.svg"
import rainySvg from "./icons/rainy.svg"
import cloudySvg from "./icons/cloudy.svg"

const searchBtn = document.querySelector("#searchBtn")
const input = document.querySelector("#city")
const tempSwitch = document.querySelector(".switch input") 

searchBtn.addEventListener("click", async function getWeather() {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${input.value}?key=FAAZDZLJKGFB3VCFH4Y3JMAF7 `, {mode: 'cors'})
        const weatherData = await response.json()

        const currentTemp = weatherData.currentConditions.temp
        const currentFeels = weatherData.currentConditions.feelslike
        const currentMin = weatherData.days[0].tempmin
        const currentMax = weatherData.days[0].tempmax

        document.querySelector("#locationName").textContent = weatherData.resolvedAddress
        document.querySelector("#todayDescription").textContent = weatherData.description
        document.querySelector("#todayTemp").textContent = `${Math.round(currentTemp)}°F`
        document.querySelector("#todayWeather").textContent = weatherData.currentConditions.conditions
        document.querySelector("#todayFeelsLike").textContent = `Feels like: ${currentFeels}°F`
        document.querySelector("#todayMinMax").textContent = `Min/Max: ${currentMin}°F/${currentMax}°F`
        
        if (tempSwitch.checked) {
            changeTempStyle(currentTemp, currentFeels, currentMin, currentMax)
        }

        const icon = weatherData.currentConditions.icon
        if (icon.includes("rain")) {
            document.querySelector("#imageContainer img").src = rainySvg
        }
        else if (icon.includes("snow")) {
            document.querySelector("#imageContainer img").src = snowySvg
        }
        else if (icon.includes("cloudy")) {
            document.querySelector("#imageContainer img").src = cloudySvg
        }
        else {
            document.querySelector("#imageContainer img").src = sunnySvg
        }

        const currentHour = weatherData.currentConditions.datetime.split(":")[0]

        if (currentHour < 13 && currentHour > 5) {
            document.documentElement.style.setProperty('--backgroundColor', 'var(--day-backgroundColor)')
            document.documentElement.style.setProperty('--textColor', 'black')
        }
        else if (currentHour < 21 && currentHour > 13) {
            document.documentElement.style.setProperty('--backgroundColor', 'var(--evening-backgroundColor)')
            document.documentElement.style.setProperty('--textColor', 'white')
        }
        else {
            document.documentElement.style.setProperty('--backgroundColor', 'var(--night-backgroundColor)')
            document.documentElement.style.setProperty('--textColor', 'white')
        }
     
    } catch(err) {
        console.log(err)
        alert("Location not found")
    }
})

tempSwitch.addEventListener("change", () => {
    const currentTemp = Number(document.querySelector("#todayTemp").textContent.split("°")[0])
    const currentFeels = Number(document.querySelector("#todayFeelsLike").textContent.split("°")[0].split(":")[1].trim())
    const currentMin = Number(document.querySelector("#todayMinMax").textContent.split("/")[1].split(":")[1].split("°")[0].trim())
    const currentMax = Number(document.querySelector("#todayMinMax").textContent.split("/")[2].split("°")[0])

    changeTempStyle(currentTemp, currentFeels, currentMin, currentMax)
})

function farToCel(number) {
    console.log(number)
    return Math.round((number - 32) * (5/9))
}

function celToFar(number) {
    return Math.round((number * (9/5)) + 32)
}

function changeTempStyle(current, feels, min, max) {
    console.log(current)
    if (tempSwitch.checked) {
        document.querySelector("#todayTemp").textContent = `${farToCel(current)}°C`
        document.querySelector("#todayFeelsLike").textContent = `Feels like: ${farToCel(feels)}°C`
        document.querySelector("#todayMinMax").textContent = `Min/Max: ${farToCel(min)}°C/${farToCel(max)}°C`
    }
    else {
        document.querySelector("#todayTemp").textContent = `${celToFar(current)}°F`
        document.querySelector("#todayFeelsLike").textContent = `Feels like: ${celToFar(feels)}°F`
        document.querySelector("#todayMinMax").textContent = `Min/Max: ${celToFar(min)}°F/${celToFar(max)}°F`
    }
}