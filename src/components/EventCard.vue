<template>
  <div class="event-card" :class="{ 'is-featured': event.is_featured }">
    <!-- Top Meta Row -->
    <div class="card-top-row">
      <div class="date-chip">
        <span class="date-icon">📅</span>
        <span class="date-text">{{ event.date_text }}</span>
      </div>

      <div class="card-actions-top">
        <span v-if="event.is_featured" class="badge badge-featured">
          ★ Highlight
        </span>
        <button
          class="btn-bookmark"
          :class="{ bookmarked: isBookmarked }"
          @click.stop="$emit('toggle-bookmark', event)"
          :title="isBookmarked ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'"
        >
          {{ isBookmarked ? '❤️' : '🤍' }}
        </button>
      </div>
    </div>

    <!-- Title & Location -->
    <div class="card-main" @click="$emit('select-event', event)">
      <h3 class="event-title">{{ event.title }}</h3>

      <div class="event-location">
        <span class="loc-icon">📍</span>
        <span class="loc-text">{{ event.location }}</span>
      </div>
    </div>

    <!-- Category Badges -->
    <div class="category-tags">
      <span
        v-for="(tag, idx) in parsedCategories"
        :key="idx"
        class="badge-category"
        :class="getBadgeClass(tag)"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Card Footer -->
    <div class="card-footer">
      <span class="city-tag">{{ event.city || 'Indonesia' }}</span>
      <div class="footer-buttons">
        <button class="btn-detail" @click="$emit('select-event', event)">
          Detail Race ↗
        </button>
      </div>
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
  if (t.includes('42k') || t.includes('marathon')) return 'tag-marathon';
  if (t.includes('21k') || t.includes('half')) return 'tag-half';
  if (t.includes('10k')) return 'tag-10k';
  if (t.includes('5k')) return 'tag-5k';
  if (t.includes('trail')) return 'tag-trail';
  if (t.includes('ultra')) return 'tag-ultra';
  return '';
}
</script>

<style scoped>
.event-card {
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: var(--radius-md);
  position: relative;
  background: #FFFFFF;
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-card);
  transition: var(--transition-normal);
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-card-hover);
  border-color: var(--border-medium);
}

.event-card.is-featured {
  border-color: #E2E8F0;
  box-shadow: 0 10px 30px -5px rgba(0, 82, 255, 0.08), 0 4px 12px rgba(17, 24, 39, 0.03);
}

.event-card.is-featured::before {
  content: '';
  position: absolute;
  top: 0;
  left: 24px;
  right: 24px;
  height: 3px;
  background: var(--accent-black);
  border-radius: 0 0 4px 4px;
}

.card-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.date-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-surface-soft);
  border: 1px solid var(--border-subtle);
  padding: 5px 12px;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-primary);
}

.card-actions-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-bookmark {
  background: var(--bg-surface-soft);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.92rem;
  transition: var(--transition-fast);
}

.btn-bookmark:hover {
  transform: scale(1.12);
  border-color: var(--accent-black);
  background: #FFFFFF;
}

.card-main {
  flex: 1;
  cursor: pointer;
  margin-bottom: 16px;
}

.event-title {
  font-size: 1.18rem;
  font-weight: 800;
  line-height: 1.35;
  color: var(--text-primary);
  margin-bottom: 10px;
  letter-spacing: -0.02em;
  transition: var(--transition-fast);
}

.card-main:hover .event-title {
  color: var(--accent-primary);
}

.event-location {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 0.86rem;
  color: var(--text-secondary);
}

.loc-icon {
  font-size: 0.86rem;
  line-height: 1.4;
  opacity: 0.7;
}

.loc-text {
  line-height: 1.35;
}

/* Category Tags - Brook Clean Pastel Style */
.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 18px;
}

.tag-marathon {
  border-color: #FED7AA;
  color: #C2410C;
  background: #FFF7ED;
}

.tag-half {
  border-color: #BFDBFE;
  color: #1D4ED8;
  background: #EFF6FF;
}

.tag-10k {
  border-color: #A7F3D0;
  color: #047857;
  background: #ECFDF5;
}

.tag-5k {
  border-color: #FDE68A;
  color: #B45309;
  background: #FFFBEB;
}

.tag-trail {
  border-color: #DDD6FE;
  color: #6D28D9;
  background: #F5F3FF;
}

.tag-ultra {
  border-color: #FBCFE8;
  color: #BE185D;
  background: #FDF2F8;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid var(--border-subtle);
}

.city-tag {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn-detail {
  font-size: 0.84rem;
  font-weight: 800;
  color: var(--text-primary);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: var(--transition-fast);
}

.btn-detail:hover {
  color: var(--accent-primary);
  transform: translateX(2px);
}
</style>
