"use strict";
import { DataTypes } from 'sequelize';

export function createComments(database) {
    database.define('Comment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
}