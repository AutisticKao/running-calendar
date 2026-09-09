<template>
  <div class="hero-section">
    <div class="container hero-container">
      <div class="hero-left-content">
        <h1 class="hero-main-title">
          Temukan lomba lari berikutnya,<br />
          <span>dari 5K sampai ultra trail</span>
        </h1>

        <p class="hero-description">
          Jadwal lomba lari di seluruh Indonesia, dari 5K, 10K, half marathon, marathon, hingga ultra trail. Arsip resmi 2018 sampai 2026.
        </p>

        <div class="hero-button-group">
          <a href="#events-section" class="btn btn-primary">
            Jelajahi jadwal lomba
          </a>
          <div class="hero-sync-badge">
            <span class="sync-dot" :class="{ live: isLive }"></span>
            <span>{{ isLive ? 'Data live, sinkron tiap 48 jam' : 'Menampilkan data cadangan' }}</span>
          </div>
        </div>
      </div>

      <div v-if="featuredEvent" class="featured-showcase-box">
        <div class="showcase-top-header">
          <span class="showcase-badge">Lomba unggulan</span>
          <span class="showcase-year">{{ featuredEvent.year }}</span>
        </div>

        <div class="showcase-body">
          <h2 class="showcase-race-title">{{ featuredEvent.title }}</h2>

          <div class="showcase-meta-grid">
            <div class="meta-row">
              <span class="meta-label">Tanggal</span>
              <span class="meta-val">{{ featuredEvent.date_text }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Lokasi</span>
              <span class="meta-val">{{ featuredEvent.location }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Kategori</span>
              <span class="meta-val highlight-cat">{{ featuredEvent.category }}</span>
            </div>
          </div>

          <div class="timer-wrapper">
            <div class="timer-unit">
              <span class="unit-number">{{ timeLeft.days }}</span>
              <span class="unit-name">hari</span>
            </div>
            <div class="timer-unit">
              <span class="unit-number">{{ pad(timeLeft.hours) }}</span>
              <span class="unit-name">jam</span>
            </div>
            <div class="timer-unit">
              <span class="unit-number">{{ pad(timeLeft.minutes) }}</span>
              <span class="unit-name">menit</span>
            </div>
            <div class="timer-unit">
              <span class="unit-number">{{ pad(timeLeft.seconds) }}</span>
              <span class="unit-name">detik</span>
            </div>
          </div>

          <div class="showcase-actions">
            <button class="btn btn-primary" @click="$emit('select-featured', featuredEvent)">
              Lihat detail lomba
            </button>
            <a :href="featuredEvent.detail_url" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
              Info sumber
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
  },
  isLive: {
    type: Boolean,
    default: false
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
.hero-section {
  background: var(--paper);
  padding: 56px 0 64px;
  border-bottom: 1px solid var(--border-color);
}

.hero-container {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 48px;
  align-items: center;
}

@media (max-width: 991px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}

.hero-main-title {
  font-size: clamp(2rem, 4vw, 2.9rem);
  font-weight: 600;
  color: var(--ink);
  line-height: 1.15;
  margin-bottom: 18px;
}

.hero-main-title span {
  color: var(--accent);
}

.hero-description {
  font-size: 1.05rem;
  color: var(--text-body);
  max-width: 480px;
  line-height: 1.6;
  margin-bottom: 28px;
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
  color: var(--text-muted);
  font-size: 0.86rem;
}

.sync-dot {
  width: 7px;
  height: 7px;
  background-color: var(--ink-faint);
  border-radius: 50%;
}

.sync-dot.live {
  background-color: var(--trail);
  box-shadow: 0 0 0 3px var(--trail-soft);
}

.featured-showcase-box {
  background-color: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.showcase-top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  border-bottom: 1px solid var(--border-color);
}

.showcase-badge {
  background-color: var(--accent-soft);
  color: var(--accent-ink);
  font-size: 0.78rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: var(--radius-pill);
}

.showcase-year {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
}

.showcase-body {
  padding: 26px;
}

.showcase-race-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 20px;
  line-height: 1.3;
}

.showcase-meta-grid {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.meta-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-size: 0.92rem;
}

.meta-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  width: 72px;
  flex-shrink: 0;
}

.meta-val {
  color: var(--ink);
  font-weight: 500;
}

.highlight-cat {
  color: var(--accent);
  font-weight: 600;
}

.timer-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 24px;
}

.timer-unit {
  background-color: var(--paper);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  text-align: center;
  padding: 12px 6px;
}

.unit-number {
  display: block;
  font-family: var(--font-heading);
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--ink);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.unit-name {
  display: block;
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.showcase-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.showcase-actions .btn {
  flex: 1;
  min-width: 140px;
}

.btn-secondary {
  background: var(--paper);
  border: 1px solid var(--border-color);
  color: var(--ink);
}

.btn-secondary:hover {
  border-color: var(--ink);
}
</style>