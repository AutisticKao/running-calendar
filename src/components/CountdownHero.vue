<template>
  <section class="wm-hero-section">
    <div class="container">
      <div class="wm-hero-header">
        <h1 class="wm-hero-title">
          Where does running <span class="highlight-text">take you</span> next?
        </h1>
        <p class="wm-hero-subtitle">
          Jelajahi lebih dari 2.800 jadwal lomba lari di seluruh penjuru Indonesia.
        </p>
      </div>

      <div class="wm-search-console">
        <div class="search-field search-keyword">
          <label class="field-label">LOKASI / NAMA EVENT</label>
          <div class="input-with-icon">
            <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              :value="searchQuery"
              placeholder="Cari event, kota (cth. Borobudur, Jakarta, Bali)..."
              @input="$emit('update:searchQuery', $event.target.value)"
            />
            <button
              v-if="searchQuery"
              class="btn-clear-field"
              @click="$emit('update:searchQuery', '')"
            >✕</button>
          </div>
        </div>

        <div class="search-field search-category">
          <label class="field-label">KATEGORI JARAK</label>
          <div class="select-wrapper">
            <select
              :value="selectedCategory"
              @change="$emit('update:selectedCategory', $event.target.value)"
            >
              <option value="all">Semua Kategori Jarak</option>
              <option value="42K">Full Marathon (42.195K)</option>
              <option value="21K">Half Marathon (21.097K)</option>
              <option value="10K">10K Run</option>
              <option value="5K">5K Fun Run</option>
              <option value="Trail">Trail Run</option>
              <option value="Ultra">Ultra Marathon</option>
            </select>
          </div>
        </div>

        <div class="search-field search-month">
          <label class="field-label">BULAN</label>
          <div class="select-wrapper">
            <select
              :value="selectedMonth"
              @change="$emit('update:selectedMonth', $event.target.value)"
            >
              <option value="">Semua Bulan</option>
              <option v-for="(name, idx) in monthsNames" :key="idx" :value="String(idx + 1)">
                {{ name }}
              </option>
            </select>
          </div>
        </div>

        <div class="search-field search-year">
          <label class="field-label">TAHUN</label>
          <div class="select-wrapper">
            <select
              :value="selectedYear"
              @change="$emit('update:selectedYear', $event.target.value)"
            >
              <option v-for="y in ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018']" :key="y" :value="y">
                {{ y }}
              </option>
            </select>
          </div>
        </div>

        <div class="search-action">
          <button class="btn-wm btn-wm-primary btn-search-submit" @click="handleScrollToEvents">
            <span>Temukan Race</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="category-pills-wrap">
        <span class="pills-title">Kategori Populer:</span>
        <div class="pills-list">
          <button
            class="category-pill-btn"
            :class="{ active: selectedCategory === 'all' }"
            @click="$emit('update:selectedCategory', 'all')"
          >
            🏁 Semua Lomba
          </button>
          <button
            class="category-pill-btn"
            :class="{ active: selectedCategory === '42K' }"
            @click="$emit('update:selectedCategory', '42K')"
          >
            🏅 Full Marathon (42K)
          </button>
          <button
            class="category-pill-btn"
            :class="{ active: selectedCategory === '21K' }"
            @click="$emit('update:selectedCategory', '21K')"
          >
            🏃 Half Marathon (21K)
          </button>
          <button
            class="category-pill-btn"
            :class="{ active: selectedCategory === '10K' }"
            @click="$emit('update:selectedCategory', '10K')"
          >
            ⚡ 10K Run
          </button>
          <button
            class="category-pill-btn"
            :class="{ active: selectedCategory === '5K' }"
            @click="$emit('update:selectedCategory', '5K')"
          >
            👟 5K Fun Run
          </button>
          <button
            class="category-pill-btn"
            :class="{ active: selectedCategory === 'Trail' }"
            @click="$emit('update:selectedCategory', 'Trail')"
          >
            🌲 Trail Run
          </button>
          <button
            class="category-pill-btn"
            :class="{ active: selectedCategory === 'Ultra' }"
            @click="$emit('update:selectedCategory', 'Ultra')"
          >
            🏔️ Ultra
          </button>
        </div>
      </div>

      <!-- Spotlight Race Countdown Card (Ahotu Style) -->
      <div v-if="featuredEvent" class="spotlight-card" @click="$emit('select-featured', featuredEvent)">
        <div class="spotlight-left">
          <div class="spotlight-badge-row">
            <span class="spotlight-badge">★ SPOTLIGHT RACE TERDEKAT</span>
            <span class="spotlight-cat-tag">{{ featuredEvent.category || 'Road Race' }}</span>
          </div>
          <h3 class="spotlight-title">{{ featuredEvent.title }}</h3>
          <div class="spotlight-meta">
            <span class="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {{ featuredEvent.date_text }}
            </span>
            <span class="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {{ featuredEvent.location }}
            </span>
          </div>
        </div>

        <div class="spotlight-right">
          <div class="countdown-boxes">
            <div class="countdown-unit">
              <span class="unit-val">{{ days }}</span>
              <span class="unit-lbl">HARI</span>
            </div>
            <span class="unit-colon">:</span>
            <div class="countdown-unit">
              <span class="unit-val">{{ hours }}</span>
              <span class="unit-lbl">JAM</span>
            </div>
            <span class="unit-colon">:</span>
            <div class="countdown-unit">
              <span class="unit-val">{{ minutes }}</span>
              <span class="unit-lbl">MENIT</span>
            </div>
            <span class="unit-colon">:</span>
            <div class="countdown-unit">
              <span class="unit-val">{{ seconds }}</span>
              <span class="unit-lbl">DETIK</span>
            </div>
          </div>
          <button class="btn-spotlight-view" @click.stop="$emit('select-featured', featuredEvent)">
            Lihat Detail Race ↗
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  featuredEvent: {
    type: Object,
    default: null
  },
  searchQuery: {
    type: String,
    default: ''
  },
  selectedCategory: {
    type: String,
    default: 'all'
  },
  selectedMonth: {
    type: String,
    default: ''
  },
  selectedYear: {
    type: String,
    default: '2026'
  }
});

