<template>
  <div id="events-catalog" class="wm-filter-bar">
    <div class="container">
      <div class="filter-bar-container">
        <!-- Top Row: Year Pills -->
        <div class="year-pills-row">
          <div class="year-pills-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Tahun Race:</span>
          </div>

          <div class="year-pills-scroll">
            <button
              v-for="y in availableYears"
              :key="y"
              class="year-pill"
              :class="{ active: selectedYear === y }"
              @click="$emit('update:selectedYear', y)"
            >
              {{ y }}
            </button>
          </div>
        </div>

        <!-- Bottom Row: Sub-Filters & View Mode Switcher -->
        <div class="filter-controls-row">
          <!-- Month Dropdown -->
          <div class="filter-item-dropdown">
            <select
              :value="selectedMonth"
              @change="$emit('update:selectedMonth', $event.target.value)"
            >
              <option value="">Semua Bulan (Jan - Des)</option>
              <option v-for="(mName, idx) in monthsNames" :key="idx" :value="String(idx + 1)">
                Bulan {{ mName }}
              </option>
            </select>
          </div>

          <!-- Sort Order Dropdown -->
          <div class="filter-sort-dropdown">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M6 12h12m-9 6h6"/>
            </svg>
            <select
              :value="sortOrder"
              @change="$emit('update:sortOrder', $event.target.value)"
            >
              <option value="upcoming">⚡ Terdekat dari Hari Ini (Mendatang)</option>
              <option value="desc">🗓️ Tanggal Terjauh (Desember ➔ Januari)</option>
              <option value="asc">📅 Awal Tahun (Januari ➔ Desember)</option>
            </select>
          </div>

          <!-- Right: View Mode Toggle (Grid vs Timeline/List ala Ahotu) -->
          <div class="view-mode-toggle">
            <button
              class="view-mode-btn"
              :class="{ active: viewMode === 'grid' }"
              title="Tampilan Kartu Grid (World's Marathons)"
              @click="$emit('update:viewMode', 'grid')"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Grid</span>
            </button>

            <button
              class="view-mode-btn"
              :class="{ active: viewMode === 'timeline' }"
              title="Tampilan Kalender Timeline (Ahotu)"
              @click="$emit('update:viewMode', 'timeline')"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              <span>Timeline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  selectedYear: {
    type: String,
    default: '2026'
  },
  selectedMonth: {
    type: String,
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
    default: 'upcoming'
  }
});

defineEmits([
  'update:selectedYear',
  'update:selectedMonth',
  'update:selectedCategory',
  'update:selectedQuery',
  'update:viewMode',
  'update:sortOrder',
  'toggle-sort'
]);

const availableYears = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];

const monthsNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];
</script>

<style scoped>
.wm-filter-bar {
  margin-bottom: 28px;
}

.filter-bar-container {
  background: #FFFFFF;
  border: 1px solid var(--wm-border);
  border-radius: var(--radius-xl);
  padding: 18px 24px;
  box-shadow: var(--shadow-card);
}

/* Year Pills */
.year-pills-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--wm-border-subtle);
}

.year-pills-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--wm-dark-muted);
  white-space: nowrap;
}

.year-pills-label svg {
  color: var(--wm-brand);
}

.year-pills-scroll {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.year-pill {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  background: #F8FAFC;
  border: 1px solid var(--wm-border);
  color: var(--wm-dark);
  transition: var(--transition-fast);
  white-space: nowrap;
}

.year-pill:hover {
  background: #FFFFFF;
  border-color: var(--wm-brand);
  color: var(--wm-brand);
}

.year-pill.active {
  background: var(--wm-dark);
  color: #FFFFFF;
  border-color: var(--wm-dark);
  box-shadow: var(--shadow-sm);
}

/* Controls Row */
.filter-controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 14px;
}

.filter-item-dropdown select {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--wm-dark);
  padding: 8px 14px;
  background: #F8FAFC;
  border: 1px solid var(--wm-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-fast);
}

.filter-item-dropdown select:hover {
  border-color: var(--wm-brand);
}

.filter-sort-dropdown {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #F8FAFC;
  border: 1px solid var(--wm-border);
  border-radius: var(--radius-md);
  padding: 0 12px;
  transition: var(--transition-fast);
}

.filter-sort-dropdown:hover {
  border-color: var(--wm-brand);
}

.filter-sort-dropdown svg {
  color: var(--wm-brand);
  flex-shrink: 0;
}

.filter-sort-dropdown select {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--wm-dark);
  padding: 8px 4px;
  background: transparent;
  border: none;
  cursor: pointer;
}

/* View Mode Switcher */
.view-mode-toggle {
  display: flex;
  align-items: center;
  background: #F1F5F9;
  padding: 4px;
  border-radius: var(--radius-md);
  gap: 4px;
}

.view-mode-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--wm-text-muted);
  transition: var(--transition-fast);
}

.view-mode-btn:hover {
  color: var(--wm-dark);
}

.view-mode-btn.active {
  background: #FFFFFF;
  color: var(--wm-dark);
  box-shadow: var(--shadow-sm);
}
</style>
