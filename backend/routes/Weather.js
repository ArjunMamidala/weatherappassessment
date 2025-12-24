const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/WeatherController');

router.get('/current', weatherController.getCurrentWeather);

router.get('/forecast', weatherController.getForecast);

router.post('/save', weatherController.saveWeatherSearch);

router.get('/saved', weatherController.getSavedSearches);

router.get('/saved/:id', weatherController.getSavedSearchById);

router.put('/saved/:id', weatherController.updateWeatherSearch);

router.delete('/saved/:id', weatherController.deleteWeatherSearch);

router.get('/export', weatherController.exportSearches);

module.exports = router;