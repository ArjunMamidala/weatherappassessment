import React, { useState } from 'react';

function SavedLocations({ searches, onDelete, onLoad }) {
  const [showSaved, setShowSaved] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleEdit = (search) => {
    setEditingId(search._id);
    setEditForm({
      location: search.location,
      startDate: new Date(search.dateRange.startDate).toISOString().split('T')[0],
      endDate: new Date(search.dateRange.endDate).toISOString().split('T')[0]
    });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${API_URL}/weather/saved/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (data.success) {
        alert('Updated successfully!');
        setEditingId(null);
        window.location.reload();
      }
    } catch (err) {
      alert('Failed to update');
    }
  };

  if (!showSaved) {
    return (
      <div className="saved-section-collapsed">
        <button 
          className="toggle-saved-btn"
          onClick={() => setShowSaved(true)}
        >
          📚 View Saved Searches ({searches.length})
        </button>
      </div>
    );
  }

  return (
    <div className="saved-locations">
      <div className="saved-header">
        <h2>📚 Saved Weather Searches</h2>
        <button onClick={() => setShowSaved(false)} className="close-btn">✕</button>
      </div>

      {searches.length === 0 ? (
        <p className="no-searches">No saved searches yet. Save a weather search to see it under saved searches.</p>
      ) : (
        <div className="searches-grid">
          {searches.map((search) => (
            <div key={search._id} className="search-card">
              {editingId === search._id ? (
                <div className="edit-form">
                  <input 
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    placeholder="Location"
                  />
                  <input 
                    type="date"
                    value={editForm.startDate}
                    onChange={(e) => setEditForm({...editForm, startDate: e.target.value})}
                  />
                  <input 
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) => setEditForm({...editForm, endDate: e.target.value})}
                  />
                  <div className="edit-actions">
                    <button onClick={() => handleUpdate(search._id)} className="btn-save">Save</button>
                    <button onClick={() => setEditingId(null)} className="btn-cancel">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="search-header">
                    <h3>{search.locationDetails?.name || search.location}</h3>
                    {search.locationDetails?.country && (
                      <span className="country-badge">{search.locationDetails.country}</span>
                    )}
                  </div>

                  <div className="search-info">
                    <p className="date-range">
                      📅 {new Date(search.dateRange.startDate).toLocaleDateString()} - {new Date(search.dateRange.endDate).toLocaleDateString()}
                    </p>
                    
                    {search.weatherData && (
                      <div className="weather-summary">
                        <div className="summary-item">
                          🌡️ {Math.round(search.weatherData.temperature)}°C
                        </div>
                        <div className="summary-item">
                          💧 {search.weatherData.humidity}%
                        </div>
                        <div className="summary-item">
                          {search.weatherData.description}
                        </div>
                      </div>
                    )}

                    <p className="searched-at">
                      Searched: {new Date(search.searchedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="search-actions">
                    <button 
                      onClick={() => onLoad(search)}
                      className="btn-load"
                    >
                      🔍 Load
                    </button>
                    <button 
                      onClick={() => handleEdit(search)}
                      className="btn-edit"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => onDelete(search._id)}
                      className="btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedLocations;