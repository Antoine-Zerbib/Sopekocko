//un package qui permet de limiter le nombre de requêtes à la suite
const rateLimit = require("express-rate-limit");
 
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100  // 100 tentatives maximum
});

module.exports = apiLimiter;