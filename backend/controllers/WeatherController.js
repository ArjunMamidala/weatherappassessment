const axios = require('axios');
const WeatherSearch = require('../models/Weather');
const { validateLocation, validateDateRange, validateExportFormat } = require('../utils/Validation');
const { exportData } = require('../utils/Export');

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEOCODING_URL = 'https://api.openweathermap.org/geo/1.0';

const getCoordinates = async (location) => {
  try {
    const trimmedLocation = location.trim();
    
    if (trimmedLocation.includes(',')) {
      const parts = trimmedLocation.split(',');
      if (parts.length === 2) {
        const lat = parseFloat(parts[0].trim());
        const lon = parseFloat(parts[1].trim());
        
        if (!isNaN(lat) && !isNaN(lon)) {
          return { lat, lon, name: 'Custom Location', country: '' };
        }
      }
    }
    
    if (trimmedLocation.length === 5 && !isNaN(trimmedLocation)) {
      const response = await axios.get(`${GEOCODING_URL}/zip`, {
        params: {
          zip: `${trimmedLocation},US`,
          appid: OPENWEATHER_API_KEY
        }
      });
      return {
        lat: response.data.lat,
        lon: response.data.lon,
        name: response.data.name,
        country: 'US'
      };
    }
    
    const response = await axios.get(`${GEOCODING_URL}/direct`, {
      params: {
        q: trimmedLocation,
        limit: 1,
        appid: OPENWEATHER_API_KEY
      }
    });
    
    if (response.data.length === 0) {
      throw new Error('Location not found. Please try a different search term.');
    }
    
    const locationData = response.data[0];
    return {
      lat: locationData.lat,
      lon: locationData.lon,
      name: locationData.name,
      country: locationData.country
    };
  } catch (error) {
    if (error.message.includes('Location not found')) {
      throw error;
    }
    throw new Error('Failed to geocode location. Please verify the location and try again.');
  }
};

exports.getCurrentWeather = async (req, res) => {
  try {
    const { location } = req.query;
    
    const locationValidation = validateLocation(location);
    if (!locationValidation.valid) {
      return res.status(400).json({ error: true, message: locationValidation.error });
    }
    
    const coords = await getCoordinates(locationValidation.location);
    
    const weatherResponse = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        lat: coords.lat,
        lon: coords.lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });
    
    const data = weatherResponse.data;
    
    res.json({
      success: true,
      location: {
        name: coords.name,
        country: coords.country,
        lat: coords.lat,
        lon: coords.lon
      },
      weather: {
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        tempMin: data.main.temp_min,
        tempMax: data.main.temp_max,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
        clouds: data.clouds.all
      },
      timestamp: new Date(data.dt * 1000)
    });
  } catch (error) {
    console.error('Error fetching current weather:', error.message);
    res.status(500).json({
      error: true,
      message: error.message || 'Failed to fetch weather data'
    });
  }
};

exports.getForecast = async (req, res) => {
  try {
    const { location } = req.query;
    
    const locationValidation = validateLocation(location);
    if (!locationValidation.valid) {
      return res.status(400).json({ error: true, message: locationValidation.error });
    }
    
    const coords = await getCoordinates(locationValidation.location);
    
    const forecastResponse = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
      params: {
        lat: coords.lat,
        lon: coords.lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });
    
    const dailyForecasts = [];
    const processedDates = new Set();
    
    forecastResponse.data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      const hour = new Date(item.dt * 1000).getHours();
      
      if (!processedDates.has(date) && hour >= 12 && hour <= 15) {
        processedDates.add(date);
        dailyForecasts.push({
          date: new Date(item.dt * 1000),
          temperature: item.main.temp,
          tempMin: item.main.temp_min,
          tempMax: item.main.temp_max,
          humidity: item.main.humidity,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          windSpeed: item.wind.speed
        });
      }
    });
    
    res.json({
      success: true,
      location: {
        name: coords.name,
        country: coords.country,
        lat: coords.lat,
        lon: coords.lon
      },
      forecast: dailyForecasts.slice(0, 5)
    });
  } catch (error) {
    console.error('Error fetching forecast:', error.message);
    res.status(500).json({
      error: true,
      message: error.message || 'Failed to fetch forecast data'
    });
  }
};

