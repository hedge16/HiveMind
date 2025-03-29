"use strict";
import { Idea } from "../db/db.js";
import { Op } from "sequelize";
import sequelize from "sequelize";

export class IdeaController {
    
    static async createIdea(req) {
        const idea = Idea.build(req.body);
        idea.UserId = req.body.UserId;
        return idea.save();
    }

    static async getIdeasByUserId(req) {
        const userId = req.params.userid;
        return Idea.scope('withVotes').findAll({
            where: {
                UserId: userId
            }
        });
    }

    static async getIdeaById(req) {
        return Idea.scope('withVotes').findByPk(req.params.id);
    }

    static async findByIdeaId(ideaId, callback) {
        Idea.scope('withVotes').findByPk(ideaId).then((idea) => {
            callback(null, idea);
        }).catch((error) => {
            callback(error, null);
        });
    }

    static async getPagedIdeas(req) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const limit = 10; // Numero di idee per pagina
        const offset = limit * (req.params.pageNumber - 1); // Calcola l'offset

        let whereCondition = {
            createdAt: {
                [Op.gte]: oneWeekAgo
            }
        };

        let orderCondition;

        switch (req.params.order) {
            case "controversial":
                orderCondition = [
                    [sequelize.literal('ABS(totalUpvotes - totalDownvotes)'), 'ASC'],
                    [sequelize.literal('totalUpvotes + totalDownvotes'), 'DESC']
                ];
                break;
            case "mainstream":
                orderCondition = [
                    [sequelize.literal('totalUpvotes - totalDownvotes'), 'DESC']
                ];
                break;
            case "unpopular":
                orderCondition = [
                    [sequelize.literal('totalUpvotes - totalDownvotes'), 'ASC']
                ];
                break;
            case "newest":
                orderCondition = [
                    ['createdAt', 'DESC']
                ];
                break;
            default:
                throw new Error("Invalid order parameter");
        }

        // Conta il numero totale di record
        const totalRecords = await Idea.count({
            where: whereCondition,
            distinct: true, // Ensure it counts unique Idea IDs
            col: 'id' // Specify the column to count
        });
        

        // Calcola il numero totale di pagine
        const totalPages = Math.ceil(totalRecords / limit);

        
        // Recupera le idee per la pagina corrente
        const ideas = await Idea.scope('withVotes').findAll({
            where: whereCondition,
            order: orderCondition,
            limit: limit,
            offset: offset
        });


        // Restituisci le idee e il numero totale di pagine
        return {
            ideas,
            totalPages
        };
    }
}