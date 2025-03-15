"use strict";
import { DataTypes } from "sequelize";

export function createVotes(database) {
    database.define('Vote', {
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
        }
    });
}