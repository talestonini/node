const _ = require('lodash');

let loadResponse = file => require(`${__dirname}/../server/service/tests/stubs/${file}.json`);
const responses = [
  loadResponse('200_zoopla_price_range_1-9'),
  loadResponse('200_zoopla_price_range_2-9'),
  loadResponse('200_zoopla_price_range_3-9'),
  loadResponse('200_zoopla_price_range_4-9'),
  loadResponse('200_zoopla_price_range_5-9'),
  loadResponse('200_zoopla_price_range_6-9'),
  loadResponse('200_zoopla_price_range_7-9'),
  loadResponse('200_zoopla_price_range_8-9'),
  loadResponse('200_zoopla_price_range_9-9')
];

let allListingIds = [];
responses.forEach(response => {
  let fileListingIds = _.map(response.listing, 'listing_id');
  Array.prototype.push.apply(allListingIds, fileListingIds);
  console.log('file listing ids count:', fileListingIds.length);
});

let distinct = new Set(allListingIds);
console.log('distincts:', distinct.size);
