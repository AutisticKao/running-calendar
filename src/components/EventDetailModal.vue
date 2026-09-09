<template>
  <div v-if="event" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content oxy-modal-box">
      <div class="modal-header-oxy">
        <div class="modal-tag-row">
          <span class="oxy-spec-badge">TAHUN {{ event.year }}</span>
          <span v-if="event.is_featured" class="oxy-featured-badge">
            HIGHLIGHT RACE
          </span>
          <span class="oxy-cat-badge">{{ event.category || 'REGULAR RACE' }}</span>
        </div>
        <button class="btn-close-oxy" @click="$emit('close')" aria-label="Tutup">✕</button>
      </div>

      <div class="modal-title-banner">
        <span class="modal-pretitle">INFORMASI RESMI PERLOMBAAN</span>
        <h2 class="modal-event-title">{{ event.title }}</h2>
      </div>

      <div class="modal-body-oxy">
        <div class="specs-grid">
          <div class="spec-card">
            <div class="spec-icon-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square">
                <rect x="3" y="4" width="18" height="18" rx="0" ry="0"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div class="spec-details">
              <span class="spec-label">JADWAL PELAKSANAAN</span>
              <span class="spec-val-bold">{{ event.date_text }}</span>
            </div>
          </div>

          <div class="spec-card">
            <div class="spec-icon-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
            </div>
            <div class="spec-details">
              <span class="spec-label">KATEGORI & JARAK</span>
              <span class="spec-val-bold">{{ event.category || 'Umum / Fun Run' }}</span>
            </div>
          </div>

          <div class="spec-card spec-card-full">
            <div class="spec-icon-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div class="spec-details">
              <span class="spec-label">VENUE & LOKASI PERLOMBAAN</span>
              <span class="spec-val-bold">{{ event.location }}</span>
              <span v-if="event.city" class="spec-city-tag">Kota / Wilayah: {{ event.city }}</span>
              <a
                :href="mapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="maps-action-link"
              >
                PETUNJUK ARAH GOOGLE MAPS ↗
              </a>
            </div>
          </div>
        </div>

        <div class="modal-actions-oxy">
          <a
            :href="event.detail_url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-oxy btn-oxy-primary btn-block-oxy"
          >
            SUMBER RESMI & REGISTRASI ↗
          </a>

          <div class="secondary-actions-row">
            <a
              :href="googleCalendarUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-oxy btn-oxy-secondary flex-1"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              TAMBAH KE CALENDAR
            </a>

            <button
              class="btn-oxy btn-oxy-navy flex-1"
              @click="$emit('toggle-bookmark', event)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" :fill="isBookmarked ? '#FF5E13' : 'none'" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {{ isBookmarked ? 'HAPUS DARI TARGET' : 'SIMPAN KE TARGET' }}
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
.oxy-modal-box {
  background-color: #FFFFFF;
  border-top: 4px solid var(--oxy-orange);
  border-radius: 0px;
  overflow: hidden;
}

.modal-header-oxy {
  background-color: var(--oxy-navy);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.modal-tag-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.oxy-spec-badge {
  background-color: rgba(255, 255, 255, 0.15);
  color: #FFFFFF;
  font-family: var(--font-heading);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 3px 10px;
  border-radius: 0px;
}

.oxy-featured-badge {
  background-color: var(--oxy-orange);
  color: #FFFFFF;
  font-family: var(--font-heading);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 3px 10px;
  border-radius: 0px;
}

.oxy-cat-badge {
  background-color: #00173D;
  color: #FF5E13;
  font-family: var(--font-heading);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 3px 10px;
  border-radius: 0px;
  border: 1px solid rgba(255, 94, 19, 0.4);
}

.btn-close-oxy {
  background-color: transparent;
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 0px;
  transition: var(--transition-fast);
}

.btn-close-oxy:hover {
  background-color: var(--oxy-orange);
  border-color: var(--oxy-orange);
}

.modal-title-banner {
  background-color: var(--oxy-navy-dark);
  padding: 24px 28px;
  border-bottom: 3px solid var(--oxy-orange);
}

.modal-pretitle {
  font-family: var(--font-heading);
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--oxy-orange);
  letter-spacing: 0.15em;
  display: block;
  margin-bottom: 6px;
}

.modal-event-title {
  font-family: var(--font-heading);
  font-size: clamp(1.4rem, 2.5vw, 1.85rem);
  font-weight: 800;
  color: #FFFFFF;
  line-height: 1.25;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.modal-body-oxy {
  padding: 28px;
  background-color: #FFFFFF;
}

.specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 28px;
}

@media (max-width: 600px) {
  .specs-grid {
    grid-template-columns: 1fr;
  }
}

.spec-card {
  background-color: #F8FAFD;
  border: 1px solid var(--border-color);
  border-left: 3px solid var(--oxy-orange);
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.spec-card-full {
  grid-column: 1 / -1;
}

.spec-icon-box {
  width: 38px;
  height: 38px;
  background-color: var(--oxy-navy);
  color: #FFFFFF;
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
  font-family: var(--font-heading);
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.spec-val-bold {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 700;
  color: var(--oxy-navy);
  margin-top: 2px;
}

.spec-city-tag {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-top: 3px;
}

.maps-action-link {
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--oxy-orange);
  letter-spacing: 0.05em;
  margin-top: 6px;
  display: inline-block;
  text-decoration: underline;
}

.maps-action-link:hover {
  color: var(--oxy-navy);
}

.modal-actions-oxy {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-block-oxy {
  width: 100%;
  padding: 14px 20px;
  font-size: 1rem;
}

.secondary-actions-row {
  display: flex;
  gap: 12px;
}

@media (max-width: 540px) {
  .secondary-actions-row {
    flex-direction: column;
  }
}

.flex-1 {
  flex: 1;
}
</style>
