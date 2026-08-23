/* ============================================================
   HỌC HSK — logic dùng chung cho toàn bộ trang
   Không phụ thuộc framework, dữ liệu tiến độ lưu ở localStorage
   nên hoạt động hoàn toàn offline sau khi tải trang lần đầu.
   ============================================================ */

const STORAGE_KEY = 'hsk_progress_v1';
const LEVELS = ['hsk1', 'hsk2', 'hsk3'];
const LEVEL_LABEL = { hsk1: 'HSK 1', hsk2: 'HSK 2', hsk3: 'HSK 3', congviec: 'Chuyên ngành' };

/* ---------------- Vocab loading ---------------- */
let _vocabCache = null;
async function loadVocab() {
  if (_vocabCache) return _vocabCache;
  const res = await fetch('data/vocab.json');
  _vocabCache = await res.json();
  return _vocabCache;
}

function allWords(vocab) {
  return LEVELS.flatMap(l => vocab[l].map(w => ({ ...w, level: l })));
}

/* ---------------- Bài học: hỗ trợ từ vựng nội tuyến ----------------
   Bài học HSK tham chiếu từ vựng có sẵn trong vocab.json bằng chuỗi hanzi.
   Bài học chuyên ngành (vd "Chuyên ngành: CNTT & Sản xuất") mang theo từ
   vựng riêng dạng object {hanzi, pinyin, meaning, pos, level} ngay trong
   lessons.json vì các từ này không thuộc bộ HSK1-3. Hai hàm dưới đây giúp
   phần còn lại của ứng dụng xử lý đồng nhất cả hai trường hợp. */
function resolveLessonVocab(lesson, vocab) {
  return lesson.vocab
    .map(item => (typeof item === 'string' ? allWords(vocab).find(w => w.hanzi === item) : item))
    .filter(Boolean);
}

function lessonHanziList(lesson) {
  return lesson.vocab.map(item => (typeof item === 'string' ? item : item.hanzi));
}

/* ---------------- Progress store ---------------- */
function defaultProgress() {
  return {
    known: {},                 // { "爱": true }
    writing: {},                // { "爱": timesPracticed }
    quiz: { attempts: 0, correct: 0, history: [] }, // history: [{date, level, score, total}]
    pinyin: { attempts: 0, correct: 0, history: [] }, // history: [{date, level, score, total}]
    streak: { count: 0, lastDate: null },
  };
}

function getProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    return { ...defaultProgress(), ...parsed };
  } catch (e) {
    return defaultProgress();
  }
}

function saveProgress(p) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function touchStreak() {
  const p = getProgress();
  const today = todayStr();
  if (p.streak.lastDate === today) return p;
  const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (p.streak.lastDate === yest) {
    p.streak.count += 1;
  } else {
    p.streak.count = 1;
  }
  p.streak.lastDate = today;
  saveProgress(p);
  return p;
}

function markKnown(hanzi, known) {
  const p = getProgress();
  if (known) p.known[hanzi] = true;
  else delete p.known[hanzi];
  saveProgress(p);
  touchStreak();
  return p;
}

function recordWriting(hanzi) {
  const p = getProgress();
  p.writing[hanzi] = (p.writing[hanzi] || 0) + 1;
  saveProgress(p);
  touchStreak();
  return p;
}

function recordPinyinResult(level, score, total) {
  const p = getProgress();
  p.pinyin.attempts += total;
  p.pinyin.correct += score;
  p.pinyin.history.unshift({ date: todayStr(), level, score, total });
  p.pinyin.history = p.pinyin.history.slice(0, 30);
  saveProgress(p);
  touchStreak();
  return p;
}

function recordQuizResult(level, score, total) {
  const p = getProgress();
  p.quiz.attempts += total;
  p.quiz.correct += score;
  p.quiz.history.unshift({ date: todayStr(), level, score, total });
  p.quiz.history = p.quiz.history.slice(0, 30);
  saveProgress(p);
  touchStreak();
  return p;
}

function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

function levelStats(vocab, level) {
  const p = getProgress();
  const words = vocab[level];
  const knownCount = words.filter(w => p.known[w.hanzi]).length;
  return { total: words.length, known: knownCount, pct: words.length ? Math.round((knownCount / words.length) * 100) : 0 };
}

/* ---------------- Text-to-speech (phát âm) ---------------- */
let _voicesReady = false;
if ('speechSynthesis' in window) {
  // một số trình duyệt tải danh sách giọng đọc bất đồng bộ
  window.speechSynthesis.onvoiceschanged = () => { _voicesReady = true; };
}

function pickChineseVoice() {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find(v => v.lang === 'zh-CN')
      || voices.find(v => v.lang && v.lang.toLowerCase().startsWith('zh'))
      || null;
}

function speakChinese(text, rate = 0.85) {
  if (!('speechSynthesis' in window)) {
    toast('Trình duyệt này không hỗ trợ phát âm');
    return;
  }
  window.speechSynthesis.cancel(); // dừng câu đang đọc dở (nếu có)
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'zh-CN';
  utter.rate = rate;
  const voice = pickChineseVoice();
  if (voice) utter.voice = voice;
  window.speechSynthesis.speak(utter);
}

/* ---------------- Pinyin helpers ---------------- */
// Bỏ dấu thanh điệu để so sánh khi chấm bài gõ pinyin (chấp nhận gõ không dấu)
function normalizePinyin(s) {
  if (!s) return '';
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // bỏ dấu thanh
    .replace(/ü/g, 'v').replace(/ǚ|ǘ|ǜ|ǖ/g, 'v')
    .replace(/[^a-z0-9]/g, ''); // bỏ khoảng trắng, dấu câu
}

function checkPinyinAnswer(userInput, correctPinyin) {
  return normalizePinyin(userInput) === normalizePinyin(correctPinyin);
}

/* ---------------- Utilities ---------------- */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr, n) {
  return shuffle(arr).slice(0, n);
}

function shortMeaning(m, maxLen = 46) {
  if (!m) return '';
  const first = m.split(';')[0].trim();
  if (first.length <= maxLen) return capitalize(first);
  return capitalize(first.slice(0, maxLen - 1).trim() + '…');
}
function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/* ---------------- Toast ---------------- */
let _toastTimer = null;
function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

/* ---------------- Nav highlight ---------------- */
function highlightNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll(`.nav a[data-page], .bottom-nav a[data-page]`).forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  highlightNav();
  touchStreak();
});
