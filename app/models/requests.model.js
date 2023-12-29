module.exports = (sequelize, Sequelize) => {
  const Requests = sequelize.define("requests", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
    },
    message: {
      type: Sequelize.STRING
    },
    comment: {
      type: Sequelize.STRING
    }
  });

  return Requests;
};
