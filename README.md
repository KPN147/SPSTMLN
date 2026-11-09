# Mật Mã Ký Ức — Hồ Sơ 2126

*Bốn góc nhìn. Những ký ức chờ được nối lại.*

Game điều tra giáo dục một người chơi, phong cách truyện tranh 2D. Bạn điều khiển An, Minh, Vy và Khôi để tìm lỗi và phục dựng bốn khu vực thư viện năm 2126.

Hành trình V3 thiết kế cho sinh viên mới học: gặp tình huống, tìm dữ kiện của bước đang làm, dùng một ý kiến thức rồi giải thích quyết định. Giữ bốn phòng và 16 mục tiêu học; thời lượng 25–35 phút và demo ba phút là mục tiêu thiết kế, chưa phải số đo chơi thử.

## Chạy game

Cần Node.js 22.18+ hoặc 24 và npm:

```sh
npm ci
npm run dev
```

Mở địa chỉ Vite hiển thị, thường là `http://localhost:5173`. Để chạy bản production:

```sh
npm run build
npm run preview
```

Không mở `dist/index.html` trực tiếp bằng `file:`. Ảnh, font và âm thanh được đóng gói cục bộ; không gọi AI hoặc Google Fonts trong lúc chơi. Chưa triển khai PWA nên không hứa chế độ offline khi tải lại trang.

## Cách chơi

1. Vào phòng đang mở. Đọc sự cố ngắn và việc cần làm tiếp theo.
2. Mở đồ vật được chỉ tới, đọc dữ kiện rồi bấm **Ghi nhận chứng cứ**. Chỉ cần tài liệu của bước đang làm; không phải thu thập đủ bốn hồ sơ trước khi bắt đầu.
3. Đọc **Kiến thức cần dùng**, xử lý tình huống bằng ghép thẻ, sửa mốc thời gian hoặc chọn quyết định. Khi đúng, một trường của bản phục dựng được hoàn thiện và một phát hiện được lưu.
4. Sau ba kiểm chứng, làm phiên hội đồng theo từng phần: **Quyết định → Căn cứ → Lý do**. Căn cứ phải liên quan và lý do phải giải thích được quyết định. Có thể quay lại sửa mà giữ phần còn lại.
5. Hoàn thành cả bốn bước để phục dựng phòng và mở phòng tiếp theo. Đủ bốn phòng sẽ mở Phòng Lõi: vận dụng các phát hiện vào bốn phần của một hồ sơ mới.

Sai có thể thử lại. Nút **Cần gợi ý?** mở lần lượt: chi tiết cần chú ý → đối chiếu với khái niệm → lời giải có lý do. Không bắt trả lời sai mới được dùng; xem lời giải không tự điền hoặc nộp câu trả lời.

Tab **Hướng dẫn** cạnh **Sổ chung** luôn mở được cẩm nang, mục lục và ví dụ thực hành độc lập. Gợi ý lần đầu chỉ nhắc ngắn; không phải đọc hết hướng dẫn trước khi chơi.

Sổ chung có **Phát hiện**, **Chứng cứ**, **Kiến thức**. Phát hiện ghi rõ bước xuất phát và nơi dùng tiếp, phân biệt **Bối cảnh** với **Căn cứ**. Ghi chú tự do tối đa 1.000 ký tự, không chấm điểm. Kiến thức dài và trang nguồn mở theo nhu cầu.

Dùng chuột, chạm hoặc bàn phím: Tab chuyển vị trí; Enter/Space kích hoạt nút; Escape đóng cửa sổ. Không bắt buộc kéo thả hoặc bật âm thanh. Nút loa và cài đặt nằm ở đầu trang; có giảm chuyển động.

## Nội dung hiện tại

