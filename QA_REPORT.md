# Kiểm tra bàn giao — Mật Mã Ký Ức — Hồ Sơ 2126 V2

Ghi nhận ban đầu: 08/11/2026; cập nhật gần nhất: 09/11/2026. Đây là kết quả kỹ thuật thực tế, không phải khảo sát hiệu quả học tập.

## Kết quả

| Hạng mục | Kết quả |
|---|---|
| `npm run lint` | PASS, không lỗi/cảnh báo ở lần kiểm tra cuối |
| `npm run test` | PASS, 123 bài trong 8 file |
| `npm run build` | PASS, xuất `dist/` |
| Chromium production | PASS, chơi qua bốn phòng và Phòng Lõi bằng giao diện |
| 1366px / 768px / 360px | PASS, không tràn ngang |
| Touch mô phỏng | PASS, hotspot, panel đồ vật và Sổ chung |
| Bàn phím/focus | PASS cho skip link đầu trang và trả focus sau dialog; các thao tác dùng nút/input chuẩn |
| Tải lại | PASS tại phòng 3 và kết quả; lựa chọn chưa nộp cũng có bài kiểm tra riêng |
| Bản lưu V1 | PASS, không bị reset hoặc ghi đè bởi V2/demo |
| Bản lưu V2 hỏng | PASS, mở thẳng phòng không tự ghi đè trước thao tác người chơi |
| Lưu bị chặn | PASS, tiếp tục thu thập trong tab, có thông báo |
| Hai đoạn kết | PASS, khác nhau theo số thư, không theo số lần thử/gợi ý |
| Nhạc | PASS phát cả Synthwave 4k và Contemplation sau thao tác bật, không báo lỗi autoplay; chỉnh volume giữ nguyên đối tượng phát và vị trí bài |
| Giảm chuyển động | PASS, không thay đổi tiến độ |
| Lỗi chạy hoặc tài nguyên HTTP lỗi trong lượt browser | 0 |
| Lượt tải đầu trang chủ | Khoảng 1,88 MB ở cả ba kích thước, với các header bảo mật production |

`output/qa/browser-report.json` là báo cáo chi tiết của lượt production cuối, kèm 13 ảnh giao diện. Không có đường debug vượt khóa trong bản phát hành; lượt chơi đầy đủ đi bằng giao diện. Fixture chỉ được dùng để chuẩn bị trạng thái cho ảnh phòng 3 và kiểm tra riêng kết thúc thường.

## Cẩm nang riêng và gợi ý lần đầu

- Tab **Hướng dẫn** nằm cạnh **Sổ chung** trên mọi trang, kể cả demo. Điện thoại dùng hai hàng header, cả ba nhãn Bản đồ / Sổ chung / Hướng dẫn luôn hiện trên cùng hàng điều hướng.
- `/guide` có mục lục 10 phần: bối cảnh, bốn vai, màn hình, chứng cứ, kiểm chứng, hội đồng, Sổ chung, toàn hành trình, điều khiển/lưu và gỡ rối. Có ví dụ ghép thẻ tương tác độc lập cùng ví dụ lập luận có thể mở; không cộng tiến độ.
- Lần đầu truy cập có khung gợi ý với mũi tên và tab được làm nổi bật. Đọc hoặc đóng gợi ý bằng nút/Escape ghi nhận trên trình duyệt; chặn lưu vẫn đóng được trong tab hiện tại, kể cả đi qua demo. Không chiếm focus đầu trang; Escape của dialog không đồng thời đóng gợi ý.
- Nút quay lại nhớ trang vừa mở sau khi dùng mục lục. Bản lưu phòng, câu trả lời, dự thảo hội đồng, ghi chú và V1 được giữ; vào hướng dẫn không ghi đè bản lưu V2 lỗi.
- Lint, 123 kiểm thử và production build đạt. Lượt chơi đầy đủ trên Chromium đạt. Kiểm tra riêng cẩm nang ở 1366/768/360px đạt, gồm chạm mô phỏng, thiếu/sai/đúng/làm lại ví dụ, mục lục, quay lại, tải lại và chặn lưu. Không tràn ngang, lỗi JavaScript, tài nguyên lỗi hoặc vi phạm CSP trong các lượt đã kiểm tra.
- Báo cáo riêng: `output/qa/game-guide-report.json`, 12 ảnh gồm `guide-intro-360.png`, `guide-page-1366.png`, `guide-practice-360.png`. Đã xem trực tiếp ảnh desktop và mobile; chưa có thử nghiệm người chơi thật cho cẩm nang mới.

## Thay nhạc nền miễn phí

