const { Sequelize, DataTypes, Model } = require('sequelize');
const  sequelize  = require('../config/db');

const User = sequelize.define('user', {
    username:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false,
    },
    firstName: {
        type : DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull:false,
    }
},{
    indexes:[{unique: true, fields:["id", "email"]}]
});



module.exports =  { User };

