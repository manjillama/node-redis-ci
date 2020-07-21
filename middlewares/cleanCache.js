const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
  // Workaround through, only after the blog has been added do rest of the middleware work
  await next();

  clearHash(req.user.id);
};
