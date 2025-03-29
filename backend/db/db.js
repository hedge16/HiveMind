"use strict";
import { Sequelize } from "sequelize";
import { createUsers } from "../models/User.js";
import { createIdeas } from "../models/Idea.js";
import { createVotes } from "../models/Vote.js";
import { createComments } from "../models/Comment.js";


export const database = new Sequelize("sqlite:mydb.sqlite");
try {
    database.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}
createUsers(database);
createIdeas(database);
createVotes(database);
createComments(database);


export const { User, Idea, Vote, Comment } = database.models;

// Define relationships
User.hasMany(Idea);
Idea.belongsTo(User);
Idea.hasMany(Vote);
Vote.belongsTo(Idea);
Vote.belongsTo(User);
User.hasMany(Comment);
Comment.belongsTo(User);
Idea.hasMany(Comment);
Comment.belongsTo(Idea);

Idea.addScope('withVotes', {
    attributes: {
      include: [
        [Sequelize.fn('COUNT', Sequelize.col('Votes.IdeaId')), 'totalVotes'],
        [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN Votes.vote = 1 THEN 1 ELSE 0 END')), 'totalUpvotes'],
        [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN Votes.vote = -1 THEN 1 ELSE 0 END')), 'totalDownvotes'],
        [Sequelize.literal('SUM(CASE WHEN Votes.vote = 1 THEN 1 ELSE 0 END) - SUM(CASE WHEN Votes.vote = -1 THEN 1 ELSE 0 END)'), 'score']
      ]
    },
    include: [
      {
        model: Vote,
        attributes: [],
        duplicating: false
      }
    ],
    group: ['Idea.id']
});

// Add a scope to include the user's firstname and lastname in comments
Comment.addScope('withUserDetails', {
  attributes: { include: ['id', 'content', 'createdAt', 'updatedAt'] },
  include: [
      {
          model: User,
          attributes: ['firstName', 'lastName']
      }
  ]
});

//synchronize schema (creates missing tables)
database.sync().then( () => {
    console.log("Database synced correctly");
  }).catch( err => {
    console.err("Error with database synchronization: " + err.message);
});