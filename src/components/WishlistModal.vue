<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content oxy-wishlist-box">
      <div class="modal-header-oxy">
        <div class="wishlist-title-group">
          <span class="wishlist-pretitle">AGENDA PRIBADI PELARI</span>
          <h2 class="wishlist-title">TARGET RACE SAYA ({{ bookmarks.length }})</h2>
        </div>
        <button class="btn-close-oxy" @click="$emit('close')" aria-label="Tutup">✕</button>
      </div>

      <div class="modal-body-oxy">
        <div v-if="!bookmarks || bookmarks.length === 0" class="empty-state-oxy">
          <div class="empty-icon-box">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3 class="empty-title">BELUM ADA TARGET RACE TERSIMPAN</h3>
          <p class="empty-desc">
            Klik ikon Target Race (bintang/bookmark) pada kartu perlombaan untuk menandai lomba impian yang ingin Anda ikuti.
          </p>
        </div>

        <div v-else class="bookmarks-list">
          <div
            v-for="item in bookmarks"
            :key="item.detail_url"
            class="bookmark-item-oxy"
          >
            <div class="bookmark-info" @click="$emit('select-event', item)">
              <div class="bookmark-meta-row">
                <span class="bookmark-date">{{ item.date_text }}</span>
                <span class="bookmark-cat-badge">{{ item.category || 'Event' }}</span>
              </div>
              <h4 class="bookmark-race-title">{{ item.title }}</h4>
              <span class="bookmark-loc">📍 {{ item.location }}</span>
            </div>

            <div class="bookmark-actions">
              <button
                class="btn-detail-link"
                @click="$emit('select-event', item)"
                title="Lihat Rincian"
              >
                DETAIL ↗
              </button>
              <button
                class="btn-remove-oxy"
                @click="$emit('remove-bookmark', item)"
                title="Hapus dari Target Race"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
.oxy-wishlist-box {
  background-color: #FFFFFF;
  border-top: 4px solid var(--oxy-orange);
  border-radius: 0px;
  max-width: 680px;
  width: 100%;
}

.modal-header-oxy {
  background-color: var(--oxy-navy);
  padding: 20px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.wishlist-title-group {
  display: flex;
  flex-direction: column;
}

.wishlist-pretitle {
  font-family: var(--font-heading);
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--oxy-orange);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.wishlist-title {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: 800;
  color: #FFFFFF;
  letter-spacing: 0.04em;
  margin-top: 2px;
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

.modal-body-oxy {
  padding: 28px;
  max-height: 70vh;
  overflow-y: auto;
}

.empty-state-oxy {
  text-align: center;
  padding: 48px 20px;
}

.empty-icon-box {
  width: 70px;
  height: 70px;
  margin: 0 auto 16px;
  background-color: #FFF0EB;
  color: var(--oxy-orange);
  border: 2px dashed var(--oxy-orange);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--oxy-navy);
  margin-bottom: 6px;
}

.empty-desc {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-body);
  max-width: 420px;
  margin: 0 auto;
  line-height: 1.5;
}

.bookmarks-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.bookmark-item-oxy {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #F8FAFD;
  border: 1px solid var(--border-color);
  border-left: 4px solid var(--oxy-orange);
  transition: var(--transition-fast);
}

.bookmark-item-oxy:hover {
  background: #FFFFFF;
  box-shadow: 0 6px 18px rgba(0, 34, 90, 0.08);
  border-color: var(--oxy-navy);
  border-left-color: var(--oxy-orange);
}

.bookmark-info {
  flex: 1;
  cursor: pointer;
}

.bookmark-meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.bookmark-date {
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--oxy-orange);
  letter-spacing: 0.04em;
}

.bookmark-cat-badge {
  background-color: var(--oxy-navy);
  color: #FFFFFF;
  font-family: var(--font-heading);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 1px 8px;
  text-transform: uppercase;
}

.bookmark-race-title {
  font-family: var(--font-heading);
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--oxy-navy);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.bookmark-info:hover .bookmark-race-title {
  color: var(--oxy-orange);
}

.bookmark-loc {
  font-size: 0.86rem;
  color: var(--text-body);
  display: block;
}

.bookmark-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 16px;
}

.btn-detail-link {
  font-family: var(--font-heading);
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--oxy-navy);
  letter-spacing: 0.06em;
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  background: #FFFFFF;
  transition: var(--transition-fast);
}

.btn-detail-link:hover {
  background: var(--oxy-navy);
  color: #FFFFFF;
  border-color: var(--oxy-navy);
}

.btn-remove-oxy {
  background: #FFF0EB;
  border: 1px solid rgba(255, 94, 19, 0.3);
  color: var(--oxy-orange);
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0px;
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn-remove-oxy:hover {
  background: var(--oxy-orange);
  color: #FFFFFF;
}
</style>
