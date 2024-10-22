module.exports = (sequelize, Sequelize) => {
  const Groups = sequelize.define("groups", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    weekdays: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return Groups;
};
