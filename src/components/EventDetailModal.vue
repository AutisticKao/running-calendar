<template>
  <div v-if="event" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content wm-modal-box">
      <!-- Modal Header -->
      <div class="modal-header-wm">
        <div class="header-badges-row">
          <span class="badge-year">Tahun {{ event.year }}</span>
          <span v-if="event.is_featured" class="badge-featured-modal">
            ★ Highlight Race
          </span>
          <span class="badge-cat-modal">{{ event.category || 'Road Race' }}</span>
        </div>
        <button class="btn-close-wm" @click="$emit('close')" aria-label="Tutup">
          ✕
        </button>
      </div>

      <!-- Title Area -->
      <div class="modal-title-area">
        <span class="event-type-pretitle">INFORMASI RESMI PERLOMBAAN</span>
        <h2 class="modal-event-title">{{ event.title }}</h2>
      </div>

      <!-- Specs & Detail Grid -->
      <div class="modal-body-wm">
        <div class="specs-grid">
          <!-- Jadwal Pelaksanaan -->
          <div class="spec-card">
            <div class="spec-icon-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div class="spec-info">
              <span class="spec-label">JADWAL PELAKSANAAN</span>
              <span class="spec-value">{{ event.date_text }}</span>
            </div>
          </div>

          <!-- Kategori & Jarak -->
          <div class="spec-card">
            <div class="spec-icon-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
            </div>
            <div class="spec-info">
              <span class="spec-label">KATEGORI & JARAK</span>
              <span class="spec-value">{{ event.category || 'Umum / Fun Run' }}</span>
            </div>
          </div>

          <!-- Lokasi / Venue Full Width -->
          <div class="spec-card spec-card-full">
            <div class="spec-icon-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div class="spec-info">
              <span class="spec-label">VENUE & LOKASI PERLOMBAAN</span>
              <span class="spec-value">{{ event.location }}</span>
              <span v-if="event.city" class="spec-city-sub">Kota / Wilayah: {{ event.city }}</span>
              <a
                :href="mapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="maps-btn-link"
              >
                <span>Buka Rute di Google Maps ↗</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Actions Row -->
        <div class="modal-actions-wm">
          <a
            :href="event.detail_url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-wm btn-wm-primary btn-action-block"
          >
            <span>Halaman Sumber & Info Pendaftaran ↗</span>
          </a>

          <div class="secondary-btn-group">
            <a
              :href="googleCalendarUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-wm btn-wm-secondary flex-1"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Tambah ke Google Calendar</span>
            </a>

            <button
              class="btn-wm btn-wm-secondary flex-1"
              :class="{ 'is-saved': isBookmarked }"
              @click="$emit('toggle-bookmark', event)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" :fill="isBookmarked ? '#E11D48' : 'none'" :stroke="isBookmarked ? '#E11D48' : 'currentColor'" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>{{ isBookmarked ? 'Hapus Target Race' : 'Simpan Target Race' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  event: {
    type: Object,
    default: null
  },
  isBookmarked: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close', 'toggle-bookmark']);

const mapsUrl = computed(() => {
  if (!props.event) return '#';
  const query = encodeURIComponent(`${props.event.location}, Indonesia`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
});

const googleCalendarUrl = computed(() => {
  if (!props.event) return '#';
  const title = encodeURIComponent(props.event.title);
  const location = encodeURIComponent(props.event.location);
  const details = encodeURIComponent(`Jadwal Event Lari: ${props.event.title}\nKategori: ${props.event.category}\nInfo: ${props.event.detail_url}`);
  
  let datesParam = '';
  if (props.event.start_date) {
    const dStr = props.event.start_date.replace(/-/g, '');
    datesParam = `&dates=${dStr}T060000/${dStr}T110000`;
  }
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&location=${location}&details=${details}${datesParam}`;
});
</script>

<style scoped>
.wm-modal-box {
  background: #FFFFFF;
  border-radius: var(--radius-xl);
  overflow: hidden;
}

/* Header */
.modal-header-wm {
  background: #F8FAFC;
  padding: 18px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--wm-border);
}

.header-badges-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.badge-year {
  background: #FFFFFF;
  border: 1px solid var(--wm-border);
  color: var(--wm-dark);
  font-family: var(--font-display);
  font-size: 0.76rem;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: var(--radius-full);
}

.badge-featured-modal {
  background: var(--wm-brand-light);
  color: var(--wm-brand);
  font-family: var(--font-display);
  font-size: 0.76rem;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(225, 29, 72, 0.2);
}

.badge-cat-modal {
  background: #E2E8F0;
  color: var(--wm-dark-muted);
  font-family: var(--font-display);
  font-size: 0.76rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--radius-full);
}

.btn-close-wm {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 1px solid var(--wm-border);
  color: var(--wm-dark-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  font-weight: bold;
  transition: var(--transition-fast);
}

.btn-close-wm:hover {
  background: var(--wm-dark);
  color: #FFFFFF;
}

/* Title Area */
.modal-title-area {
  padding: 24px 28px 16px;
}

.event-type-pretitle {
  font-family: var(--font-display);
  font-size: 0.74rem;
  font-weight: 800;
  color: var(--wm-brand);
  letter-spacing: 0.08em;
  display: block;
  margin-bottom: 6px;
}

.modal-event-title {
  font-size: clamp(1.4rem, 2.5vw, 1.85rem);
  font-weight: 800;
  color: var(--wm-dark);
  line-height: 1.3;
}

/* Body & Specs */
.modal-body-wm {
  padding: 0 28px 28px;
}

.specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

@media (max-width: 600px) {
  .specs-grid {
    grid-template-columns: 1fr;
  }
}

.spec-card {
  background: #F8FAFC;
  border: 1px solid var(--wm-border);
  border-radius: var(--radius-lg);
  padding: 16px 18px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.spec-card-full {
  grid-column: 1 / -1;
}

.spec-icon-box {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: #FFFFFF;
  border: 1px solid var(--wm-border);
  color: var(--wm-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.spec-info {
  display: flex;
  flex-direction: column;
}

.spec-label {
  font-family: var(--font-display);
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--wm-text-muted);
  letter-spacing: 0.06em;
}

.spec-value {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--wm-dark);
  margin-top: 2px;
}

.spec-city-sub {
  font-size: 0.82rem;
  color: var(--wm-text-body);
  margin-top: 2px;
}

.maps-btn-link {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--wm-brand);
  margin-top: 6px;
  text-decoration: underline;
}

.maps-btn-link:hover {
  color: var(--wm-brand-dark);
}

/* Actions */
.modal-actions-wm {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-action-block {
  width: 100%;
  padding: 14px;
  font-size: 1rem;
  border-radius: var(--radius-lg);
}

.secondary-btn-group {
  display: flex;
  gap: 12px;
}

@media (max-width: 580px) {
  .secondary-btn-group {
    flex-direction: column;
  }
}

.flex-1 {
  flex: 1;
}

.btn-wm.is-saved {
  border-color: var(--wm-brand);
  color: var(--wm-brand);
  background: var(--wm-brand-light);
}
</style>
