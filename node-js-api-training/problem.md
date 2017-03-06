# The Problem

A real estate company needs an API which allows users to browse housing property listings for sale and rent. This API will be used for their website and mobile apps to support customers, agents, and admins.

We must use the [Zoopla Property Listings API](http://developer.zoopla.com/docs/read/Property_listings) to populate housing properties into our own API. In order to use the API freely, you must [register an account](http://developer.zoopla.com/member/register). Due to the API request restrictions and for the purposes of testing, feel free to use this [mock server](https://github.com/aramk/zoopla-api-mock) to populate our own data models.

The API should support:

* RESTful CRUD actions \(Create, Read, Update, Delete\) on properties.
* An action to trigger importing from Zoopla given a set of parameters.
* Persistence of data models with MongoDB.

## Architecture

The architecture should be separated into three layers:

* **property-listing-models**
  * The data layer including the data models and persistence layer.
* **property-listing-services**
  * The service layer which exposes the Zoopla API and application context.
  * Uses the data layer for modelling inputs/outputs from the services.
* **property-listing-api**
  * The API layer which exposes the endpoints.
  * Uses the service layer for completing requests.
  * Uses the data layer for persistence.

Each of these layers should be its own Node.js package. Start by creating a blank Git repo for each of them. Use `npm link` to define links to support local development. The next chapters will take you through these layers in sequence as you build the full application.

