# Kiểm tra bàn giao — Hội đồng phục dựng V2

Ngày ghi nhận: 08/11/2026. Đây là kết quả kỹ thuật thực tế, không phải khảo sát hiệu quả học tập.

## Kết quả

| Hạng mục | Kết quả |
|---|---|
| `npm run lint` | PASS, không lỗi/cảnh báo ở lần kiểm tra cuối |
| `npm run test` | PASS, 89 bài trong 5 file |
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
| Lượt tải đầu trang chủ | 1.861.721 byte, khoảng 1,86 MB ở cả ba kích thước, với các header bảo mật production |

`output/qa/browser-report.json` là báo cáo chi tiết của lượt production cuối, kèm 13 ảnh giao diện. Không có đường debug vượt khóa trong bản phát hành; lượt chơi đầy đủ đi bằng giao diện. Fixture chỉ được dùng để chuẩn bị trạng thái cho ảnh phòng 3 và kiểm tra riêng kết thúc thường.

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

## Tăng cỡ chữ

- Nội dung đọc chính 16–18px, nút và lựa chọn thao tác tối thiểu 16px, nhãn vai 12px. Giữ cỡ chữ nội dung trên điện thoại thay vì thu nhỏ để ép vừa.
- Điều chỉnh xuống dòng cho nút, thẻ, thanh vai và panel; dùng thẻ bản đồ một cột, nhãn chương hai cột và danh sách điểm khám phá có chữ lớn trên điện thoại. Tên điểm trong cảnh nhỏ được đọc qua danh sách tương đương để tránh chồng lên nhau.
- Lint và production build đạt. Đã chạy lại toàn bộ lượt chơi trình duyệt ở 1366px, 768px và 360px: 13 ảnh, không tràn ngang, lỗi JavaScript, lỗi tải tài nguyên hoặc vi phạm CSP ngoài ý muốn. Hướng dẫn trang chủ và đường vào demo cũng đạt ở 1366px và 360px.
- Kiểm tra trực quan phòng 3 trên desktop, panel chứng cứ/hội đồng trên điện thoại mô phỏng và hướng dẫn trang chủ: chữ xuống dòng, không bị cắt ở các ảnh đã kiểm tra.

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
