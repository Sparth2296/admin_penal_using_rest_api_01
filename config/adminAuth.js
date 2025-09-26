const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  let token = req.header("authorization");

  const newToken = token.slice(7, token.length);

  if (newToken) {
    try {
      let decoded = jwt.verify(newToken, "AdminLogin123");
      req.user = decoded;
      res.status(200).json({ msg: "token is Found!!" , data : req.user});
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
  } else {
    res.status(200).json({ msg: "token is not Found!!!" });
  }
  
};

module.exports = adminAuth;