- Bốn phòng, mỗi phòng bốn bước, giữ đúng ID mục tiêu `rN-p1`…`rN-p4`.
- Các dạng ghép thông tin, dòng thời gian, chọn quyết định và hội đồng. Câu hỏi dựa trên tình huống; phản hồi nối chi tiết với khái niệm.
- Mỗi bước tạo phát hiện; quan hệ bối cảnh và quan hệ chứng minh được khai báo riêng. Các phần đã sửa cùng đi vào hồ sơ phục dựng.
- Phòng Lõi dùng bốn tình huống mới từ kiến thức đã học, không thêm mục tiêu học thuật ngoài phạm vi.
- 28 hồ sơ và hình minh họa từ bộ tài nguyên hiện có; hồ sơ bổ trợ và bốn thư truyện phụ phục vụ khám phá sâu. Hai kết thúc theo số thư, có thể quay lại tìm sau khi hoàn thành.
- Bốn vai có chân dung, biểu cảm và chuyên môn riêng; chứng cứ dùng chung, thao tác chuyên môn chuyển sang người phù hợp.
- Chữ đọc 16–18px, các phần trợ giúp đóng mặc định, nguồn và diễn giải đầy đủ vẫn truy cập được.
- Hai bản ambient miễn phí CC0 từ OpenGameArt và tám hiệu ứng gốc. Âm thanh mặc định tắt, chỉnh riêng nhạc/hiệu ứng, dừng khi tab ẩn. Ghi công ở `/about` và `public/audio/CREDITS.md`.
- Demo `/demo` dùng hai góc nhìn của phòng 3, có cùng cơ chế quyết định–căn cứ–lý do và chạy độc lập với tiến độ chính.

## Trang và dữ liệu

| Đường dẫn | Chức năng |
|---|---|
| `/` | Giới thiệu, bắt đầu/tiếp tục và ba thao tác chính |
| `/play` | Bản đồ bốn phòng và Phòng Lõi |
| `/room/1`…`/room/4` | Bốn bước phục dựng và khám phá đồ vật |
| `/codex` | Phát hiện, chứng cứ, ghi chú và kiến thức đã mở |
| `/guide` | Cẩm nang tùy chọn, mục lục và ví dụ thực hành |
| `/final` | Bốn phần của hồ sơ mở lại thư viện |
| `/result` | Kết quả và hai đoạn kết, sau khi hoàn thành Phòng Lõi |
| `/demo` | Chơi thử rút gọn phòng 3 |
| `/about` | Nguồn, hư cấu, dữ liệu thiết bị và ghi công nhạc |

V3 dùng key `mln131-restoration-save-v3`. Các key `mln131-council-save-v2` và `mln131-escape-save-v1` được giữ nguyên, kể cả khi bắt đầu lại V3.

Khi có bản lưu V2 hợp lệ và chưa có bản V3, người chơi chọn:

- **Tiếp tục hành trình:** giữ phòng đã qua, tài liệu, ghi chú và mục tiêu hoàn thành; phát hiện kế thừa có nhãn **Kế thừa bản trước**. Câu chưa nộp cần chọn lại do nội dung đã thay đổi; tiếp từ bước đầu chưa hoàn thành.
- **Bắt đầu hành trình mới:** tạo V3 từ đầu, giữ dữ liệu cũ riêng.

Bản lưu hỏng không tự ghi đè khi chỉ mở trang; giao diện đưa lựa chọn tạo bản mới rõ ràng. Khi thiết bị chặn lưu, vẫn chơi trong tab hiện tại và có thông báo giới hạn. Lựa chọn và mức trợ giúp được lưu theo bước; mở Sổ chung/Hướng dẫn hoặc tải lại không xóa lựa chọn.

Demo không đọc/ghi tiến độ V1/V2/V3. Âm thanh và giảm chuyển động dùng cài đặt chung riêng. Gợi ý người mới giữ key `mln131-guide-intro-v1`; đọc hoặc đóng gợi ý ghi nhận đã xem. Không có tài khoản; tiến độ thuộc cùng trình duyệt, thiết bị và địa chỉ website. Xóa dữ liệu trình duyệt hoặc đổi origin sẽ có vùng lưu khác.

## Mã nguồn và tài liệu

