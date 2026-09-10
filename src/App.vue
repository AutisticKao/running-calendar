<template>
  <div class="app-wrapper">
    <!-- World's Marathons Navigation Header -->
    <header class="wm-navbar">
      <div class="container wm-nav-inner">
        <!-- Brand Logo & Name -->
        <div class="wm-brand">
          <div class="wm-logo-mark">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
          </div>
          <div class="wm-brand-text">
            <div class="wm-brand-title">KALENDER LARI<span>.ID</span></div>
            <div class="wm-brand-tagline">INDONESIA RUNNING DIRECTORY</div>
          </div>
        </div>

        <!-- Navigation Actions -->
        <div class="wm-nav-actions">
          <!-- Target Race (Wishlist) Button -->
          <button class="btn-wm-wishlist" @click="isWishlistOpen = true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span class="hide-mobile">Target Race</span>
            <span class="wm-badge-counter">{{ bookmarks.length }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <!-- World's Marathons Hero Section (Discovery & Search Console) -->
      <CountdownHero
        :featured-event="stats?.nextBigEvent || events[0]"
        v-model:search-query="searchQuery"
        v-model:selected-category="selectedCategory"
        v-model:selected-month="selectedMonth"
        v-model:selected-year="selectedYear"
        @select-featured="openEventDetail"
      />

      <!-- Athletic Endurance Metrics -->
      <StatsBar
        :stats="stats"
        @select-category="handleCategorySelect"
        @filter-city="handleCityFilter"
      />

      <!-- Filter Controls & View Switcher -->
      <FilterBar
        v-model:selected-year="selectedYear"
        v-model:selected-month="selectedMonth"
        v-model:selected-category="selectedCategory"
        v-model:search-query="searchQuery"
        v-model:view-mode="viewMode"
        v-model:sort-order="sortOrder"
      />

      <!-- Events Catalog Section -->
      <section class="events-catalog-section">
        <div class="container">
          <!-- Results Header & Active Filter Chips -->
          <div class="results-header-bar">
            <div class="results-info-group">
              <h2 class="results-heading">
                Jadwal Event Lari {{ selectedYear }}
                <span v-if="selectedCategory !== 'all'" class="heading-accent"> • {{ selectedCategory }}</span>
                <span v-if="selectedMonth" class="heading-accent"> • Bulan {{ getMonthName(selectedMonth) }}</span>
              </h2>
              <span class="results-subcount">
                Menemukan <strong>{{ totalRecords.toLocaleString('id-ID') }}</strong> jadwal lomba terdaftar
              </span>
            </div>

            <!-- Active Filters Reset Strip -->
            <div v-if="hasActiveFilters" class="active-chips-strip">
              <span v-if="searchQuery" class="active-chip">
                Cari: "{{ searchQuery }}"
                <button @click="searchQuery = ''">✕</button>
              </span>
              <span v-if="selectedCategory !== 'all'" class="active-chip">
                {{ selectedCategory }}
                <button @click="selectedCategory = 'all'">✕</button>
              </span>
              <span v-if="selectedMonth" class="active-chip">
                Bulan {{ getMonthName(selectedMonth) }}
                <button @click="selectedMonth = ''">✕</button>
              </span>
              <button class="btn-clear-chips" @click="resetFilters">Reset Filter</button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="loading-state-wm">
            <div class="wm-spinner"></div>
            <p>Memuat jadwal lomba lari...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="events.length === 0" class="empty-state-card">
            <div class="empty-search-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3>Tidak Ada Lomba Yang Cocok</h3>
            <p>Coba gunakan kata kunci kota lain atau reset filter untuk melihat semua lomba di tahun {{ selectedYear }}.</p>
            <button class="btn-wm btn-wm-primary" @click="resetFilters" style="margin-top: 16px;">
              Tampilkan Semua Lomba {{ selectedYear }}
            </button>
          </div>

          <!-- VIEW 1: Grid Cards (World's Marathons Style) -->
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

          <!-- VIEW 2: Timeline / Calendar List (Ahotu Style) -->
          <div v-else-if="viewMode === 'timeline'" class="events-timeline-list">
            <div
              v-for="evt in events"
              :key="evt.detail_url || evt.id"
              class="timeline-item"
            >
              <!-- Left: Ahotu Date Block -->
              <div class="date-block-ahotu">
                <span class="date-day">{{ getDayNumber(evt.date_text, evt.start_date) }}</span>
                <span class="date-month">{{ getMonthAbbr(evt.date_text, evt.start_date) }}</span>
                <span class="date-year">{{ evt.year }}</span>
              </div>

              <!-- Center: Race Details -->
              <div class="timeline-center" @click="openEventDetail(evt)">
                <div class="timeline-meta-top">
                  <span v-if="evt.is_featured" class="badge-featured" style="font-size: 0.7rem; padding: 2px 8px;">
                    ★ Highlight
                  </span>
                  <div class="timeline-badges-flow">
                    <span
                      v-for="cat in parseCategories(evt.category)"
                      :key="cat"
                      class="dist-badge"
                      :class="getCategoryClass(cat)"
                    >
                      {{ cat }}
                    </span>
                  </div>
                </div>

                <h3 class="timeline-title">{{ evt.title }}</h3>

                <div class="timeline-loc-row">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{{ evt.location }}</span>
                  <span v-if="evt.city && evt.city !== 'Lainnya'" class="city-tag">{{ evt.city }}</span>
                </div>
              </div>

              <!-- Right: Actions -->
              <div class="timeline-actions">
                <button
                  class="btn-bookmark-heart"
                  :class="{ active: isBookmarked(evt) }"
                  :title="isBookmarked(evt) ? 'Hapus dari Target' : 'Simpan Target Race'"
                  @click="toggleBookmark(evt)"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" :fill="isBookmarked(evt) ? '#E11D48' : 'none'" :stroke="isBookmarked(evt) ? '#E11D48' : 'currentColor'" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>

                <button class="btn-wm btn-wm-secondary" style="padding: 8px 16px; font-size: 0.85rem;" @click="openEventDetail(evt)">
                  <span>Detail</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination Bar -->
          <div v-if="totalPages > 1" class="wm-pagination">
            <button
              class="btn-wm-page"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              ← Sebelumnya
            </button>

            <span class="page-numbers">
              Halaman <strong>{{ currentPage }}</strong> dari <strong>{{ totalPages }}</strong>
            </span>

            <button
              class="btn-wm-page"
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
      <div v-if="toastMessage" class="wm-toast">
        <div class="toast-dot"></div>
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

// State Filter
const selectedYear = ref('2026');
const selectedMonth = ref('');
const selectedCategory = ref('all');
const searchQuery = ref('');
const viewMode = ref('grid');
const sortOrder = ref('upcoming');
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
  return monthsNames[parseInt(m, 10) - 1] || '';
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

watch(selectedYear, (newYear) => {
  if (newYear === '2026') {
    sortOrder.value = 'upcoming';
  } else {
    sortOrder.value = 'asc';
  }
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
  const el = document.getElementById('events-catalog');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function handleCityFilter(cityName) {
  searchQuery.value = cityName;
  const el = document.getElementById('events-catalog');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
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
    const el = document.getElementById('events-catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}

function openEventDetail(event) {
  selectedEvent.value = event;
}

// Bookmarks / Target Race Management
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

// Timeline View Helpers
function getDayNumber(dateText, startDate) {
  if (startDate) {
    const parts = startDate.split('-');
    if (parts.length === 3) return parts[2];
  }
  if (dateText) {
    const match = dateText.match(/^\d+/);
    if (match) return match[0];
  }
  return '•';
}

function getMonthAbbr(dateText, startDate) {
  const monthsAbbr = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
  if (startDate) {
    const parts = startDate.split('-');
    if (parts.length === 3) {
      const mIdx = parseInt(parts[1], 10) - 1;
      return monthsAbbr[mIdx] || '';
    }
  }
  if (dateText) {
    for (let i = 0; i < monthsNames.length; i++) {
      if (dateText.toLowerCase().includes(monthsNames[i].toLowerCase())) {
        return monthsAbbr[i];
      }
    }
  }
  return 'RACE';
}

function parseCategories(catStr) {
  if (!catStr) return ['Umum'];
  return catStr.split(',').map(s => s.trim()).filter(Boolean);
}

function getCategoryClass(catName) {
  if (!catName) return 'default';
  const c = catName.toLowerCase();
  if (c.includes('42') || c.includes('full') || c.includes('marathon')) return 'marathon';
  if (c.includes('21') || c.includes('half')) return 'half';
  if (c.includes('10k') || c.includes('10 k')) return 'tenk';
  if (c.includes('5k') || c.includes('5 k')) return 'fivek';
  if (c.includes('trail')) return 'trail';
  if (c.includes('ultra')) return 'ultra';
  return 'default';
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
  background-color: var(--wm-bg);
}

main {
  flex: 1;
}

@media (max-width: 640px) {
  .hide-mobile {
    display: none !important;
  }
}

.events-catalog-section {
  padding-bottom: 80px;
}

/* Results Header */
.results-header-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.results-heading {
  font-size: clamp(1.4rem, 2.5vw, 1.85rem);
  font-weight: 800;
  color: var(--wm-dark);
}

.heading-accent {
  color: var(--wm-brand);
}

.results-subcount {
  font-size: 0.9rem;
  color: var(--wm-text-body);
  display: block;
  margin-top: 4px;
}

.results-subcount strong {
  color: var(--wm-dark);
}

/* Active Chips */
.active-chips-strip {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.active-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #FFFFFF;
  border: 1px solid var(--wm-border);
  padding: 5px 12px;
  border-radius: var(--radius-full);
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--wm-dark);
  box-shadow: var(--shadow-sm);
}

.active-chip button {
  color: var(--wm-text-muted);
  font-size: 0.85rem;
}

.active-chip button:hover {
  color: var(--wm-brand);
}

.btn-clear-chips {
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--wm-brand);
  text-decoration: underline;
  padding: 4px 8px;
}

/* Loading & Empty */
.loading-state-wm {
  text-align: center;
  padding: 80px 20px;
  color: var(--wm-dark-muted);
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
}

.wm-spinner {
  width: 42px;
  height: 42px;
  border: 3px solid var(--wm-border);
  border-top-color: var(--wm-brand);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state-card {
  text-align: center;
  padding: 60px 24px;
  max-width: 540px;
  margin: 0 auto;
  background: #FFFFFF;
  border: 1px solid var(--wm-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
}

.empty-search-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: #F1F5F9;
  color: var(--wm-text-muted);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state-card h3 {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--wm-dark);
  margin-bottom: 8px;
}

.empty-state-card p {
  color: var(--wm-text-body);
  font-size: 0.95rem;
}

/* Timeline Center Details */
.timeline-center {
  cursor: pointer;
}

.timeline-meta-top {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.timeline-badges-flow {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.timeline-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--wm-dark);
  line-height: 1.3;
  margin-bottom: 6px;
  transition: var(--transition-fast);
}

.timeline-item:hover .timeline-title {
  color: var(--wm-brand);
}

.timeline-loc-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.86rem;
  color: var(--wm-text-body);
}

.timeline-loc-row svg {
  color: var(--wm-text-muted);
}

.city-tag {
  background: #F1F5F9;
  color: var(--wm-dark-muted);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: var(--radius-sm);
}

.timeline-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Pagination */
.wm-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 44px;
}

.btn-wm-page {
  background: #FFFFFF;
  border: 1px solid var(--wm-border);
  color: var(--wm-dark);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.88rem;
  padding: 10px 20px;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-fast);
}

.btn-wm-page:hover:not(:disabled) {
  border-color: var(--wm-dark);
  transform: translateY(-1px);
}

.btn-wm-page:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.page-numbers {
  font-family: var(--font-display);
  font-size: 0.9rem;
  color: var(--wm-text-body);
}

.page-numbers strong {
  color: var(--wm-dark);
}

/* Toast */
.wm-toast {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 1000;
  background: #0F172A;
  color: #FFFFFF;
  border-radius: var(--radius-full);
  padding: 12px 22px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-size: 0.88rem;
  font-weight: 700;
  box-shadow: var(--shadow-dropdown);
}

.toast-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--wm-brand);
}

.toast-fade-enter-active, .toast-fade-leave-active {
  transition: all 0.25s ease;
}

.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
  transform: translateY(14px);
}
</style>
