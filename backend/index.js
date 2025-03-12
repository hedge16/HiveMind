import express from 'express';

const app = express();
const PORT = 3000;

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

