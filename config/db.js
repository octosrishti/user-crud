const { Sequelize } = require("sequelize");

/**
 * Create a Sequelize instance. This can be done by passing
 * the connection parameters separately to the Sequelize constructor.
 */
const sequelize = new Sequelize(
   "crud_user",
   "interview_user",
   "interview_password",
   {
      dialect: "postgres",
   }
);

/**
 * Export the Sequelize instance. This instance can now be
 * used in the index.js file to authenticate and establish a database connection.
 */
module.exports =  sequelize ;