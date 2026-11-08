# PLAN.md — MLN131 Escape Room: Mật Mã Tri Thức

> **Tài liệu lịch sử V1.** Hành trình chính đã được thay bằng Hội đồng phục dựng theo yêu cầu mới của người dùng. Xem `COUNCIL_DESIGN.md` và `README.md` cho thiết kế V2. Các quy định bắt buộc 16 câu tuyến tính, điểm 100 và demo 60–90 giây bên dưới không áp dụng cho V2. Dữ liệu và nguồn được giữ để đối chiếu; script sinh V1 chỉ chạy khi có `--legacy`.

> **Tài liệu triển khai cho coding agent.** Mục tiêu: tự xây dựng **toàn bộ phiên bản đơn giản nhất nhưng hoàn chỉnh và có thể demo/nộp** của web game MLN131 Escape Room. Đây là bản đặc tả để **thực hiện ngay**, không phải danh sách ý tưởng. Ngôn ngữ sản phẩm: **tiếng Việt**.
>
> **Ưu tiên bất biến:** (1) đúng giáo trình và có giải thích sau mỗi câu đố; (2) là Escape Room thật sự, không phải một chuỗi trắc nghiệm; (3) chơi hoàn chỉnh trên desktop và mobile; (4) demo trong lớp chứng minh được người chơi đã học gì.

> **Trạng thái triển khai ngày 04/11/2026:** đã có game local 4 phòng/16 câu, Final, Codex, hints, inventory, save và demo độc lập; đã chạy lint/test/build thành công, gồm 61 bài kiểm thử trong 3 file. Bộ PowerPoint 7 slide đã xuất và qua kiểm tra cấu trúc, bố cục, font, import lại và render từng trang; lệnh tạo lại slide chạy thành công trên Node.js 22.18. Chưa deploy theo lựa chọn bàn giao local. Công cụ điều khiển trình duyệt dừng vì không xác định URL Chrome đủ tin cậy, nên kiểm tra trực tiếp desktop/mobile và ảnh chụp trình duyệt chưa thực hiện; slide dùng artwork xuất từ mã nguồn game. Nguồn: 0 `verified`, 16 `needs-review`, chờ người phụ trách học thuật xác nhận. Xem `README.md` và `CONTENT_SOURCES.md` để biết chi tiết.

---

## 0. Mệnh lệnh thực thi cho coding agent

1. Đọc toàn bộ `plan.md` và kiểm tra những file đã có trong repository trước khi sửa. Nếu repository trống, khởi tạo dự án mới.
2. **Triển khai trọn vẹn** website chạy được, không dừng ở wireframe, scaffold hoặc bản mockup. Tạo tất cả trang, trạng thái, 4 phòng, 16 câu đố, Final Room, Knowledge Codex, Hint System, Save Progress, Mini Demo và ending.
3. Dùng **React + TypeScript + Vite + Tailwind CSS**; chọn các thư viện nhỏ, ổn định, cần thiết. Không dùng backend, đăng nhập, dịch vụ có phí, AI API, multiplayer, bảng xếp hạng online hoặc 3D engine. Không phụ thuộc vào khóa API.
4. Nội dung game phải có trong dữ liệu có cấu trúc và **gắn trang nguồn của giáo trình**. Không tự sáng tác thêm các kết luận học thuật hoặc dựng trích dẫn nguyên văn không kiểm chứng.
5. Thiết kế **scene 2D dạng phòng** với đồ vật có thể nhấp/chạm, vật phẩm/manh mối, khóa cửa, hiệu ứng mở khóa. Không chuyển mọi thử thách thành form câu hỏi ở giữa màn hình.
6. Toàn bộ phần học thuật, nhãn nút, hints, lời giải, hướng dẫn, thông báo lỗi và nội dung kết thúc bằng **tiếng Việt**. Có thể dùng tên phòng tiếng Anh làm phụ đề.
7. Câu đố **không được buộc người chơi đọc trước giáo trình**: mỗi câu có đủ manh mối hoặc sổ tay để suy luận. Sau khi giải, luôn hiển thị lời giải học thuật và nguồn.
8. Sau khi hoàn tất, chạy `npm run lint`, `npm run test`, `npm run build`; sửa lỗi trước khi bàn giao. Nếu công cụ kiểm thử giao diện có sẵn, kiểm tra một lượt desktop và mobile. Tạo `README.md` hướng dẫn chạy và demo, nêu rõ những gì đã làm.
9. Không để nút bấm giả, route trống, chức năng “coming soon”, manh mối không có tác dụng, tài nguyên từ nguồn không rõ bản quyền. Ưu tiên CSS/SVG tự tạo thay vì ảnh nặng.
10. Nếu file giáo trình không có trong môi trường coding agent, vẫn xây dựng từ bộ nội dung đã đặc tả tại §6, nhưng ghi `needs_source_review` cho những câu chưa được người phụ trách học thuật đối chiếu PDF, **không khẳng định đã xác minh nguyên văn**. Tất cả trang nguồn phải hiện cho người chơi.

### Definition of Done — điều kiện bắt buộc

- Có **4 phòng × 4 câu đố = 16 câu**, cộng **1 Final Room**.
- Có đúng **4 nhóm cơ chế cốt lõi**: `classification`, `matching`, `timeline`, `evidence-lock` (có thể tái sử dụng giữa các phòng).
- Phòng có **ít nhất 4 hotspot/đồ vật tương tác**, trạng thái mở/khóa rõ ràng, manh mối thu thập và animation mở cửa.
- Có **Knowledge Codex**, hints theo cấp, kiểm tra đáp án, phản hồi giải thích và trang giáo trình cho **cả 16 câu**.
- Có lưu tiến độ trên máy bằng `localStorage`, khôi phục được sau F5/đóng tab, có nút chơi lại/xóa tiến độ kèm xác nhận.
- Có `/demo` dài khoảng 60–90 giây, tách hoàn toàn khỏi tiến độ chính, và trang `/result` khi phá đảo.
- Không có đường cụt: dù trả lời sai, dùng hint hay bỏ dở, người chơi vẫn có thể hoàn thành 100%.
- Dùng được trên màn hình khoảng **360px** trở lên, chuột, touch và bàn phím; không có lỗi nghiêm trọng ở các luồng chính.
- Có `README.md` và kết quả lint/test/build thành công.

---

## 1. Product brief

**Tên:** MLN131 Escape Room — **Mật Mã Tri Thức**  
**Tagline:** *Giải câu đố. Mở cánh cửa. Hiểu tri thức.*  
**Loại:** Single-player 2D educational escape room chạy trên web.  
**Mục tiêu người học:** từ tình huống và manh mối, khám phá 4 nhóm kiến thức của môn Chủ nghĩa xã hội khoa học.  
**Đối tượng:** người chưa học MLN131 cũng có thể chơi; sinh viên MLN131 có thể dùng để ôn tập.  
**Thời lượng mục tiêu:** 15–20 phút cho toàn game; 60–90 giây cho chế độ demo.  
**Không yêu cầu tài khoản, không cần internet sau khi tài nguyên đã tải (nếu được cache bởi trình duyệt); không hứa offline PWA nếu chưa triển khai.**

### Câu chuyện

Năm 2126 (hư cấu), Thư viện Tri Thức bị khóa vì bốn lõi dữ liệu đã thất lạc. Người chơi là nhà thám hiểm tri thức, lần lượt khám phá **Khởi nguyên**, **Sứ mệnh**, **Chuyển mình** và **Quyền làm chủ**. Mỗi phòng có các vật thể chứa dữ kiện học thuật. Tìm manh mối và giải 4 khóa để thu hồi một **mảnh tri thức**. Đủ 4 mảnh sẽ mở **Phòng Lõi**, ghép bản đồ tri thức và khôi phục thư viện.

**Không định nghĩa 2126, công nghệ tương lai hay mật mã giả tưởng là dữ kiện lịch sử hoặc giáo trình.** Phân biệt rõ phần fictional storyline và phần academic knowledge.

### Các KPI để nhóm tự kiểm tra

- 100% câu đố có **learning objective + correct answer + explanation + textbook page**.
- 100% phòng có hoạt động khám phá đồ vật, không chỉ bấm `Tiếp tục`.
- 100% câu đố có thể giải bằng thao tác chạm trên mobile, không bắt buộc drag thuần túy.
- Không làm mất tiến độ nếu người chơi reload, chuyển route hay trở lại phòng.
- Một người mới chơi có thể hiểu điều phải làm sau ≤30 giây đầu (hướng dẫn ban đầu rõ).

---

## 2. Tài liệu nguồn và quy tắc học thuật

**Nguồn được cung cấp:** `MLN131 - Giao trinh CNXHKH.pdf` — *Giáo trình Chủ nghĩa xã hội khoa học*, Bộ Giáo dục và Đào tạo, NXB Chính trị quốc gia Sự thật, Hà Nội, 2021.

Tệp PDF thực tế trong workspace là **bản scan 273 trang**, có trang bìa và một số trang đầu. Phạm vi nội dung được chọn cho phiên bản game này là:

| Chương | Tên chương | Trang in trên giáo trình | Trang PDF 1-based |
|---|---|---:|---:|
| 1 | Nhập môn chủ nghĩa xã hội khoa học | 11–50 | 8–47 |
| 2 | Sứ mệnh lịch sử của giai cấp công nhân | 51–85 | 48–82 |
| 3 | Chủ nghĩa xã hội và thời kỳ quá độ lên chủ nghĩa xã hội | 86–124 | 83–121 |
| 4 | Dân chủ xã hội chủ nghĩa và Nhà nước xã hội chủ nghĩa | 125–153 (đoạn được cung cấp) | 122–150 |

**Quy đổi:** từ trang in 11 trở đi, `pdfPage = printedPage - 3`. Số trang nguồn hiển thị trong app là **trang in**, không phải chỉ số page của PDF.

