# Bảng nguồn học thuật

## Hành trình V3 hiện tại

V3 giữ đủ 16 mục tiêu và ID trong bảng nguồn. Kịch bản hiện tại nằm trong `src/restoration/curriculum.ts`; quan hệ giữa câu hỏi, khái niệm, phát hiện và nơi dùng tiếp được ghi tại [CONTENT_MAPPING_V3.md](CONTENT_MAPPING_V3.md).

- Mỗi phòng có bốn bước. Ba bước đầu kết hợp dữ kiện với kiến thức cần dùng; bước thứ tư là hội đồng **quyết định → căn cứ → lý do**. Không yêu cầu thu thập mọi hồ sơ trước khi bắt đầu bài đầu.
- Mỗi bước tham chiếu một ID nguồn học thuật riêng. Phần p4 được đưa vào hội đồng; hồ sơ p3 không tự hiển thị phần p4 gộp thêm trong dữ liệu V2.
- Mỗi câu có tình huống, khái niệm ngắn, câu hỏi, phản hồi theo lựa chọn và phát hiện. `context` biểu diễn bối cảnh hồ sơ; `supports` biểu diễn quan hệ căn cứ trực tiếp. Chỉ những cặp căn cứ–lý do được khai báo phù hợp mới được chấp nhận.
- Phòng Lõi là bốn đoạn mới: sửa chú giải niên đại, bổ sung tiêu chí nhận diện hồ sơ nhân sự, kiểm tra điều kiện xuất phát của tuyến chuyển tiếp và nối các hình thức tham gia với cơ chế thực hiện. Dùng lại các nguồn đã học, không thêm khái niệm mới. Demo V3 dùng hai hồ sơ của phòng 3 và nguồn khái niệm ở trang in 110–112.
- Phát hiện được chuyển từ bản V2 có nhãn kế thừa. Không coi việc chuyển bản lưu là xác nhận người chơi vừa trả lời những câu V3.

Ngày 09/11/2026 đã kiểm tra thêm các ảnh scan nguồn đại diện; xem [docs/SOURCE_REVIEW_V3.md](docs/SOURCE_REVIEW_V3.md). Việc này không thay thế xác nhận học thuật cuối cùng: **0 verified / 16 needs-review**.

## Cập nhật Mật Mã Ký Ức — Hồ Sơ 2126 V2

Phần này ghi nhận kiến trúc bản V2 để đọc dữ liệu cũ; không mô tả giao diện và trình tự V3 hiện tại.

Giữ đủ 16 mục tiêu học và trang nguồn trong bảng dưới. Các ID `rN-p1`, `rN-p2`, `rN-p3` nay mở sau ba bước kiểm chứng; `rN-p4` mở sau phiên hội đồng của chương N. Cơ chế trong bảng cũ là dạng tham chiếu V1, không mô tả luồng chơi V2.

Mỗi chương có bảy hồ sơ: `cN-e1` tham chiếu p1; `cN-e2` là nhật ký hư cấu; `cN-e3` tham chiếu p2; `cN-e4` gộp phần p3 và chú thích có nguồn p4, hiển thị cả hai nguồn; `cN-e5` và `cN-e6` là tài liệu đối chiếu p4; `cN-e7` là thư hư cấu. Nhờ chú thích trong e4, bốn hồ sơ thiết yếu đủ để giải quyết chương; hai hồ sơ bổ trợ là tùy chọn.

Phòng Lõi dùng lại các nguồn đã học qua bốn vấn đề mới về trình tự/bối cảnh, nhận diện, điều kiện xuất phát và cơ chế thực hiện. Demo V2 dùng nhật ký hư cấu của phòng 3 và diễn giải từ tr. 110–112. Không thêm khái niệm học thuật ngoài phạm vi đã chọn.

**Trạng thái V2 vẫn là 0 verified / 16 needs-review.** Viết lại tình huống, chạy tests hoặc tạo tranh không tự xác nhận nội dung học thuật. Các hướng dẫn đối chiếu cuối tài liệu tiếp tục áp dụng.

Tài liệu gốc: **MLN131 - Giao trinh CNXHKH.pdf**, *Giáo trình Chủ nghĩa xã hội khoa học*, Bộ Giáo dục và Đào tạo, NXB Chính trị quốc gia Sự thật, Hà Nội, 2021.

