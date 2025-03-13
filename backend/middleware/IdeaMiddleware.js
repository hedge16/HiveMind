
export function ensureIdeaDoesNotExceedMaxLength(req, res, next) {
    if (req.body.title.length > 50 || req.body.description.length > 400) {
        const error = new Error("Idea title or description exceeds maximum length");
        error.status = 400;
        next(error);
    } else {
        next();
    }
}