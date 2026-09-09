<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <div class="wishlist-title-group">
          <span class="wishlist-badge">TARGET RACE</span>
          <h2 class="wishlist-title">Wishlist Lomba Lari Anda ({{ bookmarks.length }})</h2>
        </div>
        <button class="btn-close" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body">
        <div v-if="!bookmarks || bookmarks.length === 0" class="empty-state">
          <span class="empty-icon">🏃‍♂️</span>
          <p class="empty-title">Belum ada race yang disimpan</p>
          <p class="empty-desc">Klik ikon hati pada kartu event untuk memasukkan race impian Anda ke daftar wishlist.</p>
        </div>

        <div v-else class="bookmarks-list">
          <div
            v-for="item in bookmarks"
            :key="item.detail_url"
            class="bookmark-item"
          >
            <div class="bookmark-info" @click="$emit('select-event', item)">
              <span class="bookmark-date">📅 {{ item.date_text }}</span>
              <h4 class="bookmark-race-title">{{ item.title }}</h4>
              <span class="bookmark-loc">📍 {{ item.location }}</span>
              <div class="bookmark-cat">
                <span class="badge badge-primary">{{ item.category }}</span>
              </div>
            </div>

            <button
              class="btn-remove-bookmark"
              @click="$emit('remove-bookmark', item)"
              title="Hapus dari Wishlist"
            >
              🗑️
            </button>
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
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 26px 32px 18px;
  border-bottom: 1px solid var(--border-subtle);
}

.wishlist-title-group {
  display: flex;
  flex-direction: column;
}

.wishlist-badge {
  font-size: 0.74rem;
  font-weight: 800;
  color: var(--accent-rose);
  letter-spacing: 0.12em;
}

.wishlist-title {
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: -0.02em;
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
  padding: 28px 32px;
  max-height: 70vh;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 50px 20px;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 14px;
  display: block;
}

.empty-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.empty-desc {
  font-size: 0.92rem;
  color: var(--text-muted);
  max-width: 380px;
  margin: 0 auto;
}

.bookmarks-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.bookmark-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-radius: var(--radius-md);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-subtle);
  transition: var(--transition-fast);
}

.bookmark-item:hover {
  border-color: var(--accent-black);
  box-shadow: var(--shadow-card);
}

.bookmark-info {
  flex: 1;
  cursor: pointer;
}

.bookmark-date {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-primary);
  display: block;
  margin-bottom: 4px;
}

.bookmark-race-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 4px;
  letter-spacing: -0.02em;
}

.bookmark-info:hover .bookmark-race-title {
  color: var(--accent-primary);
}

.bookmark-loc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 10px;
}

.btn-remove-bookmark {
  background: var(--accent-rose-light);
  border: 1px solid rgba(225, 29, 72, 0.2);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn-remove-bookmark:hover {
  background: var(--accent-rose);
  color: #FFFFFF;
  transform: scale(1.05);
}
</style>
