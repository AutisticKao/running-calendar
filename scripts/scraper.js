/**
 * ==============================================================================
 * Kalender Lari Indonesia - Data Harvester / Scraper Script
 * ------------------------------------------------------------------------------
 * Mengambil jadwal event lari dari kalenderlari.com untuk tahun 2018 - 2026.
 * Dilengkapi validasi Anti-Duplikasi (UPSERT) berdasarkan unique `detail_url`.
 * Data disimpan ke Supabase PostgreSQL dan file backup lokal `data/seed.json`.
 * ==============================================================================
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');

// Konfigurasi Supabase (opsional jika dijalankan offline/seed mode)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
let supabase = null;

if (SUPABASE_URL && SUPABASE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('✅ Supabase Client terhubung.');
} else {
  console.log('ℹ️  Kredensial Supabase tidak ditemukan, hasil scrape akan disimpan ke data/seed.json.');
}

// Daftar target URL tahun 2018 - 2026 yang sudah terverifikasi
const SCHEDULE_TARGETS = [
  { year: 2018, url: 'https://kalenderlari.com/jadwal-2018/' },
  { year: 2019, url: 'https://kalenderlari.com/jadwal-2019/' },
  { year: 2020, url: 'https://kalenderlari.com/jadwal-2020/' },
  { year: 2021, url: 'https://kalenderlari.com/jadwal-2021/' },
  { year: 2022, url: 'https://kalenderlari.com/jadwal-event-lari-2022/' },
  { year: 2023, url: 'https://kalenderlari.com/jadwal-event-lari-indonesia-2023/' },
  { year: 2024, url: 'https://kalenderlari.com/jadwal-event-lari-indonesia-2024/' },
  { year: 2025, url: 'https://kalenderlari.com/jadwal-event-lari-indonesia-2025/' },
  { year: 2026, url: 'https://kalenderlari.com/jadwal-event-lari-indonesia-2026/' },
];

const MONTH_MAP = {
  'januari': 1, 'jan': 1,
  'februari': 2, 'feb': 2,
  'maret': 3, 'mar': 3,
  'april': 4, 'apr': 4,
  'mei': 5, 'may': 5,
  'juni': 6, 'jun': 6,
  'juli': 7, 'jul': 7,
  'agustus': 8, 'ags': 8, 'agu': 8,
  'september': 9, 'sep': 9,
  'oktober': 10, 'okt': 10,
  'november': 11, 'nov': 11,
  'desember': 12, 'des': 12
};

const FEATURED_KEYWORDS = [
  'borobudur marathon', 'maybank marathon', 'pocari sweat run', 
  'jakarta running festival', 'milo activ', 'itb ultra', 
  'bromo marathon', 'isoplus marathon', 'semarang 10k',
  'balifun run', 'ui half marathon', 'garmin run', 'pln electric run'
];

/**
 * Normalisasi string tanggal bahasa Indonesia ke format ISO YYYY-MM-DD
 */
function parseIndonesianDate(rawDate, defaultYear) {
  if (!rawDate) return { startDate: null, month: null, dateText: '' };
  const clean = rawDate.trim();

  // Pola: "03 Januari 2026", "24-25 Mei 2025", "10 Maret"
  const match = clean.match(/(\d{1,2})\s*(?:-|–|\/)?\s*(?:\d{1,2})?\s+([a-zA-Z]+)(?:\s+(\d{4}))?/i);
  if (match) {
    const day = match[1].padStart(2, '0');
    const monthName = match[2].toLowerCase();
    const monthNum = MONTH_MAP[monthName] || 1;
    const monthStr = monthNum.toString().padStart(2, '0');
    const yearStr = match[3] || defaultYear.toString();
    
    return {
      startDate: `${yearStr}-${monthStr}-${day}`,
      month: monthNum,
      dateText: clean
    };
  }

  return { startDate: null, month: null, dateText: clean };
}

/**
 * Ekstraksi kota dari string lokasi
 */
function extractCity(location) {
  if (!location) return 'Indonesia';
  const majorCities = [
    'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Jogja', 'Semarang',
    'Solo', 'Surakarta', 'Bali', 'Denpasar', 'Malang', 'Medan', 'Makassar',
    'Bogor', 'Depok', 'Tangerang', 'Bekasi', 'Lombok', 'Palembang',
    'Batam', 'Balikpapan', 'Samarinda', 'Manado', 'Padang', 'Pekanbaru'
  ];

  for (const city of majorCities) {
    const regex = new RegExp(`\\b${city}\\b`, 'i');
    if (regex.test(location)) {
      if (city.toLowerCase() === 'jogja') return 'Yogyakarta';
      if (city.toLowerCase() === 'surakarta') return 'Solo';
      return city;
    }
  }
  return 'Lainnya';
}

