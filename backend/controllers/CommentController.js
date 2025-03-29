import {Comment} from '../db/db.js';

export class CommentController {
    static async createComment(req){
        const comment = Comment.build(req.body);
        comment.UserId = req.body.UserId;
        comment.IdeaId = req.body.IdeaId;
        return comment.save();
    }

    static async getCommentsByIdeaId(req){
        return Comment.scope('withUserDetails').findAll({
            where: {
                IdeaId: req.params.id
            }
        });
    }
}