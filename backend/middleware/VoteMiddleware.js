import {VoteController} from '../controllers/VoteController.js';
import {IdeaController} from '../controllers/IdeaController.js';

export function ensureUserVotesOnlyOthersIdeasOnce(req, res, next) {
    const ideaId = req.body.IdeaId;
    const userId = req.body.UserId;
    VoteController.hasUserVotedForIdea(userId, ideaId, (err, hasVoted) => {
        if(err){
            next({status: 500, message: "Internal server error"});
        } else if(hasVoted){
            next({status: 403, message: "User has already voted for this idea"});
        } else {
            next();
        }
    });
}

export function ensureUserDoesNotVoteForOwnIdea(req, res, next) {
    const ideaId = req.body.IdeaId;
    const userId = req.body.UserId;
    IdeaController.getIdeaById(ideaId, (err, idea) => {
        if(err){
            next({status: 500, message: "Internal server error"});
        } else if(idea.UserId === userId){
            next({status: 403, message: "User cannot vote for their own idea"});
        } else {
            next();
        }
    });
}
