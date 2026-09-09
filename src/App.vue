<template>
  <div class="app-wrapper">
    <!-- Navbar (Brook Creative Agency Minimalist Header) -->
    <header class="navbar">
      <div class="container navbar-inner">
        <div class="brand-logo">
          <div class="brand-icon">🏃</div>
          <div class="brand-text">
            <span class="brand-title">KALENDER LARI</span>
            <span class="brand-subtitle">INDONESIA</span>
          </div>
        </div>

        <div class="nav-actions">
          <!-- Database status indicator -->
          <div class="db-status-pill" :title="healthInfo.supabaseConnected ? 'Terhubung ke PostgreSQL Supabase' : 'Menggunakan Data Seed Lokal'">
            <span class="db-status-dot" :class="{ 'connected': healthInfo.supabaseConnected }"></span>
            <span class="db-status-text">
              {{ healthInfo.supabaseConnected ? 'Supabase' : 'Local Seed' }}
            </span>
          </div>

          <!-- Wishlist / Target Race Button -->
          <button class="btn-wishlist-toggle" @click="isWishlistOpen = true">
            <span>❤️ Target Race</span>
            <span class="wishlist-count">{{ bookmarks.length }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <!-- Hero Section with Next Race Countdown -->
      <CountdownHero
        :featured-event="stats?.nextBigEvent || events[0]"
        @select-featured="openEventDetail"
      />

      <!-- Year Stats & Category Breakdown -->
      <StatsBar
        :stats="stats"
        @select-category="handleCategorySelect"
        @filter-city="handleCityFilter"
      />

      <!-- Filter & Search Controls -->
      <FilterBar
        v-model:selected-year="selectedYear"
        v-model:selected-month="selectedMonth"
        v-model:selected-category="selectedCategory"
        v-model:search-query="searchQuery"
        v-model:view-mode="viewMode"
        :sort-order="sortOrder"
        @toggle-sort="toggleSort"
      />

      <!-- Events List Section -->
      <section class="events-section">
        <div class="container">
          <!-- Section Header / Result Counter -->
          <div class="results-header">
            <div class="results-title-group">
              <h2 class="results-title">
                Jadwal Event Lari {{ selectedYear }}
                <span v-if="selectedCategory !== 'all'" class="results-highlight">• {{ selectedCategory }}</span>
                <span v-if="selectedMonth" class="results-highlight">• Bulan {{ getMonthName(selectedMonth) }}</span>
              </h2>
              <span class="results-counter">Menampilkan {{ totalRecords.toLocaleString('id-ID') }} event lari</span>
            </div>

            <!-- Active filter chips -->
            <div v-if="hasActiveFilters" class="active-filters">
              <span v-if="searchQuery" class="filter-chip">
                Cari: "{{ searchQuery }}"
                <button @click="searchQuery = ''">✕</button>
              </span>
              <span v-if="selectedCategory !== 'all'" class="filter-chip">
                {{ selectedCategory }}
                <button @click="selectedCategory = 'all'">✕</button>
              </span>
              <span v-if="selectedMonth" class="filter-chip">
                {{ getMonthName(selectedMonth) }}
                <button @click="selectedMonth = ''">✕</button>
              </span>
              <button class="btn-clear-all" @click="resetFilters">Reset Filter</button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="loading-state">
            <div class="spinner"></div>
            <p>Memuat jadwal lomba lari...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="events.length === 0" class="empty-results">
            <span class="empty-icon">🔍</span>
            <h3>Tidak ada lomba yang cocok</h3>
            <p>Coba gunakan kata kunci lain atau ubah filter tahun / kategori lari Anda.</p>
            <button class="btn-primary" @click="resetFilters" style="margin-top: 18px;">
              Tampilkan Semua Lomba {{ selectedYear }}
            </button>
          </div>

          <!-- Grid Card View -->
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

          <!-- Table List View -->
          <div v-else-if="viewMode === 'table'" class="table-responsive">
            <table class="events-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Nama Lomba</th>
                  <th>Kategori Jarak</th>
                  <th>Lokasi / Kota</th>
                  <th>Aksi</th>
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
                      <span v-if="evt.is_featured" class="badge badge-featured" style="font-size: 0.65rem;">
                        Highlight
                      </span>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-volt">{{ evt.category }}</span>
                  </td>
                  <td>
                    <span class="table-loc">{{ evt.location }}</span>
                  </td>
                  <td>
                    <div class="table-actions">
                      <button
                        class="btn-icon"
                        :title="isBookmarked(evt) ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'"
                        @click="toggleBookmark(evt)"
                      >
                        {{ isBookmarked(evt) ? '❤️' : '🤍' }}
                      </button>
                      <button class="btn-detail-sm" @click="openEventDetail(evt)">
                        Detail ↗
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Controls -->
          <div v-if="totalPages > 1" class="pagination-bar">
            <button
              class="btn-page"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              ← Sebelumnya
            </button>

            <span class="page-info">
              Halaman <strong>{{ currentPage }}</strong> dari <strong>{{ totalPages }}</strong>
            </span>

            <button
              class="btn-page"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              Selanjutnya →
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- Modals -->
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

    <!-- Toast Notification -->
    <transition name="toast-fade">
      <div v-if="toastMessage" class="toast-popup">
        {{ toastMessage }}
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

// State Filter
const selectedYear = ref('2026');
const selectedMonth = ref('');
const selectedCategory = ref('all');
const searchQuery = ref('');
const viewMode = ref('grid');
const sortOrder = ref('asc');
const currentPage = ref(1);
const limit = ref(30);

// State Data
const events = ref([]);
const totalRecords = ref(0);
const totalPages = ref(1);
const stats = ref(null);
const isLoading = ref(false);
const healthInfo = ref({ supabaseConnected: false });

// Modals & UI State
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

// Toast notification helper
function showToast(msg) {
  toastMessage.value = msg;
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastMessage.value = '';
  }, 2800);
}

