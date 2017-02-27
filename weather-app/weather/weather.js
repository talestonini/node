const request = require('request');

var weather = (lat, lng) => {
  return new Promise((resolve, reject) => {
    var apiKey = '9c90c8a188834d758170d6862b95692e';
    request({
      url: `https://api.forecast.io/forecast/${apiKey}/${lat},${lng}?units=si`,
      json: true
    }, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        reject('Unable to fetch weather');
      } else {
        var weather = body.currently;
        resolve({
          temperature: weather.temperature,
          feelsLike: weather.apparentTemperature
        });
      }
    });
  });
}

module.exports = {
  weather
}