/**
 * Cek apakah lomba termasuk lomba besar/featured
 */
function checkIfFeatured(title) {
  const lower = title.toLowerCase();
  return FEATURED_KEYWORDS.some(kw => lower.includes(kw));
}

/**
 * Scrape satu tahun jadwal
 */
async function scrapeYear(target) {
  console.log(`\n⏳ Mengambil jadwal tahun ${target.year} dari: ${target.url}...`);
  try {
    const response = await fetch(target.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.error(`❌ Gagal mengambil tahun ${target.year}: Status HTTP ${response.status}`);
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const events = [];

    $('table.tablepress tbody tr').each((_, row) => {
      const cols = $(row).find('td');
      if (cols.length >= 4) {
        const dateRaw = $(cols[0]).text().trim();
        const nameLink = $(cols[1]).find('a');
        const title = nameLink.length ? nameLink.text().trim() : $(cols[1]).text().trim();
        const detailUrl = nameLink.length ? nameLink.attr('href').trim() : `${target.url}#${encodeURIComponent(title)}`;
        const category = $(cols[2]).text().trim();
        const location = $(cols[3]).text().trim();

        if (!title) return;

        const { startDate, month, dateText } = parseIndonesianDate(dateRaw, target.year);
        const city = extractCity(location);
        const isFeatured = checkIfFeatured(title);

        events.push({
          title,
          date_text: dateText,
          start_date: startDate,
          year: target.year,
          month,
          category: category || 'Umum',
          location: location || 'Indonesia',
          city,
          detail_url: detailUrl,
          is_featured: isFeatured
        });
      }
    });

    console.log(`✔️ Sukses memproses ${events.length} event untuk tahun ${target.year}.`);
    return events;
  } catch (err) {
    console.error(`❌ Error saat scraping tahun ${target.year}:`, err.message);
    return [];
  }
}

/**
 * Eksekusi utama scraping seluruh tahun (2018-2026)
 */
async function runScraper() {
  console.log('🚀 Memulai Proses Scraping Kalender Lari Indonesia (2018 - 2026)...');
  console.log(`⏰ Waktu eksekusi: ${new Date().toISOString()}`);

  const allEventsMap = new Map(); // Untuk anti-duplikasi in-memory berdasarkan detail_url

  for (const target of SCHEDULE_TARGETS) {
    const events = await scrapeYear(target);
    for (const evt of events) {
      // Validasi Anti-Duplikasi: hanya simpan jika belum ada atau update
      allEventsMap.set(evt.detail_url, evt);
    }
  }

  const allEvents = Array.from(allEventsMap.values());
  console.log(`\n=============================================================`);
  console.log(`🎉 Total data event bersih (tanpa duplikat): ${allEvents.length} event.`);
  console.log(`=============================================================`);

  // 1. Simpan ke file data/seed.json sebagai cadangan lokal & offline support
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const seedPath = path.join(dataDir, 'seed.json');
  fs.writeFileSync(seedPath, JSON.stringify(allEvents, null, 2), 'utf8');
  console.log(`💾 Data cadangan lokal berhasil disimpan ke: ${seedPath}`);

  // 2. Jika Supabase aktif, lakukan operasi UPSERT anti-duplikasi
  if (supabase) {
    console.log(`\n🔄 Menyinkronkan data ke PostgreSQL Supabase via UPSERT (Anti-Duplikasi)...`);
    const BATCH_SIZE = 100;
    let syncedCount = 0;

    for (let i = 0; i < allEvents.length; i += BATCH_SIZE) {
      const batch = allEvents.slice(i, i + BATCH_SIZE);
      const { data, error } = await supabase
        .from('events')
        .upsert(batch, { onConflict: 'detail_url' });

      if (error) {
        console.error(`⚠️ Gagal sync batch ${i} - ${i + batch.length}:`, error.message);
      } else {
        syncedCount += batch.length;
        process.stdout.write(`\rProgress sync: ${syncedCount}/${allEvents.length} event...`);
      }
    }
    console.log(`\n✅ Selesai menyinkronkan seluruh data ke Supabase tanpa ada duplikasi!`);
  }

  console.log(`\n✨ Proses Harvester Selesai.`);
  return allEvents;
}

if (require.main === module) {
  runScraper()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal Error:', err);
      process.exit(1);
    });
}

module.exports = { runScraper, scrapeYear };
