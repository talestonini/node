# Data Models

In many APIs we must model real world entities as objects. In ours, we must model a Property.

## Fields

Start by looking over the output parameters in the [Zoopla Property Listings API](http://developer.zoopla.com/docs/read/Property_listings). We'll want to capture some of these fields for our model:

* Zoopla listing ID and URL for back-referencing the source of the data
* Description
* Published date
* Number of floors, bedrooms, and bathrooms
* The listing type \(e.g. "sale" or "rent"\)
* The stats \(e.g. "active", "offered", "inactive\)
* Property type \(e.g. "Detached house"\)
* Price \(e.g. sale or weekly rent\)
* Location
  * Latitude and Longitude
  * Address string
  * Postcode
  * Country
* Image and thumbnail

There's more information we could capture, but this is the minimum.

## Mongoose

[Mongoose](http://mongoosejs.com) is an Object-Relational Mapping \(ORM\) framework for [MongoDB](https://docs.mongodb.com/manual) and Node.js. It allows us to create a data model for our Property objects.

## Tasks

* Define your `package.json` file in your `property-listing-models` repo.
* Install MongoDB with [Homebrew](http://brew.sh/) and configure a server to run locally.
* If you need to manage environment variables \(e.g. MongoDB URL\), use [envobj](https://github.com/matthewmueller/envobj) to set overridable defaults in your source code.
* Create a Mongoose schema and Property model with the fields above.
* Write a unit test for the Property model using [Mocha](https://mochajs.org/) and [Chai](http://chaijs.com).
  * Test that you're able to create a Property instance.
  * Check that the validation in Mongoose is working and for the fields you've defined.
  * If you need to use promises, try [Q](https://github.com/kriskowal/q).
* Expose an `index.js` file from the package with the Property data model.



