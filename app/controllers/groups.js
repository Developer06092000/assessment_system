const db = require("../models");

const Group = db.Groups;
const User = db.Users;

// create default group
// setTimeout(() => {
//   Group.findOrCreate({
//     where: { name: "Group1" },
//     defaults: {
//       name: "Group1",
//       type: "beg",
//       userId: 4,
//     },
//   }).then((res) => {
//     if (res[1]) {
//       console.log("Default group has been created successfully!");
//     } else {
//       console.log("Default group has been created!");
//     }
//   });
// }, 100);

exports.get = (req, res) => {
  const id = req.params?.id;
  let search = {};
  if (req.auth.role === "teacher") {
    if (id) {
      search.where = { userId: req.auth.id, id };
    } else {
      search.where = { userId: req.auth.id };
    }
  } else {
    if (id) search.where = { id };
  }
  Group.findAll({ raw: true, ...search })
    .then((res1) => {
      res.send(res1);
    })
    .catch((err) => console.log(err));
};

exports.create = (req, res) => {
  if (req.auth.role !== "teacher") {
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
                        weekdays: req.body.weekdays,
                        userId: req.body.userId,
                      })
                        .then((res4) => {
                          return res.send("Group has been created successfully");
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
  } else {
    return res.sendStatus(401);
  }
};

exports.update = (req, res) => {
  if (req.auth.role !== "teacher") {
    User.findByPk(req.auth.id).then(async (res1) => {
      let data = {};
      if (req.body.userId) {
        let message = "";
        await User.findByPk(req.body.userId)
          .then((res2) => {
            if (res2 && res2?.role === "teacher") {
              data.userId = req.body.userId;
            } else {
              message = "No such teacher or user exists!!!";
            }
          })
          .catch((err2) => res.send(err2));
        if (message.length !== 0) return res.send(message);
      }
      if (req.body.name) {
        data.name = req.body.name;
      }
      if (req.body.type) {
        data.type = req.body.type;
      }
      if (req.body.weekdays) {
        data.weekdays = req.body.weekdays;
      }
      if (req.body.userId) {
        data.userId = req.body.userId;
      }
      Group.update(data, { where: { id: req.params.id } })
        .then((res2) => {
          if (res2[0] !== 0) {
            return res.send("Group updated successfully!");
          } else {
            return res.send("Not found");
          }
        })
        .catch((err1) => res.send(err1));
    });
  } else {
    return res.sendStatus(401);
  }
};

exports.delete = (req, res) => {
  if (req.auth.role !== "teacher") {
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
  } else {
    return res.sendStatus(401);
  }
};
