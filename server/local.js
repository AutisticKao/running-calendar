/**
 * Local Express Dev Server
 * Port: 3000 (atau process.env.PORT)
 */
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🏃 Kalender Lari Indonesia - Backend Server Ready!`);
  console.log(`🌐 Local API: http://localhost:${PORT}`);
  console.log(`📋 Health:    http://localhost:${PORT}/api/health`);
  console.log(`📅 Events:    http://localhost:${PORT}/api/events?year=2026`);
  console.log(`📊 Stats:     http://localhost:${PORT}/api/stats?year=2026`);
  console.log(`======================================================\n`);
});
