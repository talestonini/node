const yargs = require('yargs');
const request = require('request');

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

geocode.geocodeAddress(argv.address)
  .then((gcResults) => {
    console.log(gcResults.address);
    weather.weather(gcResults.latitude, gcResults.longitude)
      .then((wResults) => {
        console.log(`The temperature is ${wResults.temperature} C.\nIt feels like ${wResults.feelsLike} C.`);
      });
  })
  .catch((errorMsg) => {
    console.log(errorMsg);
  });
