const request = require('request');
const axios = require('axios');
const decamelize = require('decamelize');

const {Property} = require('../model/property');

const API_KEY = 'xexa5zsx55mttszpd9yuykj3';
const IMPORT_PROP_DEFAULT_FILTERS = {
  country: 'England',
  outcode: 'BR1',
  pageNumber: 1,
  pageSize: 100,
};

let importProperties = (filters) => {
  let params = filters2Params(filters);
  let zooplaUrl = `http://api.zoopla.co.uk/api/v1/property_listings.json?api_key=${API_KEY}${params}`;
  console.log(`GET ${zooplaUrl}`);
  return axios.get(zooplaUrl)
    .then((response) => {
      if (response.status === 200 && response.data.error_code) {
        return errorResponse(response);
      }

      let properties = [];
      response.data.listing.forEach((listing) => {
        let property = listing2Property(listing, response.data.postcode, response.data.country);
        persistProperty(property);
        properties.push(property);
      });
      return {
        count: properties.length,
        properties
      };
    }, (error) => errorResponse(error.response));
};

filters2Params = (filters) => {
  let params = '';
  for (let defaultFilter in IMPORT_PROP_DEFAULT_FILTERS) {
    if (!filters[defaultFilter]) {
      params += reqParam(defaultFilter, IMPORT_PROP_DEFAULT_FILTERS[defaultFilter]);
    }
  }
  for (let filter in filters) {
    params += reqParam(filter, filters[filter]);
  }
  return params;
};

reqParam = (name, value) => `&${encodeURIComponent(decamelize(name))}=${encodeURIComponent(value)}`;

errorResponse = (response) => {
  console.log('error querying Zoopla:', response.status);
  console.log(response.data);
  return {
    httpStatus: response.status,
    errorCode: response.data.error_code,
    errorMessage: response.data.error_string
  };
};

listing2Property = (listing, postcode, country) => {
  return {
    listingId: listing.listing_id,
    url: listing.details_url,
    description: listing.description,
    publishedDate: listing.last_published_date,
    numFloors: listing.num_floors,
    numBedrooms: listing.num_bedrooms,
    numBathrooms: listing.num_bathrooms,
    listingStatus: listing.listing_status,
    status: listing.status,
    propertyType: listing.property_type,
    price: listing.price,
    location: {
      latitude: listing.latitude,
      longitude: listing.longitude,
      displayableAddress: listing.displayable_address,
      postcode,
      country
    },
    image: listing.image_645_430_url,
    thumbnail: listing.thumbnail_url
  }
};

persistProperty = (property) => {
  Property.findOneAndRemove({ listingId: property.listingId })
    .then(() => new Property(property).save())
    .catch((e) => console.log('error persisting property:', e));
}

module.exports = {
  importProperties
}