**Giới hạn phạm vi game:** phiên bản này chỉ dùng đến trang in 153, khi nội dung Chương 4 vẫn đang tiếp diễn. Tệp PDF 273 trang còn tiếp tục sau đó. **Không giả định** phạm vi 11–153 là toàn bộ Chương 4 hoặc toàn bộ giáo trình môn MLN131. Không mở rộng câu đố ra ngoài phạm vi đã chọn trong đặc tả.

### Quy tắc biên tập nội dung

- Đặt nguồn ở từng panel: `Nguồn: Giáo trình Chủ nghĩa xã hội khoa học (2021), Chương N, tr. X–Y.`; nút `Xem kiến thức` mở panel Codex có giải thích dễ hiểu.
- Dùng **diễn giải ngắn** đúng ý giáo trình; không sao chép nhiều đoạn văn; không sử dụng lời trích nguyên văn trừ khi đã đối chiếu trực tiếp bản scan.
- Phân biệt 3 thành phần: `clue` (manh mối trong game), `explanation` (giải thích học thuật), `fiction` (cốt truyện giả tưởng).
- Mỗi câu đố có `sourceReviewStatus: 'needs-review' | 'verified'`; chỉ người làm nội dung xác nhận `verified` sau khi so với trang PDF thực tế. Dùng dữ liệu mặc định trong plan để triển khai, không bỏ câu đố khi chưa xác nhận.
- Nếu câu đố dùng ví dụ hiện đại (AI, tự động hóa, khu dân cư), viết rõ: `Tình huống minh họa do nhóm xây dựng, không phải ví dụ nguyên văn của giáo trình`.
- Tránh suy luận cực đoan, giản lược sai nội dung lý luận hay biến các vấn đề phức tạp thành nhận định tuyệt đối.

---

## 3. Scope: làm và không làm

### BẮT BUỘC

1. Landing page và intro ngắn có nút bỏ qua.
2. Bản đồ 4 phòng, phòng khóa/mở theo thứ tự 1 → 2 → 3 → 4 → Final.
3. Scene 2D cho mỗi phòng, ít nhất 4 hotspot/đồ vật tương tác.
4. 16 câu đố có nội dung chuẩn và 4 loại cơ chế (`classification`, `matching`, `timeline`, `evidence-lock`).
5. Logic kiểm tra đáp án, lỗi trực quan, gợi ý, popup giải thích, hoàn thành câu đố và mảnh tri thức.
6. Inventory manh mối và Knowledge Codex có thể xem lại.
7. Thanh tiến độ và điểm 0–100 (16 × 5 + Final × 20).
8. Tự động lưu/khôi phục với localStorage, reset có xác nhận.
9. Final Room có thử thách tổng hợp 4 chương, ending và trang kết quả.
10. `/demo` chơi độc lập một puzzle rút gọn, có QR link và hướng dẫn tổ chức demo.
11. Responsive, keyboard/touch accessible, trạng thái loading/empty/error cơ bản.

### KHÔNG LÀM ở bản này

- AI chatbot, xử lý NLP/LLM, sinh câu đố tự động.
- Đăng nhập, cơ sở dữ liệu, hệ thống quản trị CMS, bảng xếp hạng online.
- Multiplayer, real-time voting, tổng hợp kết quả tất cả người dùng theo thời gian thực.
- Unity/Three.js/3D rendering, bản đồ lớn, di chuyển nhân vật, physics engine.
- Đồng tiền ảo, shop, cấp độ, stamina, quảng cáo, đóng góp phí.
- Hàng chục hiệu ứng hạt, video intro dài, nhạc có bản quyền.

---

## 4. User journeys và route

```text
/ (Landing)
 ├─ Bắt đầu → /play (bản đồ)
 ├─ Tiếp tục (nếu có save) → /play
 ├─ Trải nghiệm nhanh → /demo
 └─ Giới thiệu → /about

/play
 ├─ Room 1 unlocked → /room/1
 ├─ Room 2 → /room/2 (khi Room 1 hoàn thành)
 ├─ Room 3 → /room/3 (khi Room 2 hoàn thành)
 ├─ Room 4 → /room/4 (khi Room 3 hoàn thành)
 ├─ Final → /final (khi đủ 16/16 puzzle)
 └─ Sổ tay → /codex

/room/:id
 ├─ Tìm vật thể → mở puzzle modal
 ├─ Nhận manh mối → Inventory
 ├─ Giải đúng → Explanation → mở vật thể kế tiếp
 ├─ 4/4 câu → open door → nhận shard → /play
 └─ Xem Codex bất kỳ lúc nào

/final → ghép 4 mảnh → giải thích tổng hợp → /result
/demo → mini puzzle → feedback + nguồn → Chơi chính / Về trang chủ
/result → điểm, kiến thức đã học, chơi lại, chia sẻ link
```

**Navigation constraints:**

- Truy cập trực tiếp `/room/3` khi chưa mở khóa → hiển thị thông báo thân thiện và nút `/play`, không crash, không cho bypass.
- Truy cập `/final` trước khi đủ 16 câu → tương tự.
- Hoàn thành rồi vẫn được vào phòng cũ, xem codex và câu đố đã giải (read-only hoặc `Chơi lại câu này` không tính điểm lần hai).
- Reload trên bất kỳ route đều hoạt động nhờ SPA fallback của hosting.
- `/demo` không đọc/ghi trạng thái chơi chính và có thể chạy nhiều lần.

---

## 5. Game mechanics và UX rules

### 5.1. Scene Exploration là bắt buộc

Mỗi `RoomScene` gồm:

- **Background:** phông cảnh 2D bằng CSS, SVG hoặc hình được nhóm tạo hợp lệ.
- **4 hotspot:** sách, máy tính, bảng dữ kiện, đồng hồ, cửa khóa... tương ứng 4 puzzles.
- **Đồ vật tương tác:** hover/focus/chạm cho highlight và tooltip ngắn. Vật thể đang khóa hiển thị biểu tượng ổ khóa và hướng dẫn: `Hãy giải câu đố trước để mở`.
- **Inventory:** 3 mảnh manh mối từ puzzles 1–3 của từng phòng; puzzle 4 là khóa cửa dùng thông tin đã thu thập.
- **Doors:** animation mở cửa ngắn (0.5–1.2 giây) sau puzzle 4. Phòng không mở chỉ bằng nút `Tiếp tục`.
- **Feedback:** animation nhẹ khi lấy vật phẩm, mở khóa, sai đáp án; có nút giảm chuyển động.

### 5.2. Thứ tự logic trong mỗi phòng

1. Ban đầu hotspot 1 sáng, hotspot 2–4 hiển thị nhưng có trạng thái khóa nhẹ.
2. Giải puzzle 1 → nhận `clue-room-N-1`, hotspot 2 mở.
3. Giải puzzle 2 → nhận `clue-room-N-2`, hotspot 3 mở.
4. Giải puzzle 3 → nhận `clue-room-N-3`, hotspot 4 mở.
5. Puzzle 4 yêu cầu kiểm chứng kiến thức từ clues; giải đúng → cửa mở + mảnh tri thức chương N.
6. Hoàn thành chương → hiển thị `Bạn vừa học được gì?` gồm 3 gạch đầu dòng ngắn, nút về bản đồ.

Clues phải xuất hiện trong inventory và có thể đọc lại; không tạo cảm giác puzzle 4 có thể giải mà không cần khám phá.

### 5.3. Bốn loại câu đố

| Type | Dạng UI | Kiểm tra | Mobile/keyboard fallback |
|---|---|---|---|
| `classification` | Chọn thẻ → chọn một trong các nhóm | Mỗi thẻ thuộc đúng nhóm | Không bắt buộc kéo thả; nút `Chọn nhóm` |
| `matching` | Ghép thẻ trái – thẻ phải | Toàn bộ cặp khớp đáp án | Bấm/tap hai phía; hỗ trợ Tab/Enter |
| `timeline` | Sắp xếp thẻ sự kiện | Thứ tự hoàn toàn đúng | Nút ↑/↓ cho từng thẻ; drag chỉ là enhancement |
| `evidence-lock` | Chọn các phát biểu được nguồn hỗ trợ, loại phát biểu sai | Tập lựa chọn khớp expected IDs | Checkbox + nút `Kiểm tra khóa`; giải thích phản hồi |

**Quan trọng:** `evidence-lock` không được thiết kế như bốn câu hỏi ABCD tách rời. Nó phải trông như **bảng điều khiển khóa** chứa nhiều tài liệu/statement; người chơi xác định tập chứng cứ chính xác, có hỗ trợ từ clues đã tìm. Khi thành công, máy phát sáng và cửa được mở.

### 5.4. Hints (không phạt điểm)

Mỗi câu đố có 2 hints:

- Hint 1: chỉ hướng quan sát hoặc nhắc người chơi đọc manh mối, **chưa cho đáp án**.
- Hint 2: nhắc định nghĩa hoặc tiêu chí để suy luận, nhưng **không tiết lộ toàn bộ mapping**.

Dùng hint **không trừ điểm**, vì mục tiêu là học tập. Không có game over. Nếu trả lời sai, giữ nguyên lựa chọn hoặc cho sửa mà không reset toàn bộ phòng; hiện thông báo khuyến khích kiểm tra lại dữ kiện.

### 5.5. Scoring

- Puzzle giải xong lần đầu: **5 điểm** × 16 = 80 điểm.
- Final Room hoàn thành: **20 điểm**.
- `score` **tính từ tập ID đã hoàn thành**, không lưu độc lập để tránh điểm nhân đôi khi F5/chơi lại.
- Hiển thị `X/100 tri thức được khôi phục`; không biến thành thi thố tốc độ.
- Thời gian chỉ hiển thị nếu dễ triển khai; không dùng countdown gây áp lực cho người mới học.

---

## 6. Content specification — 16 câu đố có thể triển khai ngay

