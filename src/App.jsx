import React, { useState, useEffect } from 'react'; // Importing React and hooks for state and lifecycle methods
import './App.css'; // Importing CSS styles for the application
import axios from 'axios'; // Importing axios for making HTTP requests
import logo from '../src/assets/weather_icons/logo.jpg'; // Importing logo image
import font from '../src/assets/weather_icons/logofont.jpg'; // Importing font image
import { FaCalendar } from "react-icons/fa"; // Importing calendar icon
import { FaTemperatureArrowUp } from "react-icons/fa6"; // Importing temperature up icon
import { FaTemperatureArrowDown } from "react-icons/fa6"; // Importing temperature down icon
import { IoSunny } from "react-icons/io5"; // Importing sunny icon
import { FaMoon } from "react-icons/fa"; // Importing moon icon
import { WiHumidity } from "react-icons/wi"; // Importing humidity icon
import { MdOutlineCompress } from "react-icons/md"; // Importing pressure icon
import { MdRemoveRedEye } from "react-icons/md"; // Importing visibility icon
import { PiWind } from "react-icons/pi"; // Importing wind speed icon
import { FaMagnifyingGlass } from "react-icons/fa6"; // Importing search icon

function App() {
    const [data, setData] = useState({}); // State to hold fetched weather data
    const [location, setLocation] = useState(''); // State to hold user input for location
    const apiKey = '5e69be56ae5faf84ec9c4012d4250049'; // Replace with your OpenWeatherMap API key

    // Function to fetch weather data based on latitude and longitude
    const fetchWeatherData = (lat, lon) => {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        axios.get(forecastUrl) // Making a'5e69be56ae5faf84ec9c4012d4250049' GET request to the weather API
            .then((response) => {
                setData(response.data); // Updating state with fetched data
            })
            .catch(error => {
                console.error("Error fetching weather data:", error); // Logging any errors encountered during fetch
            });
    };

    // Function to get weather data for a default location (Thanjavur)
    const getWeatherDataForThanjavur = () => {
        const defaultLocation = 'Thanjavur';
        const geocodeUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&appid=${apiKey}`;
        axios.get(geocodeUrl) // Making a GET request to get coordinates of the default location
            .then((response) => {
                const { lat, lon } = response.data.coord; // Extracting latitude and longitude from response
                fetchWeatherData(lat, lon); // Fetching weather data using the coordinates
            })
            .catch(error => {
                console.error("Error fetching location data:", error); // Logging any errors encountered during fetch
            });
    };

    useEffect(() => {
        getWeatherDataForThanjavur(); // Fetch default location data when component mounts
    }, []);

    // Function to search for a location based on user input and fetch its weather data
    const searchLocation = () => {
        if (!location) return; // Exit if no location is provided by user
        const geocodeUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
        axios.get(geocodeUrl) // Making a GET request to get coordinates of the searched location
            .then((response) => {
                const { lat, lon } = response.data.coord; // Extracting latitude and longitude from response
                fetchWeatherData(lat, lon); // Fetching weather data using the coordinates
            })
            .catch(error => {
                console.error("Error fetching location data:", error); // Logging any errors encountered during fetch
            });
        setLocation(''); // Clear the input field after search is executed
    };

    // Handle key down event for searching location when Enter is pressed
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            searchLocation(); // Call search function on Enter key press
        }
    };

    // Function to capitalize the first letter of each word in the weather description for better readability
    const capitalizeDescription = (description) => {
        if (!description) return '';
        return description.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <>
            <div className='search-container'>
                <input 
                    value={location} 
                    onChange={event => setLocation(event.target.value)} 
                    onKeyDown={handleKeyDown} 
                    type="text" 
                    placeholder='Enter city...' 
                />
                <button onClick={searchLocation} className='search-button'>Search</button>
                <button onClick={searchLocation} className="search-mobile">
                    <FaMagnifyingGlass color='white' size='40' />
                </button>
            </div>
            <div className='container'>
                <div className="left-container">
                    <div className="left-top">
                        <img className='logo' src={logo} alt="logo" /> {/* Display logo */}
                        <img className='logo-font' src={font} alt="font" /> {/* Display font logo */}
                    </div>
                    <div className="left-middle">
                        {data.city ? <p>{data.city.name}</p> : null} {/* Display city name */}
                        {data.list && data.list.length > 0 && data.list[0].weather ? (
                          <p>{capitalizeDescription(data.list[0].weather[0].description)}</p> // Display weather description
                          ) : null}
                        <div className="temperature">
                            {data.list && data.list.length > 0 ? 
                                <h1>{(data.list[0].main.temp - 273.15).toFixed()}°C</h1> : null} {/* Display current temperature */}
                            <img src={data.list && data.list.length > 0 ? 
                                `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png` : null} 
                                alt={data.list && data.list.length > 0 ? data.list[0].weather[0].description : ''} 
                            /> {/* Display weather icon */}
                        </div>
                        <hr />
                        <div className="date">
                            <FaCalendar size="20" color='white' /> {/* Calendar icon */}
                            <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}</p> {/* Display current date */}
                        </div>
                    </div>
                    <h1 className="forecast-heading">Hourly Forecast</h1>
                    <div className="left-bottom">
                        {/* Map through hourly forecast data and display next 5 hours */}
                        {data.list ? data.list.slice(0, 5).map((hour, index) => (
                            <div className="day" key={index}>
                                <img src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`} 
                                     alt={hour.weather[0].description} 
                                     style={{ width: '50px', height: '50px' }} 
                                /> {/* Display hourly weather icon */}
                                <p>{(hour.main.temp - 273.15).toFixed()}°C</p> {/* Display hourly temperature */}
                                <p>{new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p> {/* Display hour in readable format */}
                            </div>
                        )) : null}
                    </div>
                </div>
                <div className="middle-container">
                    <div className="heading">Today's Highlights</div>
                    <div className="middle-top">
                        {/* Temperature Section */}
                        <div className="temp">
                            <p style={{ color: '#585858' }}>Temperature</p>
                            <div className="components">
                                {/* Minimum Temperature */}
                                <div className='minimum-temp'>
                                    <FaTemperatureArrowDown color='white' size='70' />
                                    {data.list && data.list.length > 0 ? 
                                        <p>{(data.list[0].main.temp_min - 273.15).toFixed(2)}°C</p> : null} {/* Display minimum temperature */}
                                </div>
                                {/* Maximum Temperature */}
                                <div className='maximum-temp'>
                                    <FaTemperatureArrowUp color='white' size='70' />
                                    {data.list && data.list.length > 0 ? 
                                        <p>{(data.list[0].main.temp_max - 273.15).toFixed(2)}°C</p> : null} {/* Display maximum temperature */}
                                </div>
                            </div>
                        </div>
                        {/* Sunrise and Sunset Section */}
                        <div className="temp">
                            <p style={{ color: '#585858' }}>Sunrise and Sunset</p>
                            <div className="components">
                                {/* Sunrise Time */}
                                <div className='minimum-temp'>
                                    <IoSunny color='white' size='80' />
                                    {data.city ? (
                                        <p>{new Date(data.city.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>) : null} {/* Display sunrise time */}
                                </div>
                                {/* Sunset Time */}
                                <div className='maximum-temp'>
                                    <FaMoon color='white' size='80' />
                                    {data.city ? (
                                        <p>{new Date(data.city.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>) : null} {/* Display sunset time */}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Additional Weather Metrics Section */}
                    <div className='middle-bottom'>
                        {/* Humidity Metric */}
                        <div className='humidity'>
                            <p style={{ color: '#585858' }}>Humidity</p>
                            <div className='alignment'>
                                <WiHumidity color='white' size='100' />
                                {data.list && data.list.length > 0 ? 
                                    <p>{data.list[0].main.humidity}%</p> : null} {/* Display humidity percentage */}
                            </div>
                        </div>
                        {/* Pressure Metric */}
                        <div className='humidity'>
                            <p style={{ color: '#585858' }}>Pressure</p>
                            <div className='alignment'>
                                <MdOutlineCompress color='white' size='100' />
                                {data.list && data.list.length > 0 ? 
                                    <p>{data.list[0].main.pressure} hPa</p> : null} {/* Display atmospheric pressure in hPa */}
                            </div>
                        </div>
                        {/* Visibility Metric */}
                        <div className='humidity'>
                            <p style={{ color: '#585858' }}>Visibility</p>
                            <div className='alignment'>
                                <MdRemoveRedEye color='white' size='100' />
                                {data.list && data.list[0].visibility ? (
                                    <p>{(data.list[0].visibility / 1000)} Km</p>) : (<p>Data unavailable</p>)} {/* Display visibility in kilometers or indicate unavailability */}
                            </div>
                        </div>
                        {/* Wind Speed Metric */}
                        <div className='humidity'>
                            <p style={{ color: '#585858' }}>Wind Speed</p>
                            <div className='alignment'>
                                <PiWind color='white' size='100' />
                                {data.list && data.list[0].wind ? (
                                    <p>{(data.list[0].wind.speed * 3.6).toFixed(2)} Km/h</p>) : (<p>Data unavailable</p>)} {/* Convert wind speed from m/s to km/h and display it */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App; // Exporting the App component as the default export of this module.