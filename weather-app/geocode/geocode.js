const request = require('request');

var geocodeAddress = (address) => {
  return new Promise((resolve, reject) => {
    var encodedAddr = encodeURIComponent(address);
    request({
      url: `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddr}`,
      json: true
    }, (error, response, body) => {
      if (error) {
        reject('Unable to connect to Google servers');
      } else if (body.status === 'ZERO_RESULTS') {
        reject('Unable to find that address')
      } else if (body.status === 'OK') {
        var addr = body.results[0];
        resolve({
          address: addr.formatted_address,
          latitude: addr.geometry.location.lat,
          longitude: addr.geometry.location.lng
        });
      }
    });
  });
}

module.exports = {
  geocodeAddress
}
