const jwt = require('jsonwebtoken');
const config = require('config');


const authenticateJWT = (req, res, next) => {
  const token = req.cookies['token']; 

  if (token) {
    jwt.verify(token, config.get("jwtSecret"), (err, decodedToken) => {
      if (err) {
        console.log("JWT Verification Failed:", err.message);
        return res.sendStatus(403); 
      }

      console.log("JWT Verification Successful. Decoded Token:", decodedToken);
      req.user = decodedToken;
      next();
    });
  } else {
    console.log("No JWT Token Provided");
    res.sendStatus(401); 
  }
};

module.exports = authenticateJWT;
