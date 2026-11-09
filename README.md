# Mật Mã Ký Ức — Hồ Sơ 2126

*Bốn góc nhìn. Những ký ức chờ được nối lại.*

Game điều tra giáo dục một người chơi, phong cách truyện tranh bí ẩn 2D. Bạn điều khiển An, Minh, Vy và Khôi, khám phá chứng cứ và phục dựng bốn khu vực của thư viện năm 2126.

Đây là hành trình V2 thay thế escape room tuyến tính. Giữ đủ 16 mục tiêu học, nguồn và lời giải; không yêu cầu làm lại 16 form câu hỏi cũ. Thời lượng 25–35 phút và demo ba phút là mục tiêu thiết kế, chưa có số đo chơi thử với sinh viên.

## Chạy game

Node.js 22.18+ hoặc 24 và npm:

```sh
npm ci
npm run dev
```

Mở địa chỉ Vite hiển thị, thường là `http://localhost:5173`. Bản production:

```sh
npm run build
npm run preview
```

Không mở `dist/index.html` trực tiếp bằng `file:`. Bản build đã có toàn bộ ảnh, font và âm thanh; không gọi API tạo ảnh, font Google hoặc AI trong lúc chơi. Chưa triển khai PWA nên không hứa chế độ offline khi tải lại trang.

## Nội dung đã triển khai

- Bốn phòng với sáu hotspot mỗi phòng; bốn điểm mở ban đầu, hai điểm mở theo phát hiện.
- Bốn vai có hành động riêng; thao tác chuyên môn tự chuyển vai, chứng cứ dùng chung.
- 28 hồ sơ: 16 thiết yếu, tám đối chiếu bổ trợ và bốn lá thư truyện phụ.
- 12 bước kiểm chứng và bốn phiên hội đồng, bao phủ 16 mục tiêu học của bản cũ.
- 64 nút hội thoại viết sẵn, lựa chọn có điều kiện; hỏi rõ, đối chiếu, phản biện và đề xuất chạy thử.
- Hội đồng kiểm tra kết luận + tập chứng cứ + cách phục dựng; chấp nhận các bộ chứng cứ hợp lệ khác nhau, phản hồi phần còn sai.
- Phòng Lõi gồm bốn đoạn báo cáo mới; phân công từng thành viên kiểm tra trước khi xác nhận bản sửa.
- Hai kết thúc theo số lá thư tìm được; có thể quay lại tìm thư sau khi hoàn thành.
- Sổ chung gồm Chứng cứ, Giả thuyết, Kiến thức; có nguồn và giải thích, giữ lựa chọn đang làm qua tải lại.
- Tab Hướng dẫn cạnh Sổ chung mở cẩm nang riêng: bối cảnh, nhân vật, thao tác từng bước, ví dụ ghép thẻ và cách trả lời hội đồng. Gợi ý lần đầu chỉ tới tab này.
- Hai cấp gợi ý mỗi bước, thử sai không mất tiến độ, lưu V2 riêng và reset có xác nhận.
- Sáu tranh cảnh, tranh nhóm trang chủ, 20 biểu cảm và 28 minh họa chứng cứ đóng gói thành atlas; chữ và lớp chuyển động tách khỏi tranh.
- Hai bản ambient miễn phí trên OpenGameArt (CC0), dài khoảng 2 phút 38 giây và 2 phút; tám hiệu ứng gốc. Nhạc được cân nhẹ, fade đầu/cuối; mặc định tắt, chỉnh âm lượng không tua lại nhạc, dừng khi tab ẩn.
- Chữ đọc 16–18px, nút thao tác 16px, giảm chuyển động, thao tác chạm/chuột/bàn phím; mobile dùng panel đồ vật từ đáy và bố cục rộng hơn cho chữ.
- Demo độc lập tại `/demo`, không mount provider hoặc đọc/ghi tiến độ chính.

## Cách chơi

Lần đầu vào game, gợi ý ở đầu trang chỉ tới tab **Hướng dẫn**. Mở tab để đọc cẩm nang đầy đủ tại `/guide`, dùng mục lục tìm nhanh hoặc tập ghép thẻ ngay trên trang. Nút quay lại đưa về trang vừa mở; bài tập hướng dẫn không tính vào tiến độ chính.

**Điều kiện qua mỗi phòng: 4 chứng cứ bắt buộc → 3 kiểm chứng hoàn thành → đề xuất đúng tại hội đồng.** Hai hồ sơ bổ trợ và phong thư không bắt buộc.

