const axios = require('axios');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

exports.getMapData = async (req, res) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({
        error: true,
        message: 'Location parameter is required'
      });
    }
    
    const geocodeResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: location,
        key: GOOGLE_MAPS_API_KEY
      }
    });
    
    if (geocodeResponse.data.status !== 'OK' || geocodeResponse.data.results.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'Location not found'
      });
    }
    
    const result = geocodeResponse.data.results[0];
    const coordinates = result.geometry.location;
    
    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(location)}`;
    
    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.lat},${coordinates.lng}&zoom=13&size=600x400&markers=color:red%7C${coordinates.lat},${coordinates.lng}&key=${GOOGLE_MAPS_API_KEY}`;
    
    res.json({
      success: true,
      location: {
        formattedAddress: result.formatted_address,
        coordinates: coordinates,
        placeId: result.place_id
      },
      embedUrl: embedUrl,
      staticMapUrl: staticMapUrl,
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`
    });
  } catch (error) {
    console.error('Error fetching map data:', error.message);
    
    if (error.response && error.response.status === 403) {
      return res.status(403).json({
        error: true,
        message: 'Google Maps API key invalid or quota exceeded'
      });
    }
    
    res.status(500).json({
      error: true,
      message: 'Failed to fetch map data'
    });
  }
};