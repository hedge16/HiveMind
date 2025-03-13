import {DataTypes} from "sequelize";

export function createIdeas (database){ 
    database.define('Idea', {
        id : {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [0, 400]
            }
        }
    })
};