1. Mở bản đồ và vào Thư viện Khởi nguyên.
2. Xem **Việc cần làm tiếp theo** ở đầu phòng. Nút vàng mở đúng hồ sơ hoặc bước kiểm chứng còn thiếu; vẫn có thể tự khám phá bằng cảnh/danh sách.
3. Đọc tài liệu rồi bấm **Ghi nhận chứng cứ**. Chỉ đọc chưa tính là thu thập. Thanh hướng dẫn đếm riêng các chứng cứ bắt buộc.
4. Làm đủ ba bước **Kiểm chứng hồ sơ**. Chọn dữ kiện, sau đó chọn vị trí để gắn, rồi bấm nút kiểm tra. Phản hồi chỉ rõ thẻ chưa gắn hoặc một thẻ đang sai; Gợi ý giúp đọc lại quan hệ. Xong mỗi bước có nút **Tiếp tục bước tiếp theo**.
5. Mở **Bàn hội đồng**, làm lần lượt ba phần: **Bản ghi sai ở đâu? → Hồ sơ nào chứng minh? → Sửa bằng cách nào?** Đọc câu hỏi và dòng “Giúp kiểm tra” dưới thẻ. Khi mắc, mở **Xem cách suy luận** hoặc **Xem một cách trả lời mẫu và lý do**; các mục này không tự điền hoặc nộp bài. Có thể thêm hồ sơ liên quan khi đã đủ căn cứ. Nếu sai, phản hồi nêu phần cần sửa, tên hồ sơ thiếu/không liên quan và có nút quay về đúng bước.
6. Khi phục dựng thành công, bấm **Sang phòng tiếp theo** ngay trong cửa sổ kết quả. Phục dựng đủ bốn khu vực để vào Phòng Lõi; tìm thêm thư nếu muốn mở kết thúc đặc biệt.

Tab để di chuyển, Enter/Space để kích hoạt, Escape đóng dialog. Không bắt buộc kéo thả, hover hoặc nghe âm thanh. Nút âm thanh và cài đặt nằm ở header; giảm chuyển động cũng tuân theo hệ thống.

## Trang và dữ liệu

| Đường dẫn | Chức năng |
|---|---|
| `/` | Giới thiệu nhóm, bắt đầu/tiếp tục, chơi thử |
| `/play` | Bản đồ bốn khu vực và Phòng Lõi |
| `/room/1`…`/room/4` | Điều tra, chứng cứ, đối thoại, kiểm chứng và hội đồng |
| `/codex` | Sổ chung |
| `/guide` | Cẩm nang toàn bộ game, mục lục, ví dụ thao tác và gỡ rối |
| `/final` | Báo cáo tổng hợp, yêu cầu phục dựng đủ bốn phòng |
| `/result` | Kết quả, hai đoạn kết; chỉ mở sau Phòng Lõi |
| `/demo` | Nhiệm vụ thử rút gọn của phòng 3, hai vai An/Minh |
| `/about` | Mục tiêu, nguồn, hư cấu và dữ liệu thiết bị |

Tiến độ mới dùng key `mln131-council-save-v2`. Không ghi đè hoặc xóa `mln131-escape-save-v1`, kể cả reset. Bản lưu cũ không tự chuyển thành kết quả điều tra. Lưu hỏng được báo và chưa bị thay đổi khi chỉ mở trang; thao tác mới mới ghi tiến độ V2 mới. Nếu lưu bị chặn, game vẫn chạy trong tab.

Âm thanh/giảm chuyển động dùng key cài đặt riêng; bộ lọc và vị trí đọc Sổ chung lưu trong phiên. Demo có thể dùng cài đặt chung nhưng không truy cập key tiến độ V1/V2. Dữ liệu không chia sẻ giữa trình duyệt, thiết bị hoặc các origin như localhost và domain hosting.

Gợi ý người mới dùng key riêng `mln131-guide-intro-v1`: ghi nhận khi đọc hướng dẫn hoặc đóng gợi ý bằng nút/Escape. Không ảnh hưởng save game; khi không lưu được, lựa chọn đóng vẫn có tác dụng trong tab hiện tại, kể cả chuyển sang demo. Tab Hướng dẫn luôn dùng được sau khi đóng gợi ý.

## Mã nguồn và tài nguyên

- `src/council/`: mô hình, nội dung điều tra, luật chơi V2, lưu, giao diện, âm thanh và trang.
- `src/data/puzzles.ts`: nội dung học thuật tham chiếu của 16 mục tiêu, nguồn, giải thích và điểm cần nhớ.
- Các module engine/component V1 giữ lại làm tham chiếu và kiểm tra hồi quy; không còn điều khiển hành trình chính.
- Nội dung TypeScript là nguồn chuẩn. Bộ sinh nội dung từ `plan.md` thuộc V1 và đã có guard; không dùng cho hành trình V2.
- `public/art`, `public/audio`, `public/fonts`: tài nguyên cuối; không cần công cụ sinh ảnh/âm thanh khi cài và chạy game.

Tài liệu:

- [Thiết kế V2](COUNCIL_DESIGN.md).
- [Nguồn và ánh xạ nội dung](CONTENT_SOURCES.md).
- [Hướng dẫn và đáp án điều tra](DAP_AN_HOI_DONG.md), dành cho người kiểm tra; có spoiler.
- [Danh mục nguồn tài nguyên](docs/ASSET_LEDGER.md) và [bộ prompt hình ảnh](docs/ART_PROMPTS.md).
- [Phiếu chơi thử năm sinh viên](docs/PLAYTEST.md).
- `plan.md`, đáp án và PowerPoint escape room cũ là tài liệu lịch sử V1, không phải mô tả bản V2.

