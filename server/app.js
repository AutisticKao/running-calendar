const express = require('express');
const cors = require('cors');
const { queryEvents, queryStats, isConnectedToSupabase, getLocalSeedData } = require('./supabase');
const { runScraper } = require('../scripts/scraper');

const app = express();

app.use(cors());
app.use(express.json());

const router = express.Router();

router.get('/health', (req, res) => {
  const seed = getLocalSeedData();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    supabaseConnected: isConnectedToSupabase,
    totalSeedRecords: seed.length,
    service: 'Kalender Lari Indonesia API'
  });
});

router.get('/events', async (req, res) => {
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

router.get('/stats', async (req, res) => {
  try {
    const year = req.query.year || '2026';
    const stats = await queryStats(year);
    res.json(stats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

router.post('/cron/scrape', async (req, res) => {
  const secret = req.headers['x-cron-secret'] || req.query.secret;
  const configuredSecret = process.env.CRON_SECRET || 'running_secret_key_2026';

  if (secret !== configuredSecret) {
    return res.status(401).json({ error: 'Unauthorized. Invalid cron secret token.' });
  }

  try {
    console.log('⚡ Scraping dipicu via API cron trigger...');
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

app.use('/.netlify/functions/api', router);
app.use('/api', router);
app.use('/', router);

module.exports = app;
