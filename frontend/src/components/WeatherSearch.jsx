import React, { useState } from 'react';

function WeatherSearch({ onSearch, loading }) {
  const [location, setLocation] = useState('');
  const [locationError, setLocationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim()) {
      setLocationError('Please enter a location');
      return;
    }
    setLocationError('');
    onSearch(location);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    onSearch('', true);
  };

  const handleExampleClick = (example) => {
    setLocation(example);
  };

  return (
    <div className="weather-search">
      <h2>Search Weather</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="search-input-group">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city, zip code, or coordinates..."
            className="search-input"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {locationError && (
          <div className="input-error">{locationError}</div>
        )}
      </form>

      <button 
        onClick={handleGeolocation} 
        className="geolocation-button"
        disabled={loading}
      >
        📍 Use My Current Location
      </button>

      <div className="search-hints">
        <p><strong>Try these:</strong></p>
        <div className="hint-chips">
          <span className="hint-chip" onClick={() => handleExampleClick('New York')}>New York</span>
          <span className="hint-chip" onClick={() => handleExampleClick('27606')}>27606 (Zip)</span>
          <span className="hint-chip" onClick={() => handleExampleClick('35.7796,-78.6382')}>Coordinates</span>
          <span className="hint-chip" onClick={() => handleExampleClick('Eiffel Tower')}>Eiffel Tower</span>
        </div>
      </div>
    </div>
  );
}

export default WeatherSearch;