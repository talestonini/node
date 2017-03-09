let axios = require('axios');
const decamelize = require('decamelize');
const merge = require('merge');
const _ = require('lodash');

const {Property} = require('../model/property');

const API_KEY = 'xexa5zsx55mttszpd9yuykj3';
const DEFAULT_FILTERS = { country: 'England', outcode: 'BR1', pageNumber: 1, pageSize: 100 };

/**
 * Imports properties from Zoopla's listings into the database.
 * 
 * If a page number is provided within the filters, properties will be imported from that page onwards, otherwise from
 * page IMPORT_PROP_DEFAULT_FILTERS.pageNumber. All the pages will be processed until the end or pages limit is reached.
 */
let importProperties = (filters, pagesLimit = Number.MAX_SAFE_INTEGER) => {
  filters = merge(DEFAULT_FILTERS, filters);
  return importPageProperties(filters)
    .then(firstImport => {
      let totalPages = Math.ceil(firstImport.count / filters.pageSize);
      let lastPage = Math.min(totalPages, filters.pageNumber + pagesLimit - 1);
      console.log(`--------> pages ${filters.pageNumber} to ${lastPage} (total ${totalPages})`);
      console.log(`--------> count`, firstImport.count);

      let pageImportPromises = [];
      for (let i = filters.pageNumber + 1; i <= lastPage; i++) { // first page already imported
        filters.pageNumber = i;
        pageImportPromises.push(importPageProperties(filters));
      }

      let aggregation = firstImport;
      return Promise.all(pageImportPromises)
        .then(imports => {
          imports.forEach(_import => {
            aggregation.importCount += _import.importCount;
            Array.prototype.push.apply(aggregation.properties, _import.properties);
          });
          console.log('-------->', {
            count: aggregation.count,
            importCount: aggregation.importCount,
            'properties.length': aggregation.properties.length
          });

          return aggregation;
        });
    });
}

/**
 * Imports 1 page worth of properties from Zoopla's listings into the database.
 */
let importPageProperties = filters => {
  let zooplaUrl = `http://api.zoopla.co.uk/api/v1/property_listings.json?api_key=${API_KEY}${uriParams(filters)}`;
  console.log(`page ${filters.pageNumber} -> GET ${zooplaUrl}`);
  return axios.get(zooplaUrl)
    .then(response => {
      if (response.status === 200 && response.data.error_code) {
        return errorResponse(response);
      }

      let count = response.data.result_count;
      let persistPromises = [];
      response.data.listing.forEach(listing => {
        let property = mapToProperty(listing, response.data.postcode, response.data.country);
        persistPromises.push(persistProperty(property));
      });
      return Promise.all(persistPromises).then(properties => {
        return {
          count,
          importCount: _.filter(properties, p => p && p.__v === 0).length,
          properties: _.map(properties, p => _.pick(p, ['_id', '__v', 'listingId']))
        };
      });
    }, error => errorResponse(error.response));
};

let uriParams = filters => {
  let params = '';
  for (let filter in filters) {
    params += param(filter, filters[filter]);
  }
  return params;
};

let param = (name, value) => `&${encodeURIComponent(decamelize(name))}=${encodeURIComponent(value)}`;

let mapToProperty = (listing, postcode, country) => {
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
  };
};

let persistProperty = property => {
  return Property.findOneAndUpdate({ listingId: property.listingId }, { $set: property }, { new: true })
    .then(updatedProperty => updatedProperty ? updatedProperty : new Property(property).save())
    .catch(e => {
      console.log('error persisting property:', e);
      return e;
    });
};

let errorResponse = response => {
  console.log('error querying Zoopla:', response.status);
  console.log(response.data);
  return {
    httpStatus: response.status,
    errorCode: response.data.error_code,
    errorMessage: response.data.error_string
  };
};

module.exports = {
  importProperties,
  importPageProperties
}
