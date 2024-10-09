const db = require("../models");

const Student = db.Students;
const Group = db.Groups;

exports.getParams = (req, res) => {
  let search = {};
  if (req.query.id) {
    search.where = { id: req.query.id };
  }
  if (req.query.groupId) {
    search.where = { groupId: req.query.groupId };
  }
  Student.findAll({ ...search })
    .then((res1) => {
      res.send(res1);
    })
    .catch((err) => console.log(err));
};

exports.create = (req, res) => {
  if (req.auth.role === "superadmin" || req.auth.role === "admin") {
    Group.findOne({ where: { id: req.body.groupId } })
      .then((res1) => {
        if (res1) {
          Student.create({
            fullname: req.body.fullname,
            phone: req.body.phone,
            groupId: req.body.groupId,
          })
            .then((res1) => {
              Student.findByPk(res1.id)
                .then((res2) => {
                  res.send(res2);
                })
                .catch((err2) => {
                  res.send(err2);
                });
            })
            .catch((err) => {
              res.send(err);
            });
        } else {
          return res.send("No such group exists!!!");
        }
      })
      .catch((err1) => res.send(err1));
  } else {
    return res.sendStatus(403);
  }
};

exports.update = (req, res) => {
  if (req.auth.role === "superadmin" || req.auth.role === "admin") {
    Group.findOne({ where: { id: req.body.groupId } }).then((res1) => {
      if (res1) {
        let data = {};
        if (req.body.fullname) {
          data.fullname = req.body.fullname;
        }
        if (req.body.phone) {
          data.phone = req.body.phone;
        }
        if (req.body.groupId) {
          data.groupId = req.body.groupId;
        }
        Student.update(data, { where: { id: req.params.id } })
          .then((res1) => {
            if (res1[0] !== 0) {
              Student.findByPk(req.params.id)
                .then((res2) => {
                  res.send(res2);
                })
                .catch((err2) => {
                  res.send(err2);
                });
            } else {
              res.send("Not found");
            }
          })
          .catch((err1) => {
            res.send(err1);
          });
      } else {
        return res.send("No such group exists!!!");
      }
    });
  } else {
    return res.sendStatus(403);
  }
};

exports.delete = (req, res) => {
  if (req.auth.role === "superadmin" || req.auth.role === "admin") {
    Student.destroy({
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
    return res.sendStatus(403);
  }
};