exports.saveWeatherSearch = async (req, res) => {
  try {
    const { location, startDate, endDate } = req.body;
    
    const locationValidation = validateLocation(location);
    if (!locationValidation.valid) {
      return res.status(400).json({ error: true, message: locationValidation.error });
    }
    
    const dateValidation = validateDateRange(startDate, endDate);
    if (!dateValidation.valid) {
      return res.status(400).json({ error: true, message: dateValidation.error });
    }
    
    const coords = await getCoordinates(locationValidation.location);
    
    const weatherResponse = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        lat: coords.lat,
        lon: coords.lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });
    
    const data = weatherResponse.data;
    
    const weatherSearch = new WeatherSearch({
      location: locationValidation.location,
      locationDetails: {
        name: coords.name,
        country: coords.country,
        lat: coords.lat,
        lon: coords.lon
      },
      dateRange: {
        startDate: dateValidation.startDate,
        endDate: dateValidation.endDate
      },
      weatherData: {
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        tempMin: data.main.temp_min,
        tempMax: data.main.temp_max,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
        clouds: data.clouds.all
      }
    });
    
    await weatherSearch.save();
    
    res.status(201).json({
      success: true,
      message: 'Weather search saved successfully',
      data: weatherSearch
    });
  } catch (error) {
    console.error('Error saving weather search:', error.message);
    res.status(500).json({
      error: true,
      message: error.message || 'Failed to save weather search'
    });
  }
};

exports.getSavedSearches = async (req, res) => {
  try {
    const searches = await WeatherSearch.find()
      .sort({ searchedAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      count: searches.length,
      data: searches
    });
  } catch (error) {
    console.error('Error fetching saved searches:', error.message);
    res.status(500).json({
      error: true,
      message: 'Failed to fetch saved searches'
    });
  }
};

/**
 * READ - Get a single saved search by ID
 */
exports.getSavedSearchById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const search = await WeatherSearch.findById(id);
    
    if (!search) {
      return res.status(404).json({
        error: true,
        message: 'Weather search not found'
      });
    }
    
    res.json({
      success: true,
      data: search
    });
  } catch (error) {
    console.error('Error fetching search:', error.message);
    res.status(500).json({
      error: true,
      message: 'Failed to fetch weather search'
    });
  }
};

exports.updateWeatherSearch = async (req, res) => {
  try {
    const { id } = req.params;
    const { location, startDate, endDate } = req.body;
    
    const search = await WeatherSearch.findById(id);
    if (!search) {
      return res.status(404).json({
        error: true,
        message: 'Weather search not found'
      });
    }
    
    if (location) {
      const locationValidation = validateLocation(location);
      if (!locationValidation.valid) {
        return res.status(400).json({ error: true, message: locationValidation.error });
      }
      
      const coords = await getCoordinates(locationValidation.location);
      const weatherResponse = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
        params: {
          lat: coords.lat,
          lon: coords.lon,
          appid: OPENWEATHER_API_KEY,
          units: 'metric'
        }
      });
      
      const data = weatherResponse.data;
      
      search.location = locationValidation.location;
      search.locationDetails = {
        name: coords.name,
        country: coords.country,
        lat: coords.lat,
        lon: coords.lon
      };
      search.weatherData = {
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        tempMin: data.main.temp_min,
        tempMax: data.main.temp_max,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
        clouds: data.clouds.all
      };
    }
    
    if (startDate || endDate) {
      const dateValidation = validateDateRange(
        startDate || search.dateRange.startDate,
        endDate || search.dateRange.endDate
      );
      
      if (!dateValidation.valid) {
        return res.status(400).json({ error: true, message: dateValidation.error });
      }
      
      search.dateRange = {
        startDate: dateValidation.startDate,
        endDate: dateValidation.endDate
      };
    }
    
    await search.save();
    
    res.json({
      success: true,
      message: 'Weather search updated successfully',
      data: search
    });
  } catch (error) {
    console.error('Error updating weather search:', error.message);
    res.status(500).json({
      error: true,
      message: error.message || 'Failed to update weather search'
    });
  }
};

exports.deleteWeatherSearch = async (req, res) => {
  try {
    const { id } = req.params;
    
    const search = await WeatherSearch.findByIdAndDelete(id);
    
    if (!search) {
      return res.status(404).json({
        error: true,
        message: 'Weather search not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Weather search deleted successfully',
      data: search
    });
  } catch (error) {
    console.error('Error deleting weather search:', error.message);
    res.status(500).json({
      error: true,
      message: 'Failed to delete weather search'
    });
  }
};

exports.exportSearches = async (req, res) => {
  try {
    const { format } = req.query;
    
    const formatValidation = validateExportFormat(format);
    if (!formatValidation.valid) {
      return res.status(400).json({ error: true, message: formatValidation.error });
    }
    
    const searches = await WeatherSearch.find().sort({ searchedAt: -1 });
    
    if (searches.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'No saved searches found to export'
      });
    }
    
    const exportedData = await exportData(searches, formatValidation.format);
    
    res.setHeader('Content-Type', exportedData.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="weather-searches.${exportedData.extension}"`);
    res.send(exportedData.data);
  } catch (error) {
    console.error('Error exporting data:', error.message);
    res.status(500).json({
      error: true,
      message: 'Failed to export data'
    });
  }
};