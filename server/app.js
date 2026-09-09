/**
 * ==============================================================================
 * Kalender Lari Indonesia - Express API Server
 * ------------------------------------------------------------------------------
 * Mendukung dev lokal & Serverless Netlify Functions.
 * ==============================================================================
 */

const express = require('express');
const cors = require('cors');
const { queryEvents, queryStats, isConnectedToSupabase, getLocalSeedData } = require('./supabase');
const { runScraper } = require('../scripts/scraper');

const app = express();

app.use(cors());
app.use(express.json());

// 1. Health check & status
app.get('/api/health', (req, res) => {
  const seed = getLocalSeedData();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    supabaseConnected: isConnectedToSupabase,
    totalSeedRecords: seed.length,
    service: 'Kalender Lari Indonesia API'
  });
});

// 2. Query events list dengan filter tahun, kategori, bulan, pencarian
app.get('/api/events', async (req, res) => {
  try {
    const filters = {
      year: req.query.year || '2026',
      month: req.query.month || null,
      category: req.query.category || null,
      city: req.query.city || null,
      search: req.query.q || req.query.search || null,
      featured: req.query.featured || null,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 30,
      sort: req.query.sort || 'asc'
    };

    const results = await queryEvents(filters);
    res.json(results);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// 3. Highlight / Stats info tahun berjalan
app.get('/api/stats', async (req, res) => {
  try {
    const year = req.query.year || '2026';
    const stats = await queryStats(year);
    res.json(stats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// 4. Trigger Scraping (Protected via CRON_SECRET)
app.post('/api/cron/scrape', async (req, res) => {
  const secret = req.headers['x-cron-secret'] || req.query.secret;
  const configuredSecret = process.env.CRON_SECRET || 'running_secret_key_2026';

  if (secret !== configuredSecret) {
    return res.status(401).json({ error: 'Unauthorized. Invalid cron secret token.' });
  }

  try {
    console.log('⚡ Scraping dipicu via API cron trigger...');
    // Jalankan scraper di background agar tidak timeout pada HTTP request
    runScraper().catch(e => console.error('Cron scrape background error:', e));

    res.json({
      success: true,
      message: 'Scraper task triggered successfully. Data is being harvested and updated.',
      triggeredAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to run scraper', message: err.message });
  }
});

module.exports = app;
