"use strict";
import { Sequelize } from "sequelize";
import { createUsers } from "../models/User.js";
import { createIdeas } from "../models/Idea.js";
import { createRatings } from "../models/Rating.js";


export const database = new Sequelize("sqlite:mydb.sqlite");
try {
    database.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}
createUsers(database);
createIdeas(database);
createRatings(database);


export const { User, Idea, Rating } = database.models;


User.hasMany(Idea);
Idea.belongsTo(User);
Idea.hasMany(Rating);
Rating.belongsTo(Idea);
Rating.belongsTo(User);

Idea.addScope('withVotes', {
    attributes: {
        include: [
            [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN Ratings.vote = 1 THEN 1 ELSE 0 END')), 'totalUpvotes'],
            [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN Ratings.vote = -1 THEN 1 ELSE 0 END')), 'totalDownvotes'],
            [Sequelize.literal('SUM(CASE WHEN Ratings.vote = 1 THEN 1 ELSE 0 END) / NULLIF(SUM(CASE WHEN Ratings.vote = -1 THEN 1 ELSE 0 END), 0)'), 'score'],
            [Sequelize.literal('COUNT(Ratings.id)'), 'TotalVotes']
        ]
    },
    include: [{
        model: Rating,
        attributes: []
    }],
    group: ['Idea.id']
});


//synchronize schema (creates missing tables)
database.sync().then( () => {
    console.log("Database synced correctly");
  }).catch( err => {
    console.err("Error with database synchronization: " + err.message);
});