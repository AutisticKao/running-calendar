<template>
  <div class="hero-section">
    <div class="container hero-container">
      <!-- Tagline Badge -->
      <div class="hero-badge">
        <span class="badge-dot"></span>
        <span>KALENDER RESMI LARI INDONESIA</span>
      </div>

      <!-- Main Editorial Headline -->
      <h1 class="hero-title">
        Temukan Garis Finis Anda. <br />
        <span class="hero-title-gradient">Jadwal Event Lari Terlengkap.</span>
      </h1>
      <p class="hero-subtitle">
        Jelajahi ribuan jadwal race lari di seluruh Indonesia dari 5K, 10K, Half Marathon, Full Marathon, hingga Ultra Trail Run (2018 - 2026).
      </p>

      <!-- Featured Race Countdown Card (Brook Floating Card) -->
      <div v-if="featuredEvent" class="countdown-card">
        <div class="countdown-header">
          <div class="countdown-tag">
            <span class="badge badge-featured">★ HIGHLIGHT RACE</span>
            <span class="race-year">Musim {{ featuredEvent.year }}</span>
          </div>
          <h2 class="countdown-race-title">{{ featuredEvent.title }}</h2>
          <div class="countdown-meta">
            <span class="meta-item">
              📅 {{ featuredEvent.date_text }}
            </span>
            <span class="meta-separator">•</span>
            <span class="meta-item">
              📍 {{ featuredEvent.location }}
            </span>
            <span class="badge badge-primary">{{ featuredEvent.category }}</span>
          </div>
        </div>

        <div class="timer-grid">
          <div class="timer-box">
            <span class="timer-num">{{ timeLeft.days }}</span>
            <span class="timer-label">HARI</span>
          </div>
          <div class="timer-colon">:</div>
          <div class="timer-box">
            <span class="timer-num">{{ pad(timeLeft.hours) }}</span>
            <span class="timer-label">JAM</span>
          </div>
          <div class="timer-colon">:</div>
          <div class="timer-box">
            <span class="timer-num">{{ pad(timeLeft.minutes) }}</span>
            <span class="timer-label">MENIT</span>
          </div>
          <div class="timer-colon">:</div>
          <div class="timer-box">
            <span class="timer-num">{{ pad(timeLeft.seconds) }}</span>
            <span class="timer-label">DETIK</span>
          </div>
        </div>

        <div class="countdown-footer">
          <button class="btn-primary" @click="$emit('select-featured', featuredEvent)">
            Lihat Detail Race
          </button>
          <a :href="featuredEvent.detail_url" target="_blank" rel="noopener noreferrer" class="btn-secondary">
            Website Sumber ↗
          </a>
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
.hero-section {
  position: relative;
  padding: 64px 0 48px;
  background: radial-gradient(100% 100% at 50% 0%, #FFFFFF 0%, #F5F7FB 100%);
  border-bottom: 1px solid var(--border-subtle);
}

.hero-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #FFFFFF;
  border: 1px solid var(--border-medium);
  box-shadow: var(--shadow-subtle);
  color: var(--text-primary);
  padding: 7px 16px;
  border-radius: var(--radius-full);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  margin-bottom: 24px;
}

.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: var(--accent-primary);
  box-shadow: 0 0 8px var(--accent-primary);
}

.hero-title {
  font-size: clamp(2.4rem, 5.5vw, 4.2rem);
  font-weight: 900;
  line-height: 1.12;
  letter-spacing: -0.035em;
  max-width: 900px;
  margin-bottom: 18px;
  color: var(--text-primary);
}

.hero-title-gradient {
  color: var(--text-secondary);
  font-weight: 800;
}

.hero-subtitle {
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  color: var(--text-secondary);
  max-width: 680px;
  margin-bottom: 42px;
  line-height: 1.6;
}

/* Brook Floating Countdown Card */
.countdown-card {
  width: 100%;
  max-width: 820px;
  padding: 38px 34px;
  border-radius: var(--radius-lg);
  margin-bottom: 48px;
  background: #FFFFFF;
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-elevated);
  transition: var(--transition-normal);
}

.countdown-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
}

.countdown-tag {
  display: flex;
  align-items: center;
  gap: 10px;
}

.race-year {
  color: var(--text-muted);
  font-weight: 700;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.countdown-race-title {
  font-size: clamp(1.5rem, 3.2vw, 2.2rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  color: var(--text-primary);
}

.countdown-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 0.92rem;
  color: var(--text-secondary);
}

.meta-separator {
  color: var(--border-medium);
}

.timer-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
}

.timer-box {
  background: var(--bg-surface-soft);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px 22px;
  min-width: 95px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: var(--shadow-subtle);
}

.timer-num {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1;
  letter-spacing: -0.04em;
}

.timer-label {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: var(--text-muted);
  margin-top: 6px;
}

.timer-colon {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-muted);
}

.countdown-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 14px;
}


</style>
