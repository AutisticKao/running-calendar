<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content wishlist-box">
      <div class="modal-header">
        <div class="wishlist-title-group">
          <h2 class="wishlist-title">Target race saya</h2>
          <span class="wishlist-count">{{ bookmarks.length }} lomba disimpan</span>
        </div>
        <button class="btn-close" @click="$emit('close')" aria-label="Tutup">✕</button>
      </div>

      <div class="modal-body">
        <div v-if="!bookmarks || bookmarks.length === 0" class="empty-state">
          <div class="empty-icon-box">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3 class="empty-title">Belum ada target race tersimpan</h3>
          <p class="empty-desc">
            Klik ikon hati pada kartu lomba untuk menandai lomba yang ingin kamu ikuti.
          </p>
        </div>

        <div v-else class="bookmarks-list">
          <div
            v-for="item in bookmarks"
            :key="item.detail_url"
            class="bookmark-item"
          >
            <div class="bookmark-info" @click="$emit('select-event', item)">
              <div class="bookmark-meta-row">
                <span class="bookmark-date">{{ item.date_text }}</span>
                <span class="bookmark-cat-badge">{{ item.category || 'Event' }}</span>
              </div>
              <h4 class="bookmark-race-title">{{ item.title }}</h4>
              <span class="bookmark-loc">{{ item.location }}</span>
            </div>

            <div class="bookmark-actions">
              <button
                class="btn-detail-link"
                @click="$emit('select-event', item)"
                title="Lihat rincian"
              >
                Detail
              </button>
              <button
                class="btn-remove"
                @click="$emit('remove-bookmark', item)"
                title="Hapus dari target race"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  bookmarks: {
    type: Array,
    default: () => []
  }
});

defineEmits(['close', 'select-event', 'remove-bookmark']);
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
  max-width: 620px;
  width: 100%;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.wishlist-box {
  background-color: var(--paper);
  border-radius: var(--radius-lg);
}

.modal-header {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
}

.wishlist-title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.wishlist-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.wishlist-count {
  font-size: 0.85rem;
  color: var(--text-muted);
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

.modal-body {
  padding: 22px 24px;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon-box {
  width: 58px;
  height: 58px;
  margin: 0 auto 16px;
  background-color: var(--accent-soft);
  color: var(--accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.empty-desc {
  font-size: 0.92rem;
  color: var(--text-muted);
  max-width: 380px;
  margin: 0 auto;
  line-height: 1.5;
}

.bookmarks-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bookmark-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: var(--surface);
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
}

.bookmark-item:hover {
  background: var(--accent-soft);
}

.bookmark-info {
  flex: 1;
  cursor: pointer;
  min-width: 0;
}

.bookmark-meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.bookmark-date {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--accent);
}

.bookmark-cat-badge {
  background-color: var(--paper);
  color: var(--ink-soft);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 9px;
  border-radius: var(--radius-pill);
}

.bookmark-race-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 3px;
}

.bookmark-loc {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.bookmark-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 14px;
  flex-shrink: 0;
}

.btn-detail-link {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--ink);
  padding: 7px 13px;
  background: var(--paper);
  border-radius: var(--radius-pill);
  transition: var(--transition-fast);
}

.btn-detail-link:hover {
  background: var(--ink);
  color: #FFFFFF;
}

.btn-remove {
  background: var(--paper);
  color: var(--text-muted);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.btn-remove:hover {
  background: var(--accent);
  color: #FFFFFF;
}
</style>