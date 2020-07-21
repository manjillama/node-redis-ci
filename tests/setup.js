//Setting 1 min jest timeout, default is 5 sec
jest.setTimeout(60000);
/*
 * Global jest setup
 * Gets executed one time by jest when it first starts up
 */
require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