> **Quy ước:** Các giải thích dưới đây là **diễn giải ngắn dùng để xây câu đố**, phải soát lần cuối với PDF trước khi nộp. `printedPages` là trang in trong sách; agent dùng câu chữ ngắn, thân thiện và tránh sao chép dài. Các “mã khóa”, “tài liệu bị lỗi”, “tủ chứa manh mối” chỉ là trò chơi hư cấu.
>
> Mỗi `puzzle` phải có: `id`, `roomId`, `type`, `hotspotName`, `title`, `learningObjective`, `instruction`, `cards/items`, `correctAnswer`, `hints[2]`, `explanation` (khoảng 80–160 từ dễ hiểu, không ghi điều chưa được xác minh), `source={chapter, printedPages, pdfPages}`, `clueReward` (puzzle 1–3), `sourceReviewStatus`.

### ROOM 1 — THƯ VIỆN KHỞI NGUYÊN

**Chương 1:** Nhập môn chủ nghĩa xã hội khoa học.  
**Mỹ thuật:** thư viện cổ, bàn bản thảo, kệ sách, đồng hồ lịch sử, cánh cửa kim loại.  
**Learning outcome:** người chơi hiểu các tiền đề ra đời, vai trò nhà lý luận và tiến trình phát triển của CNXH khoa học.

#### R1-P1 — Ba giá sách nguồn gốc

- `id: r1-p1`, `type: classification`, `hotspotName: Kệ bản thảo`.
- **Mục tiêu:** phân biệt các nhóm điều kiện và tiền đề cho sự ra đời CNXH khoa học.
- **Chỉ dẫn:** “Các bản thảo bị xáo trộn. Hãy đặt mỗi bản vào đúng giá sách.”
- **Nhóm:** A `Điều kiện kinh tế – xã hội`; B `Tiền đề khoa học tự nhiên`; C `Tiền đề tư tưởng – lý luận`.
- **Thẻ / đáp án:**
  - `r1p1-a1` Sự phát triển của đại công nghiệp → A.
  - `r1p1-a2` Phong trào đấu tranh của giai cấp công nhân → A.
  - `r1p1-b1` Học thuyết tiến hóa → B.
  - `r1p1-b2` Định luật bảo toàn và chuyển hóa năng lượng → B.
  - `r1p1-c1` Triết học cổ điển Đức → C.
  - `r1p1-c2` Kinh tế chính trị học cổ điển Anh → C.
- **Hint 1:** “Có những thẻ nói về xã hội và lao động, những thẻ nói về khoa học tự nhiên, và những thẻ nói về các học thuyết.”
- **Hint 2:** “Hãy đặt đại công nghiệp vào nhóm điều kiện kinh tế – xã hội; tiếp tục suy luận các thẻ còn lại.”
- **Giải thích:** Giáo trình trình bày sự ra đời của CNXH khoa học không phải ngẫu nhiên, mà gắn với sự phát triển của đại công nghiệp, phong trào công nhân và những tiền đề khoa học, tư tưởng – lý luận. Các nhóm tiền đề có chức năng khác nhau, nhưng cùng tạo bối cảnh lịch sử cho sự hình thành lý luận.
- **Nguồn:** Chương 1, tr. **12–16** (PDF **9–13**).
- **Clue:** `clue-r1-1` — `Mảnh bản đồ: Điều kiện`.

#### R1-P2 — Dấu ấn của các nhà lý luận

- `id: r1-p2`, `type: matching`, `hotspotName: Bàn chân dung`.
- **Mục tiêu:** nhận diện đóng góp và vị trí của các nhân vật/trào lưu trong quá trình hình thành, phát triển lý luận.
- **Cặp đúng:**
  - `C. Mác và Ph. Ăngghen` ↔ `Xây dựng những cơ sở lý luận của chủ nghĩa xã hội khoa học`.
  - `V.I. Lênin` ↔ `Vận dụng và phát triển CNXH khoa học trong điều kiện lịch sử mới`.
  - `Những nhà tư tưởng xã hội chủ nghĩa không tưởng – phê phán` ↔ `Đưa ra nhiều phê phán xã hội và dự tưởng tiến bộ nhưng còn những giới hạn lý luận`.
  - `Tuyên ngôn của Đảng Cộng sản` ↔ `Tác phẩm xuất bản năm 1848, đánh dấu mốc quan trọng trong sự hình thành CNXH khoa học`.
- **Hint 1:** “Hãy phân biệt người đặt nền tảng lý luận, người vận dụng và phát triển, tác phẩm, và trào lưu tiền thân.”
- **Hint 2:** “Tuyên ngôn là một tác phẩm, không phải tên một tác giả.”
- **Giải thích:** Giáo trình phân tích đóng góp của C. Mác và Ph. Ăngghen, sự vận dụng phát triển của V.I. Lênin và quan hệ kế thừa – vượt qua những giới hạn của các tư tưởng xã hội chủ nghĩa trước đó. Tuyên ngôn của Đảng Cộng sản năm 1848 là dấu mốc quan trọng.
- **Nguồn:** Chương 1, tr. **15–27** (PDF **12–24**).
- **Clue:** `clue-r1-2` — `Con dấu: Những người đặt nền tảng`.

#### R1-P3 — Đồng hồ lịch sử

- `id: r1-p3`, `type: timeline`, `hotspotName: Đồng hồ thời gian`.
- **Mục tiêu:** xác định thứ tự một số dấu mốc lịch sử được nêu trong giáo trình.
- **Các thẻ cần sắp theo thứ tự tăng dần:**
  1. `1848` — *Tuyên ngôn của Đảng Cộng sản* ra đời.
  2. `1871` — Công xã Paris.
  3. `1917` — Cách mạng Tháng Mười Nga.
  4. `1986` — Việt Nam bắt đầu công cuộc Đổi mới.
- **Hint 1:** “Hãy xếp từ giữa thế kỷ XIX đến cuối thế kỷ XX.”
- **Hint 2:** “Mốc 1848 đứng trước Công xã Paris; Đổi mới 1986 là mốc muộn nhất.”
- **Giải thích:** Các dấu mốc này cho phép người chơi nhìn thấy tiến trình từ sự ra đời lý luận, những sự kiện lịch sử và quá trình vận dụng, phát triển trong những điều kiện cụ thể. Không được suy ra rằng những sự kiện này có cùng ý nghĩa hoặc diễn ra theo một cơ chế đơn tuyến.
- **Nguồn:** Chương 1, tr. **20–35** (PDF **17–32**).
- **Clue:** `clue-r1-3` — `Bánh răng: Dòng thời gian`.

#### R1-P4 — Cánh cửa bản thảo

- `id: r1-p4`, `type: evidence-lock`, `hotspotName: Khóa cửa thư viện`.
- **Mục tiêu:** phân biệt các nhận định được giáo trình hỗ trợ và nhận định sai.
- **Chỉ dẫn:** “Từ 3 manh mối vừa thu thập, kích hoạt đúng những bản ghi đáng tin cậy để mở khóa.”
- **Các statements:**
  - `r1p4-t1` CNXH khoa học ra đời gắn với những điều kiện kinh tế – xã hội và các tiền đề khoa học, lý luận. **ĐÚNG**.
  - `r1p4-t2` *Tuyên ngôn của Đảng Cộng sản* ra đời năm 1848. **ĐÚNG**.
  - `r1p4-t3` V.I. Lênin tiếp tục vận dụng và phát triển CNXH khoa học. **ĐÚNG**.
  - `r1p4-f1` CNXH khoa học không có liên hệ gì với phong trào công nhân. **SAI**.
  - `r1p4-f2` CNXH khoa học chỉ sao chép nguyên vẹn CNXH không tưởng – phê phán. **SAI**.
- `correctAnswer: ['r1p4-t1','r1p4-t2','r1p4-t3']`.
- **Hint 1:** “Đối chiếu nội dung 3 tài liệu đã nhận: nguồn gốc, các nhà lý luận, dòng thời gian.”
- **Hint 2:** “Nhận định dùng các từ ‘không có liên hệ gì’ hoặc ‘chỉ sao chép nguyên vẹn’ cần được kiểm chứng kỹ.”
- **Giải thích:** Các tiền đề khách quan và lý luận, vai trò của C. Mác – Ph. Ăngghen, sự phát triển của V.I. Lênin và dấu mốc 1848 là những phần liên quan của Chương 1. Giáo trình cho thấy sự kế thừa có phê phán, không phải sao chép nguyên vẹn tư tưởng trước đó.
- **Nguồn:** Chương 1, tr. **12–27** (PDF **9–24**).
- **Reward:** mở cửa Room 1 + shard `origin` (`Khởi nguyên`).

### ROOM 2 — NHÀ MÁY SỨ MỆNH

**Chương 2:** Sứ mệnh lịch sử của giai cấp công nhân.  
**Mỹ thuật:** nhà máy điều khiển tự động, băng chuyền, bảng phân tích công việc, bộ điều khiển trung tâm.  
**Learning outcome:** hiểu khái niệm, nội dung sứ mệnh, điều kiện thực hiện và những biến đổi hiện nay.

#### R2-P1 — Hai lăng kính về giai cấp công nhân

- `id: r2-p1`, `type: classification`, `hotspotName: Hồ sơ lao động`.
- **Nhóm:** A `Phương diện kinh tế – xã hội`; B `Phương diện chính trị – xã hội trong CNTB`.
- **Thẻ / đáp án:**
  - `r2p1-a1` Lao động theo phương thức công nghiệp → A.
  - `r2p1-a2` Trực tiếp hoặc gián tiếp vận hành công cụ sản xuất có tính công nghiệp, xã hội hóa → A.
  - `r2p1-b1` Trong CNTB, người công nhân chủ yếu không sở hữu tư liệu sản xuất chủ yếu → B.
  - `r2p1-b2` Trong CNTB, công nhân bán sức lao động và có lợi ích cơ bản đối lập với giai cấp tư sản → B.
