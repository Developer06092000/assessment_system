const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  // dialectOptions: {
  //     ssl: {
  //         require: true,
  //         rejectUnauthorized: false,
  //     },
  // },
  // define: {
  //     timestamps: false,
  // },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require("./users.js")(sequelize, Sequelize);
db.Students = require("./students..js")(sequelize, Sequelize);
db.Groups = require("./groups.js")(sequelize, Sequelize);
db.Marks = require("./marks.js")(sequelize, Sequelize);

db.Users.hasMany(db.Users, { foreignKey: "created_id", defaultValue: null });
db.Users.hasMany(db.Groups);
db.Groups.hasMany(db.Students);
db.Groups.hasMany(db.Marks);
db.Students.hasMany(db.Marks);

module.exports = db;
