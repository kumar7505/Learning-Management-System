const jwt = require("jsonwebtoken"); 

const verifyToken = (token, secretKey) => {
    return jwt.verify(token, secretKey);
 };

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader, "authHeader");
  
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const token = authHeader.split(' ')[1];
    console.log(token);
    

    const payload = verifyToken(token, process.env.JWT_SECRET)
    console.log('payload');
    
    req.user = payload;

    next();
} 

module.exports = authenticate;