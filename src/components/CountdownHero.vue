<template>
  <div class="oxy-hero-section">
    <div class="container hero-container">
      <div class="hero-left-content">
        <div class="hero-tagline">
          <span class="tagline-bar"></span>
          <span>DATABASE EVENT LARI TERBESAR DI INDONESIA</span>
        </div>

        <h1 class="hero-main-title">
          Jadwal Lengkap &amp; <br />
          <span>Kalender Lari Indonesia</span>
        </h1>

        <p class="hero-description">
          Akses informasi terpercaya jadwal race lari di seluruh nusantara dari kategori 5K, 10K, Half Marathon, Full Marathon, hingga Ultra Trail Run (Arsip Resmi 2018 - 2026).
        </p>

        <div class="hero-button-group">
          <a href="#events-section" class="btn-oxy btn-oxy-primary">
            JELAJAHI JADWAL LARI ↓
          </a>
          <div class="hero-sync-badge">
            <span class="sync-dot"></span>
            <span>Update Otomatis Tiap 48 Jam</span>
          </div>
        </div>
      </div>

      <div v-if="featuredEvent" class="featured-showcase-box">
        <div class="showcase-top-header">
          <span class="showcase-badge">HIGHLIGHT EVENT</span>
          <span class="showcase-year">TAHUN {{ featuredEvent.year }}</span>
        </div>

        <div class="showcase-body">
          <h2 class="showcase-race-title">{{ featuredEvent.title }}</h2>

          <div class="showcase-meta-grid">
            <div class="meta-row">
              <span class="meta-label">TANGGAL:</span>
              <span class="meta-val">{{ featuredEvent.date_text }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">LOKASI:</span>
              <span class="meta-val">{{ featuredEvent.location }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">KATEGORI:</span>
              <span class="meta-val highlight-cat">{{ featuredEvent.category }}</span>
            </div>
          </div>

          <div class="oxy-timer-wrapper">
            <div class="timer-unit">
              <span class="unit-number">{{ timeLeft.days }}</span>
              <span class="unit-name">HARI</span>
            </div>
            <div class="timer-separator">:</div>
            <div class="timer-unit">
              <span class="unit-number">{{ pad(timeLeft.hours) }}</span>
              <span class="unit-name">JAM</span>
            </div>
            <div class="timer-separator">:</div>
            <div class="timer-unit">
              <span class="unit-number">{{ pad(timeLeft.minutes) }}</span>
              <span class="unit-name">MENIT</span>
            </div>
            <div class="timer-separator">:</div>
            <div class="timer-unit">
              <span class="unit-number">{{ pad(timeLeft.seconds) }}</span>
              <span class="unit-name">DETIK</span>
            </div>
          </div>

          <div class="showcase-actions">
            <button class="btn-oxy btn-oxy-primary" @click="$emit('select-featured', featuredEvent)">
              LIHAT DETAIL LOMBA →
            </button>
            <a :href="featuredEvent.detail_url" target="_blank" rel="noopener noreferrer" class="btn-oxy btn-oxy-secondary">
              INFO SUMBER ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  featuredEvent: {
    type: Object,
    default: null
  }
});

defineEmits(['select-featured']);

const timeLeft = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
});

let timerInterval = null;

function pad(num) {
  return String(num).padStart(2, '0');
}

function updateCountdown() {
  if (!props.featuredEvent || !props.featuredEvent.start_date) {
    timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return;
  }

  const targetDate = new Date(`${props.featuredEvent.start_date}T05:00:00+07:00`).getTime();
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff <= 0) {
    timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  timeLeft.value = { days, hours, minutes, seconds };
}

watch(() => props.featuredEvent, () => {
  updateCountdown();
});

onMounted(() => {
  updateCountdown();
  timerInterval = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.oxy-hero-section {
  background: linear-gradient(135deg, #00173D 0%, #00225A 60%, #0B3278 100%);
  padding: 60px 0;
  border-bottom: 4px solid var(--oxy-orange);
  position: relative;
  overflow: hidden;
}

.hero-container {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 40px;
  align-items: center;
}

@media (max-width: 991px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}

.hero-tagline {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--oxy-orange);
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.tagline-bar {
  width: 24px;
  height: 3px;
  background-color: var(--oxy-orange);
}

.hero-main-title {
  font-size: clamp(2.4rem, 4.5vw, 3.8rem);
  font-weight: 800;
  color: #FFFFFF;
  line-height: 1.1;
  margin-bottom: 20px;
  letter-spacing: 0.02em;
}

.hero-main-title span {
  color: var(--oxy-orange);
}

.hero-description {
  font-size: 1.05rem;
  color: #CBD5E1;
  max-width: 540px;
  line-height: 1.6;
  margin-bottom: 30px;
}

.hero-button-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.hero-sync-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #E2E8F0;
  font-size: 0.86rem;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.25);
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.sync-dot {
  width: 8px;
  height: 8px;
  background-color: #10B981;
  border-radius: 50%;
  box-shadow: 0 0 6px #10B981;
}

.featured-showcase-box {
  background-color: #FFFFFF;
  border-top: 5px solid var(--oxy-orange);
  box-shadow: 0 20px 40px rgba(0, 15, 45, 0.35);
  border-radius: var(--radius-sharp);
}

.showcase-top-header {
  background-color: #00173D;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.showcase-badge {
  background-color: var(--oxy-orange);
  color: #FFFFFF;
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  padding: 3px 10px;
}

.showcase-year {
  font-family: var(--font-heading);
  font-size: 0.86rem;
  font-weight: 700;
  color: #94A3B8;
  letter-spacing: 0.08em;
}

.showcase-body {
  padding: 28px 26px;
}

.showcase-race-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--oxy-navy);
  margin-bottom: 20px;
  line-height: 1.25;
}

.showcase-meta-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.meta-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-size: 0.95rem;
}

.meta-label {
  font-family: var(--font-heading);
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--text-muted);
  width: 80px;
  flex-shrink: 0;
  letter-spacing: 0.05em;
}

.meta-val {
  color: var(--text-body);
  font-weight: 600;
}

.highlight-cat {
  color: var(--oxy-orange);
  font-weight: 800;
}

.oxy-timer-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr) auto;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

.timer-unit {
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  border-bottom: 3px solid var(--oxy-navy);
  text-align: center;
  padding: 12px 6px;
}

.unit-number {
  display: block;
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 800;
  color: var(--oxy-navy);
  line-height: 1;
}

.unit-name {
  display: block;
  font-family: var(--font-heading);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-top: 4px;
}

.timer-separator {
  display: none;
}

.showcase-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.showcase-actions .btn-oxy {
  flex: 1;
  min-width: 140px;
  font-size: 0.88rem;
  padding: 11px 16px;
}
</style>
