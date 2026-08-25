/* ============================================================
   HỌC HSK — Menu điều hướng dùng chung
   Đây là NƠI DUY NHẤT cần sửa khi muốn thêm/bớt/đổi thứ tự mục menu.
   Mỗi trang HTML chỉ cần có sẵn hai chỗ trống:
     <aside class="sidebar" id="sidebarSlot"></aside>
     <nav class="bottom-nav" id="bottomNavSlot"></nav>
   và nạp file này TRƯỚC js/app.js. Script tự điền nội dung menu và tự
   đánh dấu mục đang active dựa vào data-page trên thẻ <body>.
   ============================================================ */

const NAV_ITEMS = [
  { href: 'index.html', page: 'home', icon: '🏠', label: 'Trang chủ' },
  { href: 'lessons.html', page: 'lessons', icon: '📚', label: 'Bài học' },
  { href: 'flashcards.html', page: 'flashcards', icon: '🗂️', label: 'Flashcard' },
  { href: 'quiz.html', page: 'quiz', icon: '❓', label: 'Trắc nghiệm' },
  { href: 'pinyin.html', page: 'pinyin', icon: '⌨️', label: 'Gõ Pinyin', short: 'Pinyin' },
  { href: 'writing.html', page: 'writing', icon: '✏️', label: 'Luyện viết' },
  { href: 'progress.html', page: 'progress', icon: '📊', label: 'Tiến độ' },
  { href: 'phonetics.html', page: 'phonetics', icon: '🔊', label: 'Ngữ âm cơ bản', short: 'Ngữ âm' },
  { href: 'measures.html', page: 'measures', icon: '🔢', label: 'Lượng từ' },
];

const DEFAULT_NAV_HINT = 'Dữ liệu lưu ngay trên trình duyệt của bạn — không cần tài khoản, không cần internet sau khi đã tải trang.';

function renderNav() {
  const currentPage = document.body.dataset.page;
  const hint = document.body.dataset.navhint || DEFAULT_NAV_HINT;

  const sidebarSlot = document.getElementById('sidebarSlot');
  if (sidebarSlot) {
    sidebarSlot.innerHTML = `
      <div class="brand">
        <div class="brand-mark">学</div>
        <div class="brand-text"><strong>Học HSK</strong><span>TỰ HỌC TIẾNG TRUNG</span></div>
      </div>
      <nav class="nav">
        ${NAV_ITEMS.map(item => `<a href="${item.href}" data-page="${item.page}" class="${item.page === currentPage ? 'active' : ''}"><span class="ic">${item.icon}</span> ${item.label}</a>`).join('')}
      </nav>
      <div class="sidebar-foot">${hint}</div>
    `;
  }

  const bottomSlot = document.getElementById('bottomNavSlot');
  if (bottomSlot) {
    bottomSlot.innerHTML = `
      <ul>
        ${NAV_ITEMS.map(item => `<li><a href="${item.href}" data-page="${item.page}" class="${item.page === currentPage ? 'active' : ''}"><span class="ic">${item.icon}</span>${item.short || item.label}</a></li>`).join('')}
      </ul>
    `;
  }
}

renderNav();
