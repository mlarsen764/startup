const express = require('express');
const app = express();

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Form Retrieval
app.get('/entries', (req, res) => {
    const mockEntries = [
        {
            id: 1,
            topic: "Atonement of Jesus Christ",
            reference: "stuff",
            details: "more stuff",
            insights: "yeah",
            author: "me",
            anonymous: true
        }
    ];

    res.json(mockEntries);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});