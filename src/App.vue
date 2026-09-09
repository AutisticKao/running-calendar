<template>
  <div class="app-wrapper">
    <header class="site-header">
      <div class="container header-inner">
        <div class="brand-wrap">
          <div class="brand-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
          </div>
          <div class="brand-title-group">
            <div class="brand-title">Kalender<span>Lari</span></div>
            <div class="brand-tagline">Direktori lomba lari Indonesia</div>
          </div>
        </div>

        <div class="header-status" :title="healthInfo.supabaseConnected ? 'Terhubung ke database live' : 'Menampilkan data cadangan'">
          <span class="status-dot" :class="{ live: healthInfo.supabaseConnected }"></span>
          <span class="hide-mobile">{{ healthInfo.supabaseConnected ? 'Data live' : 'Data lokal' }}</span>
        </div>

        <button class="btn-wishlist" @click="isWishlistOpen = true">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span class="hide-mobile">Target race</span>
          <span class="wishlist-counter">{{ bookmarks.length }}</span>
        </button>
      </div>
    </header>

    <main>
      <CountdownHero
        :featured-event="stats?.nextBigEvent || events[0]"
        :is-live="healthInfo.supabaseConnected"
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

      <section class="events-section" id="events-section">
        <div class="container">
          <div class="results-header">
            <div class="results-heading-group">
              <h2 class="results-heading">
                Jadwal lomba {{ selectedYear }}
                <span v-if="selectedCategory !== 'all'" class="heading-accent">· {{ selectedCategory }}</span>
                <span v-if="selectedMonth" class="heading-accent">· {{ getMonthName(selectedMonth) }}</span>
              </h2>
              <span class="results-counter">{{ totalRecords.toLocaleString('id-ID') }} lomba ditemukan</span>
            </div>

            <div v-if="hasActiveFilters" class="active-filters">
              <span v-if="searchQuery" class="filter-chip">
                "{{ searchQuery }}"
                <button @click="searchQuery = ''" aria-label="Hapus pencarian">✕</button>
              </span>
              <span v-if="selectedCategory !== 'all'" class="filter-chip">
                {{ selectedCategory }}
                <button @click="selectedCategory = 'all'" aria-label="Hapus kategori">✕</button>
              </span>
              <span v-if="selectedMonth" class="filter-chip">
                {{ getMonthName(selectedMonth) }}
                <button @click="selectedMonth = ''" aria-label="Hapus bulan">✕</button>
              </span>
              <button class="btn-clear-all" @click="resetFilters">Reset filter</button>
            </div>
          </div>

          <div v-if="isLoading" class="loading-state">
            <div class="spinner"></div>
            <p>Memuat jadwal lomba…</p>
          </div>

          <div v-else-if="events.length === 0" class="empty-results">
            <div class="empty-icon-box">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3>Belum ada lomba yang cocok</h3>
            <p>Coba ganti filter, atau reset untuk melihat semua jadwal tahun {{ selectedYear }}.</p>
            <button class="btn btn-primary" @click="resetFilters" style="margin-top: 18px;">
              Tampilkan semua lomba {{ selectedYear }}
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
                  <th>Tanggal</th>
                  <th>Nama lomba</th>
                  <th>Kategori</th>
                  <th>Lokasi</th>
                  <th style="text-align: right;">Aksi</th>
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
                        Unggulan
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
                        :class="{ bookmarked: isBookmarked(evt) }"
                        :title="isBookmarked(evt) ? 'Hapus dari target' : 'Simpan ke target'"
                        @click="toggleBookmark(evt)"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" :fill="isBookmarked(evt) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                      <button class="btn-table-detail" @click="openEventDetail(evt)">
                        Detail
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="totalPages > 1" class="pagination-bar">
            <button
              class="btn-page"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              Sebelumnya
            </button>

            <span class="page-info">
              Halaman <strong>{{ currentPage }}</strong> dari <strong>{{ totalPages }}</strong>
            </span>

            <button
              class="btn-page"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              Selanjutnya
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
      <div v-if="toastMessage" class="toast-popup">
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
    showToast(`"${event.title}" dihapus dari target race.`);
  } else {
    bookmarks.value.push(event);
    showToast(`"${event.title}" ditambahkan ke target race.`);
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

.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--paper);
  border-bottom: 1px solid var(--border-color);
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 14px;
  padding-bottom: 14px;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon-box {
  width: 36px;
  height: 36px;
  background-color: var(--accent);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.brand-title-group {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand-title {
  font-family: var(--font-heading);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--ink);
}

.brand-title span {
  color: var(--accent);
}

.brand-tagline {
  font-size: 0.76rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-left: auto;
  font-size: 0.82rem;
  color: var(--text-body);
  padding: 6px 12px;
  background: var(--surface);
  border-radius: var(--radius-pill);
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ink-faint);
}

