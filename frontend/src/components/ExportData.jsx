import React, { useState } from 'react';

function ExportData() {
  const [format, setFormat] = useState('json');
  const [exporting, setExporting] = useState(false);

  const API_URL = 'http://localhost:5000/api';

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await fetch(`${API_URL}/weather/export?format=${format}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weather-searches.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('Data exported successfully!');
    } catch (error) {
      alert('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="export-section">
      <h2>📤 Export Data</h2>
      <p>Export your saved weather searches in various formats</p>
      
      <div className="export-controls">
        <div className="format-selector">
          <label htmlFor="format">Select Format:</label>
          <select 
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            disabled={exporting}
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="markdown">Markdown</option>
          </select>
        </div>

        <button 
          onClick={handleExport}
          disabled={exporting}
          className="export-btn"
        >
          {exporting ? 'Exporting...' : 'Export Data'}
        </button>
      </div>

      <div className="export-info">
        <h4>Format Information:</h4>
        <ul>
          <li><strong>JSON:</strong> Machine-readable format that's ideal for data processing</li>
          <li><strong>CSV:</strong> Spreadsheet-compatible that's great for Excel/Google Sheets</li>
          <li><strong>XML:</strong> Structured data format for system integration</li>
          <li><strong>PDF:</strong> Human-readable report format</li>
          <li><strong>Markdown:</strong> Text format for documentation</li>
        </ul>
      </div>
    </div>
  );
}

export default ExportData;