Tệp thực tế có **273 trang PDF**. Game chỉ dùng phạm vi Chương 1–4 được đặc tả ở `plan.md`, trang in **11–153**. Không coi trang 153 là cuối tệp, cuối Chương 4 hoặc cuối toàn bộ giáo trình.

Trong phạm vi đang dùng, trang PDF tính từ 1 theo quy đổi `pdfPage = printedPage - 3`. Ví dụ đã xem: PDF 8 là trang in 11, PDF 122 là trang in 125 và PDF 150 là trang in 153. Giao diện game hiển thị **trang in**.

## Nguồn của 16 mục tiêu — giữ nguyên qua các phiên bản

Các khoảng dưới đây được lưu dưới dạng mảng số trang đầy đủ trong `src/data/puzzles.ts`, bao gồm cả hai đầu khoảng. Tên câu và cột cơ chế là tham chiếu V1; ánh xạ cách chơi V3 ở bảng riêng nêu trên. `needs-review` nghĩa là chưa có xác nhận cuối cùng của người phụ trách học thuật.

| ID | Câu đố | Cơ chế | Chương | Trang in | Trang PDF (1-based) | Trạng thái |
|---|---|---|---:|---|---|---|
| r1-p1 | Ba giá sách nguồn gốc | classification | 1 | 12–16 | 9–13 | needs-review |
| r1-p2 | Dấu ấn của các nhà lý luận | matching | 1 | 15–27 | 12–24 | needs-review |
| r1-p3 | Đồng hồ lịch sử | timeline | 1 | 20–35 | 17–32 | needs-review |
| r1-p4 | Cánh cửa bản thảo | evidence-lock | 1 | 12–27 | 9–24 | needs-review |
| r2-p1 | Hai lăng kính về giai cấp công nhân | classification | 2 | 52–55 | 49–52 | needs-review |
| r2-p2 | Ba hệ thống sứ mệnh | matching | 2 | 57–59 | 54–56 | needs-review |
| r2-p3 | Cơ chế kích hoạt | classification | 2 | 60–64 | 57–61 | needs-review |
| r2-p4 | Khóa nhà máy hiện đại | evidence-lock | 2 | 65–68 | 62–65 | needs-review |
| r3-p1 | Bản thiết kế xã hội | matching | 3 | 93–103 | 90–100 | needs-review |
| r3-p2 | Hai lối chuyển tiếp | classification | 3 | 104–106 | 101–103 | needs-review |
| r3-p3 | Bốn lĩnh vực chuyển đổi | matching | 3 | 107–109 | 104–106 | needs-review |
| r3-p4 | Mật mã “bỏ qua” | evidence-lock | 3 | 110–112 | 107–109 | needs-review |
| r4-p1 | Ba mặt của dân chủ | matching | 4 | 126–127 | 123–124 | needs-review |
| r4-p2 | Ai là người tham gia quyết định? | classification | 4 | 153 | 150 | needs-review |
| r4-p3 | Bản đồ chức năng Nhà nước | matching | 4 | 144–145 | 141–142 | needs-review |
| r4-p4 | Khóa nền tảng dân chủ | evidence-lock | 4 | 147–148, 153 | 144–145, 150 | needs-review |

Trong bản V1 lịch sử, Final ghép bốn chủ đề với bốn mảnh tri thức và demo dùng hai thẻ R4-P2. Cơ chế ấy không áp dụng cho Final/demo V3 hiện tại. Nguồn V3 của từng đoạn được ghi cụ thể trong CONTENT_MAPPING_V3.md.

## Đối chiếu đã thực hiện

Ngày 04/11/2026, quá trình triển khai đã mở hình scan của các trang mẫu sau. Đây là **kiểm tra đại diện**, chưa phải soát toàn bộ câu chữ trong mọi trang dẫn nguồn:

