/**
 * Netlify Serverless Function Handler
 * Mengemas Express App dengan serverless-http
 */
const serverless = require('serverless-http');
const app = require('../../server/app');

// Ekspor handler serverless untuk Netlify
module.exports.handler = serverless(app);
