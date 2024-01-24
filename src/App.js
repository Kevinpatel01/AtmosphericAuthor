import "./App.css";
import React, { useState } from "react";
import axios from "axios";
import logo from './logo.png';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [units, setUnits] = useState('imperial');
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${units}&appid=2513e8d2c4ca81bfe509d96acebd8399`;
  const iconBaseUrl = "http://openweathermap.org/img/wn/";

  const handleUnitChange = () =>{
    setUnits(units === 'imperial' ? 'metric' : 'imperial')
  }

  const convertTemp = (temp) =>{
    return units === 'imperial' ? `${temp.toFixed()}°F` : `${((temp - 32)* 5 / 9).toFixed()}°C`
  }

  const convertSpeed = (speed) =>{
    return units === 'imperial' ? `${speed.toFixed()} MPH` : `${(speed * 0.44704).toFixed()} m/s`
  }
  const searchLocation = (e) => {
    if (e.key === "Enter") {
      axios.get(url).then((response) => {
        setData(response.data);
        if (response.data.weather && response.data.weather.length > 0) {
          const iconCode = response.data.weather[0].icon;
          setIconUrl(`${iconBaseUrl}${iconCode}@2x.png`);
        }
      })
      .catch((error) => {
        setData({});
        console.error("Location not found", error);
        alert("Location not found!")
      });
      setLocation("");
    }
  };

  return (
    <div className="app">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="search">
        <input
          type="text"
          value={location}
          placeholder="Search City"
          onChange={(e) => setLocation(e.target.value)}
          onKeyPress={searchLocation}
        />
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temperature">
            {data.main ? <h1>{convertTemp(data.main.temp)}</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <p className="desc" style={{display: "inline"}}> {data.weather[0].description}</p> : null}
            {iconUrl && <img className="image" style= {{verticalAlign: 'middle', backgroundColor: "rgba(255,255,255,0.5)", borderRadius: "15px", width: "50px", padding: "1px", justifyContent: "space-evenly"}} src={iconUrl} alt="Weather Icon" />}
          </div>
        </div>
        {data.name !== undefined &&(
          <>
        <div className="bottom">
          <div className="feels-like">
            {data.main ? <p className="bold">{convertTemp(data.main.feels_like)}</p> : null}
            <p>Feelz Like</p>
          </div>
          <div className="humidity">
            {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
            <p>Humidity</p>
          </div>
          <div className="speed">
            {data.wind ? <p className="bold">{convertSpeed(data.wind.speed)}</p> : null}
            <p>Wind Speed</p>
          </div>
        </div>
        <div className="unit-toggle">
            <button onClick={handleUnitChange}>{units === 'imperial' ? 'Switch to Metric' : 'Switch to Imperial'}</button>
          </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
