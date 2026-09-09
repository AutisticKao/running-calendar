<template>
  <div v-if="event" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="modal-tag-row">
          <span v-if="event.is_featured" class="badge badge-featured">
            ★ Highlight Race
          </span>
          <span class="badge badge-primary">Tahun {{ event.year }}</span>
        </div>
        <button class="btn-close" @click="$emit('close')">✕</button>
      </div>

      <!-- Title & Basic Info -->
      <div class="modal-body">
        <h2 class="modal-event-title">{{ event.title }}</h2>

        <div class="info-list">
          <div class="info-row">
            <span class="info-icon">📅</span>
            <div class="info-content">
              <span class="info-label">Tanggal Pelaksanaan</span>
              <span class="info-value">{{ event.date_text }}</span>
            </div>
          </div>

          <div class="info-row">
            <span class="info-icon">📍</span>
            <div class="info-content">
              <span class="info-label">Lokasi / Venue</span>
              <span class="info-value">{{ event.location }}</span>
              <a
                :href="mapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="maps-link"
              >
                🗺️ Buka Rute di Google Maps ↗
              </a>
            </div>
          </div>

          <div class="info-row">
            <span class="info-icon">🏃</span>
            <div class="info-content">
              <span class="info-label">Kategori / Jarak</span>
              <span class="info-value">{{ event.category || 'Umum' }}</span>
            </div>
          </div>

          <div class="info-row">
            <span class="info-icon">🏙️</span>
            <div class="info-content">
              <span class="info-label">Kota / Wilayah</span>
              <span class="info-value">{{ event.city || 'Indonesia' }}</span>
            </div>
          </div>
        </div>

        <!-- Action Links -->
        <div class="modal-actions">
          <a
            :href="event.detail_url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary"
          >
            Halaman Sumber & Info Pendaftaran ↗
          </a>

          <a
            :href="googleCalendarUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary"
          >
            📅 Tambah ke Google Calendar
          </a>

          <button
            class="btn-secondary"
            @click="$emit('toggle-bookmark', event)"
          >
            {{ isBookmarked ? '❤️ Hapus dari Wishlist' : '🤍 Simpan ke Wishlist' }}
          </button>
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
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 26px 32px 18px;
  border-bottom: 1px solid var(--border-subtle);
}

.modal-tag-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-close {
  background: var(--bg-surface-soft);
  border: 1px solid var(--border-medium);
  color: var(--text-secondary);
  border-radius: var(--radius-full);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  transition: var(--transition-fast);
}

.btn-close:hover {
  color: #FFFFFF;
  background: var(--accent-black);
  border-color: var(--accent-black);
}

.modal-body {
  padding: 32px;
}

.modal-event-title {
  font-size: 1.75rem;
  font-weight: 900;
  line-height: 1.3;
  letter-spacing: -0.03em;
  margin-bottom: 28px;
  color: var(--text-primary);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 34px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.info-icon {
  font-size: 1.3rem;
  background: var(--bg-surface-soft);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.74rem;
  color: var(--text-muted);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.info-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
}

.maps-link {
  font-size: 0.84rem;
  color: var(--accent-primary);
  font-weight: 700;
  margin-top: 4px;
  display: inline-block;
}

.maps-link:hover {
  text-decoration: underline;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
