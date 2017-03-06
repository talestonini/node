# Services

Ideally, the service layer in a layered architecture should be free from any controller context which the application layer \(our API\) defines. This allows us to reuse this service in other APIs and environments.

## Zoopla Service

A service is needed to communicate with Zoopla. Since we're storing our own data models and using Zoopla as a third party API, it makes sense to isolate this into its own service. The service must:

* Make requests to the [Zoopla Property Listings API](http://developer.zoopla.com/docs/read/Property_listings).
* Support all the input parameters that are available \(just pass them through\). By default, it should use these values:

`country="England", outcode="BR1", page_number=1, page_size=100`

* Support use of an API key. Define a fake key in [envobj](https://github.com/matthewmueller/envobj) and use a reference in your code.
  * If you're using the real Zoopla API, set the key in your user's environment variables to override this one.
* Allow making multiple requests and using the pagination parameters to request all pages, and support a property object limit if provided.
* Use promises or RxJS for requests.
* Have Mocha tests for all methods. You should either use the [mock server](https://github.com/aramk/zoopla-api-mock), or create test fixtures and mock methods with [Sinon](https://github.com/sinonjs/sinon).

## Property Service

A service is needed to handle all property application logic. It must:

* Support calling the Zoopla service you defined.
* Support converting a Zoopla property document into our Property model.
* Support persisting the converted property into MongoDB using Mongoose.
