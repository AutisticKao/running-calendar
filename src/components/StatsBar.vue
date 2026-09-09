<template>
  <div v-if="stats" class="oxy-stats-section">
    <div class="container">
      <div class="stats-overview-box">
        <div class="stats-top-row">
          <div class="stats-headline-group">
            <span class="oxy-subtitle">REKAP DATA TAHUN {{ stats.year }}</span>
            <h3 class="stats-main-heading">Distribusi Kategori Lomba Lari</h3>
          </div>
          <div class="stats-total-box">
            <span class="total-big-num">{{ stats.totalThisYear }}</span>
            <span class="total-big-label">TOTAL EVENT TERDATA</span>
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
          <span class="cities-title">KOTA PENYELENGGARA UTAMA:</span>
          <div class="cities-tags-wrap">
            <span
              v-for="item in stats.topCities"
              :key="item.city"
              class="city-tag-btn"
              @click="$emit('filter-city', item.city)"
            >
              {{ item.city }} <strong>({{ item.count }})</strong>
            </span>
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
.oxy-stats-section {
  padding-bottom: 24px;
}

.stats-overview-box {
  background-color: #FFFFFF;
  border: 1px solid var(--border-color);
  border-top: 4px solid var(--oxy-orange);
  padding: 26px 30px;
  box-shadow: var(--shadow-subtle);
}

.stats-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.stats-main-heading {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--oxy-navy);
  margin-top: 4px;
}

.stats-total-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  border-left: 3px solid var(--oxy-orange);
  padding: 8px 18px;
}

.total-big-num {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 800;
  color: var(--oxy-navy);
  line-height: 1;
}

.total-big-label {
  font-family: var(--font-heading);
  font-size: 0.76rem;
  font-weight: 800;
  color: var(--text-muted);
  letter-spacing: 0.08em;
}

.category-metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.metric-box {
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  padding: 12px 14px;
  cursor: pointer;
  transition: var(--transition-fast);
}

.metric-box:hover {
  border-color: var(--oxy-orange);
  background-color: #FFFFFF;
  box-shadow: 0 4px 10px rgba(0, 34, 90, 0.08);
}

.metric-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.metric-name {
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--oxy-navy);
}

.metric-count {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--oxy-orange);
}

.metric-track {
  width: 100%;
  height: 4px;
  background-color: #CBD5E1;
}

.metric-fill {
  height: 100%;
  background-color: var(--oxy-navy);
  transition: width 0.5s ease;
}

.metric-box:hover .metric-fill {
  background-color: var(--oxy-orange);
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
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.cities-tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.city-tag-btn {
  font-family: var(--font-heading);
  font-size: 0.88rem;
  font-weight: 700;
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  color: var(--oxy-navy);
  padding: 4px 12px;
  cursor: pointer;
  transition: var(--transition-fast);
}

.city-tag-btn:hover {
  background-color: var(--oxy-orange);
  color: #FFFFFF;
  border-color: var(--oxy-orange);
}

.city-tag-btn strong {
  color: var(--oxy-orange);
}

.city-tag-btn:hover strong {
  color: #FFFFFF;
}
</style>
