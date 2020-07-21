const mongoose = require('mongoose');
const User = mongoose.model('User');

/*
* We have to avoid a hard coded user id inside the test because if we ran a test 100 times
  we would always to attempting to login the same exact user every single time.
  We really don't want to use the same object/record inside the database in this case over and over
  with every test run that we do.
  Since its way to easy to accidentally have some data from some test we ran previously leake into another one.

  So ideally, we would create brand new user for every test, we run 
  i.e. create new user -> save to database -> login as new user
*/

/**
 * @returns Promise
 */
module.exports = () => {
  return new User({}).save();
};
