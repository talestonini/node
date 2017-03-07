const expect = require('expect');
const rewire = require('rewire');
const fs = require('fs');
const {ObjectID} = require('mongodb');
const mockAxios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const zoopla = rewire('../zoopla');

let mockAxiosAdapter = new MockAdapter(mockAxios);
zoopla.__set__('axios', mockAxios);

let loadResponse = file => JSON.parse(fs.readFileSync(`${__dirname}/stubs/${file}.json`));
const responses = [
  [200, loadResponse('200_zoopla_default')],
  [200, loadResponse('200_zoopla_disambiguation')],
  [400, loadResponse('400_zoopla_unknown_location')]
];

describe('Zoopla service', () => {
  before(() => {
    mockAxiosAdapter.onAny().reply(config => responses.shift());
  });

  it('should import properties using default parameters', () => {
    return zoopla.importProperties({})
      .then(response => {
        expect(response.count).toBe(100);
        expect(response.properties.length).toBe(100);
      }, error => console.log(error.response));
  });

  it('should handle disambiguation error response', () => {
    return zoopla.importProperties({ area: 'Melbourne' })
      .then(response => {
        expect(response.httpStatus).toBe(200);
        expect(response.errorCode).toBe(-1);
        expect(response.errorMessage).toBe('Disambiguation required.');
      }, error => console.log(error.response));
  });

  it('should handle unknown location error response', () => {
    return zoopla.importProperties({ country: 'Ireland' })
      .then(response => {
        expect(response.httpStatus).toBe(400);
        expect(response.errorCode).toBe('7');
        expect(response.errorMessage).toBe('Unknown location entered.');
      }, error => console.log(error.response));
  });
});