- **Hint 1:** “Một nhóm nói về cách người lao động tham gia sản xuất; nhóm kia nói về vị trí trong quan hệ xã hội.”
- **Hint 2:** “Phương thức lao động công nghiệp là dấu hiệu kinh tế – xã hội.”
- **Giải thích:** Giáo trình tiếp cận khái niệm giai cấp công nhân từ hai phương diện: vai trò trong nền sản xuất công nghiệp hiện đại và địa vị chính trị – xã hội trong quan hệ sản xuất tư bản chủ nghĩa. Không được đồng nhất mọi nghề sử dụng máy tính với giai cấp công nhân.
- **Nguồn:** Chương 2, tr. **52–55** (PDF **49–52**).
- **Clue:** `clue-r2-1` — `Hồ sơ: Hai phương diện`.

#### R2-P2 — Ba hệ thống sứ mệnh

- `id: r2-p2`, `type: matching`, `hotspotName: Bảng vận hành`.
- **Mục tiêu:** nối ba nhóm nội dung sứ mệnh lịch sử với nội dung diễn giải phù hợp.
- **Cặp đúng:**
  - `Kinh tế` ↔ `Góp phần phát triển lực lượng sản xuất và cơ sở vật chất cho xã hội mới`.
  - `Chính trị – xã hội` ↔ `Vai trò trong biến đổi chính trị và tổ chức xây dựng xã hội theo lý luận của giáo trình`.
  - `Văn hóa – tư tưởng` ↔ `Xây dựng, phát triển các giá trị và đời sống tinh thần phù hợp mục tiêu xã hội mới`.
- **Hint 1:** “Một nội dung nói về sản xuất; một nội dung nói về quyền lực và tổ chức xã hội; một nội dung nói về giá trị tư tưởng.”
- **Hint 2:** “Văn hóa – tư tưởng không phải là nhiệm vụ xây dựng máy móc.”
- **Giải thích:** Theo Chương 2, nội dung sứ mệnh lịch sử được trình bày trên các mặt kinh tế, chính trị – xã hội và văn hóa – tư tưởng. Sự phân chia giúp người học nhận thấy đây là hệ thống nội dung nhiều chiều, không chỉ là lao động sản xuất.
- **Nguồn:** Chương 2, tr. **57–59** (PDF **54–56**).
- **Clue:** `clue-r2-2` — `Bộ điều khiển: Ba nội dung`.

#### R2-P3 — Cơ chế kích hoạt

- `id: r2-p3`, `type: classification`, `hotspotName: Thiết bị phân tích`.
- **Nhóm:** A `Điều kiện khách quan`; B `Điều kiện chủ quan`.
- **Thẻ / đáp án:**
  - `r2p3-a1` Địa vị kinh tế của giai cấp công nhân → A.
  - `r2p3-a2` Địa vị chính trị – xã hội của giai cấp công nhân → A.
  - `r2p3-b1` Sự phát triển về số lượng và chất lượng của bản thân giai cấp công nhân → B.
  - `r2p3-b2` Vai trò của Đảng Cộng sản trong tổ chức, lãnh đạo → B.
- **Hint 1:** “Khách quan nói về địa vị và điều kiện do cơ cấu xã hội quy định; chủ quan nói về sự phát triển và tổ chức lực lượng.”
- **Hint 2:** “Vai trò của tổ chức lãnh đạo thuộc nhóm điều kiện chủ quan trong giáo trình.”
- **Giải thích:** Giáo trình phân biệt những điều kiện khách quan gắn với địa vị kinh tế, chính trị – xã hội của giai cấp công nhân và những điều kiện chủ quan về sự phát triển của giai cấp, vai trò tổ chức chính trị.
- **Nguồn:** Chương 2, tr. **60–64** (PDF **57–61**).
- **Clue:** `clue-r2-3` — `Mạch điện: Điều kiện thực hiện`.

#### R2-P4 — Khóa nhà máy hiện đại

- `id: r2-p4`, `type: evidence-lock`, `hotspotName: Tủ điều khiển chính`.
- **Mục tiêu:** nhận diện những biến đổi của giai cấp công nhân hiện nay theo giáo trình.
- **Statements:**
  - `r2p4-t1` Xu hướng trí thức hóa của giai cấp công nhân diễn ra nhanh. **ĐÚNG**.
  - `r2p4-t2` Công nghệ hiện đại khiến nhiều công việc công nghiệp yêu cầu kỹ năng và tri thức cao hơn. **ĐÚNG**.
  - `r2p4-t3` Giáo trình có đề cập xu hướng trung lưu hóa của một bộ phận giai cấp công nhân. **ĐÚNG**.
  - `r2p4-f1` Máy móc hiện đại làm cho giai cấp công nhân hoàn toàn biến mất. **SAI**.
  - `r2p4-f2` Công nhân hiện đại chỉ có thể là lao động cơ bắp, không liên quan tri thức. **SAI**.
- `correctAnswer: ['r2p4-t1','r2p4-t2','r2p4-t3']`.
- **Hint 1:** “Quan sát manh mối về phương thức lao động và điều kiện phát triển của giai cấp công nhân.”
- **Hint 2:** “Hai khẳng định phủ nhận hoàn toàn vai trò tri thức và sự tồn tại của công nhân cần được xem lại.”
- **Giải thích:** Giáo trình nhấn mạnh những biến đổi của giai cấp công nhân trong điều kiện khoa học – công nghệ hiện đại, trong đó có xu hướng trí thức hóa và một số biến đổi về cơ cấu, đời sống. Vì vậy không thể đồng nhất giai cấp công nhân với hình ảnh lao động chân tay duy nhất.
- **Nguồn:** Chương 2, tr. **65–68** (PDF **62–65**).
- **Reward:** shard `mission` (`Sứ mệnh`).

### ROOM 3 — PHÒNG THÍ NGHIỆM CHUYỂN MÌNH

**Chương 3:** Chủ nghĩa xã hội và thời kỳ quá độ lên chủ nghĩa xã hội.  
**Mỹ thuật:** phòng thí nghiệm mô hình thành phố, bảng trưng bày các đặc trưng, hai cánh cổng phát triển, lõi dữ liệu.  
**Learning outcome:** nắm các đặc trưng, hai hình thức quá độ và sự đa dạng của thời kỳ quá độ; tránh hiểu sai “bỏ qua chế độ TBCN”.

#### R3-P1 — Bản thiết kế xã hội

- `id: r3-p1`, `type: matching`, `hotspotName: Sa bàn thành phố`.
- **Mục tiêu:** ghép đặc trưng của CNXH với mô tả được nêu trong giáo trình.
- **Cặp đúng:**
  - `Nhân dân lao động làm chủ` ↔ `Đặc trưng về vai trò làm chủ của người lao động trong xã hội`.
  - `Nền kinh tế phát triển cao` ↔ `Dựa trên lực lượng sản xuất hiện đại và chế độ công hữu về tư liệu sản xuất chủ yếu`.
  - `Nền văn hóa phát triển cao` ↔ `Kế thừa, phát huy những giá trị văn hóa dân tộc và tinh hoa nhân loại`.
  - `Bình đẳng, đoàn kết giữa các dân tộc` ↔ `Các dân tộc hợp tác, tôn trọng và giúp đỡ lẫn nhau`.
- **Hint 1:** “Mỗi thẻ đặc trưng nói về một phương diện: chủ thể làm chủ, kinh tế, văn hóa, dân tộc.”
- **Hint 2:** “Lực lượng sản xuất hiện đại là dấu hiệu thuộc phương diện kinh tế.”
- **Giải thích:** Theo lý luận được trình bày ở Chương 3, CNXH có những đặc trưng gắn với quyền làm chủ, nền kinh tế, văn hóa và quan hệ giữa các dân tộc. Đây là một hệ thống đặc trưng, không phải chỉ là một tiêu chí đơn lẻ.
- **Nguồn:** Chương 3, tr. **93–103** (PDF **90–100**).
- **Clue:** `clue-r3-1` — `Mô hình: Những đặc trưng`.

#### R3-P2 — Hai lối chuyển tiếp

- `id: r3-p2`, `type: classification`, `hotspotName: Hai cánh cổng`.
- **Mục tiêu:** phân biệt quá độ trực tiếp và quá độ gián tiếp theo cách phân chia trong giáo trình.
- **Nhóm:** A `Quá độ trực tiếp`; B `Quá độ gián tiếp`.
- **Thẻ / đáp án:**
  - `r3p2-a1` Xuất phát từ chủ nghĩa tư bản đã phát triển ở trình độ cao → A.
  - `r3p2-a2` Hình thức quá độ được giáo trình gắn với các nước đã trải qua CNTB phát triển → A.
  - `r3p2-b1` Xuất phát từ xã hội mà CNTB chưa phát triển cao → B.
  - `r3p2-b2` Có thể cần những bước phát triển và hình thức trung gian thích hợp với điều kiện lịch sử → B.
- **Hint 1:** “Tiêu chí phân biệt nằm ở trình độ phát triển và điểm xuất phát lịch sử.”
- **Hint 2:** “Trực tiếp được mô tả gắn với CNTB phát triển ở trình độ cao.”
- **Giải thích:** Chương 3 phân biệt quá độ trực tiếp và gián tiếp dựa trên điều kiện lịch sử, trình độ phát triển của xã hội xuất phát. Các con đường không thể được trình bày như một lộ trình máy móc giống hệt nhau ở mọi quốc gia.
- **Nguồn:** Chương 3, tr. **104–106** (PDF **101–103**).
- **Clue:** `clue-r3-2` — `Bản đồ: Điểm xuất phát`.

#### R3-P3 — Bốn lĩnh vực chuyển đổi

