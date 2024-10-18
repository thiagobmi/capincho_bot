import { timeConverter } from './utils.js';

const CLIMATE_API_KEY = process.env.CLIMATE_API_KEY;

const icons =
{
    "01d": "☀️",
    "02d": "⛅️",
    "03d": "☁️",
    "04d": "☁️",
    "09d": "\uD83C\uDF27",
    "10d": "\uD83C\uDF26",
    "11d": "⛈",
    "13d": "❄️",
    "50d": "\uD83C\uDF2B",
    "01n": "\uD83C\uDF11",
    "02n": "\uD83C\uDF11 ☁",
    "03n": "☁️",
    "04n": "️️☁☁",
    "09n": "\uD83C\uDF27",
    "10n": "☔️",
    "11n": "⛈",
    "13n": "❄️",
    "50n": "\uD83C\uDF2B"
}

export async function sendClimateInfo(input, msg) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(
        input
    )}&units=metric&lang=pt_br&appid=${CLIMATE_API_KEY}`;

    let mensagem
    try {
        await fetch(url)
            .then((res) => res.json())
            .then((data) => {
                if (data?.cod && data.cod === "404") {
                    msg.react('❌')
                }

                mensagem = `O clima em ${data.name} está ${icons[data.weather[0].icon]} ${data.weather[0].description} ${icons[data.weather[0].icon]}.
          \n🌡Temperatura: ${data.main.temp}°C
          \n📊Sensação térmica: ${data.main.feels_like}°C
          \n💧Umidade do ar: ${data.main.humidity}%
          \n🍃Vento: ${data.wind.speed}m/s
          \n⏱Horário Local: ${timeConverter(data.dt + data.timezone + 10800)} [GMT${(data.timezone / 3600)}]`

                msg.react(icons[data.weather[0].icon]);
                msg.reply(mensagem).then(() => {
                }).catch(error => console.log('error: ', error));

            });
    } catch (error) {
        console.log('error: ', error)
    }

}
