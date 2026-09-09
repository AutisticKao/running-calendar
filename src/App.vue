<template>
  <div class="app-wrapper">
    <header class="oxy-header">
      <div class="header-topbar">
        <div class="container topbar-inner">
          <div class="topbar-left">
            <div class="topbar-item">
              <span>KALENDER RESMI EVENT LARI INDONESIA 2018 - 2026</span>
            </div>
            <div class="topbar-item hide-mobile">
              <span class="topbar-badge">LIVE DATABASE SYNC</span>
            </div>
          </div>
          <div class="topbar-right">
            <div class="topbar-item" :title="healthInfo.supabaseConnected ? 'Terhubung ke PostgreSQL Supabase' : 'Data Seed Aktif'">
              <span class="hide-mobile">DATABASE:</span>
              <span class="topbar-badge">
                {{ healthInfo.supabaseConnected ? 'SUPABASE ONLINE' : 'LOCAL SEED' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="header-mainnav">
        <div class="container mainnav-inner">
          <div class="brand-wrap">
            <div class="brand-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
            </div>
            <div class="brand-title-group">
              <div class="brand-title">KALENDER<span>LARI</span></div>
              <div class="brand-tagline">INDONESIA RUNNING DIRECTORY</div>
            </div>
          </div>

          <div class="mainnav-actions">
            <button class="btn-wishlist-oxy" @click="isWishlistOpen = true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>TARGET RACE</span>
              <span class="wishlist-counter-box">{{ bookmarks.length }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main>
      <CountdownHero
        :featured-event="stats?.nextBigEvent || events[0]"
        @select-featured="openEventDetail"
      />

      <StatsBar
        :stats="stats"
        @select-category="handleCategorySelect"
        @filter-city="handleCityFilter"
      />

      <FilterBar
        v-model:selected-year="selectedYear"
        v-model:selected-month="selectedMonth"
        v-model:selected-category="selectedCategory"
        v-model:search-query="searchQuery"
        v-model:view-mode="viewMode"
        :sort-order="sortOrder"
        @toggle-sort="toggleSort"
      />

      <section class="events-section">
        <div class="container">
          <div class="results-header">
            <div class="oxy-section-title">
              <span class="oxy-subtitle">KATALOG PERLOMBAAN RESMI</span>
              <h2 class="oxy-heading">
                JADWAL EVENT LARI {{ selectedYear }}
                <span v-if="selectedCategory !== 'all'" class="heading-accent"> / {{ selectedCategory }}</span>
                <span v-if="selectedMonth" class="heading-accent"> / BULAN {{ getMonthName(selectedMonth).toUpperCase() }}</span>
              </h2>
              <span class="results-counter">Menampilkan {{ totalRecords.toLocaleString('id-ID') }} agenda perlombaan terverifikasi</span>
            </div>

            <div v-if="hasActiveFilters" class="active-filters">
              <span v-if="searchQuery" class="filter-chip-oxy">
                CARI: "{{ searchQuery }}"
                <button @click="searchQuery = ''">✕</button>
              </span>
              <span v-if="selectedCategory !== 'all'" class="filter-chip-oxy">
                {{ selectedCategory }}
                <button @click="selectedCategory = 'all'">✕</button>
              </span>
              <span v-if="selectedMonth" class="filter-chip-oxy">
                {{ getMonthName(selectedMonth) }}
                <button @click="selectedMonth = ''">✕</button>
              </span>
              <button class="btn-clear-all-oxy" @click="resetFilters">RESET FILTER</button>
            </div>
          </div>

          <div v-if="isLoading" class="loading-state-oxy">
            <div class="spinner-oxy"></div>
            <p>MEMUAT JADWAL EVENT LARI...</p>
          </div>

          <div v-else-if="events.length === 0" class="empty-results-oxy">
            <div class="empty-icon-box">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3>TIDAK ADA PERLOMBAAN YANG SESUAI</h3>
            <p>Tidak ada hasil untuk filter yang dipilih. Coba reset filter atau pilih tahun dan kategori lain.</p>
            <button class="btn-oxy btn-oxy-primary" @click="resetFilters" style="margin-top: 18px;">
              TAMPILKAN SEMUA LOMBA {{ selectedYear }}
            </button>
          </div>

          <div v-else-if="viewMode === 'grid'" class="events-grid">
            <EventCard
              v-for="evt in events"
              :key="evt.detail_url || evt.id"
              :event="evt"
              :is-bookmarked="isBookmarked(evt)"
              @select-event="openEventDetail"
              @toggle-bookmark="toggleBookmark"
            />
          </div>

          <div v-else-if="viewMode === 'table'" class="table-responsive">
            <table class="events-table">
              <thead>
                <tr>
                  <th>TANGGAL</th>
                  <th>NAMA PERLOMBAAN</th>
                  <th>KATEGORI</th>
                  <th>LOKASI / VENUE</th>
                  <th style="text-align: right;">AKSI</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="evt in events" :key="evt.detail_url || evt.id">
                  <td>
                    <span class="table-date">{{ evt.date_text }}</span>
                  </td>
                  <td>
                    <div class="table-title-group">
                      <span class="table-title" @click="openEventDetail(evt)">
                        {{ evt.title }}
                      </span>
                      <span v-if="evt.is_featured" class="badge-featured-mini">
                        HIGHLIGHT
                      </span>
                    </div>
                  </td>
                  <td>
                    <span class="table-cat-badge">{{ evt.category || 'Umum' }}</span>
                  </td>
                  <td>
                    <span class="table-loc">{{ evt.location }}</span>
                  </td>
                  <td>
                    <div class="table-actions-cell">
                      <button
                        class="btn-table-bookmark"
                        :title="isBookmarked(evt) ? 'Hapus dari Target' : 'Simpan ke Target'"
                        @click="toggleBookmark(evt)"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" :fill="isBookmarked(evt) ? '#FF5E13' : 'none'" stroke="currentColor" stroke-width="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                      <button class="btn-table-detail" @click="openEventDetail(evt)">
                        DETAIL ↗
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="totalPages > 1" class="pagination-bar-oxy">
            <button
              class="btn-page-oxy"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              ← SEBELUMNYA
            </button>

            <span class="page-info-oxy">
              HALAMAN <strong>{{ currentPage }}</strong> DARI <strong>{{ totalPages }}</strong>
            </span>

            <button
              class="btn-page-oxy"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              SELANJUTNYA →
            </button>
          </div>
        </div>
      </section>
    </main>

    <EventDetailModal
      :event="selectedEvent"
      :is-bookmarked="selectedEvent ? isBookmarked(selectedEvent) : false"
      @close="selectedEvent = null"
      @toggle-bookmark="toggleBookmark"
    />

    <WishlistModal
      :is-open="isWishlistOpen"
      :bookmarks="bookmarks"
      @close="isWishlistOpen = false"
      @select-event="openEventDetail"
      @remove-bookmark="toggleBookmark"
    />

    <transition name="toast-fade">
      <div v-if="toastMessage" class="toast-popup-oxy">
        <div class="toast-indicator"></div>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import CountdownHero from './components/CountdownHero.vue';
import StatsBar from './components/StatsBar.vue';
import FilterBar from './components/FilterBar.vue';
import EventCard from './components/EventCard.vue';
import EventDetailModal from './components/EventDetailModal.vue';
import WishlistModal from './components/WishlistModal.vue';

const selectedYear = ref('2026');
const selectedMonth = ref('');
const selectedCategory = ref('all');
const searchQuery = ref('');
const viewMode = ref('grid');
const sortOrder = ref('asc');
const currentPage = ref(1);
const limit = ref(30);

const events = ref([]);
const totalRecords = ref(0);
const totalPages = ref(1);
const stats = ref(null);
const isLoading = ref(false);
const healthInfo = ref({ supabaseConnected: false });

const selectedEvent = ref(null);
const isWishlistOpen = ref(false);
const bookmarks = ref([]);
const toastMessage = ref('');
let toastTimeout = null;

const monthsNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

function getMonthName(m) {
  return monthsNames[parseInt(m) - 1] || '';
}

const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedCategory.value !== 'all' || selectedMonth.value;
});

function showToast(msg) {
  toastMessage.value = msg;
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastMessage.value = '';
  }, 2800);
}

