# API

The API defines the public interface clients will use for accessing the services and data models it exposes. It must: 

* Be built with a web application framework like [Express](https://expressjs.com/).
* Support JSON (de)serialization.
* Use the Property Mongoose model defined in your data layer for CRUD actions.
* Define the following endpoints:
  * `GET /properties` - return an array of properties.
  * `GET /properties/:id` - return the given property.
  * `POST /properties` - create a property.
  * `PUT /properties/:id` - update a property.
  * `DELETE /properties/:id` - delete a property.
  * `POST /properties/zoopla/import` - import properties from Zoopla. This should use the Zoopla Service from your service layer.
* Support error handling, ideally in the form of middleware.
* Have tests for all endpoints written in Mocha and [supertest](https://github.com/visionmedia/supertest).
* Use [Sinon](https://github.com/sinonjs/sinon) and test fixtures to stub out Mongoose model calls (e.g. `find()`, `create()`, `remove()`).
