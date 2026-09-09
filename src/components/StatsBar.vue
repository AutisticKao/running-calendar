<template>
  <div v-if="stats" class="stats-section">
    <div class="container">
      <div class="stats-overview-box">
        <div class="stats-top-row">
          <div class="stats-headline-group">
            <h3 class="stats-main-heading">Distribusi kategori tahun {{ stats.year }}</h3>
          </div>
          <div class="stats-total-box">
            <span class="total-big-num">{{ stats.totalThisYear }}</span>
            <span class="total-big-label">lomba terdata</span>
          </div>
        </div>

        <div class="category-metrics-grid">
          <div
            v-for="(count, catName) in stats.categories"
            :key="catName"
            class="metric-box"
            @click="$emit('select-category', catName)"
          >
            <div class="metric-info">
              <span class="metric-name">{{ catName }}</span>
              <span class="metric-count">{{ count }}</span>
            </div>
            <div class="metric-track">
              <div
                class="metric-fill"
                :style="{ width: `${stats.totalThisYear ? Math.min(100, Math.round((count / stats.totalThisYear) * 100 * 2.2)) : 0}%` }"
              ></div>
            </div>
          </div>
        </div>

        <div v-if="stats.topCities && stats.topCities.length" class="popular-cities-bar">
          <span class="cities-title">Kota penyelenggara utama</span>
          <div class="cities-tags-wrap">
            <button
              v-for="item in stats.topCities"
              :key="item.city"
              class="city-tag-btn"
              @click="$emit('filter-city', item.city)"
            >
              {{ item.city }} <strong>{{ item.count }}</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    default: null
  }
});

defineEmits(['select-category', 'filter-city']);
</script>

<style scoped>
.stats-section {
  padding-bottom: 8px;
}

.stats-overview-box {
  background-color: var(--paper);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 26px 28px;
}

.stats-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
  flex-wrap: wrap;
  gap: 16px;
}

.stats-main-heading {
  font-size: 1.15rem;
  font-weight: 600;
}

.stats-total-box {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.total-big-num {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
}

.total-big-label {
  font-size: 0.82rem;
  color: var(--text-muted);
}

.category-metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 10px;
  margin-bottom: 22px;
}

.metric-box {
  background-color: var(--surface);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  cursor: pointer;
  transition: var(--transition-fast);
}

.metric-box:hover {
  background-color: var(--accent-soft);
}

.metric-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.metric-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--ink);
}

.metric-count {
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--ink-soft);
}

.metric-box:hover .metric-count {
  color: var(--accent-ink);
}

.metric-track {
  width: 100%;
  height: 4px;
  background-color: var(--border-color);
  border-radius: var(--radius-pill);
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  background-color: var(--ink-faint);
  transition: width 0.5s ease;
}

.metric-box:hover .metric-fill {
  background-color: var(--accent);
}

.popular-cities-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 18px;
  border-top: 1px solid var(--border-color);
}

.cities-title {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.cities-tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.city-tag-btn {
  font-size: 0.85rem;
  font-weight: 500;
  background-color: var(--surface);
  color: var(--ink);
  padding: 5px 12px;
  border-radius: var(--radius-pill);
  transition: var(--transition-fast);
}

.city-tag-btn:hover {
  background-color: var(--ink);
  color: #FFFFFF;
}

.city-tag-btn strong {
  color: var(--accent);
  font-weight: 700;
}

.city-tag-btn:hover strong {
  color: #FFFFFF;
}
</style>