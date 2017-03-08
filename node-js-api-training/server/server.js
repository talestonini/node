require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let zoopla = require('./service/zoopla');
const {Property} = require('./model/property');

let app = express();
app.use(bodyParser.json());

app.post('/properties/zoopla/import', (req, res) => {
  zoopla.importProperties(req.body)
    .then(response => {
      if (response.httpStatus) {
        return res.status(response.httpStatus).send(_.pick(response, ['errorCode', 'errorMessage']));
      }
      res.send(response);
    })
    .catch(e => {
      console.log('error importing properties from Zoopla:', e);
      res.status(500).send({
        errorCode: 'unknown',
        errorMessage: 'ops... this is embarrassing...'
      });
    });
});

app.get('/properties', (req, res) => {
  Property.find()
    .then(properties => res.send({ count: properties.length, properties }))
    .catch(e => res.status(400).send(e));
});

app.get('/properties/:id', (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Property.findById(id)
    .then(property => {
      if (!property) {
        return res.status(404).send();
      }
      res.send({ property });
    })
    .catch(e => res.status(400).send(e));
});

app.post('/properties', (req, res) => {
  new Property(req.body) // TODO: pick only valid body fields
    .save()
    .then(property => res.status(201).send(property))
    .catch(e => res.status(400).send(e));
});

app.delete('/properties/:id', (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Property.findByIdAndRemove(id)
    .then(property => {
      if (!property) {
        return res.status(404).send();
      }
      res.send({ property });
    })
    .catch(e => res.status(400).send(e));
});

app.patch('/properties/:id', (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  let body = req.body; // TODO: pick only valid body fields

  Property.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then(property => {
      if (!property) {
        return res.status(404).send();
      }
      res.send({ property });
    })
    .catch(e => res.status(400).send(e));
});

app.listen(process.env.PORT, () => {
  console.log(`Started on port ${process.env.PORT}`)
});

module.exports = {
  app
}
