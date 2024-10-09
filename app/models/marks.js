module.exports = (sequelize, Sequelize) => {
  const Marks = sequelize.define("marks", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    average: {
      type: Sequelize.INTEGER,
    },
    extant: {
      type: Sequelize.BOOLEAN,
    },
    listen: {
      type: Sequelize.INTEGER,
    },
    read: {
      type: Sequelize.INTEGER,
    },
    vocab: {
      type: Sequelize.INTEGER,
    },
    speak: {
      type: Sequelize.INTEGER,
    },
    date: {
      type: Sequelize.DATEONLY,
    },
  });
  return Marks;
};
