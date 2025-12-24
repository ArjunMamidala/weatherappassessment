const mongoose = require('mongoose');

const weatherSearchSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
    trim: true
  },
  locationDetails: {
    name: String,
    country: String,
    lat: Number,
    lon: Number
  },
  dateRange: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  weatherData: {
    temperature: Number,
    feelsLike: Number,
    tempMin: Number,
    tempMax: Number,
    humidity: Number,
    pressure: Number,
    description: String,
    icon: String,
    windSpeed: Number,
    clouds: Number
  },
  forecast: [{
    date: Date,
    temp: Number,
    description: String,
    icon: String
  }],
  searchedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

weatherSearchSchema.index({ location: 1, searchedAt: -1 });

weatherSearchSchema.pre('save', function(next) {
  if (this.dateRange.startDate > this.dateRange.endDate) {
    next(new Error('Start date must be before end date'));
  }
  
  this.lastUpdated = new Date();
});

const WeatherSearch = mongoose.model('WeatherSearch', weatherSearchSchema);

module.exports = WeatherSearch;