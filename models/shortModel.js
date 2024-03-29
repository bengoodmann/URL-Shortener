const sequelize = require("../config/db")
const joi = require("joi")
const { DataTypes } = require("sequelize")


const Short = sequelize.define("Short", {
    originalURL: { type: DataTypes.STRING, allowNull: false, maxlength: 2048 },
    name: { type: DataTypes.STRING, allowNull: false, maxlength: 50 },
    description: { type: DataTypes.TEXT },
    clickedTimes: { type: DataTypes.INTEGER, defaultValue: 0 },
    shortened: { type: DataTypes.STRING, unique: true },
})


module.exports =  Short 