- `src/restoration/`: dữ liệu tình huống V3, luật chơi, lưu/chuyển tiếp và giao diện hiện tại.
- `src/data/puzzles.ts`: 16 mục tiêu và nguồn học thuật tham chiếu.
- `src/council/`: dữ liệu, luật V2 để kiểm tra tương thích; một số thành phần hình ảnh, âm thanh và điều hướng dùng chung.
- Bộ sinh từ `plan.md`, escape room V1 và PowerPoint cũ là tài liệu lịch sử; không sinh đè lên nội dung V3.
- `public/art`, `public/audio`, `public/fonts`: tài nguyên chạy game; không cần công cụ tạo tài nguyên khi cài và chạy.

Tài liệu chính: [Ánh xạ 16 mục tiêu V3](CONTENT_MAPPING_V3.md), [nguồn học thuật](CONTENT_SOURCES.md), [đối chiếu scan V3](docs/SOURCE_REVIEW_V3.md), [kiểm tra kỹ thuật](QA_REPORT.md), [phiếu chơi thử](docs/PLAYTEST.md), [nguồn tài nguyên](docs/ASSET_LEDGER.md), [bảo mật](SECURITY_REVIEW.md). [Thiết kế V2](COUNCIL_DESIGN.md) là tài liệu tham chiếu lịch sử.

## Kiểm tra và phát hành

```sh
npm run lint
npm test
npm run build
```

Kiểm tra luật, chuyển bản lưu, điều kiện bước, căn cứ–lý do, trợ giúp, điều hướng và demo độc lập. Các bài hồi quy V1/V2 phục vụ kiểm tra dữ liệu cũ; kiểm thử V3 kiểm tra hành trình hiện tại. Kết quả số lượng và giao diện được ghi theo lần chạy thực tế trong [QA_REPORT.md](QA_REPORT.md).

Kiểm tra trình duyệt cần runtime Chromium/Playwright được cấu hình theo script của dự án. Không dùng thời gian chạy tự động hoặc số bài test để tuyên bố hiệu quả học tập. Trước khi phát hành, kiểm tra cả chuột, bàn phím, touch, tải lại, các lựa chọn chuyển bản lưu và màn hình 360/768/1366px.

Build `dist/` lên static hosting; rewrite SPA trong Vercel và `_redirects` được giữ. Kiểm tra tải trực tiếp `/room/3`, `/codex`, `/guide`, `/demo`, cùng luật mở khóa. Chưa xác nhận public URL trong tài liệu này.

Tạo lại tài nguyên là việc phát triển tùy chọn (`assets:art`, `assets:audio`, `assets:music`), không phải bước cài đặt game. Nguồn, giấy phép và thay đổi âm thanh ở `public/audio/CREDITS.md`.

## Nguồn học thuật và chơi thử thực tế

Nguồn: *Giáo trình Chủ nghĩa xã hội khoa học*, Bộ Giáo dục và Đào tạo, NXB Chính trị quốc gia Sự thật, 2021. Dùng các phần Chương 1–4 trong trang in 11–153, không phải toàn bộ giáo trình hoặc toàn bộ Chương 4. Scan gốc có 273 trang.

**0 verified / 16 needs-review.** Đã đối chiếu các trang scan đại diện để giữ đúng phạm vi khái niệm; vẫn cần người phụ trách học thuật xác nhận cuối cùng. Nhân vật, nhật ký máy, hồ sơ và tình huống là hư cấu/minh họa, không phải quy trình pháp lý hay mô hình dự đoán xã hội.

Theo lựa chọn triển khai toàn bộ bản mới, bốn phòng và Phòng Lõi được chuẩn bị trước vòng chơi thử. **Chưa thực hiện với năm sinh viên; chưa xác nhận mức hiểu, mức quá tải, thời gian trung vị 25–35 phút hoặc điện thoại vật lý.** Dùng [phiếu chơi thử](docs/PLAYTEST.md) để ghi nhận và sửa sau quan sát, không điền kết quả giả.

`.gitignore` bảo vệ tệp môi trường, credentials, khóa và tài liệu cục bộ; `.vercelignore` chỉ gửi tệp cần để build. Không đặt bí mật trong frontend, `public` hoặc biến `VITE_*`. Tiến độ/đáp án xử lý ở trình duyệt, không dùng làm kết quả thi hoặc xác thực.
