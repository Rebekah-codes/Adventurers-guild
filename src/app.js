const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Fallback to index.html for SPA-ish routing using a middleware (avoids path-to-regexp)
app.use((req, res, next) => {
    if (req.method === 'GET' && req.accepts && req.accepts('html')) {
        return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    }
    next();
});

app.listen(PORT, () => {
    console.log(`Guild site running on port ${PORT}`);
});