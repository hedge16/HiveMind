import { Vote } from '../db/db.js';


export class VoteController {

    static async createVote(req){
        const vote = Vote.build(req.body);
        vote.UserId = req.body.UserId;
        vote.IdeaId = req.body.IdeaId;
        return vote.save();
    }
    static async getVotesByIdeaId(req){
        return Vote.findAll({
            where: {
                IdeaId: req.params.id
            }
        });
    }
    static hasUserVotedForIdea(userId, ideaId, callback){
        Vote.findOne({
            where: {
                UserId: userId,
                IdeaId: ideaId
            }
        }).then((vote) => {
            callback(null, vote !== null);
        }).catch((error) => {
            callback(error, null);
        });
    }
    
}