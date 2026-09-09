<template>
  <div v-if="stats" class="stats-section">
    <div class="container">
      <div class="stats-card">
        <div class="stats-header">
          <div class="stats-title-group">
            <span class="stats-subtitle">STATISTIK KALENDER {{ stats.year }}</span>
            <h3 class="stats-title">Distribusi Kategori Lomba</h3>
          </div>
          <div class="total-badge">
            <span class="total-number">{{ stats.totalThisYear }}</span>
            <span class="total-label">Total Lomba</span>
          </div>
        </div>

        <!-- Categories Distribution Grid -->
        <div class="category-stat-grid">
          <div
            v-for="(count, catName) in stats.categories"
            :key="catName"
            class="cat-stat-box"
            @click="$emit('select-category', catName)"
          >
            <div class="cat-stat-info">
              <span class="cat-stat-name">{{ catName }}</span>
              <span class="cat-stat-count">{{ count }}</span>
            </div>
            <div class="cat-stat-bar-bg">
              <div
                class="cat-stat-bar-fill"
                :style="{ width: `${stats.totalThisYear ? Math.min(100, Math.round((count / stats.totalThisYear) * 100 * 2.2)) : 0}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Top Cities Strip -->
        <div v-if="stats.topCities && stats.topCities.length" class="cities-strip">
          <span class="cities-label">📍 KOTA POPULER:</span>
          <div class="cities-list">
            <span
              v-for="item in stats.topCities"
              :key="item.city"
              class="city-chip"
              @click="$emit('filter-city', item.city)"
            >
              {{ item.city }} <strong class="city-count">({{ item.count }})</strong>
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
.stats-section {
  padding-bottom: 24px;
}

.stats-card {
  padding: 28px 32px;
  background: #FFFFFF;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.stats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.stats-subtitle {
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: var(--accent-primary);
  text-transform: uppercase;
}

.stats-title {
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.total-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-surface-soft);
  border: 1px solid var(--border-medium);
  padding: 8px 20px;
  border-radius: var(--radius-full);
}

.total-number {
  font-family: var(--font-heading);
  font-size: 1.9rem;
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1;
}

.total-label {
  font-size: 0.76rem;
  font-weight: 800;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Category Grid */
.category-stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
}

.cat-stat-box {
  background: var(--bg-surface-soft);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  cursor: pointer;
  transition: var(--transition-fast);
}

.cat-stat-box:hover {
  border-color: var(--accent-black);
  background: #FFFFFF;
  box-shadow: var(--shadow-subtle);
  transform: translateY(-2px);
}

.cat-stat-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.cat-stat-name {
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.cat-stat-count {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--text-primary);
}

.cat-stat-bar-bg {
  width: 100%;
  height: 5px;
  background: #E5E7EB;
  border-radius: var(--radius-full);
  overflow: hidden;
}

.cat-stat-bar-fill {
  height: 100%;
  background: var(--accent-black);
  border-radius: var(--radius-full);
  transition: width 0.6s ease;
}

/* Cities Strip */
.cities-strip {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 18px;
  border-top: 1px solid var(--border-subtle);
}

.cities-label {
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.cities-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.city-chip {
  background: #FFFFFF;
  border: 1px solid var(--border-medium);
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: var(--radius-full);
  cursor: pointer;
  box-shadow: var(--shadow-subtle);
  transition: var(--transition-fast);
}

.city-chip:hover {
  border-color: var(--accent-black);
  color: var(--accent-black);
  background: var(--bg-surface-soft);
}

.city-count {
  color: var(--text-primary);
  font-weight: 800;
}
</style>
