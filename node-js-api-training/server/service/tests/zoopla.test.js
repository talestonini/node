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
  [400, loadResponse('400_zoopla_unknown_location')]
];

describe('Zoopla service', () => {
  before(() => mockAxiosAdapter.onAny().reply(config => responses.shift()));

  it('should import properties using default parameters', () => {
    return zoopla.importProperties({})
      .then(response => {
        expect(response.count).toBe(100);
        expect(response.properties).toExist('response has no properties');
        expect(response.properties.length).toBe(100);
        response.properties.forEach(property => {
          expect(property.__v).toBeA('number');
          expect(property.listingId).toExist('response property has no listingId');
          Property.findOne({ listingId: property.listingId })
            .then(response => expect(response.listingId).toBe(property.listingId));
        })
      });
  });

  it('should handle disambiguation error response', () => {
    return zoopla.importProperties({ area: 'Melbourne' })
      .then(response => {
        expect(response).toInclude({
          httpStatus: 200,
          errorCode: -1,
          errorMessage: 'Disambiguation required.'
        });
      });
  });

  it('should handle unknown location error response', () => {
    return zoopla.importProperties({ country: 'Ireland' })
      .then(response => {
        expect(response).toInclude({
          httpStatus: 400,
          errorCode: '7',
          errorMessage: 'Unknown location entered.'
        });
      });
  });
});