const emit = defineEmits([
  'select-featured',
  'update:searchQuery',
  'update:selectedCategory',
  'update:selectedMonth',
  'update:selectedYear'
]);

const monthsNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const days = ref('00');
const hours = ref('00');
const minutes = ref('00');
const seconds = ref('00');
let timer = null;

function updateCountdown() {
  if (!props.featuredEvent || !props.featuredEvent.start_date) {
    days.value = '00';
    hours.value = '00';
    minutes.value = '00';
    seconds.value = '00';
    return;
  }

  const targetDate = new Date(`${props.featuredEvent.start_date}T06:00:00`).getTime();
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff <= 0) {
    days.value = '00';
    hours.value = '00';
    minutes.value = '00';
    seconds.value = '00';
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  days.value = String(d).padStart(2, '0');
  hours.value = String(h).padStart(2, '0');
  minutes.value = String(m).padStart(2, '0');
  seconds.value = String(s).padStart(2, '0');
}

function handleScrollToEvents() {
  const el = document.getElementById('events-catalog');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 620, behavior: 'smooth' });
  }
}

onMounted(() => {
  updateCountdown();
  timer = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.wm-hero-section {
  padding: 56px 0 40px;
  background: radial-gradient(circle at 50% 10%, rgba(225, 29, 72, 0.05) 0%, transparent 70%);
}

.wm-hero-header {
  text-align: center;
  max-width: 820px;
  margin: 0 auto 36px;
}

.wm-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: #FFFFFF;
  border: 1px solid var(--wm-border);
  border-radius: var(--radius-full);
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--wm-dark-muted);
  box-shadow: var(--shadow-sm);
  margin-bottom: 20px;
}

.badge-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--wm-brand);
  animation: pulseDot 1.8s infinite;
}

@keyframes pulseDot {
  0% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.6); }
  70% { box-shadow: 0 0 0 8px rgba(225, 29, 72, 0); }
  100% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
}

.wm-hero-title {
  font-size: clamp(2.1rem, 4.5vw, 3.4rem);
  font-weight: 900;
  line-height: 1.15;
  color: var(--wm-dark);
  margin-bottom: 16px;
}

