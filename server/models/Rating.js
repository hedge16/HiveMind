import { DataTypes, Sequelize } from "sequelize";

export function createRatings (database){ 
    database.define('Rating', {
        vote : {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isIn: [[1, -1]]
            }
        },
        comment : {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
};