## Kiểm tra

```sh
npm run lint
npm run test
npm run build
```

Bộ kiểm tra gồm luật/save V2, nội dung và nguồn tham chiếu, hồi quy dialog, tương tác, demo độc lập, lượt chơi qua bốn phòng/Phòng Lõi và hai kết thúc. Không dùng bài kiểm tra tự động để tuyên bố hiệu quả học tập.

Kết quả hiện tại: lint PASS, 123 bài kiểm tra PASS, build PASS; kiểm tra Chromium production ở 1366/768/360px PASS. Đã kiểm tra phát cả hai bản nhạc miễn phí, chỉnh âm lượng không tua nhạc và hiển thị credit CC0. Lượt tải đầu khoảng 1,88 MB. Xem [báo cáo và ảnh kiểm tra](QA_REPORT.md).

Trong Codex có primary runtime và Chromium của Playwright:

```sh
npm run build
npm run check:browser
```

Lệnh browser tự mở production preview tại cổng 4273 và đóng khi xong; xuất ảnh cùng báo cáo vào `output/qa/`. Nó kiểm tra 1366/768/360px, tràn ngang, tải tài nguyên, bàn phím/touch mô phỏng, chơi hết game, tải lại, demo và giảm chuyển động. `RUNTIME_NODE_MODULES`, `PLAYWRIGHT_EXECUTABLE_PATH`, `TEST_URL` có thể chỉ vị trí runtime/browser/server khác; lệnh này không tự cài Playwright khi thiếu. Các lệnh chạy game/lint/test/build không phụ thuộc primary runtime.

Tạo lại tài nguyên là bước phát triển tùy chọn:

```sh
npm run assets:art
npm run assets:audio
npm run assets:music
```

Xuất tranh cần Sharp trong runtime và file đường dẫn ảnh đầu vào riêng của máy; tạo âm thanh cần FFmpeg. `assets:audio` chỉ sinh lại hiệu ứng, giữ nguyên nhạc nền. `assets:music` xuất lại nhạc đã cấp phép từ các file nguồn cục bộ; tải lại chúng bằng `node scripts/fetch-music.mjs` khi cần. Không cần các lệnh tài nguyên cho bản đã bàn giao. Tác giả, nguồn, giấy phép và thay đổi được ghi trong `public/audio/CREDITS.md` và trang Về trò chơi.

## Nguồn học thuật và việc cần người tham gia

Nguồn: *Giáo trình Chủ nghĩa xã hội khoa học*, Bộ Giáo dục và Đào tạo, NXB Chính trị quốc gia Sự thật, 2021. Dùng Chương 1–4 trong phạm vi trang in 11–153. Scan gốc có 273 trang; phạm vi game không phải toàn bộ giáo trình hoặc toàn bộ Chương 4.

**0 verified / 16 needs-review.** Giữ trạng thái thật, cần người phụ trách đối chiếu đầy đủ và xác nhận. Bối cảnh 2126, nhân vật, nhật ký và thư là hư cấu. Tình huống do nhóm xây dựng không phải ví dụ nguyên văn hay quy trình pháp lý thực tế.

Chưa thực hiện chơi thử với năm sinh viên, chưa đo trung vị 25–35 phút và chưa thử trên điện thoại vật lý. Đã có kịch bản và phiếu ghi nhận riêng để làm các bước này; kiểm tra Chromium không thay thế chúng.

## Hosting sau này

Chưa xác nhận public URL. Khi nhóm cần, build `dist/` lên static hosting. Rewrite Vercel và `_redirects` cho SPA vẫn được giữ. Kiểm tra tải trực tiếp `/room/3`, `/codex`, `/guide`, `/demo`; luật mở khóa vẫn áp dụng.

PowerPoint và lệnh `slides` hiện còn thuộc V1, chưa làm lại theo Mật Mã Ký Ức — Hồ Sơ 2126 theo phạm vi bàn giao đã chốt.

## Bảo mật và tệp cục bộ

Đã bổ sung `.gitignore` cho tệp môi trường, credentials, khóa, dữ liệu riêng, output và tài liệu nội bộ; `.vercelignore` chỉ cho gửi các tệp cần để build game. Cấu hình Vercel có CSP và các header bảo vệ trình duyệt. Chạy `npm audit`, `npm run lint`, `npm test`, `npm run build` trước khi phát hành; `npm run check:browser` kiểm tra thêm game với các header production trên local khi có runtime trình duyệt theo hướng dẫn ở trên.

Không đặt bí mật trong mã frontend, `public` hoặc biến `VITE_*`. Đáp án và tiến độ hiện được xử lý trên máy người chơi; không dùng chúng làm dữ liệu thi hoặc xác thực. Xem [kết quả rà soát và giới hạn thực tế](SECURITY_REVIEW.md).
