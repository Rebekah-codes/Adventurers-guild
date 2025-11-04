const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 3000;

// Backend target (set via env var BACKEND_URL or default to the Heroku backend)
const BACKEND_URL = process.env.BACKEND_URL || 'https://adventurers-guild-backend-76688da2a54c.herokuapp.com';

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Proxy any /api requests to the Django backend so the site appears under one URL.
// This keeps the frontend as the public origin while forwarding API calls to the
// separate backend app. It also avoids CORS issues for browser requests.
app.use('/api', createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    pathRewrite: { '^/api': '/api' },
    proxyTimeout: 5000,
    timeout: 5000,
    onProxyReq: (proxyReq, req, res) => {
        // Forward original host header if needed, or add any custom headers here.
        proxyReq.setHeader('X-Forwarded-Host', req.headers.host);
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err && err.message);
        if (!res.headersSent) {
            res.writeHead(502, { 'Content-Type': 'application/json' });
        }
        res.end(JSON.stringify({ error: 'Bad gateway', details: err && err.message }));
    }
}));

// Quest Board route
app.get('/quests', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'quests.html'));
});

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