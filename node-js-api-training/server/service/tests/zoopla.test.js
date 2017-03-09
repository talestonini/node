const expect = require('expect');
const rewire = require('rewire');
const mockAxios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const zoopla = rewire('../zoopla');
const {Property} = require('../../model/property');

let mockAxiosAdapter = new MockAdapter(mockAxios);
zoopla.__set__('axios', mockAxios);

let loadResponse = file => require(`${__dirname}/stubs/${file}.json`);
const responses = [
  [200, loadResponse('200_zoopla_price_range_1-9')],
  [200, loadResponse('200_zoopla_price_range_2-9')],
  [200, loadResponse('200_zoopla_price_range_3-9')],
  [200, loadResponse('200_zoopla_price_range_4-9')],
  [200, loadResponse('200_zoopla_price_range_5-9')],
  [200, loadResponse('200_zoopla_price_range_6-9')],
  [200, loadResponse('200_zoopla_price_range_7-9')],
  [200, loadResponse('200_zoopla_price_range_8-9')],
  [200, loadResponse('200_zoopla_price_range_9-9')],
  [200, loadResponse('200_zoopla_default')],
  [200, loadResponse('200_zoopla_disambiguation')],
  [400, loadResponse('400_zoopla_unknown_location')]
];

describe('Zoopla service', () => {

  before(() => mockAxiosAdapter.onAny().reply(config => responses.shift()));
  beforeEach(() => Property.remove({}));

  it('should import multiple page properties', () => {
    let count = 854;
    let distinct = 674;
    return zoopla.importProperties({ minimumPrice: 998000, maximumPrice: 1000000 })
      .then(response => {
        expect(response.count).toBe(count, `count should be ${count}, but is ${response.count}`);
        expect(response.importCount)
          .toBe(distinct, `importCount should be ${distinct}, but is ${response.importCount}`);
        expect(response.properties.length)
          .toBe(distinct, `properties length should be ${distinct}, but is ${response.properties.length}`);
        return Property.count({})
          .then(dbCount => expect(dbCount).toBe(distinct, `database count should be ${distinct}, but is ${dbCount}`));
      });
  });

  it('should import single page properties using default parameters', () => {
    let count = 100;
    return zoopla.importPageProperties({})
      .then(response => {
        expect(response).toInclude({ count: 404075, importCount: count });
        expect(response.properties).toExist('response has no properties');
        expect(response.properties.length).toBe(100);
        response.properties.forEach(property => {
          expect(property._id).toExist();
          expect(property.__v).toBeA('number');
          expect(property.listingId).toExist('response property has no listingId');
        });
        return Property.count({})
          .then(dbCount => expect(dbCount).toBe(count, `database count should be ${count}, but is ${dbCount}`));
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

});
