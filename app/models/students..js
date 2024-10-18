module.exports = (sequelize, Sequelize) => {
  const Students = sequelize.define("students", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    fullname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    // username: {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    //   unique: true,
    // },
    // password: {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    // },
    phone: {
      type: Sequelize.STRING,
    },
    parentsPhone: {
      type: Sequelize.STRING,
    },
  });
  return Students;
};
