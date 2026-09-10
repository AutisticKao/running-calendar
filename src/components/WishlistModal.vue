<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content wm-wishlist-box">
      <!-- Modal Header -->
      <div class="modal-header-wm">
        <div class="wishlist-title-group">
          <span class="wishlist-pretitle">AGENDA & RACE TARGET PRIBADI</span>
          <h2 class="wishlist-title">Target Race Anda ({{ bookmarks.length }})</h2>
        </div>
        <button class="btn-close-wm" @click="$emit('close')" aria-label="Tutup">
          ✕
        </button>
      </div>

      <div class="modal-body-wm">
        <!-- Empty State -->
        <div v-if="!bookmarks || bookmarks.length === 0" class="empty-state-wm">
          <div class="empty-icon-circle">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <h3 class="empty-title">Belum Ada Target Race Tersimpan</h3>
          <p class="empty-desc">
            Klik ikon hati pada kartu lomba lari yang ingin Anda ikuti untuk menyimpannya ke daftar target pribadi.
          </p>
        </div>

        <!-- Bookmarks List -->
        <div v-else class="bookmarks-list">
          <div
            v-for="item in bookmarks"
            :key="item.detail_url"
            class="bookmark-card"
          >
            <div class="bookmark-info" @click="$emit('select-event', item)">
              <div class="bookmark-meta-row">
                <span class="bookmark-date-pill">📅 {{ item.date_text }}</span>
                <span class="bookmark-cat-pill">{{ item.category || 'Road Race' }}</span>
              </div>
              <h4 class="bookmark-race-title">{{ item.title }}</h4>
              <span class="bookmark-loc">📍 {{ item.location }}</span>
            </div>

            <div class="bookmark-actions">
              <button
                class="btn-wm-view-sm"
                @click="$emit('select-event', item)"
                title="Buka rincian event"
              >
                Rincian ↗
              </button>
              <button
                class="btn-wm-remove-sm"
                @click="$emit('remove-bookmark', item)"
                title="Hapus dari Target Race"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
.wm-wishlist-box {
  background: #FFFFFF;
  border-radius: var(--radius-xl);
  max-width: 680px;
  width: 100%;
}

.modal-header-wm {
  background: #F8FAFC;
  padding: 20px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--wm-border);
}

.wishlist-title-group {
  display: flex;
  flex-direction: column;
}

.wishlist-pretitle {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--wm-brand);
  letter-spacing: 0.08em;
}

.wishlist-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--wm-dark);
  margin-top: 2px;
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

.modal-body-wm {
  padding: 28px;
  max-height: 70vh;
  overflow-y: auto;
}

.empty-state-wm {
  text-align: center;
  padding: 48px 20px;
}

.empty-icon-circle {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  background: var(--wm-brand-light);
  color: var(--wm-brand);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--wm-dark);
  margin-bottom: 6px;
}

.empty-desc {
  font-size: 0.92rem;
  color: var(--wm-text-body);
  max-width: 400px;
  margin: 0 auto;
}

.bookmarks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bookmark-card {
  background: #F8FAFC;
  border: 1px solid var(--wm-border);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  transition: var(--transition-fast);
}

.bookmark-card:hover {
  background: #FFFFFF;
  border-color: #CBD5E1;
  box-shadow: var(--shadow-sm);
}

.bookmark-info {
  flex: 1;
  cursor: pointer;
}

.bookmark-meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.bookmark-date-pill {
  font-family: var(--font-display);
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--wm-dark);
}

.bookmark-cat-pill {
  background: #E2E8F0;
  color: var(--wm-dark-muted);
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.bookmark-race-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--wm-dark);
  margin-bottom: 4px;
}

.bookmark-card:hover .bookmark-race-title {
  color: var(--wm-brand);
}

.bookmark-loc {
  font-size: 0.84rem;
  color: var(--wm-text-body);
}

.bookmark-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-wm-view-sm {
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--wm-dark);
  background: #FFFFFF;
  border: 1px solid var(--wm-border);
  padding: 6px 14px;
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
}

.btn-wm-view-sm:hover {
  border-color: var(--wm-brand);
  color: var(--wm-brand);
}

.btn-wm-remove-sm {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  background: #FFFFFF;
  border: 1px solid var(--wm-border);
  color: var(--wm-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
}

.btn-wm-remove-sm:hover {
  background: var(--wm-brand-light);
  border-color: var(--wm-brand);
  color: var(--wm-brand);
}
</style>