- Khám phá: Synthwave 4k — The Cynic Project, CC0, 157,90 giây.
- Hội đồng: Contemplation — Joth, CC0, 120,06 giây.
- Tệp nguồn do tác giả đăng trên OpenGameArt; nguồn và giấy phép được kiểm tra tại từng trang nhạc. Ghi công có trong game và `public/audio/CREDITS.md`; giữ bản pháp lý CC0 cùng tài nguyên.
- FFmpeg giải mã thành công; mức trung bình lần lượt −23,6 / −24,0 dB, đỉnh −7,1 / −6,8 dB, không clipping. Đây là số đo tín hiệu, không phải đánh giá cảm nhận người nghe.
- Nhạc được làm mềm dải cao, fade đầu/cuối, mức khởi đầu 12% cho hồ sơ cài đặt mới. Cài đặt âm lượng người chơi đã chọn vẫn được giữ.
- Browser kiểm tra cả hai tệp đang phát và thời gian tiến lên; chỉnh volume không tạo lại nhạc. Trang Về trò chơi hiển thị đúng credit và đường dẫn CC0.
- Hai tệp nhạc tổng hợp cũ đã bỏ khỏi thư mục phát hành. Script sinh hiệu ứng không còn ghi đè nhạc nền mới.

## Hướng dẫn chơi trên trang chủ

- Có liên kết tới hướng dẫn ngay dưới các nút bắt đầu; sáu bước mô tả đúng thao tác trong game, kèm câu hỏi thường gặp và đường vào demo.
- PASS kiểm tra ở 1366px và 360px: đủ sáu bước, liên kết cuộn đúng mục, mở trợ giúp bằng bàn phím, vào demo và không thay đổi tiến độ chính; không tràn ngang hoặc có lỗi JavaScript.
- Lint và production build đạt. Báo cáo: `output/qa/home-help-report.json`; ảnh: `output/qa/home-help-1366.png` và `output/qa/home-help-360.png`. Điện thoại được mô phỏng bằng Chromium.

## Viết lại nội dung để dễ suy luận

- Cả 4 phiên hội đồng, 4 đoạn Phòng Lõi và demo có câu hỏi cụ thể, ý cần kiểm tra, hướng dẫn suy luận, giải mẫu có lý do và ghi chú giải thích vai trò từng hồ sơ. Mở giải mẫu không tự chọn đáp án, nộp hoặc thay tiến độ.
- 28 hồ sơ có ý chính dễ đọc; vẫn mở được diễn giải đầy đủ và thấy nguồn, nhãn hư cấu/minh họa, trạng thái chờ duyệt. Viết lại lời dẫn và hai cấp gợi ý cho 12 nhiệm vụ, mở tài liệu đọc nhanh tại nhiệm vụ và bảng ghép mẫu khi dùng gợi ý cấp hai. Các chữ viết tắt trong thẻ thao tác được viết đầy đủ.
- Chấp nhận căn cứ đầy đủ kèm thẻ bổ sung liên quan, không bắt khớp tuyệt đối số thẻ. Vẫn từ chối thẻ không liên quan, lặp, chưa thu thập hoặc thiếu căn cứ. Giải thích lựa chọn sai và chỉ rõ thẻ cần thêm/bỏ; nút sửa đưa focus về đúng bước. Trạng thái lưu cũ vẫn hợp lệ.
- 114 kiểm thử đạt, gồm kiểm tra cả 8 giải mẫu, giải thích theo từng lựa chọn, thẻ bổ sung, thẻ sai, nguồn và bản lưu cũ. Giữ 16 mục tiêu học và 0 verified / 16 needs-review; việc viết lại không phải xác nhận học thuật.
- Lượt chơi đầy đủ trên desktop và giao diện 1366/768/360px đạt. Kiểm tra riêng 18 lượt hội đồng (4 phòng + 4 đoạn cuối + demo, mỗi loại ở 1366px và 360px) đạt: mẫu giữ lựa chọn, sửa đúng phần, nộp được, demo không ghi tiến độ chính; không lỗi JavaScript/CSP hoặc tràn ngang.
- Báo cáo: `output/qa/clear-content-report.json`; ảnh: `output/qa/clear-case-1-1366.png`, `output/qa/clear-case-1-360.png`, `output/qa/clear-final-3-360.png`. Kiểm tra điện thoại là mô phỏng; chưa có khảo sát người chơi thật về mức dễ hiểu.

## Chỉ dẫn qua phòng trong lúc chơi

- Mỗi phòng có “Việc cần làm tiếp theo”: đếm riêng 4 chứng cứ bắt buộc, 3 kiểm chứng và trạng thái hội đồng. Nút dẫn tới đúng hồ sơ hoặc bước còn thiếu, không ép thứ tự khám phá. Nêu rõ 2 hồ sơ bổ trợ và thư là tùy chọn.
- Nút thu thập thống nhất “Ghi nhận chứng cứ”; đọc tài liệu chưa tự tính là thu thập. Bước kiểm chứng báo dữ kiện chưa gắn hoặc một thẻ chưa khớp; có nút đi tiếp sau khi làm đúng. Hội đồng hiển thị số hồ sơ cần gắn, số đã chọn và cách bỏ thẻ thừa. Phục dựng thành công đi thẳng tới phòng kế tiếp.
- Lint, 92 kiểm thử và production build đạt. Ba kiểm thử mới đi theo chỉ dẫn qua phòng chỉ với chứng cứ bắt buộc, thử thiếu/sai thẻ, tải lại ở trạng thái sẵn sàng và đề xuất sớm.
- Lượt chơi Chromium đầy đủ đạt trên desktop; giao diện ở 1366px, 768px và 360px không tràn ngang, lỗi JavaScript hoặc lỗi tải tài nguyên. Thử thêm luồng hướng dẫn trên điện thoại mô phỏng: qua phòng 1 chỉ với 4 chứng cứ bắt buộc rồi đi thẳng vào phòng 2.
- Báo cáo riêng: `output/qa/room-guide-report.json`; ảnh: `output/qa/room-guide-1366.png`, `output/qa/room-guide-360.png` và `output/qa/guide-collect-360.png`. Chưa có kết quả đo mức dễ hiểu với người chơi thật.

