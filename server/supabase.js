/**
 * ==============================================================================
 * Supabase Data Client with Automatic Local Fallback
 * ------------------------------------------------------------------------------
 * Mengelola koneksi ke PostgreSQL Supabase.
 * Jika kredensial belum diisi, sistem otomatis membaca data/seed.json.
 * ==============================================================================
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

let supabase = null;
let isConnectedToSupabase = false;

if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    isConnectedToSupabase = true;
    console.log('⚡ Supabase PostgreSQL Client aktif.');
  } catch (e) {
    console.warn('⚠️ Gagal inisialisasi Supabase client:', e.message);
  }
}

/**
 * Membaca data seed lokal dari data/seed.json
 */
function getLocalSeedData() {
  const seedFile = path.join(__dirname, '..', 'data', 'seed.json');
  if (fs.existsSync(seedFile)) {
    try {
      const raw = fs.readFileSync(seedFile, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error parsing seed.json:', e.message);
    }
  }
  return [];
}

/**
 * Mengambil daftar events dengan filter
 */
async function queryEvents(filters = {}) {
  const {
    year,
    month,
    category,
    search,
    city,
    featured,
    page = 1,
    limit = 50,
    sort = 'asc'
  } = filters;

  // Jika terhubung ke Supabase di cloud
  if (isConnectedToSupabase && supabase) {
    try {
      let query = supabase
        .from('events')
        .select('*', { count: 'exact' });

      if (year) query = query.eq('year', parseInt(year));
      if (month) query = query.eq('month', parseInt(month));
      if (city) query = query.ilike('city', `%${city}%`);
      if (featured === 'true' || featured === true) query = query.eq('is_featured', true);
      if (category && category !== 'all') query = query.ilike('category', `%${category}%`);
      if (search) {
        query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%,category.ilike.%${search}%`);
      }

      query = query.order('start_date', { ascending: sort === 'asc', nullsFirst: false });

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (!error && data) {
        return {
          source: 'supabase',
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
          data
        };
      }
      console.warn('Supabase query error, beralih ke local seed:', error?.message);
    } catch (err) {
      console.warn('Supabase exception, beralih ke local seed:', err.message);
    }
  }

  // Fallback: Filter data seed lokal secara cerdas
  let list = getLocalSeedData();

  if (year) {
    list = list.filter(item => item.year === parseInt(year));
  }
  if (month) {
    list = list.filter(item => item.month === parseInt(month));
  }
  if (city) {
    list = list.filter(item => item.city && item.city.toLowerCase().includes(city.toLowerCase()));
  }
  if (featured === 'true' || featured === true) {
    list = list.filter(item => item.is_featured);
  }
  if (category && category !== 'all') {
    const catLower = category.toLowerCase();
    list = list.filter(item => item.category && item.category.toLowerCase().includes(catLower));
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(item => 
      (item.title && item.title.toLowerCase().includes(s)) ||
      (item.location && item.location.toLowerCase().includes(s)) ||
      (item.category && item.category.toLowerCase().includes(s))
    );
  }

  // Sorting berdasarkan tanggal
  list.sort((a, b) => {
    const dateA = a.start_date || '9999-99-99';
    const dateB = b.start_date || '9999-99-99';
    return sort === 'asc' ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA);
  });

  const total = list.length;
  const p = parseInt(page);
  const l = parseInt(limit);
  const start = (p - 1) * l;
  const pagedData = list.slice(start, start + l);

  return {
    source: isConnectedToSupabase ? 'supabase-fallback' : 'local-seed',
    total,
    page: p,
    limit: l,
    totalPages: Math.ceil(total / l),
    data: pagedData
  };
}

/**
 * Statistik ringkas kalender lari
 */
async function queryStats(selectedYear = null) {
  const list = getLocalSeedData();
  const year = selectedYear ? parseInt(selectedYear) : 2026;

  const currentYearEvents = list.filter(e => e.year === year);
  
  // Hitung kategori
  let count5K = 0;
  let count10K = 0;
  let count21K = 0;
  let count42K = 0;
  let countTrail = 0;
  let countUltra = 0;

  for (const e of currentYearEvents) {
    const cat = (e.category || '').toLowerCase();
    if (cat.includes('5k')) count5K++;
    if (cat.includes('10k')) count10K++;
    if (cat.includes('21k') || cat.includes('half')) count21K++;
    if (cat.includes('42k') || cat.includes('full') || cat.includes('marathon')) count42K++;
    if (cat.includes('trail')) countTrail++;
    if (cat.includes('ultra')) countUltra++;
  }

  // Top kota
  const cityCount = {};
  for (const e of currentYearEvents) {
    const city = e.city || 'Lainnya';
    if (city !== 'Lainnya' && city !== 'Indonesia') {
      cityCount[city] = (cityCount[city] || 0) + 1;
    }
  }
  const topCities = Object.entries(cityCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([city, count]) => ({ city, count }));

  // Event besar berikutnya (highlight)
  const today = new Date().toISOString().split('T')[0];
  const upcomingFeatured = list.filter(e => e.start_date && e.start_date >= today && e.is_featured);
  upcomingFeatured.sort((a, b) => a.start_date.localeCompare(b.start_date));

  return {
    year,
    totalThisYear: currentYearEvents.length,
    totalAllTime: list.length,
    categories: {
      '5K': count5K,
      '10K': count10K,
      '21K': count21K,
      '42K': count42K,
      'Trail': countTrail,
      'Ultra': countUltra
    },
    topCities,
    nextBigEvent: upcomingFeatured[0] || currentYearEvents.find(e => e.is_featured) || currentYearEvents[0] || null
  };
}

module.exports = {
  supabase,
  isConnectedToSupabase,
  queryEvents,
  queryStats,
  getLocalSeedData
};
