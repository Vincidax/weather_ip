from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

IPSTACK_API_KEY = '5dfe00f232e16617f5e796aeed968314'
OPENWEATHERMAP_API_KEY = '147678a712f9ab2aa590e7995fa64df6'

def get_location(ip):
    url = f'http://api.ipstack.com/{ip}?access_key={IPSTACK_API_KEY}'
    response = requests.get(url)
    data = response.json()
    return data['city']

def get_temperature(city):
    url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid={OPENWEATHERMAP_API_KEY}'
    response = requests.get(url)
    data = response.json()
    return data['main']['temp']

@app.route('/api/hello', methods=['GET'])
def hello():
    visitor_name = request.args.get('visitor_name', 'Guest')
    client_ip = request.remote_addr

    # Get location based on IP
    location = get_location(client_ip)

    # Get temperature based on location
    temperature = get_temperature(location)

    greeting = f"Hello, {visitor_name}!, the temperature is {temperature} degrees Celsius in {location}"

    response = {
        "client_ip": client_ip,
        "location": location,
        "greeting": greeting
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)
