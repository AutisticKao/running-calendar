<template>
  <div v-if="stats" class="wm-stats-section">
    <div class="container">
      <div class="stats-panel">
        <!-- Metric Cards Row -->
        <div class="metrics-row">
          <div class="metric-box">
            <span class="metric-label">TOTAL RACE {{ stats.year }}</span>
            <div class="metric-value-row">
              <span class="metric-num">{{ displayTotalThisYear.toLocaleString('id-ID') }}</span>
              <span class="metric-unit">Events</span>
            </div>
            <span class="metric-hint">Terdaftar di tahun {{ stats.year }}</span>
          </div>

          <div class="metric-box">
            <span class="metric-label">DATABASE ARCHIVE</span>
            <div class="metric-value-row">
              <span class="metric-num">{{ displayTotalAllTime.toLocaleString('id-ID') }}</span>
              <span class="metric-unit">Total</span>
            </div>
            <span class="metric-hint">Sejak 2018 – 2026</span>
          </div>

          <!-- Category Counts Badges -->
          <div class="metric-box category-breakdown-box">
            <span class="metric-label">DISTRIBUSI KATEGORI JARAK</span>
            <div class="category-badges-flow">
              <button
                class="dist-badge marathon"
                @click="$emit('select-category', '42K')"
                title="Filter Full Marathon"
              >
                42K • {{ stats.categories?.['42K'] || 0 }}
              </button>

              <button
                class="dist-badge half"
                @click="$emit('select-category', '21K')"
                title="Filter Half Marathon"
              >
                21K • {{ stats.categories?.['21K'] || 0 }}
              </button>

              <button
                class="dist-badge tenk"
                @click="$emit('select-category', '10K')"
                title="Filter 10K"
              >
                10K • {{ stats.categories?.['10K'] || 0 }}
              </button>

              <button
                class="dist-badge fivek"
                @click="$emit('select-category', '5K')"
                title="Filter 5K"
              >
                5K • {{ stats.categories?.['5K'] || 0 }}
              </button>

              <button
                class="dist-badge trail"
                @click="$emit('select-category', 'Trail')"
                title="Filter Trail Run"
              >
                Trail • {{ stats.categories?.['Trail'] || 0 }}
              </button>

              <button
                class="dist-badge ultra"
                @click="$emit('select-category', 'Ultra')"
                title="Filter Ultra Marathon"
              >
                Ultra • {{ stats.categories?.['Ultra'] || 0 }}
              </button>
            </div>
          </div>
        </div>

        <!-- Top Running Destinations / Cities -->
        <div v-if="stats.topCities && stats.topCities.length" class="cities-strip">
          <span class="cities-label">Kota Favorit Pelari:</span>
          <div class="cities-chips-list">
            <button
              v-for="c in stats.topCities"
              :key="c.city"
              class="city-chip-btn"
              @click="$emit('filter-city', c.city)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{{ c.city }}</span>
              <span class="city-count">({{ c.count }})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  stats: {
    type: Object,
    default: null
  }
});

defineEmits(['select-category', 'filter-city']);

const displayTotalThisYear = ref(0);
const displayTotalAllTime = ref(0);

// Counting animation helper with ease-out cubic
function animateCount(start, end, duration, onUpdate) {
  if (end === undefined || end === null || isNaN(end)) return;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Cubic ease-out
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * easeProgress);
    onUpdate(current);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      onUpdate(end);
    }
  }

  requestAnimationFrame(step);
}

function runCountAnimation() {
  if (!props.stats) return;
  const targetYear = Number(props.stats.totalThisYear) || 0;
  const targetAll = Number(props.stats.totalAllTime) || 2897;

  animateCount(0, targetYear, 1200, (val) => {
    displayTotalThisYear.value = val;
  });

  animateCount(0, targetAll, 1400, (val) => {
    displayTotalAllTime.value = val;
  });
}

onMounted(() => {
  runCountAnimation();
});

watch(
  () => props.stats,
  (newVal) => {
    if (newVal) {
      runCountAnimation();
    }
  },
  { deep: true }
);
</script>

<style scoped>
.wm-stats-section {
  margin-bottom: 36px;
}

.stats-panel {
  background: #FFFFFF;
  border: 1px solid var(--wm-border);
  border-radius: var(--radius-xl);
  padding: 24px 28px;
  box-shadow: var(--shadow-card);
}

.metrics-row {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--wm-border-subtle);
}

@media (max-width: 900px) {
  .metrics-row {
    grid-template-columns: 1fr;
    gap: 18px;
  }
}

.metric-box {
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--wm-text-muted);
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}

.metric-value-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.metric-num {
  font-family: var(--font-display);
  font-size: 2.1rem;
  font-weight: 900;
  color: var(--wm-dark);
  line-height: 1;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

.metric-unit {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--wm-brand);
}

.metric-hint {
  font-size: 0.8rem;
  color: var(--wm-text-muted);
  margin-top: 4px;
}

/* Category Breakdown */
.category-breakdown-box {
  justify-content: center;
}

.category-badges-flow {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.category-badges-flow .dist-badge {
  padding: 6px 13px;
  font-size: 0.78rem;
  cursor: pointer;
  transition: var(--transition-fast);
}

.category-badges-flow .dist-badge:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

/* Cities Strip */
.cities-strip {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-top: 18px;
  flex-wrap: wrap;
}

.cities-label {
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--wm-dark-muted);
  white-space: nowrap;
}

.cities-chips-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.city-chip-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #F8FAFC;
  border: 1px solid var(--wm-border);
  border-radius: var(--radius-full);
  padding: 5px 14px;
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--wm-dark);
  transition: var(--transition-fast);
}

.city-chip-btn svg {
  color: var(--wm-brand);
}

.city-count {
  color: var(--wm-text-muted);
  font-weight: 500;
}

.city-chip-btn:hover {
  border-color: var(--wm-brand);
  background: #FFFFFF;
  color: var(--wm-brand);
  transform: translateY(-1px);
}
</style>