.status-dot.live {
  background: var(--trail);
  box-shadow: 0 0 0 3px var(--trail-soft);
}

.btn-wishlist {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: var(--ink);
  color: #FFFFFF;
  padding: 9px 16px;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: var(--radius-pill);
  transition: var(--transition-fast);
}

.btn-wishlist:hover {
  background-color: var(--accent);
}

.wishlist-counter {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 1px 8px;
  font-size: 0.78rem;
  font-weight: 700;
  border-radius: var(--radius-pill);
}

@media (max-width: 640px) {
  .hide-mobile {
    display: none !important;
  }
}

.events-section {
  padding: 44px 0 80px;
}

.results-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.results-heading {
  font-size: 1.5rem;
  font-weight: 600;
}

.heading-accent {
  color: var(--accent);
}

.results-counter {
  font-size: 0.9rem;
  color: var(--text-muted);
  display: block;
  margin-top: 4px;
}

.active-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip {
  background: var(--surface);
  color: var(--ink);
  font-size: 0.82rem;
  font-weight: 500;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: var(--radius-pill);
}

.filter-chip button {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.filter-chip button:hover {
  color: var(--accent);
}

.btn-clear-all {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--accent);
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  transition: var(--transition-fast);
}

.btn-clear-all:hover {
  background: var(--accent-soft);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.92rem;
  padding: 11px 22px;
  border-radius: var(--radius-pill);
  transition: var(--transition-fast);
}

.btn-primary {
  background-color: var(--accent);
  color: #FFFFFF;
}

.btn-primary:hover {
  background-color: var(--accent-dark);
}

.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-results {
  text-align: center;
  padding: 56px 24px;
  max-width: 480px;
  margin: 0 auto;
  background: var(--paper);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
}

.empty-results h3 {
  font-size: 1.2rem;
  margin-bottom: 6px;
}

.empty-results p {
  color: var(--text-muted);
  font-size: 0.92rem;
}

.empty-icon-box {
  width: 52px;
  height: 52px;
  margin: 0 auto 16px;
  background-color: var(--surface);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--paper);
}

.events-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.events-table th {
  background-color: var(--surface);
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 12px 18px;
  border-bottom: 1px solid var(--border-color);
}

.events-table td {
  padding: 15px 18px;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.92rem;
  color: var(--text-body);
}

.events-table tr:last-child td {
  border-bottom: none;
}

.events-table tr:hover td {
  background-color: var(--surface);
}

.table-date {
  font-weight: 600;
  color: var(--accent);
  white-space: nowrap;
  font-size: 0.85rem;
}

.table-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-title {
  font-weight: 600;
  cursor: pointer;
  color: var(--ink);
  transition: var(--transition-fast);
}

.table-title:hover {
  color: var(--accent);
}

.badge-featured-mini {
  background: var(--accent-soft);
  color: var(--accent-ink);
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: var(--radius-pill);
}

.table-cat-badge {
  background: var(--surface);
  color: var(--ink-soft);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
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
  background: var(--paper);
  border: 1px solid var(--border-color);
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink-faint);
  transition: var(--transition-fast);
}

.btn-table-bookmark:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.btn-table-bookmark.bookmarked {
  background: var(--accent-soft);
  color: var(--accent);
  border-color: var(--accent-soft);
}

.btn-table-detail {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--ink);
  background: var(--surface);
  padding: 7px 14px;
  border-radius: var(--radius-pill);
  transition: var(--transition-fast);
}

.btn-table-detail:hover {
  background: var(--ink);
  color: #FFFFFF;
}

.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin-top: 40px;
}

.btn-page {
  background: var(--paper);
  border: 1px solid var(--border-color);
  color: var(--ink);
  font-weight: 600;
  font-size: 0.88rem;
  padding: 9px 18px;
  border-radius: var(--radius-pill);
  transition: var(--transition-fast);
}

.btn-page:hover:not(:disabled) {
  border-color: var(--ink);
}

.btn-page:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.88rem;
  color: var(--text-muted);
}

.page-info strong {
  color: var(--ink);
}

.toast-popup {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 1000;
  background: var(--ink);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 20px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-hover);
  font-weight: 500;
  font-size: 0.9rem;
}

.toast-indicator {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
}

.toast-fade-enter-active, .toast-fade-leave-active {
  transition: all 0.25s ease;
}

.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>