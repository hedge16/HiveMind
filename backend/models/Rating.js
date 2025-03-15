"use strict";
import { DataTypes } from "sequelize";

export function createRatings(database) {
    database.define('Rating', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        vote: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isIn: [[1, -1]]
            }
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
}