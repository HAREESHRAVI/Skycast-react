import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import clearsky from '../src/assets/weather_icons/01d.png';
import { FaCalendar } from "react-icons/fa";
import { FaTemperatureArrowUp } from "react-icons/fa6";
import { FaTemperatureArrowDown } from "react-icons/fa6";
import { IoSunny } from "react-icons/io5";
import { FaMoon } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { MdOutlineCompress } from "react-icons/md";
import { MdRemoveRedEye } from "react-icons/md";
import { PiWind } from "react-icons/pi";
import { FaMagnifyingGlass } from "react-icons/fa6";
function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const apiKey = '5e69be56ae5faf84ec9c4012d4250049';
  const fetchWeatherData = (lat, lon) => {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    axios.get(forecastUrl).then((response) => {
      setData(response.data);
    }).catch(error => {
      console.error("Error fetching weather data:", error);
    });
  }
  const getWeatherDataForThanjavur = () => {
    const defaultLocation = 'Thanjavur';
    const geocodeUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&appid=${apiKey}`;
  
    axios.get(geocodeUrl).then((response) => {
      const { lat, lon } = response.data.coord;
      fetchWeatherData(lat, lon);
    }).catch(error => {
      console.error("Error fetching location data:", error);
    });
  }
  
  useEffect(() => {
    getWeatherDataForThanjavur(); // Call this function on component mount
  }, []);
  
  const searchLocation = () => {
    const geocodeUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    axios.get(geocodeUrl).then((response) => {
      const { lat, lon } = response.data.coord;
      console.log(response.data);
      fetchWeatherData(lat, lon);
    }).catch(error => {
      console.error("Error fetching location data:", error);
    });

    setLocation('');
  }
  const capitalizeDescription = (description) => {
    if (!description) return '';
    return description
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  return (
    <>
      <div className='search-container'>
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          type="text"
          placeholder='Enter city...'
        />
        <button onClick={searchLocation} className='search-button'>Search</button>
        <button onClick={searchLocation} className="search-mobile"><FaMagnifyingGlass color='white' size='40' /></button>
      </div>
      <div className='container'>
        <div className="left-container">
          <div className="left-top">
            <img className='logo' src={clearsky} alt="logo" />
            <h1 className='logo-heading'>SkyCast</h1>
          </div>
          <div className="left-middle">
            {data.city ? <p>{data.city.name}</p> : null}
            {data.list && data.list.length > 0 ? (<p>{capitalizeDescription(data.list[0].weather[0].description)}</p>) : null}
            <div className="temperature">
              {data.list && data.list.length > 0 ? <h1>{(data.list[0].main.temp - 273.15).toFixed()}°C</h1> : null}
              <img
                src={data.list && data.list.length > 0 ? `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png` : null}
                alt={data.list && data.list.length > 0 ? data.list[0].weather[0].description : ''}
              />
            </div>
            <hr />
            <div className="date">
              <FaCalendar size="20" color='white' />
              <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
            </div>
          </div>
          <h1 className="forecast-heading">Hourly Forecast</h1>
          <div className="left-bottom">
            {data.list ? data.list.slice(0, 5).map((hour, index) => (
              <div className="day" key={index}>
                <img
                  src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                  alt={hour.weather[0].description}
                  style={{ width: '50px', height: '50px' }}
                />
                <p>{(hour.main.temp - 273.15).toFixed()}°C</p>
                <p>{new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
              </div>
            )) : null}
          </div>
        </div>
        <div className="middle-container">
          <div className="heading">Today's Highlights</div>
          <div className="middle-top">
            <div className="temp">
              <p style={{ color: '#585858' }}>Temperature</p>
              <div className="components">
                <div className='minimum-temp'>
                  <FaTemperatureArrowDown color='white' size='70' />
                  {data.list && data.list.length > 0 ? <p>{(data.list[0].main.temp_min - 273.15).toFixed(2)}°C</p> : null}
                </div>
                <div className='maximum-temp'>
                  <FaTemperatureArrowUp color='white' size='70' />
                  {data.list && data.list.length > 0 ? <p>{(data.list[0].main.temp_max - 273.15).toFixed(2)}°C</p> : null}
                </div>
              </div>
            </div>
            <div className="temp">
              <p style={{ color: '#585858' }}>Sunrise and Sunset</p>
              <div className="components">
                <div className='minimum-temp'>
                  <IoSunny color='white' size='80' />
                  {data.city ? (<p>{new Date(data.city.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>) : null}
                </div>
                <div className='maximum-temp'>
                  <FaMoon color='white' size='80' />
                  {data.city ? (<p>{new Date(data.city.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>) : null}
                </div>
              </div>
            </div>
          </div>
          <div className='middle-bottom'>
            <div className='humidity'>
              <p style={{ color: '#585858' }}>Humidity</p>
              <div className='alignment'>
                <WiHumidity color='white' size='100' />
                {data.list && data.list.length > 0 ? <p>{data.list[0].main.humidity}%</p> : null}
              </div>
            </div>
            <div className='humidity'>
              <p style={{ color: '#585858' }}>Pressure</p>
              <div className='alignment'>
                <MdOutlineCompress color='white' size='100' />
                {data.list && data.list.length > 0 ? <p>{data.list[0].main.pressure} hPa</p> : null}
              </div>
            </div>
            <div className='humidity'>
              <p style={{ color: '#585858' }}>Visibility</p>
              <div className='alignment'>
                <MdRemoveRedEye color='white' size='100' />
                {data.list && data.list[0].visibility ? <p>{(data.list[0].visibility / 1000)} Km</p> : <p>Data unavailable</p>}
                
              </div>
            </div>
            <div className='humidity'>
              <p style={{ color: '#585858' }}>Wind Speed</p>
              <div className='alignment'>
                <PiWind color='white' size='100' />
                {data.list && data.list[0].wind ? (
                  <p>{(data.list[0].wind.speed * 3.6).toFixed(2)} Km/h</p>) : (<p>Data unavailable</p>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
