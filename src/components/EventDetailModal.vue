<template>
  <div v-if="event" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content modal-box">
      <div class="modal-header">
        <div class="modal-tag-row">
          <span class="spec-badge">{{ event.year }}</span>
          <span v-if="event.is_featured" class="featured-badge">
            Lomba unggulan
          </span>
          <span class="cat-badge">{{ event.category || 'Umum' }}</span>
        </div>
        <button class="btn-close" @click="$emit('close')" aria-label="Tutup">✕</button>
      </div>

      <div class="modal-title-banner">
        <h2 class="modal-event-title">{{ event.title }}</h2>
      </div>

      <div class="modal-body">
        <div class="specs-grid">
          <div class="spec-card">
            <div class="spec-icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div class="spec-details">
              <span class="spec-label">Jadwal pelaksanaan</span>
              <span class="spec-val">{{ event.date_text }}</span>
            </div>
          </div>

          <div class="spec-card">
            <div class="spec-icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
            </div>
            <div class="spec-details">
              <span class="spec-label">Kategori & jarak</span>
              <span class="spec-val">{{ event.category || 'Umum / fun run' }}</span>
            </div>
          </div>

          <div class="spec-card spec-card-full">
            <div class="spec-icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div class="spec-details">
              <span class="spec-label">Venue & lokasi</span>
              <span class="spec-val">{{ event.location }}</span>
              <span v-if="event.city" class="spec-city-tag">Kota: {{ event.city }}</span>
              <a
                :href="mapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="maps-action-link"
              >
                Petunjuk arah di Google Maps
              </a>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <a
            :href="event.detail_url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-primary btn-block"
          >
            Sumber resmi & registrasi
          </a>

          <div class="secondary-actions-row">
            <a
              :href="googleCalendarUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-secondary flex-1"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Tambah ke calendar
            </a>

            <button
              class="btn btn-dark flex-1"
              @click="$emit('toggle-bookmark', event)"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" :fill="isBookmarked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {{ isBookmarked ? 'Hapus dari target' : 'Simpan ke target' }}
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
  const details = encodeURIComponent(`Jadwal lomba lari: ${props.event.title}\nKategori: ${props.event.category}\nInfo: ${props.event.detail_url}`);

  let datesParam = '';
  if (props.event.start_date) {
    const dStr = props.event.start_date.replace(/-/g, '');
    datesParam = `&dates=${dStr}T060000/${dStr}T110000`;
  }
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&location=${location}&details=${details}${datesParam}`;
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background-color: rgba(21, 23, 28, 0.55);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content {
  max-width: 640px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalIn 0.2s ease-out;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-box {
  background-color: var(--paper);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.modal-header {
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
}

.modal-tag-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.spec-badge {
  background-color: var(--surface);
  color: var(--ink-soft);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 4px 11px;
  border-radius: var(--radius-pill);
}

.featured-badge {
  background-color: var(--accent-soft);
  color: var(--accent-ink);
  font-size: 0.78rem;
  font-weight: 700;
  padding: 4px 11px;
  border-radius: var(--radius-pill);
}

.cat-badge {
  background-color: var(--surface);
  color: var(--ink-soft);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 4px 11px;
  border-radius: var(--radius-pill);
}

.btn-close {
  background-color: var(--surface);
  color: var(--ink);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  border-radius: 50%;
  transition: var(--transition-fast);
}

.btn-close:hover {
  background-color: var(--ink);
  color: #FFFFFF;
}

.modal-title-banner {
  padding: 22px 24px 0;
}

.modal-event-title {
  font-size: clamp(1.25rem, 2.2vw, 1.55rem);
  font-weight: 600;
  color: var(--ink);
  line-height: 1.3;
}

.modal-body {
  padding: 22px 24px 24px;
}

.specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

@media (max-width: 600px) {
  .specs-grid {
    grid-template-columns: 1fr;
  }
}

.spec-card {
  background-color: var(--surface);
  border-radius: var(--radius-md);
  padding: 15px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.spec-card-full {
  grid-column: 1 / -1;
}

.spec-icon-box {
  width: 34px;
  height: 34px;
  background-color: var(--paper);
  color: var(--ink);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.spec-details {
  display: flex;
  flex-direction: column;
}

.spec-label {
  font-size: 0.76rem;
  color: var(--text-muted);
}

.spec-val {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--ink);
  margin-top: 2px;
}

.spec-city-tag {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-top: 3px;
}

.maps-action-link {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--accent);
  margin-top: 8px;
  display: inline-block;
}

.maps-action-link:hover {
  color: var(--accent-dark);
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-block {
  width: 100%;
  padding: 13px 20px;
  font-size: 0.95rem;
}

.secondary-actions-row {
  display: flex;
  gap: 10px;
}

@media (max-width: 540px) {
  .secondary-actions-row {
    flex-direction: column;
  }
}

.flex-1 {
  flex: 1;
}

.btn-dark {
  background-color: var(--ink);
  color: #FFFFFF;
}

.btn-dark:hover {
  background-color: var(--accent);
}
</style>