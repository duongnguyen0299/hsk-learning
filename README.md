# Học HSK — Trang tự học tiếng Trung HSK 1–3

Trang web tĩnh (HTML/CSS/JS thuần, không cần build) giúp tự học từ vựng
HSK 1–3 với 5 chức năng chính:

- **Bài học** — học theo giáo trình: mỗi bài chia theo chủ đề gồm 3 phần **Từ mới — Hội thoại — Bài tập**, giống cấu trúc sách giáo trình HSK truyền thống. **HSK1 đã hoàn thành 100%** qua **22 bài** (506/506 từ); **HSK2 đã bắt đầu với 3 bài** (Cảm xúc & Liên từ, Công sở & Sự nghiệp, Siêu thị & Mua sắm mở rộng); HSK3 sẽ được bổ sung sau.
- **Chuyên ngành: CNTT & Sản xuất** — mục bài học riêng dành cho công việc thực tế (lập trình viên phần mềm liên quan nhà xưởng sản xuất): họp hành công sở, từ vựng phần mềm cơ bản, từ vựng xưởng sản xuất, và đi sâu vào thuật ngữ lập trình — **Git & quản lý mã nguồn**, **Code Review & Debug**, **Database & API**. Cùng format Từ mới — Hội thoại — Bài tập, ngữ pháp giữ ở mức HSK1 nhưng từ vựng sát chuyên ngành. Hiện có 6 bài.
- **Ngữ âm cơ bản** — kiến thức nền: bảng thanh mẫu, vận mẫu, thanh điệu, có nút nghe phát âm và bảng so sánh các âm dễ nhầm với người Việt. Nên đọc qua trước khi học từ vựng.
- **Lượng từ** — bảng 18 lượng từ (量词) thông dụng nhất theo nhóm ý nghĩa (个/本/张/件/条...), mỗi lượng từ có ví dụ kết hợp với danh từ thật + nút nghe, kèm bài kiểm tra nhanh dạng điền từ.
- **Flashcard** — học và ôn từ vựng, lật thẻ xem nghĩa + câu ví dụ, nghe phát âm, đánh dấu đã thuộc.
- **Trắc nghiệm** — 10 câu hỏi ngẫu nhiên mỗi lượt, chọn nghĩa đúng của từ, có nút nghe phát âm.
- **Gõ Pinyin** — nhìn chữ Hán và nghĩa (có thể nghe phát âm), gõ lại pinyin (không cần gõ dấu thanh điệu, hệ thống tự bỏ dấu khi so khớp).
- **Luyện viết** — đồ theo chữ mẫu trong ô "mễ tự cách" (lưới luyện chữ Hán truyền thống) bằng chuột hoặc cảm ứng, có nút nghe phát âm.
- **Tiến độ** — theo dõi số từ đã thuộc theo từng cấp, chuỗi ngày học liên tiếp, lịch sử trắc nghiệm và gõ pinyin.

Nút loa 🔊 dùng Web Speech API có sẵn trong trình duyệt (không cần file âm
thanh, không tốn dung lượng). Chất lượng giọng đọc phụ thuộc vào hệ điều
hành/trình duyệt của bạn — hầu hết máy Windows, Mac, Chrome đều có sẵn giọng
tiếng Trung (zh-CN). Nếu trình duyệt không có giọng tiếng Trung, âm thanh có
thể không chuẩn hoặc không phát được.

Toàn bộ tiến độ học được lưu trong `localStorage` của trình duyệt — **không
cần tài khoản, không cần backend**. Vì vậy dữ liệu chỉ tồn tại trên đúng
trình duyệt/thiết bị bạn đã học, và sẽ mất nếu bạn xoá dữ liệu duyệt web.

## 📚 Nguồn dữ liệu từ vựng

