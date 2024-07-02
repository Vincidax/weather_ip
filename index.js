require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Guest';
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
        // Get location based on IP address (use a third-party API service)
        const locationResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
        const location = locationResponse.data.city || 'Unknown location';

        if (location === 'Unknown location') {
            return res.json({
                client_ip: clientIp,
                location: 'Unknown',
                greeting: `Hello, ${visitorName}!, we couldn't determine the temperature at your location.`
            });
        }

        // Get weather information for the location (using a weather API service)
        const apiKey = process.env.WEATHER_API_KEY;
        const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`);
        const temperature = weatherResponse.data.main.temp;

        const greeting = `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`;
        res.json({ client_ip: clientIp, location, greeting });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

