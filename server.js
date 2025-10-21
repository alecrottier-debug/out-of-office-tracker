const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for demo purposes
let outDates = {};

// API endpoint to get all out-of-office dates
app.get('/api/getOutDates', (req, res) => {
    console.log('GET /api/getOutDates');

    // Convert the outDates object to the expected array format
    const result = [];
    for (const person in outDates) {
        for (const dateKey in outDates[person]) {
            result.push({
                person: person,
                dateKey: dateKey,
                isOut: outDates[person][dateKey]
            });
        }
    }

    res.json(result);
});

// API endpoint to save an out-of-office date
app.post('/api/saveOutDate', (req, res) => {
    const { person, dateKey, isOut } = req.body;

    console.log('POST /api/saveOutDate', { person, dateKey, isOut });

    if (!person || !dateKey) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Initialize person object if it doesn't exist
    if (!outDates[person]) {
        outDates[person] = {};
    }

    // Update the status
    if (isOut) {
        outDates[person][dateKey] = true;
    } else {
        delete outDates[person][dateKey];
    }

    res.json({ success: true });
});

// Serve static files (the HTML app)
app.use(express.static(__dirname));

// Fallback to index.html for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`🚀 Demo Server is running!`);
    console.log(`========================================`);
    console.log(`\n📍 Open your browser and navigate to:`);
    console.log(`\n   http://localhost:${PORT}\n`);
    console.log(`========================================\n`);
});
