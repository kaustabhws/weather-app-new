import React, { useEffect, useState } from 'react'
import './Home.css'

const Home = () => {

    function convertTo12HourFormat(time24) {
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = (hour % 12) || 12;
        const time12 = `${hour12}:${minutes} ${period}`;

        return time12;
    }

    const api_key = process.env.REACT_APP_WEATHER_API_KEY;

    const [city, setCity] = useState('London')

    const handleChange = (e) => {
        setCity(e.target.value);
    }

    const [currentData, setCurrentData] = useState({
        resolvedAddress: '',
        datetime: '',
        tempmax: '',
        tempmin: '',
        temp: '',
        feelslike: '',
        humidity: '',
        windspeed: '',
        pressure: '',
        uvindex: '',
        icon: '',
        conditions: ''
    })

    const currentWeather = async () => {
        try {
            const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&include=current&key=${api_key}&contentType=json`);

            const result = await response.json();

            setCurrentData({
                resolvedAddress: result.resolvedAddress,
                datetime: result.days[0].datetime,
                tempmax: result.days[0].tempmax,
                tempmin: result.days[0].tempmin,
                temp: result.days[0].temp,
                feelslike: result.days[0].feelslike,
                humidity: result.days[0].humidity,
                windspeed: result.days[0].windspeed,
                pressure: result.days[0].pressure,
                uvindex: result.days[0].uvindex,
                icon: result.days[0].icon,
                conditions: result.days[0].conditions
            })
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }

    const [weatherData, setWeatherData] = useState([]);
    const [currentHour, setCurrentHour] = useState(new Date().getHours());

    const currentForecast = async () => {
        try {
            const response = await fetch(
                `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&include=hours&key=${api_key}&contentType=json`
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const jsonData = await response.json();

            const firstDay = jsonData.days[0];

            if (firstDay) {
                const filteredData = firstDay.hours.filter((hourData) => {
                    const dataHour = parseInt(hourData.datetime.split(':')[0]);
                    return dataHour >= currentHour && dataHour < currentHour + 5;
                });

                setWeatherData(filteredData);

            } else {
                throw new Error('Invalid data structure');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [forecast, setForecast] = useState([])

    const futureForecast = async () => {
        try {
            const response = await fetch(
                `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&include=current%2Cdays&key=${api_key}&contentType=json`
            );
            const json = await response.json();

            const futureForecast = json.days.slice(0, 15).map((dailyData) => ({
                datetime: dailyData.datetime,
                tempmax: dailyData.tempmax,
                tempmin: dailyData.tempmin,
                icon: dailyData.icon,
                conditions: dailyData.conditions
            }));

            setForecast(futureForecast);

            console.log(forecast);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    useEffect(() => {
        currentWeather()
        currentForecast()
        futureForecast()
    }, [currentHour])


    return (
        <div className="home-wrap">
            <div className="search-wrap">
                <input type="text" name="city" id="city" autoComplete='off' placeholder='Search City' onChange={handleChange} />
                <i className="fa-solid fa-magnifying-glass fa-lg" onClick={() => {
                    currentWeather();
                    currentForecast();
                    futureForecast();
                }}></i>
            </div>
            <div className="main-container">
                <div className="left-weather">
                    <div className="current-details">
                        <div className="left-current">
                            <div className="city-details">
                                <h2 className="city-name">{currentData.resolvedAddress}</h2>
                                <p className="date">{currentData.datetime}</p>
                            </div>
                            <div className="temp-details">
                                <h2 className="temp">{currentData.temp}°C</h2>
                            </div>
                        </div>
                        <div className="right-current">
                            <div className="temp-logo">
                                <img src={`https://www.visualcrossing.com/img/${currentData.icon}.svg`} alt="" />
                            </div>
                            <div className="description-dd">
                                <p className="desc-title">{currentData.conditions}</p>
                            </div>
                        </div>
                    </div>
                    <div className="current-forecast">
                        <p className="cfTitle">Today's Forecast</p>
                        <div className="forecast-container">
                            {weatherData.map((hourData, index) => (
                                <div className="forecast" id={index}>
                                    <div className="time-details">
                                        <p className="time">{convertTo12HourFormat(hourData.datetime)}</p>
                                    </div>
                                    <div className="logo-img">
                                        <img src={`https://www.visualcrossing.com/img/${hourData.icon}.svg`} alt="" />
                                    </div>
                                    <div className="temp-info">
                                        <p className="temp">{hourData.temp}°C</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="air-container">
                        <p className="cfTitle">Air Conditions</p>
                        <div className="condition-cont">
                            <div className="condition-col">
                                <div className="logo-cont">
                                    <i className="fa-solid fa-temperature-three-quarters fa-2x"></i>
                                    <h3>Real Feel</h3>
                                </div>
                                <div className="cond-val">
                                    <h2>{currentData.feelslike}°C</h2>
                                </div>
                                <div className="logo-cont">
                                    <i className="fa-solid fa-wind fa-2x"></i>
                                    <h3>Wind</h3>
                                </div>
                                <div className="cond-val">
                                    <h2>{currentData.windspeed}km/h</h2>
                                </div>
                            </div>
                            <div className="condition-col">
                                <div className="logo-cont">
                                    <i className="fa-solid fa-gauge fa-2x"></i>
                                    <h3>Pressure</h3>
                                </div>
                                <div className="cond-val">
                                    <h2>{currentData.pressure}hPa</h2>
                                </div>
                                <div className="logo-cont">
                                    <i className="fa-solid fa-sun fa-2x"></i>
                                    <h3>UV Index</h3>
                                </div>
                                <div className="cond-val">
                                    <h2>{currentData.uvindex}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right-weather">
                    <div className="future-forecast">
                        <p className="cfTitle">15 Day Forecast</p>
                        <div className="future-details">
                            {forecast.map((dailyData, index) => (
                                <div className="forecast-info" id={index}>
                                    <div className="forecast-day">
                                        <p className="day">{dailyData.datetime}</p>
                                    </div>
                                    <div className="forecast-logos">
                                        <img src={`https://www.visualcrossing.com/img/${dailyData.icon}.svg`} alt="" />
                                        <p className="weather-title">{dailyData.conditions.split(',')[0]}</p>
                                    </div>
                                    <div className="temp-values">
                                        <p className="min-max-temp">{dailyData.tempmax}<span>/</span>{dailyData.tempmin}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home