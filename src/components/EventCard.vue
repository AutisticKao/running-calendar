<template>
  <div class="oxy-event-card" :class="{ 'is-featured': event.is_featured }">
    <div class="card-meta-bar">
      <div class="date-badge-sharp">
        <span class="date-text">{{ event.date_text }}</span>
      </div>

      <div class="meta-bar-right">
        <span v-if="event.is_featured" class="badge-featured-sharp">
          HIGHLIGHT
        </span>
        <button
          class="btn-bookmark-sharp"
          :class="{ bookmarked: isBookmarked }"
          @click.stop="$emit('toggle-bookmark', event)"
          :title="isBookmarked ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'"
        >
          {{ isBookmarked ? '★' : '☆' }}
        </button>
      </div>
    </div>

    <div class="card-content-area" @click="$emit('select-event', event)">
      <h3 class="event-headline">{{ event.title }}</h3>

      <div class="event-venue-row">
        <span class="venue-icon">📍</span>
        <span class="venue-text">{{ event.location }}</span>
      </div>
    </div>

    <div class="category-badges-row">
      <span
        v-for="(tag, idx) in parsedCategories"
        :key="idx"
        class="cat-badge-sharp"
        :class="getBadgeClass(tag)"
      >
        {{ tag }}
      </span>
    </div>

    <div class="card-action-footer">
      <span class="city-indicator">{{ event.city || 'INDONESIA' }}</span>
      <button class="btn-read-more" @click="$emit('select-event', event)">
        <span>DETAIL RACE</span>
        <span class="arrow">→</span>
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
.oxy-event-card {
  background-color: #FFFFFF;
  border: 1px solid var(--border-color);
  border-top: 3px solid var(--oxy-navy);
  display: flex;
  flex-direction: column;
  position: relative;
  transition: var(--transition-fast);
  box-shadow: var(--shadow-subtle);
}

.oxy-event-card:hover {
  border-top-color: var(--oxy-orange);
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.oxy-event-card.is-featured {
  border-top: 4px solid var(--oxy-orange);
}

.card-meta-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background-color: #FAFBFC;
  border-bottom: 1px solid var(--border-color);
}

.date-badge-sharp {
  background-color: var(--oxy-orange);
  color: #FFFFFF;
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 3px 10px;
}

.meta-bar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-featured-sharp {
  background-color: var(--oxy-navy);
  color: #FFFFFF;
  font-family: var(--font-heading);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 2px 8px;
}

.btn-bookmark-sharp {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
  border: 1px solid var(--border-color);
  font-size: 1.1rem;
  color: var(--text-muted);
  transition: var(--transition-fast);
}

.btn-bookmark-sharp:hover,
.btn-bookmark-sharp.bookmarked {
  background-color: var(--oxy-navy);
  color: var(--oxy-orange);
  border-color: var(--oxy-navy);
}

/* Content Area */
.card-content-area {
  padding: 20px 20px 14px;
  flex: 1;
  cursor: pointer;
}

.event-headline {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--oxy-navy);
  line-height: 1.3;
  margin-bottom: 10px;
  letter-spacing: 0.02em;
  transition: var(--transition-fast);
}

.card-content-area:hover .event-headline {
  color: var(--oxy-orange);
}

.event-venue-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 0.88rem;
  color: var(--text-body);
}

.venue-icon {
  font-size: 0.9rem;
  opacity: 0.7;
}

.venue-text {
  line-height: 1.4;
}

/* Category Badges */
.category-badges-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 20px 18px;
}

.cat-badge-sharp {
  font-family: var(--font-heading);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 2px 8px;
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  color: var(--text-body);
}

.cat-marathon {
  background-color: #FFF2EB;
  border-color: #FFD4C2;
  color: var(--oxy-orange-dark);
}

.cat-half {
  background-color: #EEF4FF;
  border-color: #BFD7FE;
  color: var(--oxy-navy);
}

.cat-10k {
  background-color: #EDFDF7;
  border-color: #A3F3D2;
  color: #059669;
}

.cat-5k {
  background-color: #FEF9EB;
  border-color: #FDE8A5;
  color: #B45309;
}

.cat-trail {
  background-color: #F5F3FF;
  border-color: #DDD6FE;
  color: #6D28D9;
}

.cat-ultra {
  background-color: #FDF2F8;
  border-color: #FBCFE8;
  color: #BE185D;
}

/* Footer */
.card-action-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background-color: #FAFBFC;
  border-top: 1px solid var(--border-color);
}

.city-indicator {
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.btn-read-more {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--oxy-navy);
  transition: var(--transition-fast);
}

.btn-read-more .arrow {
  color: var(--oxy-orange);
  font-size: 1rem;
  transition: var(--transition-fast);
}

.btn-read-more:hover {
  color: var(--oxy-orange);
}

.btn-read-more:hover .arrow {
  transform: translateX(4px);
}
</style>
