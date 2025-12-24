import React, { useState, useEffect } from 'react';
import WeatherSearch from './components/WeatherSearch';
import WeatherDisplay from './components/WeatherDisplay';
import ForecastCard from './components/ForecastCard';
import SavedLocations from './components/SavedLocations';
import ExportData from './components/ExportData';

const API_URL ='http://localhost:5000/api';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedSearches, setSavedSearches] = useState([]);

  useEffect(() => {
    fetchSavedSearches();
  }, []);

  const fetchSavedSearches = async () => {
    try {
      const res = await fetch(`${API_URL}/weather/saved`);
      const data = await res.json();
      if (data.success) {
        setSavedSearches(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch saved searches:', err);
    }
  };

  const handleSearch = async (location, useGeo = false) => {
    setLoading(true);
    setError(null);

    try {
      let searchLoc = location;
      
      if (useGeo) {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        searchLoc = `${pos.coords.latitude},${pos.coords.longitude}`;
      }

      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`${API_URL}/weather/current?location=${encodeURIComponent(searchLoc)}`),
        fetch(`${API_URL}/weather/forecast?location=${encodeURIComponent(searchLoc)}`)
      ]);

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      if (!weatherData.success) {
        throw new Error(weatherData.message);
      }

      setWeather(weatherData);
      setForecast(forecastData.success ? forecastData : null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (location, startDate, endDate) => {
    try {
      const res = await fetch(`${API_URL}/weather/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, startDate, endDate })
      });
      const data = await res.json();
      if (data.success) {
        alert('Saved successfully!');
        fetchSavedSearches();
      }
    } catch (err) {
      alert('Failed to save search');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this search?')) return;
    try {
      await fetch(`${API_URL}/weather/saved/${id}`, { method: 'DELETE' });
      fetchSavedSearches();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Weather App</h1>
        <p className="creator">Created by Arjun Mamidala</p>
        <button 
          className="info-btn"
          onClick={() => window.open('https://www.linkedin.com/school/pmaccelerator/', '_blank')}
        >
          About PM Accelerator
        </button>
      </header>

      <main className="app-main">
        <WeatherSearch onSearch={handleSearch} loading={loading} />
        
        {error && <div className="error-message">{error}</div>}
        
        {weather && <WeatherDisplay weather={weather} onSave={handleSave} />}
        
        {forecast && <ForecastCard forecast={forecast} />}
        
        <SavedLocations 
          searches={savedSearches}
          onDelete={handleDelete}
          onLoad={(search) => handleSearch(search.location)}
        />
        
        <ExportData />
      </main>
    </div>
  );
}

export default App;