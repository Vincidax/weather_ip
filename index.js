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
        
        // Get weather information for the location (using a weather API service)
        const apiKey = '33ed5c61df140f112355337b84fa4947';
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
