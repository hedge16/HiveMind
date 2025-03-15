import express from 'express';
import { CommentController } from '../controllers/CommentController.js';

export const commentRouter = express.Router();

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