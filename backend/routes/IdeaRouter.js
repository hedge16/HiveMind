"use strict";
import express from 'express';
import { IdeaController } from '../controllers/IdeaController.js';
import { ensureIdeaDoesNotExceedMaxLength } from '../middleware/IdeaMiddleware.js';

export const ideaRouter = express.Router();

/**
 * @swagger
 * /idea:
 *   post:
 *     summary: Create a new idea
 *     description: Creates a new idea with the given title and description
 *     tags: [Idea]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Idea title
 *               description:
 *                 type: string
 *                 description: Idea description
 *             required:
 *               - title
 *               - description
 *     responses:
 *       200:
 *         description: Idea created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 idea:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

ideaRouter.post("/idea", ensureIdeaDoesNotExceedMaxLength, (req, res, next) => {
    IdeaController.createIdea(req).then((idea) => {
        res.json({
            success: true,
            message: "Idea created successfully",
            idea: idea
        });
    }).catch((err) => {
        next({status: 500, message: "Errore interno del server"});
    });
});

ideaRouter.get("/idea/user/:userid", (req, res, next) => {
    IdeaController.getIdeasByUserId(req).then((ideas) => {
        res.json(ideas);
    }).catch((err) => {
        next({status: 500, message: "Internal server error"});
    });
});

ideaRouter.get("/idea/:order/:pageNumber", (req, res, next) => {
    IdeaController.getPagedIdeas(req).then((ideas) => {
        res.json(ideas);
    }).catch((err) => {
        console.log(err);
        next({status: 500, message: "Internal server error"});
    });
});