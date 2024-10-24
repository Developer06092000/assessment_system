const config = require("../config/config");
const db = require("../models");

const Student = db.Students;
const Group = db.Groups;

// setTimeout(() => {
//   Student.findOrCreate({
//     where: { id: 1 },
//     defaults: {
//       fullname: "Student1",
//       // username: "student1",
//       // password: "123",
//       phone: "933333",
//       parentsPhone: "933333",
//       groupId: 1,
//     },
//   }).then((res) => {
//     if (res[1]) {
//       console.log("Default student has been created successfully!");
//     } else {
//       console.log("Default student has been created!");
//     }
//   });
// }, 55);

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
  if (req.auth.role === config.defaultRole || req.auth.role === "superadmin" || req.auth.role === "admin") {
    Group.findOne({ where: { id: req.body.groupId } })
      .then((res1) => {
        if (res1) {
          Student.create({
            fullname: req.body.fullname,
            phone: req.body.phone,
            parentsPhone: req.body.parentsPhone,
            groupId: req.body.groupId,
          })
            .then((res1) => {
              res.send("Student has been created successfully");
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
    return res.sendStatus(401);
  }
};

exports.update = async (req, res) => {
  if (req.auth.role === config.defaultRole || req.auth.role === "superadmin" || req.auth.role === "admin") {
    let msg = "";
    if (req.body.groupId) {
      msg = await Group.findOne({ where: { id: req.body.groupId } }).then((res1) => {
        if (!res1) {
          return "No such group exists!!!";
        } else {
          return "";
        }
      });
    }
    if (msg.length !== 0) {
      return res.send(msg);
    }
    let data = {};
    if (req.body.fullname) {
      data.fullname = req.body.fullname;
    }
    if (req.body.phone) {
      data.phone = req.body.phone;
    }
    if (req.body.parentsPhone) {
      data.parentsPhone = req.body.parentsPhone;
    }
    if (req.body.groupId) {
      data.groupId = req.body.groupId;
    }
    Student.update(data, { where: { id: req.params.id } })
      .then((res1) => {
        if (res1[0] !== 0) {
          res.send("Student updated successfully!");
        } else {
          res.send("Not found");
        }
      })
      .catch((err1) => {
        res.send(err1);
      });
  } else {
    return res.sendStatus(401);
  }
};

exports.delete = (req, res) => {
  if (req.auth.role === config.defaultRole || req.auth.role === "superadmin" || req.auth.role === "admin") {
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
    return res.sendStatus(401);
  }
};
