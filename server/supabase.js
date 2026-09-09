require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.SUPABASE_SERVICE_KEY || 
  process.env.SUPABASE_KEY || 
  process.env.SUPABASE_ANON_KEY;

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

function getLocalSeedData() {
  const candidatePaths = [
    path.join(__dirname, '..', 'data', 'seed.json'),
    path.join(__dirname, '..', '..', 'data', 'seed.json'),
    path.join(process.cwd(), 'data', 'seed.json'),
    path.join(__dirname, 'data', 'seed.json')
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf8');
        const data = JSON.parse(raw);
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      } catch (e) {
        console.error('Error parsing seed.json at', p, e.message);
      }
    }
  }
  return [];
}

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
      if (!error && data && data.length > 0) {
        return {
          source: 'supabase',
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
          data
        };
      }
      if (error) {
        console.warn('Supabase query error, beralih ke local seed:', error.message);
      }
    } catch (err) {
      console.warn('Supabase exception, beralih ke local seed:', err.message);
    }
  }

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

async function queryStats(selectedYear = null) {
  const year = selectedYear ? parseInt(selectedYear) : 2026;

  if (isConnectedToSupabase && supabase) {
    try {
      const { data: currentYearEvents, error } = await supabase
        .from('events')
        .select('category, city, is_featured, start_date, title, location, detail_url')
        .eq('year', year);

      const { count: totalAllTime } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });

      if (!error && currentYearEvents && currentYearEvents.length > 0) {
        let count5K = 0, count10K = 0, count21K = 0, count42K = 0, countTrail = 0, countUltra = 0;
        const cityCount = {};

        for (const e of currentYearEvents) {
          const cat = (e.category || '').toLowerCase();
          if (cat.includes('5k')) count5K++;
          if (cat.includes('10k')) count10K++;
          if (cat.includes('21k') || cat.includes('half')) count21K++;
          if (cat.includes('42k') || cat.includes('full') || cat.includes('marathon')) count42K++;
          if (cat.includes('trail')) countTrail++;
          if (cat.includes('ultra')) countUltra++;

          const city = e.city || 'Lainnya';
          if (city !== 'Lainnya' && city !== 'Indonesia') {
            cityCount[city] = (cityCount[city] || 0) + 1;
          }
        }

        const topCities = Object.entries(cityCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([city, count]) => ({ city, count }));

        const today = new Date().toISOString().split('T')[0];
        const upcomingFeatured = currentYearEvents
          .filter(e => e.start_date && e.start_date >= today && e.is_featured)
          .sort((a, b) => a.start_date.localeCompare(b.start_date));

        return {
          year,
          totalThisYear: currentYearEvents.length,
          totalAllTime: totalAllTime || currentYearEvents.length,
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
    } catch (err) {
      console.warn('Supabase queryStats error, falling back to local seed:', err.message);
    }
  }

  const list = getLocalSeedData();
  const currentYearEvents = list.filter(e => e.year === year);
  
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
