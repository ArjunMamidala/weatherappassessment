const exportToJSON = (data) => {
  return JSON.stringify(data, null, 2);
};

const exportToCSV = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return 'No data available';
  }
  
  const headers = [
    'Location',
    'Location Name',
    'Country',
    'Start Date',
    'End Date',
    'Temperature (°C)',
    'Humidity (%)',
    'Description',
    'Searched At'
  ];
  
  const rows = data.map(item => [
    item.location || '',
    item.locationDetails?.name || '',
    item.locationDetails?.country || '',
    item.dateRange?.startDate ? new Date(item.dateRange.startDate).toLocaleDateString() : '',
    item.dateRange?.endDate ? new Date(item.dateRange.endDate).toLocaleDateString() : '',
    item.weatherData?.temperature || '',
    item.weatherData?.humidity || '',
    item.weatherData?.description || '',
    item.searchedAt ? new Date(item.searchedAt).toLocaleString() : ''
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
};


const exportToMarkdown = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return '# Weather Search History\n\nNo data available.';
  }
  
  let markdown = '# Weather Search History\n\n';
  markdown += `*Generated: ${new Date().toLocaleString()}*\n\n`;
  
  data.forEach((item, index) => {
    markdown += `## ${index + 1}. ${item.location}\n\n`;
    markdown += `- **Location:** ${item.locationDetails?.name || 'N/A'}, ${item.locationDetails?.country || 'N/A'}\n`;
    markdown += `- **Date Range:** ${new Date(item.dateRange?.startDate).toLocaleDateString()} - ${new Date(item.dateRange?.endDate).toLocaleDateString()}\n`;
    markdown += `- **Temperature:** ${item.weatherData?.temperature}°C\n`;
    markdown += `- **Humidity:** ${item.weatherData?.humidity}%\n`;
    markdown += `- **Description:** ${item.weatherData?.description}\n`;
    markdown += `- **Searched:** ${new Date(item.searchedAt).toLocaleString()}\n\n`;
  });
  
  return markdown;
};

const exportData = async (data, format) => {
  switch (format) {
    case 'json':
      return { 
        data: exportToJSON(data), 
        contentType: 'application/json', 
        extension: 'json' 
      };
    
    case 'csv':
      return { 
        data: exportToCSV(data), 
        contentType: 'text/csv', 
        extension: 'csv' 
      };
    
    case 'markdown':
      return { 
        data: exportToMarkdown(data), 
        contentType: 'text/markdown', 
        extension: 'md' 
      };
    
    default:
      throw new Error('Unsupported export format. Supported: json, csv, markdown');
  }
};

module.exports = {
  exportData,
  exportToJSON,
  exportToCSV,
  exportToMarkdown
};