Từ vựng (`data/vocab.json`, ~2200 từ HSK 1–3 theo khung HSK 3.0 mới) được
tổng hợp từ bộ dữ liệu mở [complete-hsk-vocabulary](https://github.com/drkameleon/complete-hsk-vocabulary)
(dựa trên CC-CEDICT, giấy phép MIT), sau đó **dịch sang tiếng Việt** (nghĩa +
câu ví dụ). Câu ví dụ hiện có đầy đủ cho HSK1; HSK2/HSK3 đang được bổ sung
dần — từ chưa có câu ví dụ vẫn hiển thị bình thường, chỉ ẩn phần ví dụ đi.
Mỗi từ có cấu trúc:
```json
{"hanzi": "爱", "pinyin": "ài", "meaning": "yêu; yêu thích", "pos": "v",
 "example": {"cn": "我爱我的家人。", "py": "Wǒ ài wǒ de jiārén.", "vi": "Tôi yêu gia đình của mình."}}
```

## 🖥️ Chạy thử trên máy (tự học)

Không cần cài gì thêm ngoài một trình duyệt. Vì trang dùng `fetch()` để tải
`data/vocab.json`, bạn cần mở qua một local server nhỏ (mở trực tiếp file
`index.html` bằng `file://` sẽ bị chặn bởi CORS ở một số trình duyệt):

```bash
cd hsk-app
python3 -m http.server 8000
# rồi mở http://localhost:8000
```

Hoặc dùng extension "Live Server" của VS Code.

## 🚀 Deploy lên GitHub Pages để chia sẻ

1. Tạo repo mới trên GitHub, ví dụ `hoc-hsk`.
2. Đẩy toàn bộ nội dung thư mục này lên nhánh `main`:
   ```bash
   git init
   git add .
   git commit -m "Khởi tạo trang tự học HSK"
   git branch -M main
   git remote add origin https://github.com/<username>/hoc-hsk.git
   git push -u origin main
   ```
3. Vào **Settings → Pages** trên GitHub, chọn **Source: Deploy from a
   branch**, branch `main`, thư mục `/ (root)`, rồi **Save**.
4. Sau 1–2 phút, trang sẽ có tại:
   `https://<username>.github.io/hoc-hsk/`

Vì đây là site tĩnh 100% (không build step), không cần GitHub Actions hay
cấu hình gì thêm.

## 🗂️ Cấu trúc dự án

```
hsk-app/
├── index.html          Trang chủ / dashboard
├── phonetics.html       Ngữ âm cơ bản (thanh mẫu, vận mẫu, thanh điệu)
├── measures.html        Lượng từ (量词)
├── lessons.html         Danh sách bài học theo giáo trình
├── lesson.html          Chi tiết 1 bài học (Từ mới / Hội thoại / Bài tập)
├── flashcards.html      Flashcard
├── quiz.html            Trắc nghiệm
├── pinyin.html          Gõ Pinyin
├── writing.html         Luyện viết
├── progress.html        Tiến độ
├── css/style.css        Toàn bộ style (design token, layout, component)
├── js/
│   ├── nav.js            Menu điều hướng dùng chung — SỬA MENU Ở ĐÂY DUY NHẤT
│   └── app.js            Logic dùng chung: đọc vocab, lưu tiến độ (localStorage)
└── data/
    ├── vocab.json        Dữ liệu từ vựng HSK 1–3 (tiếng Việt + câu ví dụ)
    └── lessons.json       Dữ liệu các bài học theo giáo trình
```

## ✏️ Mở rộng thêm

- Thêm phát âm thật: có thể tích hợp Web Speech API (`speechSynthesis`) để
  đọc từ, hoặc nhúng file âm thanh cho từng từ trong `data/vocab.json`.
- Thêm HSK 4–6: lặp lại bước tải dữ liệu từ `complete-hsk-vocabulary` cho
  các cấp cao hơn và gộp vào `vocab.json`.
- Bổ sung câu ví dụ cho HSK2/HSK3: thêm trường `example` cho từng từ theo
  đúng cấu trúc ở trên.
- Thêm bài học chuyên ngành khác: trong `data/lessons.json`, tạo lesson mới
  với `"level"` là tên mục tuỳ ý (khác `hsk1/hsk2/hsk3`) và `"vocab"` là mảng
  object `{hanzi, pinyin, meaning, pos, level}` thay vì mảng chuỗi hanzi —
  ứng dụng tự nhận diện và không cần từ đó có sẵn trong `vocab.json`.
- Sửa/thêm/bớt mục menu: chỉ cần sửa mảng `NAV_ITEMS` trong `js/nav.js` —
  toàn bộ 10 trang sẽ tự cập nhật theo vì menu được sinh động từ file này
  (không còn phải sửa từng trang HTML riêng lẻ nữa). Mỗi trang chỉ cần có
  `<aside class="sidebar" id="sidebarSlot"></aside>` và
  `<nav class="bottom-nav" id="bottomNavSlot"></nav>`, cùng thẻ
  `<script src="js/nav.js"></script>` đặt trước `js/app.js`. Muốn đổi dòng
  gợi ý riêng ở chân menu của từng trang, sửa thuộc tính `data-navhint`
  trên thẻ `<body>` của trang đó.
