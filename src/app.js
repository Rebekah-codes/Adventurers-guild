const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Fallback to index.html for SPA-ish routing
// Use '/*' to avoid path-to-regexp errors on some Express versions
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Guild site running on port ${PORT}`);
});