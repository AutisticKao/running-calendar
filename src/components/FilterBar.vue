<template>
  <div class="oxy-filter-section" id="events-section">
    <div class="container">
      <div class="oxy-section-title">
        <span class="oxy-subtitle">KATALOG LOMBA</span>
        <h2 class="oxy-heading">Jadwal Event Lari Indonesia</h2>
      </div>

      <div class="year-tabs-bar">
        <span class="filter-headline">PILIH TAHUN:</span>
        <div class="tabs-scroll-wrap">
          <button
            v-for="yr in years"
            :key="yr"
            class="tab-year-btn"
            :class="{ active: selectedYear === yr }"
            @click="$emit('update:selectedYear', yr)"
          >
            {{ yr }}
            <span v-if="yr === '2026'" class="tab-badge">TERKINI</span>
          </button>
        </div>
      </div>

      <div class="filter-controls-card">
        <div class="search-form-wrap">
          <input
            type="text"
            placeholder="Cari event, kota (e.g. Bandung, Bali), atau jarak..."
            :value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
            class="oxy-search-input"
          />
          <button class="oxy-search-btn">
            CARI
          </button>
          <button
            v-if="searchQuery"
            class="search-clear-btn"
            @click="$emit('update:searchQuery', '')"
          >
            ✕
          </button>
        </div>

        <div class="month-select-wrap">
          <select
            :value="selectedMonth"
            @change="$emit('update:selectedMonth', $event.target.value)"
            class="oxy-select-input"
          >
            <option value="">Semua Bulan (1 - 12)</option>
            <option v-for="(mName, idx) in months" :key="idx + 1" :value="idx + 1">
              Bulan {{ mName }}
            </option>
          </select>
        </div>

        <div class="action-controls-wrap">
          <div class="view-mode-group">
            <button
              class="view-btn"
              :class="{ active: viewMode === 'grid' }"
              @click="$emit('update:viewMode', 'grid')"
            >
              GRID
            </button>
            <button
              class="view-btn"
              :class="{ active: viewMode === 'table' }"
              @click="$emit('update:viewMode', 'table')"
            >
              TABEL
            </button>
          </div>

          <button
            class="btn-sort-oxy"
            @click="$emit('toggle-sort')"
            :title="sortOrder === 'asc' ? 'Urutkan dari terlama' : 'Urutkan dari terdekat'"
          >
            <span>{{ sortOrder === 'asc' ? 'URUTKAN: TERDEKAT' : 'URUTKAN: TERLAMA' }}</span>
          </button>
        </div>
      </div>

      <div class="category-tabs-bar">
        <span class="filter-headline">KATEGORI JARAK:</span>
        <div class="category-scroll-wrap">
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="category-tab-btn"
            :class="{ active: selectedCategory === cat.value }"
            @click="$emit('update:selectedCategory', cat.value)"
          >
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
  { label: 'SEMUA KATEGORI', value: 'all' },
  { label: '5K', value: '5K' },
  { label: '10K', value: '10K' },
  { label: 'HALF MARATHON (21K)', value: '21K' },
  { label: 'MARATHON (42K)', value: '42K' },
  { label: 'TRAIL RUN', value: 'Trail' },
  { label: 'ULTRA MARATHON', value: 'Ultra' }
];
</script>

<style scoped>
.oxy-filter-section {
  padding: 48px 0 28px;
}

.filter-headline {
  font-family: var(--font-heading);
  font-size: 0.88rem;
  font-weight: 800;
  color: var(--oxy-navy);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

.year-tabs-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.tabs-scroll-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.tab-year-btn {
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 700;
  padding: 8px 18px;
  background-color: #FFFFFF;
  color: var(--text-body);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sharp);
  transition: var(--transition-fast);
  white-space: nowrap;
}

.tab-year-btn:hover {
  background-color: var(--oxy-navy);
  color: #FFFFFF;
  border-color: var(--oxy-navy);
}

.tab-year-btn.active {
  background-color: var(--oxy-orange);
  color: #FFFFFF;
  border-color: var(--oxy-orange);
  box-shadow: 0 4px 10px rgba(255, 94, 19, 0.3);
}

.tab-badge {
  font-size: 0.68rem;
  padding: 1px 5px;
  background-color: var(--oxy-navy);
  color: #FFFFFF;
  margin-left: 6px;
  vertical-align: middle;
}

.filter-controls-card {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  background-color: #FFFFFF;
  border: 1px solid var(--border-color);
  border-top: 3px solid var(--oxy-navy);
  padding: 16px 20px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-subtle);
}

.search-form-wrap {
  flex: 1;
  min-width: 280px;
  display: flex;
  position: relative;
}

.oxy-search-input {
  width: 100%;
  padding: 11px 16px;
  border: 1px solid var(--border-color);
  border-right: none;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-primary);
  background-color: var(--bg-main);
  border-radius: var(--radius-sharp);
}

.oxy-search-input:focus {
  outline: none;
  background-color: #FFFFFF;
  border-color: var(--oxy-navy);
}

.oxy-search-btn {
  background-color: var(--oxy-orange);
  color: #FFFFFF;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  padding: 0 20px;
  border-radius: var(--radius-sharp);
  transition: var(--transition-fast);
}

.oxy-search-btn:hover {
  background-color: var(--oxy-navy);
}

.search-clear-btn {
  position: absolute;
  right: 80px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 0.85rem;
}

.month-select-wrap {
  position: relative;
}

.oxy-select-input {
  padding: 11px 18px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-main);
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--oxy-navy);
  border-radius: var(--radius-sharp);
  cursor: pointer;
}

.oxy-select-input:focus {
  outline: none;
  background-color: #FFFFFF;
  border-color: var(--oxy-navy);
}

.action-controls-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.view-mode-group {
  display: flex;
  border: 1px solid var(--border-color);
}

.view-btn {
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 8px 14px;
  background-color: var(--bg-main);
  color: var(--text-muted);
  transition: var(--transition-fast);
}

.view-btn.active {
  background-color: var(--oxy-navy);
  color: #FFFFFF;
}

.btn-sort-oxy {
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 10px 18px;
  background-color: #FFFFFF;
  border: 1px solid var(--border-color);
  color: var(--oxy-navy);
  transition: var(--transition-fast);
}

.btn-sort-oxy:hover {
  background-color: var(--oxy-navy);
  color: #FFFFFF;
  border-color: var(--oxy-navy);
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
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 6px 14px;
  background-color: #FFFFFF;
  color: var(--text-body);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sharp);
  white-space: nowrap;
  transition: var(--transition-fast);
}

.category-tab-btn:hover {
  background-color: var(--oxy-navy);
  color: #FFFFFF;
  border-color: var(--oxy-navy);
}

.category-tab-btn.active {
  background-color: var(--oxy-navy);
  color: #FFFFFF;
  border-color: var(--oxy-navy);
  border-bottom: 3px solid var(--oxy-orange);
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
