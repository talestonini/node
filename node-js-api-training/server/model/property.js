const mongoose = require('mongoose');

let PropertySchema = new mongoose.Schema({
  listingId: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  publishedDate: {
    type: Date, // TODO: change to Date
    required: true
  },
  numFloors: {
    type: Number,
    required: true
  },
  numBedrooms: {
    type: Number,
    required: true
  },
  numBathrooms: {
    type: Number,
    required: true
  },
  listingStatus: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    trim: true
  },
  propertyType: {
    type: String,
    trim: true
  },
  price: {
    type: String,
    trim: true
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    displayableAddress: {
      type: String,
      required: true,
      trim: true
    },
    postcode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    }
  },
  image: {
    type: String,
    trim: true
  },
  thumbnail: {
    type: String,
    trim: true
  }
});

let Property = mongoose.model('Property', PropertySchema);

module.exports = {
  Property
}