- `id: r3-p3`, `type: matching`, `hotspotName: Bảng mô phỏng`.
- **Mục tiêu:** liên hệ đặc điểm của thời kỳ quá độ với lĩnh vực tương ứng.
- **Cặp đúng:**
  - `Kinh tế` ↔ `Tồn tại nhiều thành phần kinh tế và hình thức sở hữu trong quá trình chuyển đổi`.
  - `Chính trị` ↔ `Những biến đổi về tổ chức, thiết chế và quan hệ chính trị`.
  - `Tư tưởng – văn hóa` ↔ `Cùng tồn tại các hệ tư tưởng, giá trị và hoạt động xây dựng đời sống văn hóa mới`.
  - `Xã hội` ↔ `Tồn tại nhiều giai cấp, tầng lớp và các quan hệ xã hội đa dạng`.
- **Hint 1:** “Nhìn vào đối tượng chính được nhắc tới: sở hữu, thiết chế, hệ giá trị hay tầng lớp xã hội.”
- **Hint 2:** “Nhiều thành phần kinh tế thuộc lĩnh vực kinh tế.”
- **Giải thích:** Giáo trình mô tả thời kỳ quá độ là giai đoạn tồn tại nhiều đặc điểm đan xen trên các lĩnh vực kinh tế, chính trị, tư tưởng – văn hóa và xã hội. Đây không phải tình trạng mọi yếu tố xã hội cũ lập tức biến mất.
- **Nguồn:** Chương 3, tr. **107–109** (PDF **104–106**).
- **Clue:** `clue-r3-3` — `Bộ dữ liệu: Bốn lĩnh vực`.

#### R3-P4 — Mật mã “bỏ qua”

- `id: r3-p4`, `type: evidence-lock`, `hotspotName: Máy tính trung tâm`.
- **Mục tiêu:** phân biệt đúng – sai trong cách hiểu quan điểm quá độ lên CNXH bỏ qua chế độ TBCN ở Việt Nam theo giáo trình.
- **Statements:**
  - `r3p4-t1` “Bỏ qua” không đồng nghĩa với phủ nhận mọi thành tựu của nhân loại trong CNTB. **ĐÚNG**.
  - `r3p4-t2` Giáo trình nhấn mạnh việc không xác lập vị trí thống trị của quan hệ sản xuất và kiến trúc thượng tầng TBCN. **ĐÚNG**.
  - `r3p4-t3` Có thể tiếp thu, kế thừa những thành tựu khoa học – công nghệ và kinh nghiệm phù hợp. **ĐÚNG**.
  - `r3p4-f1` “Bỏ qua” nghĩa là không sử dụng bất kỳ thành tựu khoa học – công nghệ nào từng có trong CNTB. **SAI**.
  - `r3p4-f2` “Bỏ qua” nghĩa là thời kỳ quá độ không có những hình thức kinh tế, xã hội trung gian. **SAI**.
- `correctAnswer: ['r3p4-t1','r3p4-t2','r3p4-t3']`.
- **Hint 1:** “Đọc lại manh mối từ hai lối chuyển tiếp và bốn lĩnh vực chuyển đổi.”
- **Hint 2:** “Hãy phân biệt ‘bỏ qua chế độ’ với ‘bỏ qua toàn bộ thành tựu’.”
- **Giải thích:** Tr. 110–112 của giáo trình nhấn mạnh rằng “bỏ qua chế độ tư bản chủ nghĩa” không phải phủ nhận mọi thành tựu của chủ nghĩa tư bản; nội dung bao gồm vấn đề vị trí thống trị của quan hệ sản xuất, kiến trúc thượng tầng và việc kế thừa thành tựu phù hợp. Câu đố không được tự mở rộng thành một kết luận chính sách nằm ngoài phạm vi nguồn.
- **Nguồn:** Chương 3, tr. **110–112** (PDF **107–109**).
- **Reward:** shard `transition` (`Chuyển mình`).

### ROOM 4 — HỘI TRƯỜNG QUYỀN LÀM CHỦ

**Chương 4:** Dân chủ xã hội chủ nghĩa và Nhà nước xã hội chủ nghĩa.  
**Mỹ thuật:** hội trường, bục phát biểu, khu trưng bày văn bản, bàn mô phỏng tham gia ý kiến, cánh cửa trung tâm.  
**Learning outcome:** hiểu khái niệm dân chủ theo nhiều phương diện, hình thức tham gia và mối quan hệ giữa dân chủ với nhà nước theo giáo trình.

#### R4-P1 — Ba mặt của dân chủ

- `id: r4-p1`, `type: matching`, `hotspotName: Bức tường khái niệm`.
- **Mục tiêu:** nối ba phương diện mà giáo trình dùng để diễn giải dân chủ.
- **Cặp đúng:**
  - `Phương diện quyền lực` ↔ `Quyền lực thuộc về nhân dân`.
  - `Phương diện chế độ xã hội / chính trị` ↔ `Một hình thức tổ chức thực thi quyền lực trong xã hội`.
  - `Phương diện nguyên tắc tổ chức và quản lý` ↔ `Nguyên tắc dân chủ được vận dụng vào tổ chức, quản lý xã hội`.
- **Hint 1:** “Đây là ba góc nhìn của cùng một khái niệm, không phải ba khái niệm đối lập.”
- **Hint 2:** “Câu nói ‘quyền lực thuộc về nhân dân’ ứng với phương diện quyền lực.”
- **Giải thích:** Giáo trình giới thiệu dân chủ không chỉ như một từ đồng nghĩa với bỏ phiếu, mà còn xét đến quyền lực, chế độ xã hội và phương diện nguyên tắc tổ chức, quản lý. Việc phân biệt giúp người chơi tránh cách hiểu một chiều.
- **Nguồn:** Chương 4, tr. **126–127** (PDF **123–124**).
- **Clue:** `clue-r4-1` — `Biểu tượng: Ba phương diện`.

#### R4-P2 — Ai là người tham gia quyết định?

- `id: r4-p2`, `type: classification`, `hotspotName: Bàn biểu quyết`.
- **Mục tiêu:** phân biệt hình thức dân chủ trực tiếp và gián tiếp qua tình huống minh họa.
- **Nhóm:** A `Dân chủ trực tiếp`; B `Dân chủ gián tiếp / đại diện`.
- **Thẻ / đáp án:**
  - `r4p2-a1` Người dân trực tiếp tham gia biểu quyết một vấn đề thuộc thẩm quyền và quy trình cho phép → A.
  - `r4p2-a2` Người dân trực tiếp tham gia quyết định theo hình thức trưng cầu ý dân được tổ chức hợp lệ → A.
  - `r4p2-b1` Người dân lựa chọn đại biểu để đại diện mình thực hiện chức năng theo quy định → B.
  - `r4p2-b2` Đại biểu được bầu tham gia quyết định công việc trong phạm vi thẩm quyền của cơ quan đại diện → B.
- **Hint 1:** “Xét xem người dân trực tiếp thực hiện quyền hay thông qua người đại diện.”
- **Hint 2:** “Có yếu tố bầu đại biểu đại diện thực hiện nhiệm vụ → cân nhắc nhóm gián tiếp.”
- **Giải thích:** Trang 153 giới thiệu hình thức dân chủ trực tiếp và dân chủ gián tiếp, trong đó dân chủ gián tiếp được thực hiện qua những người đại diện được lựa chọn, còn dân chủ trực tiếp nhấn mạnh sự tham gia trực tiếp của người dân. Tình huống minh họa là do nhóm xây dựng, không phải ví dụ nguyên văn của sách; lưu ý thẩm quyền và pháp luật khi diễn giải.
- **Nguồn:** Chương 4, tr. **153** (PDF **150**).
- **Clue:** `clue-r4-2` — `Thẻ: Hình thức thực hiện dân chủ`.

#### R4-P3 — Bản đồ chức năng Nhà nước

- `id: r4-p3`, `type: matching`, `hotspotName: Tủ hồ sơ nhà nước`.
- **Mục tiêu:** hiểu cách giáo trình phân chia chức năng Nhà nước XHCN theo những tiêu chí khác nhau.
- **Cặp đúng:**
  - `Theo phạm vi tác động: đối nội` ↔ `Chức năng liên quan tổ chức, quản lý công việc trong nước`.
  - `Theo phạm vi tác động: đối ngoại` ↔ `Chức năng trong các quan hệ, hoạt động đối ngoại`.
  - `Theo lĩnh vực` ↔ `Các chức năng chính trị, kinh tế, văn hóa, xã hội`.
  - `Theo tính chất quyền lực` ↔ `Chức năng tổ chức xây dựng và chức năng trấn áp theo cách trình bày của giáo trình`.
- **Hint 1:** “Có những cách phân chia theo phạm vi, theo lĩnh vực và theo tính chất.”
- **Hint 2:** “Đối nội/đối ngoại thuộc tiêu chí phạm vi tác động.”
- **Giải thích:** Giáo trình phân chia chức năng Nhà nước XHCN theo nhiều tiêu chí. Mỗi cách phân chia trả lời một câu hỏi khác nhau: hoạt động trong hay ngoài nước, lĩnh vực nào, hoặc tính chất của việc thực hiện quyền lực. Không nên xem những nhóm phân loại này là các chức năng hoàn toàn tách biệt.
- **Nguồn:** Chương 4, tr. **144–145** (PDF **141–142**).
- **Clue:** `clue-r4-3` — `Hồ sơ: Chức năng nhà nước`.

#### R4-P4 — Khóa nền tảng dân chủ

- `id: r4-p4`, `type: evidence-lock`, `hotspotName: Cửa hội trường`.
- **Mục tiêu:** xác định những nhận định phù hợp về quan hệ giữa dân chủ XHCN và Nhà nước XHCN.
- **Statements:**
  - `r4p4-t1` Dân chủ XHCN được giáo trình trình bày như cơ sở, nền tảng của việc xây dựng và hoạt động Nhà nước XHCN. **ĐÚNG**.
  - `r4p4-t2` Nhà nước XHCN được trình bày như công cụ quan trọng để thực hiện quyền làm chủ của nhân dân. **ĐÚNG**.
  - `r4p4-t3` Thực hiện dân chủ cần gắn với việc thể chế hóa, bảo đảm và thực thi quyền trong thực tế. **ĐÚNG**.
  - `r4p4-f1` Chỉ cần nói tới dân chủ là không còn cần thiết chế hay cơ chế thực hiện. **SAI**.
  - `r4p4-f2` Có cơ quan đại diện nghĩa là người dân không có hình thức tham gia trực tiếp nào. **SAI**.