// Fetch Events dari API
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

// Fetch Stats untuk tahun terpilih
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

// Fetch Health Info
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

// Watchers
watch([selectedYear, selectedMonth, selectedCategory, sortOrder], () => {
  currentPage.value = 1;
  fetchEvents();
});

watch(selectedYear, () => {
  fetchStats();
});

// Debounce search query
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

// Bookmarks / Wishlist Management
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
    showToast(`🗑️ "${event.title}" dihapus dari Target Race.`);
  } else {
    bookmarks.value.push(event);
    showToast(`❤️ "${event.title}" ditambahkan ke Target Race!`);
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

/* Results Header */
.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}

.results-title {
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  font-weight: 900;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.results-highlight {
  color: var(--accent-primary);
}

.results-counter {
  font-size: 0.88rem;
  color: var(--text-muted);
  font-weight: 600;
}

.active-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-chip {
  background: var(--bg-surface-soft);
  border: 1px solid var(--border-medium);
  color: var(--text-primary);
  font-size: 0.8rem;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-chip button {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.filter-chip button:hover {
  color: var(--accent-rose);
}

.btn-clear-all {
  font-size: 0.82rem;
  color: var(--text-muted);
  text-decoration: underline;
  padding: 4px 8px;
  font-weight: 600;
}

.btn-clear-all:hover {
  color: var(--text-primary);
}

/* Loading & Empty */
.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-secondary);
}

.spinner {
  width: 44px;
  height: 44px;
  border: 3px solid #E2E8F0;
  border-top-color: var(--accent-black);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 18px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-results {
  text-align: center;
  padding: 60px 20px;
  max-width: 520px;
  margin: 0 auto;
  background: #FFFFFF;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 14px;
  display: block;
}

/* Table Style */
.table-date {
  font-weight: 800;
  color: var(--text-primary);
  white-space: nowrap;
}

.table-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.table-title {
  font-weight: 800;
  cursor: pointer;
  color: var(--text-primary);
  transition: var(--transition-fast);
}

.table-title:hover {
  color: var(--accent-primary);
}

.table-loc {
  font-size: 0.88rem;
  color: var(--text-secondary);
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-icon {
  font-size: 1rem;
  padding: 6px 8px;
  border-radius: var(--radius-full);
  background: var(--bg-surface-soft);
  border: 1px solid var(--border-subtle);
  transition: var(--transition-fast);
}

.btn-icon:hover {
  border-color: var(--accent-black);
  transform: scale(1.1);
}

.btn-detail-sm {
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--text-primary);
}

.btn-detail-sm:hover {
  color: var(--accent-primary);
}

/* Pagination */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 48px;
  padding-bottom: 48px;
}

.btn-page {
  background: #FFFFFF;
  border: 1px solid var(--border-medium);
  color: var(--text-primary);
  font-weight: 700;
  padding: 11px 24px;
  border-radius: var(--radius-full);
  font-size: 0.9rem;
  box-shadow: var(--shadow-subtle);
  transition: var(--transition-fast);
}

.btn-page:hover:not(:disabled) {
  border-color: var(--accent-black);
  background: var(--accent-black);
  color: #FFFFFF;
}

.btn-page:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* Toast */
.toast-popup {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 1000;
  background: var(--accent-black);
  color: #FFFFFF;
  box-shadow: var(--shadow-elevated);
  padding: 15px 24px;
  border-radius: var(--radius-full);
  font-weight: 800;
  font-size: 0.92rem;
}

.toast-fade-enter-active, .toast-fade-leave-active {
  transition: all 0.28s ease;
}

.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
  transform: translateY(18px);
}


</style>
