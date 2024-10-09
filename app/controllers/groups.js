const db = require("../models");

const Group = db.Groups;
const User = db.Users;

exports.get = (req, res) => {
  let search = {};
  if (req.auth.role === "teacher") {
    search.where = { userId: req.auth.id };
  }
  Group.findAll({ raw: true, ...search })
    .then((res1) => {
      res.send(res1);
    })
    .catch((err) => console.log(err));
};

exports.create = (req, res) => {
  User.findByPk(req.auth.id)
    .then((res1) => {
      if (res1) {
        User.findByPk(req.body.userId)
          .then((res2) => {
            if (res2 && res2?.role === "teacher") {
              Group.findOne({ where: { type: req.body.type, name: req.body.name } })
                .then((res3) => {
                  if (!res3) {
                    Group.create({
                      name: req.body.name,
                      type: req.body.type,
                      userId: req.body.userId,
                    })
                      .then((res4) => {
                        Group.findByPk(res4.id)
                          .then((res5) => {
                            return res.send(res5);
                          })
                          .catch((err5) => {
                            return res.send(err5);
                          });
                      })
                      .catch((err4) => {
                        return res.send(err4);
                      });
                  } else {
                    return res.send("A group with this name and type exists!!!");
                  }
                })
                .catch((err3) => res.send(err3));
            } else {
              return res.send("No such teacher or user exists!!!");
            }
          })
          .catch((err2) => res.send(err2));
      } else {
        return res.sendStatus(401);
      }
    })
    .catch((err) => res.send(err));
};

exports.update = (req, res) => {
  User.findOne({ where: { id: req.body.userId } }).then((res1) => {
    if (res1 && res1?.role === "teacher") {
      let data = {};
      if (req.body.name) {
        data.name = req.body.name;
      }
      if (req.body.type) {
        data.type = req.body.type;
      }
      if (req.body.userId) {
        data.userId = req.body.userId;
      }
      Group.update(data, { where: { id: req.params.id } })
        .then((res2) => {
          if (res2[0] !== 0) {
            Group.findByPk(req.params.id)
              .then((res3) => res.send(res3))
              .catch((err3) => res.send(err3));
          } else {
            return res.send("Not found");
          }
        })
        .catch((err1) => res.send(err1));
    } else {
      return res.send("No such teacher or user exists!!!");
    }
  });
};

exports.delete = (req, res) => {
  Group.destroy({
    where: { id: req.params.id },
  })
    .then((res1) => {
      if (res1) {
        res.send("Has been deleted!");
      } else {
        res.send("Not found");
      }
    })
    .catch((err) => {
      res.send(err);
    });
};