- `correctAnswer: ['r4p4-t1','r4p4-t2','r4p4-t3']`.
- **Hint 1:** “Đọc lại bản đồ chức năng nhà nước và manh mối về hình thức dân chủ.”
- **Hint 2:** “Giáo trình trình bày mối quan hệ hỗ trợ qua lại giữa dân chủ và nhà nước.”
- **Giải thích:** Chương 4 nêu dân chủ XHCN là nền tảng cho việc xây dựng, hoạt động của Nhà nước XHCN; đồng thời nhà nước giữ vai trò tổ chức, thể chế hóa và thực thi quyền làm chủ của nhân dân. Hai hình thức dân chủ trực tiếp/gián tiếp không loại trừ nhau chỉ vì tồn tại thiết chế đại diện.
- **Nguồn:** Chương 4, tr. **147–148, 153** (PDF **144–145, 150**).
- **Reward:** shard `democracy` (`Quyền làm chủ`).

### FINAL — PHÒNG LÕI TRI THỨC

- `id: final-knowledge-core` (không tính vào 16 puzzle), mở khi tất cả `r1-p1...r4-p4` hoàn thành.
- **Giao diện:** bốn pedestal/ổ cắm tượng trưng cho 4 shard; kéo thả hoặc chọn shard → slot. Sau khi đặt đủ, một bảng tri thức hiện ra.
- **Bài toán tổng hợp:** ghép **4 shard** với **4 ý chính**, không suy diễn rằng bốn ý có quan hệ nhân quả đơn tuyến:
  - `origin` ↔ `Sự hình thành và phát triển của chủ nghĩa xã hội khoa học`.
  - `mission` ↔ `Sứ mệnh lịch sử của giai cấp công nhân`.
  - `transition` ↔ `Chủ nghĩa xã hội và thời kỳ quá độ`.
  - `democracy` ↔ `Dân chủ xã hội chủ nghĩa và Nhà nước xã hội chủ nghĩa`.
- **Sau khi ghép đúng:** hiển thị một đoạn tổng hợp: “Bốn phòng giúp người chơi lần lượt khám phá: cơ sở ra đời của lý luận; nội dung liên quan giai cấp công nhân; đặc trưng và thời kỳ quá độ; vấn đề dân chủ và Nhà nước XHCN theo giáo trình. Đây là bốn mảng tri thức có liên hệ, cần được hiểu trong bối cảnh cụ thể.”
- **Nguồn:** Chương 1–4, tr. 11–153 (đúng phạm vi đã cung cấp).
- **Reward:** `finalCompleted: true`, +20 điểm, ending “Thư viện đã được khôi phục”, nút `Xem kết quả`.
- **Fallback mobile:** có thể tap shard rồi tap slot, không bắt buộc drag.

---

## 7. Knowledge Codex — trọng tâm chấm điểm nội dung

**Không được xem là tính năng phụ.** Mỗi câu đố sau khi giải đúng **bắt buộc** mở `KnowledgeFeedbackModal`:

```text
[ĐÃ GIẢI MẬT MÃ]

Kiến thức: <tên khái niệm>

Vì sao đúng?
<giải thích 80–160 từ bằng tiếng Việt, bám nguồn>

Điểm cần nhớ:
• <ý 1>
• <ý 2>

Nguồn:
Giáo trình Chủ nghĩa xã hội khoa học (2021),
Chương <n>, tr. <x–y>.

[Thêm vào Sổ tay]   [Tiếp tục khám phá]
```

`KnowledgeCodex`:

- Tab/nhóm theo 4 chương, danh sách theo puzzle ID.
- Khi chưa giải puzzle: chỉ hiển thị tiêu đề/mục tiêu và khóa giải thích chi tiết để tránh spoil quá sớm.
- Khi giải xong: hiển thị định nghĩa/nguyên lý ở mức vừa đủ, đáp án, diễn giải dễ hiểu, nguồn trích theo trang, ví dụ minh họa (nếu có thì đánh dấu là ví dụ minh họa).
- Có thể truy cập từ `/codex` và qua nút Sổ tay trên HUD; không làm mất trạng thái trong puzzle đang mở.
- Không yêu cầu đưa toàn bộ PDF lên website, tránh vấn đề bản quyền và dung lượng. Có thể liệt kê tài liệu tham khảo và trang in.
- Nội dung `knowledge.ts`/`puzzles.ts` phải được review dễ dàng, không hardcode trong JSX.

---

## 8. Màn hình và bố cục

### 8.1. Routes

| Route | Nội dung | Acceptance |
|---|---|---|
| `/` | Hero, premise, 4 biểu tượng phòng, Start/Continue/Demo, hướng dẫn | CTA hoạt động |
| `/play` | Sơ đồ 4 phòng + Final, trạng thái lock/unlock, 0–100 điểm | Không bypass phòng khóa |
| `/room/:id` | Scene có 4 hotspot, HUD, inventory, puzzle modal, hints | 4 puzzle thực sự chơi được |
| `/codex` | Sổ tay theo chương | Có đủ kiến thức đã mở |
| `/final` | Ghép 4 shard vào bốn vị trí + ending | Chỉ mở khi 16/16 |
| `/result` | Tiến độ, điểm, recap, nguồn tham khảo, chơi lại | Reload vẫn hiện kết quả |
| `/demo` | Mini Challenge riêng, 1 câu đố, feedback nguồn | Không ảnh hưởng save chính |
| `/about` | Mục tiêu, cách sử dụng, nguồn giáo trình, ghi chú giả tưởng | Không có placeholder |
| `*` | 404 có nút về trang chủ | Không trang trắng |

### 8.2. Design system — tối giản nhưng có bản sắc

- **Visual direction:** cinematic 2D book-adventure; không dùng bố cục dashboard công sở.
- **Colors:** `#10182B` background; `#263B55` panel; `#D9B56E` accent; `#53CFB5` solved; `#F3EBDC` text.
- **Room themes:** Room1 vàng thư viện cổ, Room2 xanh thép, Room3 cyan tương lai, Room4 tím hội trường; chung layout để không tăng chi phí code.
- **Font:** system stack hỗ trợ tiếng Việt, có thể dùng `Inter` nếu thuận tiện; không phụ thuộc tải font ngoài để website hiển thị đúng.
- **Layout Desktop:** top HUD (header/progress), scene chiếm phần chính, inventory dưới, puzzle trong modal bên phải hoặc centered overlay.
- **Layout Mobile:** scene giữ tỉ lệ hợp lý và có thể cuộn nhẹ khi cần; puzzle `bottom sheet`/fullscreen dialog; inventory dạng tab; mọi hotspot có hit area ≥44×44 px.
- **Motion:** mở ngăn tủ, chuyển cảnh, hiệu ứng cửa mở. Thời lượng ngắn, hỗ trợ `prefers-reduced-motion`.
- **Audio:** không bắt buộc. Nếu dùng, tự tạo/nguồn phép hợp lệ; phải có mute và không autoplay lớn tiếng.
- **Tính dễ dùng:** có hướng dẫn bước đầu, nút back, nhìn thấy tiến độ, dùng được với keyboard, focus ring, text contrast, `aria-label` cho hotspots.

### 8.3. Scene layout mẫu

```text
┌─────────────────────────────────────────────────────────┐
│ ← Bản đồ      ROOM 01 / THƯ VIỆN       10/100    [Sổ tay]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│   [Kệ bản thảo]           [Bàn chân dung]               │
│                                                         │
│             SCENE 2D — có đồ vật tương tác              │
│                                                         │
│  [Đồng hồ thời gian]               [CỬA BỊ KHÓA]       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  🎒 Manh mối 1 / 3   [Xem vật phẩm]     [?] Hướng dẫn  │
└─────────────────────────────────────────────────────────┘
```

Trên desktop có thể sử dụng SVG 16:9 cố định với vị trí hotspots bằng phần trăm; mobile scene được scale và thêm list hotspots dễ thao tác bên dưới nếu vật thể quá nhỏ. **Không để hotspot chỉ có biểu tượng vô nghĩa; hover/tap hiển thị tên và trạng thái.**

---

## 9. Kiến trúc code và dữ liệu

### 9.1. Stack

```text
React + TypeScript + Vite
Tailwind CSS
React Router (nếu cần)
Zustand hoặc React Context (chọn 1, không overengineer)
Motion / CSS transitions (chọn phương án nhẹ nhất)
lucide-react (icon)
Vitest + React Testing Library (unit/component tests)
localStorage (save)
Vercel / Cloudflare Pages / Netlify static hosting
```

Không cài thư viện drag-and-drop nếu click/tap-to-assign và CSS/React state đã đáp ứng đủ; nếu dùng drag-and-drop, phải có fallback keyboard/mobile.

### 9.2. Suggested tree