async function fetchEvents() {
  isLoading.value = true;
  try {
    const params = new URLSearchParams({
      year: selectedYear.value,
      page: currentPage.value,
      limit: limit.value,
      sort: sortOrder.value
    });

    if (selectedMonth.value) params.append('month', selectedMonth.value);
    if (selectedCategory.value && selectedCategory.value !== 'all') {
      params.append('category', selectedCategory.value);
    }
    if (searchQuery.value) params.append('q', searchQuery.value);

    const res = await fetch(`/api/events?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      events.value = data.data || [];
      totalRecords.value = data.total || 0;
      totalPages.value = data.totalPages || 1;
    }
  } catch (err) {
    console.error('Error fetching events:', err);
  } finally {
    isLoading.value = false;
  }
}

async function fetchStats() {
  try {
    const res = await fetch(`/api/stats?year=${selectedYear.value}`);
    if (res.ok) {
      stats.value = await res.json();
    }
  } catch (err) {
    console.error('Error fetching stats:', err);
  }
}

async function fetchHealth() {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      healthInfo.value = await res.json();
    }
  } catch (err) {
    console.warn('API health check error:', err);
  }
}

watch([selectedYear, selectedMonth, selectedCategory, sortOrder], () => {
  currentPage.value = 1;
  fetchEvents();
});

watch(selectedYear, () => {
  fetchStats();
});

let searchDebounce = null;
watch(searchQuery, () => {
  if (searchDebounce) clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    currentPage.value = 1;
    fetchEvents();
  }, 350);
});

function toggleSort() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
}

function handleCategorySelect(catName) {
  selectedCategory.value = catName;
  window.scrollTo({ top: 650, behavior: 'smooth' });
}

function handleCityFilter(cityName) {
  searchQuery.value = cityName;
  window.scrollTo({ top: 650, behavior: 'smooth' });
}

function resetFilters() {
  selectedCategory.value = 'all';
  selectedMonth.value = '';
  searchQuery.value = '';
  currentPage.value = 1;
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchEvents();
    window.scrollTo({ top: 650, behavior: 'smooth' });
  }
}

function openEventDetail(event) {
  selectedEvent.value = event;
}

function loadBookmarks() {
  try {
    const saved = localStorage.getItem('running_wishlist_indonesia');
    if (saved) bookmarks.value = JSON.parse(saved);
  } catch (e) {
    console.warn('Cannot load bookmarks:', e);
  }
}

function saveBookmarks() {
  try {
    localStorage.setItem('running_wishlist_indonesia', JSON.stringify(bookmarks.value));
  } catch (e) {
    console.warn('Cannot save bookmarks:', e);
  }
}

function isBookmarked(event) {
  if (!event) return false;
  return bookmarks.value.some(b => b.detail_url === event.detail_url);
}

function toggleBookmark(event) {
  if (!event) return;
  const idx = bookmarks.value.findIndex(b => b.detail_url === event.detail_url);
  if (idx !== -1) {
    bookmarks.value.splice(idx, 1);
    showToast(`"${event.title}" dihapus dari Target Race.`);
  } else {
    bookmarks.value.push(event);
    showToast(`"${event.title}" ditambahkan ke Target Race!`);
  }
  saveBookmarks();
}

onMounted(() => {
  loadBookmarks();
  fetchHealth();
  fetchStats();
  fetchEvents();
});
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-main);
}

main {
  flex: 1;
}

.events-section {
  padding: 50px 0 80px;
}

@media (max-width: 640px) {
  .hide-mobile {
    display: none !important;
  }
}

.results-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 32px;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 20px;
}

.heading-accent {
  color: var(--oxy-orange);
}

.results-counter {
  font-size: 0.88rem;
  color: var(--text-body);
  font-weight: 600;
  display: block;
  margin-top: 4px;
}

.active-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip-oxy {
  background: var(--oxy-navy);
  color: #FFFFFF;
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 5px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 0px;
  border-left: 2px solid var(--oxy-orange);
}

.filter-chip-oxy button {
  color: var(--oxy-orange);
  font-size: 0.85rem;
  font-weight: bold;
}

.btn-clear-all-oxy {
  font-family: var(--font-heading);
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--oxy-orange);
  letter-spacing: 0.06em;
  padding: 5px 10px;
  border: 1px solid var(--oxy-orange);
  background: transparent;
  transition: var(--transition-fast);
}

.btn-clear-all-oxy:hover {
  background: var(--oxy-orange);
  color: #FFFFFF;
}

.loading-state-oxy {
  text-align: center;
  padding: 80px 20px;
  color: var(--oxy-navy);
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.spinner-oxy {
  width: 44px;
  height: 44px;
  border: 4px solid var(--border-color);
  border-top-color: var(--oxy-orange);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 18px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-results-oxy {
  text-align: center;
  padding: 60px 24px;
  max-width: 580px;
  margin: 0 auto;
  background: #FFFFFF;
  border: 1px solid var(--border-color);
  border-top: 4px solid var(--oxy-orange);
  border-radius: 0px;
  box-shadow: var(--shadow-card);
}

.empty-results-oxy h3 {
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--oxy-navy);
  margin-bottom: 8px;
}

.empty-results-oxy p {
  color: var(--text-body);
  font-size: 0.95rem;
}

.empty-icon-box {
  width: 60px;
  height: 60px;
  margin: 0 auto 18px;
  background-color: var(--oxy-orange-light);
  color: var(--oxy-orange);
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-date {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.92rem;
  color: var(--oxy-orange);
  white-space: nowrap;
}

.table-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  color: var(--oxy-navy);
  letter-spacing: 0.02em;
  transition: var(--transition-fast);
}

.table-title:hover {
  color: var(--oxy-orange);
}

.badge-featured-mini {
  background: var(--oxy-orange);
  color: #FFFFFF;
  font-family: var(--font-heading);
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 6px;
  letter-spacing: 0.06em;
}

.table-cat-badge {
  background: #EBF0F8;
  color: var(--oxy-navy);
  font-family: var(--font-heading);
  font-size: 0.76rem;
  font-weight: 700;
  padding: 3px 8px;
  border-left: 2px solid var(--oxy-navy);
}

.table-loc {
  font-size: 0.88rem;
  color: var(--text-body);
}

.table-actions-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.btn-table-bookmark {
  background: #FFFFFF;
  border: 1px solid var(--border-color);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--oxy-navy);
  transition: var(--transition-fast);
}

.btn-table-bookmark:hover {
  border-color: var(--oxy-orange);
  background: var(--oxy-orange-light);
}

.btn-table-detail {
  font-family: var(--font-heading);
  font-size: 0.78rem;
  font-weight: 700;
  color: #FFFFFF;
  background: var(--oxy-navy);
  padding: 7px 12px;
  letter-spacing: 0.05em;
  transition: var(--transition-fast);
}

.btn-table-detail:hover {
  background: var(--oxy-orange);
}

.pagination-bar-oxy {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 48px;
}

.btn-page-oxy {
  background: #FFFFFF;
  border: 1px solid var(--oxy-navy);
  color: var(--oxy-navy);
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.06em;
  padding: 10px 22px;
  border-radius: 0px;
  transition: var(--transition-fast);
}

.btn-page-oxy:hover:not(:disabled) {
  background: var(--oxy-navy);
  color: #FFFFFF;
}

.btn-page-oxy:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.page-info-oxy {
  font-family: var(--font-heading);
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-body);
  letter-spacing: 0.04em;
}

.page-info-oxy strong {
  color: var(--oxy-navy);
  font-weight: 800;
}

.toast-popup-oxy {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  background: var(--oxy-navy);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 22px;
  border-left: 4px solid var(--oxy-orange);
  box-shadow: 0 10px 30px rgba(0, 23, 61, 0.3);
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.04em;
}

.toast-indicator {
  width: 8px;
  height: 8px;
  background: var(--oxy-orange);
}

.toast-fade-enter-active, .toast-fade-leave-active {
  transition: all 0.25s ease;
}

.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
