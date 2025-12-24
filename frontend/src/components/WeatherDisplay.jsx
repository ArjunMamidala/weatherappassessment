import React, { useState } from 'react';

function WeatherDisplay({ weather, onSave }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const handleSave = () => {
    if (!startDate || !endDate) {
      alert('Please enter both dates');
      return;
    }
    onSave(weather.location.name, startDate, endDate);
    setShowSaveForm(false);
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="weather-display">
      <div className="weather-header">
        <h2>
          {weather.location.name}
          {weather.location.country && `, ${weather.location.country}`}
        </h2>
        <p className="coordinates">
          📍 {weather.location.lat.toFixed(2)}, {weather.location.lon.toFixed(2)}
        </p>
      </div>

      <div className="weather-main">
        <div className="temp-section">
          <img 
            src={`http://openweathermap.org/img/wn/${weather.weather.icon}@4x.png`}
            alt={weather.weather.description}
            className="weather-icon"
          />
          <div className="temperature">
            <span className="temp-value">{Math.round(weather.weather.temperature)}°C</span>
            <p className="description">{weather.weather.description}</p>
          </div>
        </div>

        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-label">Feels Like</span>
            <span className="detail-value">{Math.round(weather.weather.feelsLike)}°C</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Min / Max</span>
            <span className="detail-value">
              {Math.round(weather.weather.tempMin)}° / {Math.round(weather.weather.tempMax)}°
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{weather.weather.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Wind Speed</span>
            <span className="detail-value">{weather.weather.windSpeed} m/s</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Pressure</span>
            <span className="detail-value">{weather.weather.pressure} hPa</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Clouds</span>
            <span className="detail-value">{weather.weather.clouds}%</span>
          </div>
        </div>
      </div>

      <div className="save-section">
        {!showSaveForm ? (
          <button 
            className="save-btn"
            onClick={() => setShowSaveForm(true)}
          >
            💾 Save This Search
          </button>
        ) : (
          <div className="save-form">
            <h3>Save Weather Search</h3>
            <div className="date-inputs">
              <div className="input-group">
                <label>Start Date</label>
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>End Date</label>
                <input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="form-actions">
              <button onClick={handleSave} className="btn-primary">Save</button>
              <button onClick={() => setShowSaveForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherDisplay;