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
 *               userId:
 *                 type: integer
 *                 description: ID of the user creating the idea
 *             required:
 *               - title
 *               - description
 *               - userId
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
 *                       type: integer
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     userId:
 *                       type: integer
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

/**
 * @swagger
 * /idea/{id}:
 *   get:
 *     summary: Get an idea by its ID
 *     description: Fetches an idea based on its unique ID
 *     tags: [Idea]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the idea
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Idea found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 userId:
 *                   type: integer
 *       404:
 *         description: Idea not found
 *       500:
 *         description: Internal server error
 */

ideaRouter.get("/idea/:id", (req, res, next) => {
    IdeaController.getIdeaById(req).then((idea) => {
        if (!idea) {
            return next({ status: 404, message: "Idea not found" });
        }
        res.json(idea);
    }).catch((err) => {
        console.error(err);
        next({ status: 500, message: "Internal server error" });
    });
});

/**
 * @swagger
 * /idea/user/{userid}:
 *   get:
 *     summary: Get ideas by user ID
 *     description: Fetches all ideas associated with a specific user
 *     tags: [Idea]
 *     parameters:
 *       - name: userid
 *         in: path
 *         description: The ID of the user
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ideas fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   userId:
 *                     type: integer
 *       500:
 *         description: Internal server error
 */

ideaRouter.get("/idea/user/:userid", (req, res, next) => {
    IdeaController.getIdeasByUserId(req).then((ideas) => {
        res.json(ideas);
    }).catch((err) => {
        next({status: 500, message: "Internal server error"});
    });
});

/**
 * @swagger
 * /idea/{order}/{pageNumber}:
 *   get:
 *     summary: Get paginated list of ideas
 *     description: Fetches a paginated list of ideas based on the given order and page number
 *     tags: [Idea]
 *     parameters:
 *       - name: order
 *         in: path
 *         description: The order in which ideas should be listed (e.g., ascending/descending)
 *         required: true
 *         schema:
 *           type: string
 *       - name: pageNumber
 *         in: path
 *         description: The page number to fetch for pagination
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ideas fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ideas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       userId:
 *                         type: integer
 *                 totalPages:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */

ideaRouter.get("/idea/:order/:pageNumber", async (req, res, next) => {
    try {
        const { ideas, totalPages } = await IdeaController.getPagedIdeas(req);

        res.json({
            ideas: ideas,
            totalPages: totalPages
        });
    } catch (err) {
        console.error(err);
        next({ status: 500, message: "Internal server error" });
    }
});
