import express from 'express';
import { VoteController } from '../controllers/VoteController.js';
import { ensureUserDoesNotVoteForOwnIdea, ensureUserVotesOnlyOthersIdeasOnce } from '../middleware/VoteMiddleware.js';

export const voteRouter = express.Router();

/**
 * @swagger
 * /vote:
 *   post:
 *     summary: Create a vote
 *     description: Allows a user to vote on an idea, with checks to ensure users can vote only once on others' ideas and not on their own.
 *     tags: [Vote]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ideaId:
 *                 type: integer
 *                 description: ID of the idea being voted on
 *               userId:
 *                 type: integer
 *                 description: ID of the user casting the vote
 *               vote:
 *                 type: integer
 *                 description: The vote cast by the user (1 for upvote, -1 for downvote)
 *             required:
 *               - ideaId
 *               - userId
 *               - vote
 *     responses:
 *       200:
 *         description: Vote created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 vote:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     ideaId:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     vote:
 *                       type: integer
 *       400:
 *         description: Invalid request or user action
 *       500:
 *         description: Internal server error
 */

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

/**
 * @swagger
 * /vote/idea/{id}:
 *   get:
 *     summary: Get votes for an idea
 *     description: Retrieves all votes for a specific idea based on its ID.
 *     tags: [Vote]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the idea to fetch votes for
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Votes fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   ideaId:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   vote:
 *                     type: integer
 *       500:
 *         description: Internal server error
 */

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

/**
 * @swagger
 * /vote:
 *   patch:
 *     summary: Change a vote
 *     description: Allows a user to change their vote on an idea.
 *     tags: [Vote]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voteId:
 *                 type: integer
 *                 description: ID of the vote to be changed
 *               newVote:
 *                 type: integer
 *                 description: The new vote value (1 for upvote, -1 for downvote)
 *             required:
 *               - voteId
 *               - newVote
 *     responses:
 *       200:
 *         description: Vote changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 vote:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     ideaId:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     vote:
 *                       type: integer
 *       400:
 *         description: Invalid vote data or action
 *       500:
 *         description: Internal server error
 */

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

/**
 * @swagger
 * /vote/user/{id}:
 *   get:
 *     summary: Get all votes by a user
 *     description: Retrieves all votes cast by a specific user based on their user ID.
 *     tags: [Vote]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user to fetch votes for
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Votes fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   ideaId:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   vote:
 *                     type: integer
 *       500:
 *         description: Internal server error
 */

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
