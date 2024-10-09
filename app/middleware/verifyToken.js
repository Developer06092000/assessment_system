const jwt = require("jsonwebtoken");
const config = require("../config/config");
const db = require("../models");

const Users = db.Users;

module.exports = (req, res, next) => {
  const tokenHeader = req.headers["authorization"];
  if (tokenHeader) {
    const token = tokenHeader.split(" ")[1];
    jwt.verify(token, config.tokenKey, (err, authData) => {
      if (err) return res.sendStatus(403);
      Users.findOne({ where: { username: authData.username } })
        .then((res1) => {
          req.auth = authData;
          if (res1) {
            return next();
          } else {
            return res.send("This username not found!");
          }
        })
        .catch((err) => {
          res.send(err);
        });
    });
  } else {
    return res.sendStatus(403);
  }
};