## Tăng cỡ chữ

- Nội dung đọc chính 16–18px, nút và lựa chọn thao tác tối thiểu 16px, nhãn vai 12px. Giữ cỡ chữ nội dung trên điện thoại thay vì thu nhỏ để ép vừa.
- Điều chỉnh xuống dòng cho nút, thẻ, thanh vai và panel; dùng thẻ bản đồ một cột, nhãn chương hai cột và danh sách điểm khám phá có chữ lớn trên điện thoại. Tên điểm trong cảnh nhỏ được đọc qua danh sách tương đương để tránh chồng lên nhau.
- Lint và production build đạt. Đã chạy lại toàn bộ lượt chơi trình duyệt ở 1366px, 768px và 360px: 13 ảnh, không tràn ngang, lỗi JavaScript, lỗi tải tài nguyên hoặc vi phạm CSP ngoài ý muốn. Hướng dẫn trang chủ và đường vào demo cũng đạt ở 1366px và 360px.
- Kiểm tra trực quan phòng 3 trên desktop, panel chứng cứ/hội đồng trên điện thoại mô phỏng và hướng dẫn trang chủ: chữ xuống dòng, không bị cắt ở các ảnh đã kiểm tra.

## Đổi tên thành Mật Mã Ký Ức — Hồ Sơ 2126

- Đồng bộ logo chữ, trang chủ, phụ đề, câu giới thiệu, tiêu đề tab theo trang, metadata chia sẻ, nút chia sẻ kết quả, thông báo hành trình và tài liệu dự án.
- Lint, 89 kiểm thử và production build đạt. Kiểm tra trình duyệt ở 1366px, 768px và 360px: tên trang chủ, metadata, tiêu đề các route và dữ liệu gửi vào hộp chia sẻ đúng tên mới; không tràn ngang hoặc có lỗi JavaScript/CSP.
- Bản lưu V2 trước khi đổi tên vẫn mở được kết quả và giữ nguyên ghi chú, không khởi tạo lại tiến độ. Chỉ đổi tên hiển thị, giữ các khóa lưu và ID nội dung.
- Báo cáo: `output/qa/rename-report.json`; ảnh: `output/qa/rename-hero-1366.png`, `output/qa/rename-hero-768.png`, `output/qa/rename-hero-360.png`. Điện thoại được mô phỏng; chưa xác nhận bản deploy Vercel thực tế.

## Rà soát bảo mật ngày 09/11/2026

- Đã vá dependency `minimatch` lên 11.0.1; npm audit từ 10 cảnh báo moderate về 0 cảnh báo. Lint, 89 kiểm thử và production build đạt sau sửa.
- Đã kiểm tra lại lượt chơi đầy đủ với các header Vercel trên local; không lỗi JavaScript, lỗi tải tài nguyên hoặc lỗi CSP ngoài ý muốn. Thử riêng ghi chú có HTML/script không thực thi; CSP chặn script inline và ảnh từ nguồn ngoài.
- 42 trường hợp đường dẫn Git/deployment ignore đạt. Bản phát hành có 37 tệp, không thấy tệp môi trường, credentials, khóa, giáo trình, đáp án xuất riêng hoặc source map.
- Kết quả và giới hạn được ghi trong `SECURITY_REVIEW.md`. Chưa kiểm tra header trên domain Vercel thực tế hoặc lịch sử Git; thư mục hiện chưa phải Git repository.

## Ảnh giao diện

- [Trang chủ desktop](output/qa/landing-1366.png).
- [Phòng 3 desktop](output/qa/room-3-1366.png).
- [Phòng 3 điện thoại mô phỏng](output/qa/room-3-360.png).
- [Panel đồ vật 360px](output/qa/inspector-360.png).
- [Bàn hội đồng 360px](output/qa/council-360.png).
- [Kết quả đặc biệt](output/qa/result-complete.png).
- [Demo hoàn thành](output/qa/demo-complete.png).
- [Nguồn và ghi công nhạc mới](output/qa/music-credits.png).

## Chưa xác nhận

- Chưa thử trên điện thoại vật lý hoặc nhiều dòng trình duyệt; touch ở đây là mô phỏng bằng Chromium.
- Chưa quan sát năm sinh viên, chưa có số liệu thời lượng trung vị hoặc mức hấp dẫn. Dùng `docs/PLAYTEST.md` để thực hiện.
- Nội dung học thuật giữ 0 verified / 16 needs-review; cần duyệt đầy đủ với nguồn thực tế.
- Chưa deploy public; PowerPoint cũ vẫn là bản V1 theo phạm vi đã chốt.
