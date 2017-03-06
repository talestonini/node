require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let zoopla = require('./service/zoopla');

let app = express();
app.use(bodyParser.json());

app.post('/properties/zoopla/import', (req, res) => {
  zoopla.importProperties(req.body)
    .then((response) => {
      if (response.httpStatus) {
        return res.status(response.httpStatus).send(_.pick(response, ['errorCode', 'errorMessage']));
      }
      res.send(response);
    })
    .catch((e) => {
      console.log('error importing properties from Zoopla:', e);
      res.status(500).send({
        errorCode: 'unknown',
        errorMessage: 'ops... this is embarrassing...'
      });
    });
});

app.listen(process.env.PORT, () => {
  console.log(`Started on port ${process.env.PORT}`)
});

module.exports = {
  app
}
