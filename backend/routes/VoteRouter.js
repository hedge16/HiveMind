import express from 'express';
import { VoteController } from '../controllers/VoteController.js';

export const voteRouter = express.Router();

voteRouter.post("/vote", (req, res, next) => {
    VoteController.createVote(req).then((vote) => {
        res.json({
            success: true,
            message: "Vote created successfully",
            vote: vote
        });
    }).catch((error) => {
        res.status(500);
        res.json({
            success: false,
            message: "Internal server error"
        });
    });
});

voteRouter.get("/vote/idea/:id",  (req, res, next) => {
    VoteController.getVotesByIdeaId(req).then((votes) => {
        res.json(votes);
    }).catch((error) => {
        res.status(500);
        res.json({
            success: false,
            message: "Internal server error"
        });
    });
});