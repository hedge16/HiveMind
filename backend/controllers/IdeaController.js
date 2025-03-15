"use strict";
import {Idea} from "../db/db.js";
import {Op} from "sequelize";
import sequelize from "sequelize";

export class IdeaController {
    
    static async createIdea(req){
        const idea = Idea.build(req.body);
        idea.UserId = req.body.UserId;
        return idea.save();
    }
    static async getIdeasByUserId(req){
        const userId = req.params.userid;
        return Idea.findAll(
            {
                where: {
                    UserId: userId
                }
            }
        );
    }

    static async getIdeaById(req){
        return Idea.findByPk(req.params.id);
    }

    static async getPagedIdeas(req) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        switch (req.params.order) {
            case "controversial":
                return Idea.scope('withVotes').findAll({
                    where: {
                        createdAt: {
                            [Op.gte]: oneWeekAgo
                        }
                    },
                    order: [
                        [sequelize.literal('ABS(totalUpvotes - totalDownvotes)'), 'ASC'],
                        [sequelize.literal('totalUpvotes + totalDownvotes'), 'DESC']
                    ],
                    limit: 10,
                    offset: 10 * (req.params.pageNumber - 1)
                });
            case "mainstream":
                return Idea.scope('withVotes').findAll({
                    where: {
                        createdAt: {
                            [Op.gte]: oneWeekAgo
                        }
                    },
                    order: [
                        [sequelize.literal('totalUpvotes - totalDownvotes'), 'DESC']
                    ],
                    limit: 10,
                    offset: 10 * (req.params.pageNumber - 1)
                });
            case "unpopular":
                return Idea.scope('withVotes').findAll({
                    where: {
                        createdAt: {
                            [Op.gte]: oneWeekAgo
                        }
                    },
                    order: [
                        [sequelize.literal('totalUpvotes - totalDownvotes'), 'ASC']
                    ],
                    limit: 10,
                    offset: 10 * (req.params.pageNumber - 1)
                });
            default:
                throw new Error("Invalid order parameter");
        }
    }
}