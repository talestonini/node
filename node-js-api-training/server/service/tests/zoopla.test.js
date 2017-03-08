const expect = require('expect');
const rewire = require('rewire');
const fs = require('fs');
const {ObjectID} = require('mongodb');
const mockAxios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const zoopla = rewire('../zoopla');
const {Property} = require('../../model/property');

let mockAxiosAdapter = new MockAdapter(mockAxios);
zoopla.__set__('axios', mockAxios);

let loadResponse = file => JSON.parse(fs.readFileSync(`${__dirname}/stubs/${file}.json`));
const responses = [
  [200, loadResponse('200_zoopla_default')],
  [200, loadResponse('200_zoopla_disambiguation')],
  [400, loadResponse('400_zoopla_unknown_location')],
  [200, loadResponse('200_zoopla_price_range_1-9')],
  [200, loadResponse('200_zoopla_price_range_2-9')],
  [200, loadResponse('200_zoopla_price_range_3-9')],
  [200, loadResponse('200_zoopla_price_range_4-9')],
  [200, loadResponse('200_zoopla_price_range_5-9')],
  [200, loadResponse('200_zoopla_price_range_6-9')],
  [200, loadResponse('200_zoopla_price_range_7-9')],
  [200, loadResponse('200_zoopla_price_range_8-9')],
  [200, loadResponse('200_zoopla_price_range_9-9')]
];

describe('Zoopla service', () => {
  before(() => mockAxiosAdapter.onAny().reply(config => responses.shift()));

  it('should import single page properties using default parameters', () => {
    return zoopla.importPageProperties({})
      .then(response => {
        expect(response).toInclude({ count: 404075, importCount: 100 });
        expect(response.properties).toExist('response has no properties');
        expect(response.properties.length).toBe(100);
        response.properties.forEach(property => {
          expect(property._id).toExist();
          expect(property.__v).toBeA('number');
          expect(property.listingId).toExist('response property has no listingId');
          Property.findOne({ listingId: property.listingId })
            .then(response => expect(response.listingId).toBe(property.listingId));
        })
      });
  });

  it('should handle disambiguation error response', () => {
    return zoopla.importPageProperties({ area: 'Melbourne' })
      .then(response => {
        expect(response).toInclude({
          httpStatus: 200,
          errorCode: -1,
          errorMessage: 'Disambiguation required.'
        });
      });
  });

  it('should handle unknown location error response', () => {
    return zoopla.importPageProperties({ country: 'Ireland' })
      .then(response => {
        expect(response).toInclude({
          httpStatus: 400,
          errorCode: '7',
          errorMessage: 'Unknown location entered.'
        });
      });
  });

  it('should import multiple page properties', () => {
    let count = 854;
    return zoopla.importProperties({ minimumPrice: 998000, maximumPrice: 1000000 })
      .then(response => {
        expect(response.count).toBe(count, `count should be ${count}, but is ${response.count}`);
        expect(response.importCount).toBe(count, `importCount should be ${count}, but is ${response.importCount}`);
        expect(response.properties.length)
          .toBe(count, `properties length should be ${count}, but is ${response.properties.length}`);
      });
  });
});
