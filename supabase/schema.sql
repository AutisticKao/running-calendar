-- ==============================================================================
-- Schema: Kalender Lari Indonesia
-- Deskripsi: Tabel untuk menyimpan data event lari dari kalenderlari.com (2018-2026)
-- Termasuk validasi anti-duplikasi melalui UNIQUE KEY pada `detail_url`.
-- ==============================================================================

-- Buat ekstensi UUID jika belum ada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Buat tabel events
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    date_text VARCHAR(100) NOT NULL,            -- e.g. "03 Januari 2026" atau "24-25 Mei 2025"
    start_date DATE,                            -- e.g. '2026-01-03' (untuk sorting & filtering)
    year INTEGER NOT NULL,                      -- e.g. 2026 (2018 - 2026)
    month INTEGER,                              -- 1 - 12
    category VARCHAR(255) NOT NULL,             -- e.g. "5K, 10K, 21K", "Full Marathon", "Trail"
    location TEXT NOT NULL,                     -- e.g. "GBK, Jakarta" atau "Yogyakarta"
    city VARCHAR(100),                          -- e.g. "Jakarta", "Bandung", "Bali"
    detail_url TEXT UNIQUE NOT NULL,            -- ANTI-DUPLIKASI: URL detail sumber kalenderlari.com
    is_featured BOOLEAN DEFAULT FALSE,          -- Untuk highlight event besar nasional
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk optimasi query pencarian & filter
CREATE INDEX IF NOT EXISTS idx_events_year ON events(year);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_city ON events(city);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(is_featured);

-- Full text search index untuk judul & lokasi
CREATE INDEX IF NOT EXISTS idx_events_search ON events USING gin(to_tsvector('simple', title || ' ' || location));

-- Aktifkan Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Kebijakan akses: Publik bisa membaca data (SELECT)
CREATE POLICY "Public Read Events" 
ON events FOR SELECT 
USING (true);

-- Kebijakan akses: Service role / Authenticated bisa insert & update
CREATE POLICY "Service Role Upsert Events" 
ON events FOR ALL 
USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');
