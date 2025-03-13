import {Idea} from "../db/db.js";

export class IdeaController {
    
    static async createIdea(req){
        const idea = Idea.build(req.body);
        idea.UserId = req.UserId;
        return idea.save();
    }
    static async getIdeasByUserId(req){
        return Idea.findAll(
            {
                where: {
                    UserId: req.UserId
                }
            }
        );
    }

    static async getIdeaById(req){
        return Idea.findByPk(req.params.id);
    }


}