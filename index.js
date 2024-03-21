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

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
    if (await DB.getUser(req.body.email)) {
        res.status(409).send({ msg: 'Existing user' });
    } else {
        const user = await DB.createUser(req.body.email, req.body.password);
  
        // Set the cookie
        setAuthCookie(res, user.token);
  
        res.send({
            id: user._id,
        });
    }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
    const user = await DB.getUser(req.body.email);
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            setAuthCookie(res, user.token);
            res.send({ id: user._id });
            return;
        }
    }
    res.status(401).send({ msg: 'Unauthorized' });
});
  
// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
    res.clearCookie(authCookieName);
    res.status(204).end();
});
  
// GetUser returns information about a user
apiRouter.get('/user/:email', async (req, res) => {
    const user = await DB.getUser(req.params.email);
    if (user) {
        const token = req?.cookies.token;
        res.send({ email: user.email, authenticated: token === user.token });
        return;
    }
    res.status(404).send({ msg: 'Unknown' });
});
  
// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);
  
secureApiRouter.use(async (req, res, next) => {
    authToken = req.cookies[authCookieName];
    const user = await DB.getUserByToken(authToken);
    if (user) {
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

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