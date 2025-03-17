import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import {authenticationRouter} from './routes/authenticationRouter.js';
import { enforceAuthentication } from './middleware/authorization.js';
import { ideaRouter } from './routes/IdeaRouter.js';
import { commentRouter } from './routes/CommentRouter.js';
import { voteRouter } from './routes/VoteRouter.js';

const app = express();
const PORT = 3000;

dotenv.config();

app.use(morgan('dev')); // Register the morgan logging middleware, use the 'dev' format

app.use(cors()); // Enable CORS for all requests

app.use(express.json()); // Parse incoming requests with a JSON payload

//error handler
app.use( (err, req, res, next) => {
    console.log(err.stack);
    res.status(err.status || 500).json({
    code: err.status || 500,
    description: err.message || "An error occurred"
    });
});

//generate OpenAPI spec and show swagger ui
// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'HIVEMIND',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*Router.js'], // files containing annotations
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(authenticationRouter);
app.use(enforceAuthentication);
app.use(ideaRouter);
app.use(commentRouter);
app.use(voteRouter);

app.listen(PORT);

console.log(`Server running on port: ${PORT}`);
