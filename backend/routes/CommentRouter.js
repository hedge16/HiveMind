import express from 'express';
import { CommentController } from '../controllers/CommentController.js';

export const commentRouter = express.Router();

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Create a comment
 *     description: Allows a user to create a comment on an idea.
 *     tags: [Comment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ideaId:
 *                 type: integer
 *                 description: ID of the idea the comment is for
 *               userId:
 *                 type: integer
 *                 description: ID of the user creating the comment
 *               content:
 *                 type: string
 *                 description: The content of the comment
 *             required:
 *               - ideaId
 *               - userId
 *               - content
 *     responses:
 *       200:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 comment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     ideaId:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     content:
 *                       type: string
 *       400:
 *         description: Invalid comment data
 *       500:
 *         description: Internal server error
 */

commentRouter.post("/comment", (req, res, next) => {
    CommentController.createComment(req).then((comment) => {
        res.json({
            success: true,
            message: "Comment created successfully",
            comment: comment
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
 * /comment/idea/{id}:
 *   get:
 *     summary: Get comments for an idea
 *     description: Retrieves all comments associated with a specific idea based on its ID.
 *     tags: [Comment]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the idea to fetch comments for
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comments fetched successfully
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
 *                   content:
 *                     type: string
 *       500:
 *         description: Internal server error
 */

commentRouter.get("/comment/idea/:id", (req, res, next) => {
    CommentController.getCommentsByIdeaId(req).then((comments) => {
        res.json(comments);
    }).catch((error) => {
        res.status(500);
        res.json({
            success: false,
            message: "Internal server error"
        });
    });
});
