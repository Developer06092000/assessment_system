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
    },
    phone: {
      type: Sequelize.STRING,
    },
  });
  return Students;
};