```text
/
├── plan.md
├── README.md
├── package.json
├── index.html
├── public/
│   ├── favicon.svg
│   └── og-cover.svg
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── RoomMapPage.tsx
│   │   ├── RoomPage.tsx
│   │   ├── CodexPage.tsx
│   │   ├── FinalPage.tsx
│   │   ├── DemoPage.tsx
│   │   ├── ResultPage.tsx
│   │   └── AboutPage.tsx
│   ├── components/
│   │   ├── GameHUD.tsx
│   │   ├── RoomScene.tsx
│   │   ├── Hotspot.tsx
│   │   ├── InventoryPanel.tsx
│   │   ├── PuzzleDialog.tsx
│   │   ├── HintPanel.tsx
│   │   └── KnowledgeFeedbackModal.tsx
│   ├── puzzles/
│   │   ├── ClassificationPuzzle.tsx
│   │   ├── MatchingPuzzle.tsx
│   │   ├── TimelinePuzzle.tsx
│   │   ├── EvidenceLockPuzzle.tsx
│   │   └── validatePuzzle.ts
│   ├── data/
│   │   ├── rooms.ts
│   │   ├── puzzles.ts
│   │   └── knowledge.ts
│   ├── game/
│   │   ├── types.ts
│   │   ├── progress.ts
│   │   └── save.ts
│   ├── store/
│   │   └── useGameStore.ts
│   ├── styles/
│   │   └── index.css
│   └── tests/
│       ├── contentIntegrity.test.ts
│       ├── validatePuzzle.test.ts
│       ├── progress.test.ts
│       └── save.test.ts
└── ...config files
```

### 9.3. Data types (bắt buộc type-safe)

```ts
type PuzzleType = 'classification' | 'matching' | 'timeline' | 'evidence-lock';
type RoomId = 1 | 2 | 3 | 4;

type TextbookSource = {
  book: 'Giáo trình Chủ nghĩa xã hội khoa học (2021)';
  chapter: 1 | 2 | 3 | 4;
  printedPages: number[];
  pdfPages: number[];
  sourceReviewStatus: 'needs-review' | 'verified';
};

type PuzzleBase = {
  id: string;
  roomId: RoomId;
  order: 1 | 2 | 3 | 4;
  type: PuzzleType;
  title: string;
  hotspotName: string;
  learningObjective: string;
  instruction: string;
  hints: [string, string];
  explanation: string;
  keyTakeaways: string[];
  source: TextbookSource;
  clueReward?: { id: string; name: string; description: string };
};

type ClassificationPuzzle = PuzzleBase & {
  type: 'classification';
  groups: { id: string; label: string }[];
  cards: { id: string; label: string; correctGroupId: string }[];
};

type MatchingPuzzle = PuzzleBase & {
  type: 'matching';
  pairs: { id: string; left: string; right: string }[];
};

type TimelinePuzzle = PuzzleBase & {
  type: 'timeline';
  events: { id: string; year: number; label: string }[];
};

type EvidenceLockPuzzle = PuzzleBase & {
  type: 'evidence-lock';
  statements: { id: string; text: string; supported: boolean }[];
};

type Puzzle = ClassificationPuzzle | MatchingPuzzle | TimelinePuzzle | EvidenceLockPuzzle;
```

**Không dùng `correctAnswer` hardcode tách rời khi chính `cards.correctGroupId`, `pairs`, `events.year` hoặc `statements.supported` đã là canonical source; nếu dùng field `correctAnswer`, phải sinh tự động và test nhất quán.**

### 9.4. Save schema

```ts
type GameSaveV1 = {
  version: 1;
  completedPuzzleIds: string[];
  collectedClueIds: string[];
  collectedShardIds: ('origin' | 'mission' | 'transition' | 'democracy')[];
  viewedKnowledgeIds: string[];
  revealedHints: Record<string, 0 | 1 | 2>;
  finalCompleted: boolean;
  introSeen: boolean;
  updatedAt: string;
};
```

- `localStorage` key: `mln131-escape-save-v1`.
- Mọi dữ liệu đọc từ localStorage phải được validate (kể cả parse JSON lỗi, thiếu field, khác version, ID không tồn tại); nếu lỗi thì phục hồi save rỗng an toàn.
- Dùng **Set** logic ở runtime để không trùng puzzle, clue và shard.
- `score = completedPuzzleIds.length * 5 + (finalCompleted ? 20 : 0)`; clamp 0–100; chỉ tính ID đã được biết.
- Room N unlocked nếu mọi puzzle ở N-1 hoàn thành; Room 1 unlocked mặc định; Final unlocked khi đúng 16 ID hoàn thành.
- Source of truth cho hotspot unlocked: `order === 1` hoặc puzzle liền trước completed; không tin riêng trạng thái UI.
- Demo dùng state local trong `DemoPage`, **không gọi `saveGame`**.
- Reset xóa key, reset store và điều hướng về `/` (cần modal xác nhận rõ ràng).

### 9.5. Puzzle validation

- `classification`: tất cả card ID phải có assignment hợp lệ, map `cardId→groupId` khớp dữ liệu.
- `matching`: mỗi left/right chỉ ghép một lần, toàn bộ pair ID đúng.
- `timeline`: sự kiện theo ascending `year`; vì dữ liệu khác năm nên không cần tie handling.
- `evidence-lock`: tập `selected IDs` đúng bằng tập statements có `supported === true`; thứ tự chọn không ảnh hưởng.
- Không cần server để validate vì điểm là phục vụ tự học; không coi điểm frontend là kết quả thi chính thức.

---

## 10. Mini Demo cho lớp học

**URL:** `/demo` — không đăng nhập, không đọc/ghi save chính.

**Nội dung:** dùng bản rút gọn của `R4-P2` (phân biệt dân chủ trực tiếp/gián tiếp) với 2 thẻ, 2 vùng lựa chọn và feedback.

**Flow 60–90 giây:**

1. Tiêu đề: “Trong 60 giây, bạn có phân biệt được hai hình thức dân chủ?”
2. Một thẻ: “Người dân trực tiếp biểu quyết...” → `Trực tiếp`.
3. Một thẻ: “Đại biểu được bầu thay mặt người dân...” → `Gián tiếp`.
4. `Kiểm tra` → hiện đúng/sai, giải thích ngắn, **Nguồn: Chương 4, tr. 153**.
5. Hiện `Bạn đã mở khóa 1 kiến thức` + CTA `Chơi đủ 4 phòng`.

**Giới hạn:** Vì **không có backend**, website **không** hiển thị số người chơi hay bảng tổng hợp toàn lớp. Không ngụy tạo kết quả. Tạo QR thật từ URL khi đã deploy (có thể tạo QR bằng công cụ offline/thư viện), in trong slide.

**Presentation shortcut:** thêm query `?presentation=1` cho `/play` (chỉ trong tab demo) để có nút `Giới thiệu nhanh các phòng` hoặc mục `Xem demo phòng`. Tùy chọn này **không sửa save chính** và không cho gian lận kết quả; nếu phức tạp, bỏ shortcut và demo bằng save đã chuẩn bị từ trước.

---

## 11. Màn hình kết quả và đánh giá học tập

Trang `/result` cần có:

- `100/100` nếu hoàn thành cả Final; số phòng đã qua; 4 mảnh tri thức.
- Tóm tắt ngắn 4 kiến thức nền tảng đã học từ các phòng.
- Danh sách 16 mục Codex có thể mở lại.
- Nút `Chơi lại từ đầu` (xác nhận reset), `Về bản đồ`, `Chia sẻ trò chơi` (chia sẻ URL, không công bố dữ liệu người chơi).
- Nút `Góp ý` đơn giản có thể là mở `mailto:` hoặc một form nội bộ không gửi dữ liệu nếu không có backend; **không tạo form thu thập feedback mà không lưu/gửi thật**. Tối giản: bỏ nút góp ý nếu không có endpoint rõ ràng.

**Có thể đánh giá hiệu quả thực tế sau khi hoàn thiện** bằng bài kiểm tra trước/sau ngoài game; không được dựng dữ liệu khảo sát giả. Chưa cần analytics tự động.

---

## 12. Kế hoạch thực thi theo milestone

Coding agent thực hiện tuần tự và tự kiểm tra từng milestone:

### M0 — Kiểm tra và bootstrap

- [x] Kiểm tra repo, assets, package manager và PDF nguồn thực tế 273 trang.
- [x] Tạo Vite React TS, Tailwind, router, UI theme và script `dev/build/lint/test`.
- [x] Tạo README; chạy `npm run dev` và kiểm tra server trả HTTP 200.

**Exit:** landing hiển thị chuẩn tiếng Việt, các route hoạt động.

### M1 — Data + content integrity

- [x] Chuyển 16 specification ở §6 thành `src/data/puzzles.ts` type-safe.
- [x] Tạo `rooms.ts` bốn phòng và các hotspot.
- [x] Đặt key takeaways, explanation và tài liệu đọc trong cùng dữ liệu `puzzles.ts` để dùng chung cho Codex, không nhân bản sang `knowledge.ts`.
- [x] Viết tests: chính xác 4 phòng, 4 puzzle/phòng, 16 ID unique, mỗi puzzle có nguồn/hints/giải thích, đủ 4 mechanic types, `pdfPage = printedPage - 3`.
- [ ] Người phụ trách học thuật duyệt đầy đủ nội dung và nguồn của 16 câu trước khi đánh dấu `verified`.

**Exit:** test content integrity pass; không có puzzle thiếu đáp án/nguồn.

### M2 — Reusable Puzzle Engine

- [x] Xây dựng UI + validation cho 4 loại puzzle.
- [x] Chọn/tap/matching, nút lên/xuống cho timeline, nút Kiểm tra, thông báo sai và hints; không bắt buộc kéo thả.
- [x] Feedback modal với nguồn học thuật; xem lại đáp án và giải thích.
- [x] Unit tests cho correct/wrong/partial answers của cả 4 types.

**Exit:** mỗi loại puzzle chạy với ít nhất một data fixture, không gây lỗi khi input sai.

### M3 — Scenes, progression, Inventory, Save

- [x] Tạo 4 room scene bằng CSS/SVG và 4 hotspot/phòng.
- [x] Puzzle mở tuần tự, clue rewards, khóa cửa và shard rewards.
- [x] Bản đồ phòng, locked state, route guard.
- [x] Save + restore + reset có xác nhận, code guard và tests.

**Exit:** có thể chơi hết một phòng, reload vẫn giữ tiến độ và mở phòng kế.

### M4 — Full game completion

