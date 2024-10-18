const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { Op } = require("sequelize");

const Users = db.Users;

Users.findOrCreate({
  where: { username: config.defaultUsername },
  defaults: {
    fullname: config.defaultFullname,
    role: config.defaultRole,
    phone: config.defaultPhone,
    password: bcrypt.hashSync(config.defaultPassword, bcrypt.genSaltSync(Number(config.genSalt)).valueOf()).valueOf(),
  },
}).then((res) => {
  if (res[1]) {
    console.log("Default superadmin has been created successfully!");
  } else {
    console.log("Default superadmin has been created!");
  }
});

Users.findOrCreate({
  where: { username: "superadmin" },
  defaults: {
    fullname: "superadmin",
    role: "superadmin",
    password: bcrypt.hashSync("123", bcrypt.genSaltSync(Number(config.genSalt)).valueOf()).valueOf(),
  },
}).then((res) => {
  if (res[1]) {
    console.log("Default superadmin has been created successfully!");
  } else {
    console.log("Default superadmin has been created!");
  }
});

Users.findOrCreate({
  where: { username: "admin" },
  defaults: {
    fullname: "admin",
    role: "admin",
    password: bcrypt.hashSync("123", bcrypt.genSaltSync(Number(config.genSalt)).valueOf()).valueOf(),
  },
}).then((res) => {
  if (res[1]) {
    console.log("Default admin has been created successfully!");
  } else {
    console.log("Default admin has been created!");
  }
});

Users.findOrCreate({
  where: { username: "teacher" },
  defaults: {
    fullname: "teacher",
    role: "teacher",
    password: bcrypt.hashSync("123", bcrypt.genSaltSync(Number(config.genSalt)).valueOf()).valueOf(),
  },
}).then((res) => {
  if (res[1]) {
    console.log("Default teacher has been created successfully!");
  } else {
    console.log("Default teacher has been created!");
  }
});

exports.get = (req, res) => {
  let tokenHeader = req.headers["authorization"];
  if (tokenHeader) {
    let token = tokenHeader.split(" ")[1];
    jwt.verify(token, config.tokenKey, (err, auth) => {
      if (err) return res.send(err);
      let search = { attributes: ["id", "fullname", "username", "role", "created_id"] };
      if (auth.role === "superadmin") {
        search.where = { role: { [Op.or]: ["teacher", "admin"] } };
      }
      if (auth.role === "admin") {
        search.where = { role: "teacher" };
      }
      if (auth.role === "teacher") {
        return res.send(401);
      }
      Users.findAll(search)
        .then((res1) => {
          return res.send(res1);
        })
        .catch((err) => {
          return res.send(err);
        });
    });
  }
};

exports.register = (req, res) => {
  let tokenHeader = req.headers["authorization"];
  if (tokenHeader) {
    let token = tokenHeader.split(" ")[1];
    jwt.verify(token, config.tokenKey, (err, auth) => {
      if (err) return res.send(err);
      if (auth.role === "superadmin" && req.body.role !== "teacher" && req.body.role !== "admin") {
        return res.send('The role field is invalid. The role field must be of the form "admin" or "teacher".');
      } else if (auth.role === "admin" && req.body.role !== "teacher") {
        return res.send('The role field is invalid. The role field must be of the form "teacher".');
      } else if (auth.role === "teacher") {
        return res.sendStatus(401);
      }
      if (req.body.role !== "superadmin" && req.body.role !== "admin" && req.body.role !== "teacher") {
        return res.send('The role field is invalid. The role field must be of the form "admin" or "teacher".');
      }
      if (req.body.role === config.defaultRole && auth.username !== config.defaultUsername) {
        return res.sendStatus(403);
      }
      Users.findOne({ where: { username: req.body.username } })
        .then((res1) => {
          if (!res1) {
            let salt = bcrypt.genSaltSync(config.genSalt).valueOf();
            let password = bcrypt.hashSync(req.body.password, salt).valueOf();
            let user = {
              fullname: req.body.fullname,
              username: req.body.username,
              password: password,
              phone: req.body.phone,
              role: req.body.role,
              created_id: auth.id,
            };
            Users.create(user)
              .then((res2) => {
                Users.findByPk(res2.id)
                  .then((res3) => {
                    return res.send("User created!");
                  })
                  .catch((err2) => {
                    return res.send(err2);
                  });
              })
              .catch((err) => {
                return res.send(err);
              });
          } else {
            return res.send("This username already exists!");
          }
        })
        .catch((err) => {
          return res.send(err);
        });
    });
  }
};

