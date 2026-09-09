<template>
  <div class="filter-section">
    <div class="container">
      <div class="year-tabs-bar">
        <span class="filter-headline">Tahun</span>
        <div class="tabs-scroll-wrap">
          <button
            v-for="yr in years"
            :key="yr"
            class="tab-year-btn"
            :class="{ active: selectedYear === yr }"
            @click="$emit('update:selectedYear', yr)"
          >
            {{ yr }}
          </button>
        </div>
      </div>

      <div class="filter-controls-card">
        <div class="search-form-wrap">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Cari nama lomba, kota, atau jarak"
            :value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
            class="search-input"
          />
          <button
            v-if="searchQuery"
            class="search-clear-btn"
            @click="$emit('update:searchQuery', '')"
            aria-label="Hapus pencarian"
          >
            ✕
          </button>
        </div>

        <div class="month-select-wrap">
          <select
            :value="selectedMonth"
            @change="$emit('update:selectedMonth', $event.target.value)"
            class="select-input"
          >
            <option value="">Semua bulan</option>
            <option v-for="(mName, idx) in months" :key="idx + 1" :value="idx + 1">
              {{ mName }}
            </option>
          </select>
        </div>

        <div class="action-controls-wrap">
          <div class="view-mode-group">
            <button
              class="view-btn"
              :class="{ active: viewMode === 'grid' }"
              @click="$emit('update:viewMode', 'grid')"
              aria-label="Tampilan grid"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              class="view-btn"
              :class="{ active: viewMode === 'table' }"
              @click="$emit('update:viewMode', 'table')"
              aria-label="Tampilan tabel"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>

          <button
            class="btn-sort"
            @click="$emit('toggle-sort')"
            :title="sortOrder === 'asc' ? 'Urutkan dari terlama' : 'Urutkan dari terdekat'"
          >
            {{ sortOrder === 'asc' ? 'Terdekat dulu' : 'Terlama dulu' }}
          </button>
        </div>
      </div>

      <div class="category-tabs-bar">
        <span class="filter-headline">Jarak</span>
        <div class="category-scroll-wrap">
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="category-tab-btn"
            :class="{ active: selectedCategory === cat.value }"
            @click="$emit('update:selectedCategory', cat.value)"
          >
            {{ cat.label }}
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
  { label: 'Semua kategori', value: 'all' },
  { label: '5K', value: '5K' },
  { label: '10K', value: '10K' },
  { label: 'Half marathon (21K)', value: '21K' },
  { label: 'Marathon (42K)', value: '42K' },
  { label: 'Trail run', value: 'Trail' },
  { label: 'Ultra marathon', value: 'Ultra' }
];
</script>

<style scoped>
.filter-section {
  padding: 8px 0 32px;
}

.filter-headline {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
  min-width: 44px;
}

.year-tabs-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.tabs-scroll-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.tab-year-btn {
  font-size: 0.92rem;
  font-weight: 500;
  padding: 7px 14px;
  background-color: transparent;
  color: var(--text-body);
  border-radius: var(--radius-pill);
  transition: var(--transition-fast);
  white-space: nowrap;
}

.tab-year-btn:hover {
  background-color: var(--surface);
}

.tab-year-btn.active {
  background-color: var(--ink);
  color: #FFFFFF;
  font-weight: 600;
}

.filter-controls-card {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
}

.search-form-wrap {
  flex: 1;
  min-width: 260px;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  background: var(--paper);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-pill);
  padding: 0 14px;
}

.search-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  width: 100%;
  padding: 10px 0;
  font-size: 0.92rem;
  color: var(--ink);
  background: transparent;
}

.search-input:focus {
  outline: none;
}

.search-clear-btn {
  color: var(--text-muted);
  font-size: 0.85rem;
  flex-shrink: 0;
}

.search-clear-btn:hover {
  color: var(--accent);
}

.month-select-wrap {
  position: relative;
}

.select-input {
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  background-color: var(--paper);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--ink);
  border-radius: var(--radius-pill);
  cursor: pointer;
}

.select-input:focus {
  outline: none;
  border-color: var(--ink);
}

.action-controls-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.view-mode-group {
  display: flex;
  gap: 2px;
  background: var(--surface);
  border-radius: var(--radius-pill);
  padding: 3px;
}

.view-btn {
  padding: 7px 10px;
  color: var(--text-muted);
  border-radius: var(--radius-pill);
  transition: var(--transition-fast);
  display: flex;
}

.view-btn.active {
  background-color: var(--paper);
  color: var(--ink);
  box-shadow: var(--shadow-subtle);
}

.btn-sort {
  font-size: 0.85rem;
  font-weight: 500;
  padding: 9px 16px;
  background-color: var(--paper);
  border: 1px solid var(--border-color);
  color: var(--ink);
  border-radius: var(--radius-pill);
  transition: var(--transition-fast);
  white-space: nowrap;
}

.btn-sort:hover {
  border-color: var(--ink);
}

.category-tabs-bar {
  display: flex;
  align-items: center;
  gap: 16px;
}

.category-scroll-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.category-tab-btn {
  font-size: 0.87rem;
  font-weight: 500;
  padding: 7px 14px;
  background-color: var(--surface);
  color: var(--ink-soft);
  border-radius: var(--radius-pill);
  white-space: nowrap;
  transition: var(--transition-fast);
}

.category-tab-btn:hover {
  background-color: var(--accent-soft);
  color: var(--accent-ink);
}

.category-tab-btn.active {
  background-color: var(--accent);
  color: #FFFFFF;
}

@media (max-width: 768px) {
  .filter-controls-card {
    flex-direction: column;
    align-items: stretch;
  }
  .action-controls-wrap {
    justify-content: space-between;
  }
}
</style>