.highlight-text {
  background: var(--wm-brand-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.wm-hero-subtitle {
  font-size: clamp(1rem, 1.8vw, 1.15rem);
  color: var(--wm-text-body);
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Search Console */
.wm-search-console {
  background: #FFFFFF;
  border: 1px solid var(--wm-border);
  border-radius: var(--radius-xl);
  padding: 12px 16px;
  box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08);
  display: grid;
  grid-template-columns: 2.2fr 1.3fr 1fr 0.9fr auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 28px;
}

@media (max-width: 1024px) {
  .wm-search-console {
    grid-template-columns: 1fr 1fr;
    padding: 16px;
  }
  .search-action {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .wm-search-console {
    grid-template-columns: 1fr;
  }
}

.search-field {
  display: flex;
  flex-direction: column;
  padding: 4px 10px;
  border-right: 1px solid var(--wm-border-subtle);
}

.search-field:last-of-type {
  border-right: none;
}

@media (max-width: 1024px) {
  .search-field {
    border-right: none;
    border-bottom: 1px solid var(--wm-border-subtle);
    padding-bottom: 8px;
  }
}

.field-label {
  font-family: var(--font-display);
  font-size: 0.68rem;
  font-weight: 800;
  color: var(--wm-text-muted);
  letter-spacing: 0.06em;
  margin-bottom: 4px;
}

.input-with-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}

.field-icon {
  color: var(--wm-text-muted);
  flex-shrink: 0;
}

.input-with-icon input {
  width: 100%;
  font-family: var(--font-body);
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--wm-dark);
  border: none;
  background: transparent;
}

.btn-clear-field {
  color: var(--wm-text-muted);
  font-size: 0.85rem;
  padding: 2px 6px;
}

.btn-clear-field:hover {
  color: var(--wm-brand);
}

.select-wrapper select {
  width: 100%;
  font-family: var(--font-body);
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--wm-dark);
  border: none;
  background: transparent;
  cursor: pointer;
}

.btn-search-submit {
  height: 48px;
  padding: 0 24px;
  border-radius: var(--radius-lg);
  font-size: 0.95rem;
  width: 100%;
}

/* Category Pills Bar */
.category-pills-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 36px;
  overflow-x: auto;
  padding-bottom: 6px;
}

.pills-title {
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--wm-dark-muted);
  white-space: nowrap;
}

.pills-list {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-pill-btn {
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 700;
  padding: 7px 15px;
  border-radius: var(--radius-full);
  background: #FFFFFF;
  border: 1px solid var(--wm-border);
  color: var(--wm-dark-muted);
  box-shadow: var(--shadow-sm);
  white-space: nowrap;
  transition: var(--transition-fast);
}

.category-pill-btn:hover {
  border-color: var(--wm-brand);
  color: var(--wm-brand);
  transform: translateY(-1px);
}

.category-pill-btn.active {
  background: var(--wm-brand);
  color: #FFFFFF;
  border-color: var(--wm-brand);
  box-shadow: var(--shadow-glow);
}

/* Spotlight Race Card */
.spotlight-card {
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border-radius: var(--radius-xl);
  padding: 28px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  color: #FFFFFF;
  box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.25);
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: var(--transition-smooth);
}

.spotlight-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 26px 48px -12px rgba(15, 23, 42, 0.35);
  border-color: rgba(225, 29, 72, 0.4);
}

@media (max-width: 880px) {
  .spotlight-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;
    gap: 20px;
  }
  .spotlight-right {
    width: 100%;
    align-items: flex-start;
  }
}

.spotlight-left {
  flex: 1;
}

.spotlight-badge-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.spotlight-badge {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #FDA4AF;
  background: rgba(225, 29, 72, 0.2);
  padding: 3px 10px;
  border-radius: var(--radius-full);
}

.spotlight-cat-tag {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 700;
  color: #94A3B8;
}

.spotlight-title {
  font-size: clamp(1.3rem, 2.2vw, 1.7rem);
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 12px;
  line-height: 1.25;
}

.spotlight-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.88rem;
  color: #CBD5E1;
  font-weight: 500;
}

.meta-item svg {
  color: var(--wm-brand);
}

.spotlight-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
}

.countdown-boxes {
  display: flex;
  align-items: center;
  gap: 8px;
}

.countdown-unit {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  min-width: 58px;
  text-align: center;
}

.unit-val {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 900;
  color: #FFFFFF;
  display: block;
  line-height: 1;
}

.unit-lbl {
  font-size: 0.62rem;
  font-weight: 700;
  color: #94A3B8;
  letter-spacing: 0.08em;
  margin-top: 4px;
  display: block;
}

.unit-colon {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 800;
  color: #64748B;
}

.btn-spotlight-view {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 18px;
  border-radius: var(--radius-full);
  transition: var(--transition-fast);
}

.btn-spotlight-view:hover {
  background: var(--wm-brand);
  border-color: var(--wm-brand);
}
</style>
