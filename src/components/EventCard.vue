<template>
  <div class="event-card" :class="{ 'is-featured': event.is_featured }">
    <div class="card-meta-bar">
      <span class="date-badge">{{ event.date_text }}</span>

      <div class="meta-bar-right">
        <span v-if="event.is_featured" class="badge-featured">
          Unggulan
        </span>
        <button
          class="btn-bookmark"
          :class="{ bookmarked: isBookmarked }"
          @click.stop="$emit('toggle-bookmark', event)"
          :title="isBookmarked ? 'Hapus dari target' : 'Simpan ke target'"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" :fill="isBookmarked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
    </div>

    <div class="card-content-area" @click="$emit('select-event', event)">
      <h3 class="event-headline">{{ event.title }}</h3>

      <div class="event-venue-row">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span class="venue-text">{{ event.location }}</span>
      </div>
    </div>

    <div class="category-badges-row">
      <span
        v-for="(tag, idx) in parsedCategories"
        :key="idx"
        class="cat-badge"
        :class="getBadgeClass(tag)"
      >
        {{ tag }}
      </span>
    </div>

    <div class="card-action-footer">
      <span class="city-indicator">{{ event.city || 'Indonesia' }}</span>
      <button class="btn-read-more" @click="$emit('select-event', event)">
        Lihat detail
      </button>
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
  return props.event.category.split(',').map(c => c.trim()).filter(Boolean);
});

function getBadgeClass(tag) {
  const t = tag.toLowerCase();
  if (t.includes('42k') || t.includes('marathon')) return 'cat-marathon';
  if (t.includes('21k') || t.includes('half')) return 'cat-half';
  if (t.includes('10k')) return 'cat-10k';
  if (t.includes('5k')) return 'cat-5k';
  if (t.includes('trail')) return 'cat-trail';
  if (t.includes('ultra')) return 'cat-ultra';
  return '';
}
</script>

<style scoped>
.event-card {
  background-color: var(--paper);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  position: relative;
  transition: var(--transition-fast);
}

.event-card:hover {
  border-color: var(--ink-faint);
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

.event-card.is-featured {
  border-color: var(--accent);
}

.card-meta-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px 0;
}

.date-badge {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--accent);
}

.meta-bar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-featured {
  background-color: var(--accent-soft);
  color: var(--accent-ink);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: var(--radius-pill);
}

.btn-bookmark {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  transition: var(--transition-fast);
}

.btn-bookmark:hover,
.btn-bookmark.bookmarked {
  background-color: var(--accent-soft);
  color: var(--accent);
}

.card-content-area {
  padding: 12px 18px 12px;
  flex: 1;
  cursor: pointer;
}

.event-headline {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.3;
  margin-bottom: 8px;
  transition: var(--transition-fast);
}

.card-content-area:hover .event-headline {
  color: var(--accent);
}

.event-venue-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 0.86rem;
  color: var(--text-muted);
}

.event-venue-row svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.venue-text {
  line-height: 1.4;
}

.category-badges-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 18px 16px;
}

.cat-badge {
  font-size: 0.74rem;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: var(--radius-pill);
  background-color: var(--surface);
  color: var(--ink-soft);
}

.cat-marathon {
  background-color: var(--accent-soft);
  color: var(--accent-ink);
}

.cat-half {
  background-color: #E4EEFA;
  color: #164A83;
}

.cat-10k {
  background-color: var(--trail-soft);
  color: var(--trail-ink);
}

.cat-5k {
  background-color: #FBF1DC;
  color: #7A5710;
}

.cat-trail {
  background-color: #EFE7FB;
  color: #4B2A8C;
}

.cat-ultra {
  background-color: #FBE3F0;
  color: #7C1256;
}

.card-action-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-top: 1px solid var(--border-color);
}

.city-indicator {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.btn-read-more {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--ink);
  transition: var(--transition-fast);
}

.btn-read-more:hover {
  color: var(--accent);
}
</style>