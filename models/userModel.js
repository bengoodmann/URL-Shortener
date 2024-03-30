const sequelize = require("../config/db")
const { DataTypes } = require("sequelize")
const Short = require("./shortModel")


const User = sequelize.define("User", {
    name: { type: DataTypes.STRING, allowNull: false, maxlength: 50 },
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    password: {type: DataTypes.STRING, allowNull: false}
})

User.hasMany(Short)
module.exports = User