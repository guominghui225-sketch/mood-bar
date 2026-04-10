// Vercel Serverless Function for Mood Bar API
// This file wraps the Express app for deployment on Vercel

// Import the Express app from the server directory
const app = require('../server/src/server.js');

// Export as Vercel serverless function handler
module.exports = (req, res) => {
  // Add CORS headers for Vercel deployment
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Pass request to Express app
  return app(req, res);
};