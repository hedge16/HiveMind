import express from 'express';
import { VoteController } from '../controllers/VoteController.js';
import { ensureUserDoesNotVoteForOwnIdea, ensureUserVotesOnlyOthersIdeasOnce } from '../middleware/VoteMiddleware.js';

export const voteRouter = express.Router();

// Rotta per creare un voto
voteRouter.post("/vote", ensureUserVotesOnlyOthersIdeasOnce, ensureUserDoesNotVoteForOwnIdea, (req, res, next) => {
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

// Rotta per ottenere i voti di un'idea
voteRouter.get("/vote/idea/:id", (req, res, next) => {
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

// Rotta per cambiare un voto
voteRouter.patch("/vote", (req, res, next) => {
    VoteController.changeVote(req).then((result) => {
        res.json({
            success: true,
            message: result.message,
            vote: result.vote
        });
    }).catch((error) => {
        res.status(500);
        res.json({
            success: false,
            message: "Failed to change vote",
            error: error.message
        });
    });
});

// Rotta per ottenere tutti i voti di un utente
voteRouter.get("/vote/user/:id", (req, res, next) => {
    VoteController.getVotesByUserId(req).then((votes) => {
        res.json(votes);
    }).catch((error) => {
        res.status(500);
        res.json({
            success: false,
            message: "Failed to retrieve votes",
            error: error.message
        });
    });
});

