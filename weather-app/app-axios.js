const yargs = require('yargs');
const request = require('request');
const axios = require('axios');

const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

var encodedAddr = encodeURIComponent(argv.address);
var geocodeUrl = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddr}`;
axios.get(geocodeUrl)
  .then((response) => {
    if (response.data.status === 'ZERO_RESULTS') {
      throw new Error('Unable to find that address');
    }

    var result = response.data.results[0];
    console.log(result.formatted_address);

    var apiKey = '9c90c8a188834d758170d6862b95692e';
    var lat = result.geometry.location.lat;
    var lng = result.geometry.location.lng;
    var weatherUrl = `https://api.forecast.io/forecast/${apiKey}/${lat},${lng}?units=si`;
    return axios.get(weatherUrl);
  })
  .then((response) => {
    var result = response.data.currently;
    console.log(`The temperature is ${result.temperature} C.\nIt feels like ${result.apparentTemperature} C.`);
  })
  .catch((e) => {
    if (e.code === 'ENOTFOUND') {
      console.log('Unable to connect to API servers');
    } else {
      console.log(e.message);
    }
  });
