const sequelize = require("../config/db")
const { DataTypes } = require("sequelize")
const User = require("./userModel")


const Short = sequelize.define("Short", {
    originalURL: { type: DataTypes.STRING, allowNull: false, maxlength: 2048 },
    name: { type: DataTypes.STRING, allowNull: false, maxlength: 50 },
    description: { type: DataTypes.TEXT },
    clickedTimes: { type: DataTypes.INTEGER, defaultValue: 0 },
    shortened: { type: DataTypes.STRING, unique: true },
    userId: { type: DataTypes.INTEGER}
})

Short.belongsTo(User, {foreignKey: 'userId'})
module.exports =  Short 