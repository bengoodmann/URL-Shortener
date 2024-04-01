const Sequelize = require("sequelize")
const path = require("path")
process.env.DATABASE_URL
const DATABASE = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, 'db.sqlite3'),
  logging: console.log,
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false, 
//     },
//   },
});

(async () => {
    try {
        await DATABASE.authenticate()
        console.log("Database connection was successful")
    } catch (error) {
        console.error("An error occurred while connecting to the database", error)
    }

})

module.exports = DATABASE