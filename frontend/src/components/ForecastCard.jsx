import React from 'react';

function ForecastCard({ forecast }) {
  if (!forecast || !forecast.forecast) {
    return null;
  }

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="forecast-section">
      <h2>5-Day Forecast</h2>
      <div className="forecast-grid">
        {forecast.forecast.map((day, index) => (
          <div key={index} className="forecast-card">
            <div className="forecast-day">{getDayName(day.date)}</div>
            <img 
              src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt={day.description}
              className="forecast-icon"
            />
            <div className="forecast-temp">
              <span className="temp-main">{Math.round(day.temperature)}°C</span>
              <span className="temp-range">
                {Math.round(day.tempMin)}° / {Math.round(day.tempMax)}°
              </span>
            </div>
            <div className="forecast-desc">{day.description}</div>
            <div className="forecast-details">
              <span>💧 {day.humidity}%</span>
              <span>💨 {day.windSpeed} m/s</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForecastCard;