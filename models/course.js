'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Model {}
    Course.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'A title is required' },
                notEmpty: { msg: 'Please provide a title' }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: { msg: 'A description is required' },
                notEmpty: { msg: 'Please provide a description' }
            }
        },
        estimatedTime: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: { msg: 'An estimated time is required' },
                notEmpty: { msg: 'Please provide an estimated time' }
            }
        },
        materialsNeeded: {
            type: DataTypes.TEXT,
        },
    }, { sequelize });
    return Course;
};