const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const express = require('express');
const app = express();
const DB = require('./database.js')

const authCookieName = 'token';

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

let entries = [];

apiRouter.post('/entries', (req, res) => {
    try {
        const newEntry = {
            id: entries.length + 1,
            ...req.body,
            dateAdded: new Date()
        };
        entries.push(newEntry);
        res.status(201).send(newEntry);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Form Retrieval
apiRouter.get('/entries', (req, res) => {
    res.json(entries);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});