| Chương | Trang in đã xem | Trọng tâm kiểm tra đại diện |
|---|---|---|
| 1 | 12, 14, 16, 20, 27 | Bối cảnh ra đời, tiền đề, giới hạn tư tưởng trước đó, mốc Tuyên ngôn và sự phát triển lý luận |
| 2 | 52, 57, 60, 62, 66, 67 | Khái niệm giai cấp công nhân, nội dung sứ mệnh, điều kiện khách quan/chủ quan và biến đổi hiện đại |
| 3 | 94, 96, 104, 105, 107, 110, 111 | Một số đặc trưng, hai hình thức quá độ, đặc điểm thời kỳ quá độ và nội hàm “bỏ qua chế độ” |
| 4 | 126, 127, 144, 147, 148, 153 | Các phương diện dân chủ, tiêu chí chức năng nhà nước, quan hệ dân chủ–nhà nước và hai hình thức dân chủ |

Hình phục vụ kiểm tra được lưu tạm ở `.build/source-review/` và không nằm trong build website. Nội dung game được diễn giải từ đặc tả; không sao chép dài từ scan và không trình bày như trích dẫn nguyên văn đã được duyệt.

**Tổng trạng thái: 0 verified / 16 needs-review.** Việc xem trang scan đại diện không tự chuyển trạng thái sang `verified`.

## Phân biệt nguồn và tình huống trò chơi

- Các trường `readingNote`, `explanation` và `keyTakeaways` là diễn giải phục vụ học tập; người duyệt cần kiểm tra tính đúng nghĩa, phạm vi và sự phù hợp với nguồn.
- Tên phòng, mật mã, cánh cửa, hồ sơ bị lỗi, mảnh tri thức và bối cảnh năm 2126 là yếu tố hư cấu, không phải dữ kiện giáo trình.
- Tình huống biểu quyết và đại biểu trong R4-P2, các đoạn Phòng Lõi và demo là **ví dụ minh họa do nhóm xây dựng, không phải ví dụ nguyên văn của giáo trình**. Cần giữ điều kiện về thẩm quyền và quy trình khi diễn giải hình thức dân chủ; demo hiện tại minh họa lệnh xử lý hồ sơ của phòng 3.
- Tài liệu bổ sung tại khóa R2-P4, R3-P4 và R4-P4 giúp người chưa đọc sách có đủ dữ kiện suy luận; nguồn vẫn là các trang đã ghi của chính câu đó.
- Bốn chủ đề ở Final không biểu diễn quan hệ nhân quả đơn tuyến. Điểm game không phải kết quả kiểm tra học thuật chính thức.

## Checklist cho người duyệt học thuật

1. Mở từng trang nguồn thực tế theo bảng trên; kiểm tra đúng phiên bản sách và số trang in.
2. Đọc đủ mọi thẻ, cặp ghép, mốc thời gian và nhận định đúng/sai của câu.
3. Soát `learningObjective`, `readingNote`, hai hints, `explanation` và `keyTakeaways`; kiểm tra cả khẳng định phủ định và các từ chỉ phạm vi như “một bộ phận”.
4. Kiểm tra các câu khóa được suy luận bằng manh mối và tài liệu bổ sung, không chỉ bằng kiến thức ngoài trò chơi.
5. Xác nhận lời giải không đưa thêm kết luận chính sách hoặc suy diễn ngoài phạm vi nguồn; giữ rõ các ví dụ minh họa.
6. Sau khi duyệt, ghi người duyệt, ngày duyệt và ghi chú thực tế; mới cập nhật `sourceReviewStatus` của câu sang `verified` trong nguồn dữ liệu/sinh dữ liệu và bảng này.
7. Chạy lại `npm run test` và `npm run build` sau mọi thay đổi nội dung. Nếu test mặc định đang yêu cầu `needs-review`, cập nhật kiểm tra trạng thái theo kết quả duyệt thực tế, không đổi trạng thái để chỉ làm test đạt.
8. Với V3, soát thêm `concept`, `scenario`, từng lựa chọn sai, căn cứ, lý do, phát hiện và cạnh `usesFindings`. Phân biệt quan hệ bối cảnh với quan hệ chứng minh; kiểm tra các đoạn Phòng Lõi chỉ vận dụng kiến thức đã được cung cấp trước đó.

Không có tên người duyệt hoặc ngày xác nhận được điền sẵn vì chưa nhận được xác nhận học thuật.