exports.login = (req, res) => {
  Users.findOne({ where: { username: req.body.username } })
    .then((res1) => {
      if (res1) {
        if (bcrypt.compareSync(req.body.password, res1.password).valueOf()) {
          let user = {
            id: res1.id,
            fullname: res1.fullname,
            username: res1.username,
            role: res1.role,
          };
          jwt.sign(user, config.tokenKey, (err, token) => {
            if (err) return res.send(err);
            return res.send({ token: token, role: res1.role, fullname: res1.fullname });
          });
        } else {
          return res.send("Incorrect password!");
        }
      } else {
        return res.send("Incorrect username");
      }
    })
    .catch((err) => {
      return res.send(err);
    });
};

exports.update = (req, res) => {
  let tokenHeader = req.headers["authorization"];
  if (tokenHeader) {
    let token = tokenHeader.split(" ")[1];
    jwt.verify(token, config.tokenKey, (err, auth) => {
      if (err) return res.send(err);
      if (auth.role !== "teacher") {
        let data = { fullname: req.body.fullname };
        if (auth.role === "superadmin" || auth.role === config.defaultRole) {
          if (req.body.username) data.username = req.body.username;
          if (req.body.phone) data.phone = req.body.phone;
          if (req.body.role && req.body.role !== "superadmin" && req.body.role !== config.defaultRole)
            data.role = req.body.role;
        }
        if (req.body.phone) data.phone = req.body.phone;
        if (req.body.password) {
          let salt = bcrypt.genSaltSync(config.genSalt).valueOf();
          let password = bcrypt.hashSync(req.body.password, salt).valueOf();
          data.password = password;
        }
        Users.update(data, { where: { id: req.params.id } })
          .then((res1) => {
            if (res1[0] !== 0) {
              return res.send("Data has been changed!");
            } else {
              return res.send("Data has not been changed!");
            }
          })
          .catch((err) => {
            return res.send(err);
          });
      } else {
        return res.sendStatus(403);
      }
    });
  } else {
    return res.sendStatus(401);
  }
};

exports.updateAccount = (req, res) => {
  let tokenHeader = req.headers["authorization"];
  if (tokenHeader) {
    let token = tokenHeader.split(" ")[1];
    jwt.verify(token, config.tokenKey, (err, auth) => {
      if (err) return res.send(err);
      let data = { fullname: req.body.fullname };
      if (auth.role === "superadmin") {
        if (req.body.username) data.username = req.body.username;
        if (req.body.role) data.role = req.body.role;
      }
      if (req.body.password) {
        let salt = bcrypt.genSaltSync(config.genSalt).valueOf();
        let password = bcrypt.hashSync(req.body.password, salt).valueOf();
        data.password = password;
      }
      Users.update(data, { where: { id: auth.id } })
        .then((res1) => {
          if (res1[0] !== 0) {
            return res.send("Data has been changed!");
          } else {
            return res.send("Data has not been changed!");
          }
        })
        .catch((err) => {
          return res.send(err);
        });
    });
  } else {
    return res.sendStatus(403);
  }
};

exports.delete = (req, res) => {
  let tokenHeader = req.headers["authorization"];
  if (tokenHeader) {
    let token = tokenHeader.split(" ")[1];
    jwt.verify(token, config.tokenKey, (err, auth) => {
      if (err) return res.send(err);
      if (auth.role !== "teacher") {
        Users.destroy({
          where: { id: req.params.id },
        })
          .then((res1) => {
            if (res1) {
              return res.send("Has been deleted!");
            } else {
              return res.send("Not found");
            }
          })
          .catch((err) => {
            return res.send(err);
          });
      } else {
        return res.sendStatus(403);
      }
    });
  } else {
    res.sendStatus(401);
  }
};
