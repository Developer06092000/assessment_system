const { Op } = require("sequelize");
const db = require("../models");
const { sequelize } = db;

const Mark = db.Marks;
const Student = db.Students;
const Group = db.Groups;

// sequelize.query(`CREATE OR REPLACE FUNCTION calculate_average()
//   RETURNS TRIGGER AS $$
//   BEGIN
//     NEW.average = (NEW."listen" + NEW."read" + NEW."speak" + NEW."vocab") / 4.0;
//     RETURN NEW;
//   END;
//   $$ LANGUAGE plpgsql;

// 	CREATE OR REPLACE TRIGGER calculate_average_insert_trigger
//   BEFORE INSERT OR UPDATE ON marks
//   FOR EACH ROW
//   EXECUTE FUNCTION calculate_average();
// `);

setTimeout(() => {
  Mark.findOrCreate({
    where: { id: 1 },
    defaults: {
      extant: true,
      listen: 60,
      read: 60,
      vocab: 70,
      speak: 70,
      date: "2024-09-09",
      groupId: 1,
      studentId: 1,
    },
  }).then((res) => {
    if (res[1]) {
      console.log("Default mark has been created successfully!");
    } else {
      console.log("Default mark has been created!");
    }
  });
}, 60);

function getLastDayOfMonth(year, month) {
  const lastDay = new Date(year, month + 1, 0).getDate();
  const lastDate = `${year}-${(month + 1).toString().padStart(2, 0)}-${lastDay}`;
  return lastDate;
}

exports.getParams = (req, res) => {
  let search = {};
  if (req.query.id) {
    search.where = { id: req.query.id };
  }
  if (req.query.groupId) {
    search.where = { groupId: req.query.groupId };
  }
  if (req.query.date) {
    search.where = { date: req.query.date };
  }
  Mark.findAll({ ...search })
    .then((res1) => {
      res.send(res1);
    })
    .catch((err) => console.log(err));
};

exports.getDate = (req, res) => {
  if (!req.query?.groupId || req.query?.groupId.length === 0) return res.send("No such groupId exists!!!");
  if (!req.query?.date || req.query?.date.length === 0) return res.send("No such date exists!!!");
  let date = new Date(req.query.date);
  const year = date.getFullYear();
  const month = date.getMonth();
  const lastDate = getLastDayOfMonth(year, month);
  let search = {
    where: { groupId: req.query.groupId, date: { [Op.between]: [req.query.date, lastDate] } },
  };

  Mark.findAll({ ...search })
    .then((res1) => {
      return res.send(res1);
    })
    .catch((err) => console.log(err));
};

exports.create = (req, res) => {
  if (!req.body.groupId) return res.send("No such groupId exists!!!");
  if (!req.body.studentId) return res.send("No such studentId exists!!!");
  Group.findOne({ where: { id: req.body.groupId } })
    .then((res1) => {
      if (res1) {
        Student.findOne({ where: { id: req.body.groupId } })
          .then((res2) => {
            if (res2) {
              let data = {};
              if (req.body.extant) {
                data.extant = req.body.extant;
              } else {
                data.extant = false;
              }
              if (req.body.listen) {
                data.listen = +req.body.listen;
              } else {
                data.listen = 0;
              }
              if (req.body.read) {
                data.read = +req.body.read;
              } else {
                data.read = 0;
              }
              if (req.body.vocab) {
                data.vocab = +req.body.vocab;
              } else {
                data.vocab = 0;
              }
              if (req.body.speak) {
                data.speak = +req.body.speak;
              } else {
                data.speak = 0;
              }
              if (req.body.date) {
                data.date = req.body.date;
              }
              data.average = Math.round((data.speak + data.listen + data.vocab + data.read) / 4);
              data.groupId = req.body.groupId;
              data.studentId = req.body.studentId;
              Mark.create(data)
                .then((res3) => {
                  Mark.findByPk(res3.id)
                    .then((res4) => {
                      res.send(res4);
                    })
                    .catch((err4) => {
                      res.send(err4);
                    });
                })
                .catch((err3) => {
                  res.send(err3);
                });
            } else {
              return res.send("No such student exists!!!");
            }
          })
          .catch((err2) => res.send(err2));
      } else {
        return res.send("No such group exists!!!");
      }
    })
    .catch((err1) => res.send(err1));
};

exports.update = async (req, res) => {
  const mark = await Mark.findOne({ where: { id: req.params.id } });
  if (mark) {
    let data = {};
    if (req.body.groupId) {
      const group = await Group.findOne({ where: { id: req.body.groupId } });
      if (group) {
        data.groupId = req.body.groupId;
      } else {
        return res.send("No such groupId exists!!!");
      }
    }
    if (req.body.studentId) {
      const student = await Student.findOne({ where: { id: req.body.studentId } });
      if (student) {
        data.studentId = req.body.studentId;
      } else {
        return res.send("No such studentId exists!!!");
      }
    }
    if (req.body.extant) {
      data.extant = req.body.extant;
    }
    if (req.body.listen) {
      data.listen = +req.body.listen;
    }
    if (req.body.read) {
      data.read = +req.body.read;
    }
    if (req.body.vocab) {
      data.vocab = +req.body.vocab;
    }
    if (req.body.speak) {
      data.speak = +req.body.speak;
    }
    if (req.body.date) {
      data.date = req.body.date;
    }
    data.average = Math.round(
      (Number(data.speak ?? mark.speak) +
        Number(data.listen ?? mark.listen) +
        Number(data.vocab ?? mark.vocab) +
        Number(data.read ?? mark.read)) /
        4
    );
    Mark.update(data, { where: { id: req.params.id } })
      .then((res1) => {
        if (res1[0] !== 0) {
          Mark.findByPk(req.params.id)
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
    return res.send("No such mark exists!!!");
  }
};

exports.delete = (req, res) => {
  Mark.destroy({
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
