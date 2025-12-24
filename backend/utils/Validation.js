const validateLocation = (location) => {
  if (!location || location.trim().length === 0) {
    return { valid: false, error: 'Location is required' };
  }
  
  return { valid: true, location: location.trim() };
};


const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return { valid: false, error: 'Both start date and end date are required' };
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime())) {
    return { valid: false, error: 'Invalid start date' };
  }
  
  if (isNaN(end.getTime())) {
    return { valid: false, error: 'Invalid end date' };
  }
  
  if (start > end) {
    return { valid: false, error: 'Start date must be before end date' };
  }
  
  return { 
    valid: true, 
    startDate: start, 
    endDate: end 
  };
};

const validateExportFormat = (format) => {
  const validFormats = ['json', 'csv', 'pdf', 'markdown', 'xml'];
  
  if (!format || !validFormats.includes(format.toLowerCase())) {
    return { valid: false, error: 'Invalid export format' };
  }
  
  return { valid: true, format: format.toLowerCase() };
};

module.exports = {
  validateLocation,
  validateDateRange,
  validateExportFormat
};