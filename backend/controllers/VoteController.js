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

    static async changeVote(req) {
        const { UserId, IdeaId, vote } = req.body;

        try {
            // Trova il voto esistente
            const existingVote = await Vote.findOne({
                where: {
                    UserId: UserId,
                    IdeaId: IdeaId
                }
            });

            if (existingVote) {
                // Aggiorna il valore del voto
                existingVote.vote = vote;
                await existingVote.save();
                return { message: 'Vote updated successfully', vote: existingVote };
            } else {
                // Se il voto non esiste, creane uno nuovo
                const newVote = await Vote.create({ UserId, IdeaId, vote });
                return { message: 'Vote created successfully', vote: newVote };
            }
        } catch (error) {
            console.error('Error changing vote:', error);
            throw new Error('Failed to change vote');
        }
    }

    static async getVotesByUserId(req) {
        const userId = req.params.id;
    
        try {
            const votes = await Vote.findAll({
                where: {
                    UserId: userId
                }
            });
            return votes;
        } catch (error) {
            console.error('Error retrieving votes for user:', error);
            throw new Error('Failed to retrieve votes for user');
        }
    }
    
}