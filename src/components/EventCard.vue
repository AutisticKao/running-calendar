<template>
  <div class="wm-event-card" :class="{ 'is-featured': event.is_featured }">
    <!-- Card Top: Date Badge & Bookmark Action -->
    <div class="card-header-bar">
      <div class="card-date-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>{{ event.date_text }}</span>
      </div>

      <div class="card-top-actions">
        <span v-if="event.is_featured" class="badge-featured">
          ★ Highlight
        </span>

        <button
          class="btn-bookmark-heart"
          :class="{ active: isBookmarked }"
          :title="isBookmarked ? 'Hapus dari Target Race' : 'Simpan ke Target Race'"
          @click.stop="$emit('toggle-bookmark', event)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" :fill="isBookmarked ? '#E11D48' : 'none'" :stroke="isBookmarked ? '#E11D48' : 'currentColor'" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Card Main: Title & Location -->
    <div class="card-content" @click="$emit('select-event', event)">
      <h3 class="event-title">{{ event.title }}</h3>

      <div class="event-location-row">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span class="location-text">{{ event.location }}</span>
        <span v-if="event.city && event.city !== 'Lainnya'" class="city-tag">{{ event.city }}</span>
      </div>

      <!-- Distance Badges Flow -->
      <div class="category-pills-row">
        <span
          v-for="cat in parsedCategories"
          :key="cat"
          class="dist-badge"
          :class="getCategoryClass(cat)"
        >
          {{ cat }}
        </span>
      </div>
    </div>

    <!-- Card Footer -->
    <div class="card-footer">
      <button class="btn-card-detail" @click="$emit('select-event', event)">
        <span>Rincian Event</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>

      <a
        v-if="event.detail_url"
        :href="event.detail_url"
        target="_blank"
        rel="noopener noreferrer"
        class="link-card-source"
        title="Buka sumber resmi & pendaftaran"
        @click.stop
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  isBookmarked: {
    type: Boolean,
    default: false
  }
});

defineEmits(['select-event', 'toggle-bookmark']);

const parsedCategories = computed(() => {
  if (!props.event.category) return ['Umum'];
  return props.event.category
    .split(',')
    .map(c => c.trim())
    .filter(Boolean);
});

function getCategoryClass(catName) {
  const c = catName.toLowerCase();
  if (c.includes('42') || c.includes('full') || c.includes('marathon')) return 'marathon';
  if (c.includes('21') || c.includes('half')) return 'half';
  if (c.includes('10k') || c.includes('10 k')) return 'tenk';
  if (c.includes('5k') || c.includes('5 k')) return 'fivek';
  if (c.includes('trail')) return 'trail';
  if (c.includes('ultra')) return 'ultra';
  return 'default';
}
</script>

<style scoped>
.wm-event-card {
  background: #FFFFFF;
  border: 1px solid var(--wm-border);
  border-radius: var(--radius-lg);
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: var(--shadow-card);
  transition: var(--transition-smooth);
  position: relative;
}

.wm-event-card:hover {
  transform: translateY(-3px);
  border-color: #CBD5E1;
  box-shadow: var(--shadow-card-hover);
}

.wm-event-card.is-featured {
  border-top: 3px solid var(--wm-brand);
}

/* Header Bar */
.card-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.card-date-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #F8FAFC;
  border: 1px solid var(--wm-border);
  border-radius: var(--radius-full);
  padding: 4px 12px;
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--wm-dark-muted);
}

.card-date-badge svg {
  color: var(--wm-brand);
}

.card-top-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-featured {
  background: var(--wm-brand-light);
  color: var(--wm-brand);
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(225, 29, 72, 0.2);
}

.btn-bookmark-heart {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F8FAFC;
  border: 1px solid var(--wm-border);
  color: var(--wm-text-muted);
  transition: var(--transition-fast);
}

.btn-bookmark-heart:hover {
  background: var(--wm-brand-light);
  color: var(--wm-brand);
  border-color: rgba(225, 29, 72, 0.3);
  transform: scale(1.1);
}

.btn-bookmark-heart.active {
  background: var(--wm-brand-light);
  border-color: rgba(225, 29, 72, 0.3);
}

/* Card Content */
.card-content {
  flex: 1;
  cursor: pointer;
  margin-bottom: 18px;
}

.event-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--wm-dark);
  line-height: 1.35;
  margin-bottom: 10px;
  transition: var(--transition-fast);
}

.wm-event-card:hover .event-title {
  color: var(--wm-brand);
}

.event-location-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.86rem;
  color: var(--wm-text-body);
  margin-bottom: 14px;
}

.event-location-row svg {
  color: var(--wm-text-muted);
  flex-shrink: 0;
}

.location-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.city-tag {
  background: #F1F5F9;
  color: var(--wm-dark-muted);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: var(--radius-sm);
}

.category-pills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* Footer */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid var(--wm-border-subtle);
}

.btn-card-detail {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--wm-dark);
  transition: var(--transition-fast);
}

.btn-card-detail:hover {
  color: var(--wm-brand);
  transform: translateX(3px);
}

.link-card-source {
  color: var(--wm-text-muted);
  padding: 6px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
}

.link-card-source:hover {
  color: var(--wm-brand);
  background: #F8FAFC;
}
</style>