- [x] Tích hợp đủ 16 câu từ §6.
- [x] Final Room tổng hợp 4 shard.
- [x] Ending + result + Codex.
- [x] Test tích hợp từ save rỗng qua 16 câu, tải lại tại phòng 3, hoàn thành Final và khôi phục kết quả 100 điểm.

**Exit:** chơi toàn bộ game không có nút giả/đường cụt.

### M5 — Demo + polish + release

- [x] `/demo` độc lập, feedback tr. 153; test không đọc/ghi save chính.
- [x] Viết CSS responsive 360px/768px/desktop và dialog mobile.
- [ ] Xác nhận responsive trực tiếp trên trình duyệt ở 360px/768px/desktop; công cụ browser hiện bị dừng.
- [x] Triển khai keyboard bằng nút/checkbox chuẩn, labels, focus state, native dialog và reduced motion.
- [ ] Kiểm tra touch, focus native và reduced motion trên trình duyệt/thiết bị thật.
- [x] Dùng artwork SVG/CSS tự tạo, transitions, page titles/favicon.
- [x] Chạy lint/test/build thành công; kết quả và giới hạn ghi trong README.
- [x] README: hướng dẫn deploy, route, demo trong lớp, mapping sources và các hạn chế.
- [x] Xuất PowerPoint 7 slide, speaker notes 7 phút; kiểm tra cấu trúc, font, bố cục, import lại và render từng trang. Hình là artwork game, chưa phải ảnh chụp trình duyệt.

**Trạng thái Exit:** build production và bộ slide đã có; kiểm thử tự động đã chạy. Checklist thủ công dưới đây chưa được xác nhận vì công cụ điều khiển trình duyệt dừng; cần người tiếp nhận chạy trước khi nộp/trình chiếu.

---

## 13. Kiểm thử tối thiểu bắt buộc

### Unit/content tests

1. `16 puzzles / 4 rooms / 4 mechanics`, không trùng ID.
2. Mỗi `puzzle` có `learningObjective`, `instruction`, ít nhất hai hints, explanation, source và trang in hợp lệ.
3. Đáp án đúng/thiếu/thừa cho mỗi loại `classification`, `matching`, `timeline`, `evidence-lock`.
4. Sai thì không ghi completed; đúng thì ghi completed **đúng một lần**.
5. `score`: save rỗng 0; giải 1 puzzle = 5; 16 puzzle = 80; Final = 100.
6. `unlock`: room 1 mở; room 2/3/4 chỉ mở khi phòng trước xong; Final chỉ mở khi đủ 16.
7. `localStorage`: save/restore, JSON lỗi, version lạ, ID giả, reset.
8. `/demo` không thay đổi save của người chơi.

### Smoke test thủ công

- [ ] Desktop: bắt đầu → Room 1 P1 → clue → P2 → P3 → P4 → mở cửa → Room 2... → Final → Result.
- [ ] Điền sai ở classification, matching, timeline và lock; đảm bảo có thể sửa.
- [ ] Dùng Hint 1/2 và xem Codex trong lúc ở một phòng.
- [ ] F5 ở phòng 3 và quay lại đúng tiến độ.
- [ ] Mở trực tiếp `/room/4` khi chưa unlock và `/final` khi chưa đủ điều kiện.
- [ ] Trên iPhone-size 360–390px, từng hotspot chạm được; timeline dùng ↑/↓ được; modal không tràn.
- [ ] Chạy `/demo` rồi kiểm tra save main không đổi.
- [ ] Giảm chuyển động hệ thống: animation không làm mất chức năng.

Các luồng giải câu, luật mở khóa, tải lại, lỗi save và demo độc lập đã có test RTL/jsdom; danh sách này chỉ dành cho kiểm tra thủ công trên trình duyệt thật và chưa được đánh dấu thay bằng test tự động.

### Định nghĩa bug blocker

- Không thể hoàn thành bất kỳ puzzle nào mặc dù đã chọn đáp án đúng.
- Puzzle không có lời giải học thuật hoặc nguồn.
- Dữ liệu save bị mất hoặc score tăng lặp vô hạn.
- Không thể mở phòng tiếp theo dù đã giải đủ câu.
- Một trong bốn puzzle types không dùng được bằng touch.
- Trang trắng, lỗi runtime, route 404 không được xử lý.

---

## 14. Hướng dẫn thuyết trình và tài liệu bàn giao

### Demo 7 phút gợi ý

| Mốc | Việc trình bày | Điều cần chứng minh |
|---|---|---|
| 0:00–0:45 | Nêu vấn đề: lý luận trừu tượng khó tiếp cận | Mục tiêu sản phẩm |
| 0:45–1:30 | Giới thiệu 4 phòng và mảnh tri thức | Liên kết chương giáo trình |
| 1:30–3:30 | Live demo Room 1: đồ vật → puzzle → clue → giải thích → nguồn | Đây là Escape Room, không phải quiz |
| 3:30–4:45 | Demo Room 3 một puzzle về thời kỳ quá độ | Chiều sâu học thuật |
| 4:45–5:45 | Cho lớp mở `/demo` bằng QR | Tương tác và tiếp cận công chúng |
| 5:45–7:00 | Tóm tắt Codex, kết quả, giá trị giáo dục | Kết thúc sản phẩm |

Không cố chơi tất cả 16 puzzle trên sân khấu. Chuẩn bị **video ghi màn hình dự phòng** hoặc build chạy local nếu mạng lớp yếu. Chỉ tuyên bố số liệu người dùng nếu đã thu thập thật.

### Deliverables bắt buộc

- [x] Source code game và server local; dùng `npm ci && npm run dev` theo README.
- [x] Production build chạy `npm run build`.
- [x] `plan.md` được cập nhật trạng thái và sửa mô tả số trang PDF.
- [x] `README.md` với setup, architecture, routes, cách chơi, LAN và hướng dẫn deploy.
- [x] `CONTENT_SOURCES.md` liệt kê 16 câu, trang nguồn, các trang mẫu đã xem và trạng thái `needs-review`.
- [x] Bản `/demo` và PowerPoint 7 slide có speaker notes; slide dùng artwork xuất từ game.
- [ ] Đường link hosting và QR `/demo`: ngoài phạm vi bàn giao local đã chọn; tạo QR bằng `--demo-url` khi có URL LAN/hosting truy cập được.
- [ ] Nhóm ghi lịch sử đóng góp thực tế qua Git hoặc bảng công việc; không dựng lịch sử hay tên người phụ trách chưa được cung cấp.

### Phân vai 9 thành viên (nếu nhóm 9 người)

1. Leader/Product Owner: quản lý scope, nghiệm thu, slide mở đầu.
2. Nội dung 1: soát câu đố Chương 1–2, citations.
3. Nội dung 2: soát câu đố Chương 3–4, citations.
4. UI/UX: layout, SVG scene, mobile.
5. Frontend 1: scene/map/hotspot/inventory.
6. Frontend 2: puzzle UI/validation/hints.
7. Frontend 3: state/save/codex/final/deploy.
8. QA: regression, mobile, checklist, khảo sát thử.
9. Presentation/Storytelling: opening, demo script, video dự phòng, slides.

**Quy tắc chất lượng:** người soát học thuật phải review các explanation và trang nguồn sau khi developer hoàn thành, không chỉ gửi nội dung một lần rồi kết thúc nhiệm vụ.

---

## 15. Quy tắc lựa chọn khi cần cắt scope

Nếu thiếu thời gian, **giữ nguyên** các phần cốt lõi: 4 phòng, 16 câu, giải thích đúng nguồn, hotspot, khóa cửa, hints, Codex, save, Final, demo. Chỉ cắt theo thứ tự:

1. Nhạc nền/hiệu ứng âm thanh.
2. Animation phức tạp và VFX.
3. Thay tranh nền riêng quá cầu kỳ bằng SVG/CSS scene chỉn chu.
4. Presentation shortcut và các tiện ích không tác động nội dung.
5. Tùy chọn chia sẻ thành tích.

**Không cắt** phần giải thích, nguồn, kiểm tra đáp án, khả năng thao tác trên mobile hoặc flow hoàn thành trò chơi.

---

## 16. Yêu cầu final report của coding agent

Khi hoàn thành, báo cáo ngắn gọn theo mẫu:

```text
IMPLEMENTATION COMPLETE

- Tech stack:
- Routes implemented:
- Rooms: 4/4
- Puzzles: 16/16 (classification / matching / timeline / evidence-lock)
- Final Room: done/not done
- Codex / Hints / Save / Demo: status
- Source verification status: <N verified, M needs-review>
- npm run lint: PASS/FAIL
- npm run test: PASS/FAIL
- npm run build: PASS/FAIL
- Run locally:
- Known limitations:
- Files added/modified:
```

Không ghi PASS nếu chưa thật sự chạy lệnh. Nếu môi trường không cho cài dependencies hoặc chạy browser, ghi rõ hạn chế và vẫn hoàn thiện source code ở mức cao nhất có thể.

---

## 17. Nguyên tắc quyết định cuối cùng

**Khi có xung đột giữa đẹp mắt và đúng kiến thức → chọn đúng kiến thức.**  
**Khi có xung đột giữa thêm tính năng và hoàn thiện game → chọn game hoàn thiện.**  
**Khi có xung đột giữa câu đố khó và người mới hiểu được → chọn giải thích, manh mối, hint tốt hơn.**  
**Khi có xung đột giữa demo hoành tráng và demo ổn định → chọn demo ổn định.**

**Mục tiêu sản phẩm:** người dùng bước vào phòng, quan sát một đồ vật, suy luận từ dữ kiện, giải được khóa, đọc một kiến thức có nguồn đáng tin cậy và cảm thấy thực sự vừa học được điều gì đó. Lặp lại quá trình đó ở bốn phòng, ghép bốn mảnh tri thức trong Final Room và kết thúc hành trình. Đó là phiên bản tối giản nhưng hoàn chỉnh mà coding agent phải bàn giao.
