<template>
  <div class="filter-section">
    <div class="container">
      <!-- Year Selector Tabs (Brook Portfolio Filter Style) -->
      <div class="year-tabs-container">
        <span class="filter-label">TAHUN:</span>
        <div class="year-scroll">
          <button
            v-for="yr in years"
            :key="yr"
            class="year-tab"
            :class="{ active: selectedYear === yr }"
            @click="$emit('update:selectedYear', yr)"
          >
            {{ yr }}
            <span v-if="yr === '2026'" class="year-badge">Baru</span>
          </button>
        </div>
      </div>

      <!-- Main Controls Row -->
      <div class="controls-row">
        <!-- Search Input -->
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Cari lomba, kota (e.g. Bandung, Bali), atau jarak lari..."
            :value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
            class="search-input"
          />
          <button
            v-if="searchQuery"
            class="search-clear"
            @click="$emit('update:searchQuery', '')"
          >
            ✕
          </button>
        </div>

        <!-- Month Dropdown -->
        <div class="dropdown-wrapper">
          <select
            :value="selectedMonth"
            @change="$emit('update:selectedMonth', $event.target.value)"
            class="select-input"
          >
            <option value="">Semua Bulan</option>
            <option v-for="(mName, idx) in months" :key="idx + 1" :value="idx + 1">
              {{ mName }}
            </option>
          </select>
        </div>

        <!-- View Mode & Sort -->
        <div class="view-controls">
          <div class="view-toggle">
            <button
              class="toggle-btn"
              :class="{ active: viewMode === 'grid' }"
              @click="$emit('update:viewMode', 'grid')"
              title="Tampilan Kartu"
            >
              Grid
            </button>
            <button
              class="toggle-btn"
              :class="{ active: viewMode === 'table' }"
              @click="$emit('update:viewMode', 'table')"
              title="Tampilan Tabel"
            >
              Tabel
            </button>
          </div>

          <button
            class="btn-sort"
            @click="$emit('toggle-sort')"
            :title="sortOrder === 'asc' ? 'Urutkan dari terlama' : 'Urutkan dari terdekat'"
          >
            <span>{{ sortOrder === 'asc' ? '📅 Terdekat' : '📅 Terjauh' }}</span>
          </button>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="category-pills-row">
        <span class="filter-label">KATEGORI:</span>
        <div class="pills-scroll">
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="cat-pill"
            :class="{ active: selectedCategory === cat.value }"
            @click="$emit('update:selectedCategory', cat.value)"
          >
            <span class="cat-icon">{{ cat.icon }}</span>
            <span>{{ cat.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedYear: {
    type: String,
    default: '2026'
  },
  selectedMonth: {
    type: [String, Number],
    default: ''
  },
  selectedCategory: {
    type: String,
    default: 'all'
  },
  searchQuery: {
    type: String,
    default: ''
  },
  viewMode: {
    type: String,
    default: 'grid'
  },
  sortOrder: {
    type: String,
    default: 'asc'
  }
});

defineEmits([
  'update:selectedYear',
  'update:selectedMonth',
  'update:selectedCategory',
  'update:searchQuery',
  'update:viewMode',
  'toggle-sort'
]);

const years = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const categories = [
  { label: 'Semua Kategori', value: 'all', icon: '🏃' },
  { label: '5K', value: '5K', icon: '⚡' },
  { label: '10K', value: '10K', icon: '🔥' },
  { label: 'Half Marathon (21K)', value: '21K', icon: '🏅' },
  { label: 'Marathon (42K)', value: '42K', icon: '🏆' },
  { label: 'Trail Run', value: 'Trail', icon: '⛰️' },
  { label: 'Ultra', value: 'Ultra', icon: '🚀' }
];
</script>

<style scoped>
.filter-section {
  padding: 32px 0 24px;
}

.filter-label {
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  white-space: nowrap;
}

/* Year Tabs - Brook Pill Filter */
.year-tabs-container {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.year-scroll {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 6px;
  scrollbar-width: thin;
}

.year-tab {
  position: relative;
  background: #FFFFFF;
  color: var(--text-secondary);
  border: 1px solid var(--border-medium);
  padding: 8px 18px;
  border-radius: var(--radius-full);
  font-size: 0.92rem;
  font-weight: 700;
  font-family: var(--font-heading);
  white-space: nowrap;
  box-shadow: var(--shadow-subtle);
  transition: var(--transition-fast);
}

.year-tab:hover {
  color: var(--text-primary);
  border-color: var(--accent-black);
  background: var(--bg-surface-soft);
}

.year-tab.active {
  background: var(--accent-black);
  color: #FFFFFF;
  border-color: var(--accent-black);
  box-shadow: 0 4px 12px rgba(17, 24, 39, 0.2);
}

.year-badge {
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: var(--radius-full);
  background: var(--accent-rose);
  color: #FFFFFF;
  margin-left: 4px;
  font-weight: 800;
}

/* Controls Row */
.controls-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px 20px;
  margin-bottom: 20px;
  background: #FFFFFF;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}

.search-box {
  flex: 1;
  min-width: 280px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  font-size: 0.95rem;
  pointer-events: none;
  opacity: 0.6;
}

.search-input {
  width: 100%;
  background: var(--bg-surface-soft);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-full);
  padding: 11px 40px 11px 42px;
  color: var(--text-primary);
  font-size: 0.92rem;
  font-family: inherit;
  font-weight: 500;
  transition: var(--transition-fast);
}

.search-input:focus {
  outline: none;
  background: #FFFFFF;
  border-color: var(--accent-black);
  box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.08);
}

.search-clear {
  position: absolute;
  right: 14px;
  color: var(--text-muted);
  font-size: 0.85rem;
  padding: 4px;
}

.search-clear:hover {
  color: var(--text-primary);
}

/* Dropdown */
.dropdown-wrapper {
  position: relative;
}

.select-input {
  background: var(--bg-surface-soft);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-full);
  padding: 11px 20px;
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: var(--transition-fast);
}

.select-input:focus {
  outline: none;
  background: #FFFFFF;
  border-color: var(--accent-black);
}

/* View & Sort */
.view-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-toggle {
  display: flex;
  background: var(--bg-surface-soft);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-full);
  padding: 3px;
}

.toggle-btn {
  padding: 6px 16px;
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-secondary);
  transition: var(--transition-fast);
}

.toggle-btn.active {
  background: #FFFFFF;
  color: var(--text-primary);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.btn-sort {
  background: var(--bg-surface-soft);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-full);
  padding: 10px 18px;
  color: var(--text-secondary);
  font-size: 0.84rem;
  font-weight: 700;
  transition: var(--transition-fast);
}

.btn-sort:hover {
  border-color: var(--accent-black);
  color: var(--accent-black);
  background: #FFFFFF;
}

/* Category Pills */
.category-pills-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.pills-scroll {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 6px;
  scrollbar-width: thin;
}

.cat-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #FFFFFF;
  color: var(--text-secondary);
  border: 1px solid var(--border-medium);
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: 0.84rem;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: var(--shadow-subtle);
  transition: var(--transition-fast);
}

.cat-pill:hover {
  background: var(--bg-surface-soft);
  border-color: var(--accent-black);
  color: var(--text-primary);
}

.cat-pill.active {
  background: var(--accent-black);
  color: #FFFFFF;
  border-color: var(--accent-black);
  box-shadow: 0 4px 12px rgba(17, 24, 39, 0.18);
}

@media (max-width: 768px) {
  .controls-row {
    flex-direction: column;
    align-items: stretch;
  }
  .view-controls {
    justify-content: space-between;
  }
}
</style>
