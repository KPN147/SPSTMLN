# Danh mục tài nguyên V2

## Tranh được tạo riêng

Công cụ: image generation tích hợp. Tạo mới theo bộ mẫu chung; không dùng ảnh stock, nhân vật có bản quyền được chỉ định hoặc tác phẩm của họa sĩ cụ thể làm tham chiếu. Các prompt và mô tả nguồn nằm trong `ART_PROMPTS.md`.

| Tệp trong `public/art/` | Nội dung | Định dạng xuất |
|---|---|---|
| `room-1.webp`…`room-4.webp` | Bốn khu vực điều tra | 2048×1152 |
| `council.webp` | Bàn hội đồng | 2048×1152 |
| `core.webp` | Phòng Lõi | 2048×1152 |
| `hero.webp` | Bảng mẫu bốn nhân vật trong thư viện, dùng trên trang chủ | 2048×1365 |
| `portrait-an.webp`, `portrait-minh.webp`, `portrait-vy.webp`, `portrait-khoi.webp` | Mỗi tệp có năm biểu cảm trên atlas 3×2; ô cuối trống | 1152×768, giữ alpha |
| `evidence-1.webp`…`evidence-4.webp` | Mỗi tệp có bảy hình chứng cứ trên atlas 4×2; ô cuối trống | 1536×768 |

Atlas giúp dùng đủ 20 biểu cảm và 28 hình chứng cứ mà không tạo hàng chục yêu cầu tải. SVG của thiết bị, đường nối và giao diện là các lớp riêng có thể chỉnh sửa trong source. Không chèn chữ vào ảnh sinh.

`scripts/prepare-art.mjs` chỉ xuất/resize/nén các ảnh đã sinh; không gọi API tạo ảnh. Đầu vào cục bộ trong `scripts/art-inputs.local.json` bị bỏ qua bởi Git vì chứa đường dẫn máy. Không cần script này để chạy hoặc build game đã bàn giao. Các file cuối nằm trong dự án, không phụ thuộc thư mục ảnh của công cụ.

## Nhạc nền miễn phí và hiệu ứng gốc

Nhạc nền hiện tại thay cho hai vòng nhạc tổng hợp 48 giây:

- `explore-ambient.ogg`: **Synthwave 4k — The Cynic Project**, bản đầy đủ khoảng 2 phút 38 giây, nguồn [OpenGameArt](https://opengameart.org/content/calm-ambient-1-synthwave-4k).
- `council-ambient.ogg`: **Contemplation — Joth**, bản đầy đủ khoảng 2 phút, nguồn [OpenGameArt](https://opengameart.org/content/contemplation-0).
- Giấy phép **CC0 1.0**, miễn phí; game vẫn ghi công tác giả. Ghi công hiển thị tại trang Về trò chơi, lưu cùng [credits](../public/audio/CREDITS.md) và bản giấy phép `public/audio/CC0-1.0.txt`.
- Chỉnh sửa: giữ bản đầy đủ, lọc tần số thấp/cao để giảm độ gắt, cân âm lượng đích −22 LUFS, fade đầu 2,5 giây/cuối 3 giây, nén Ogg Vorbis. Không đổi cao độ hoặc tốc độ.

`scripts/generate-audio.mjs` chỉ tổng hợp tám hiệu ứng gốc bằng hàm sóng, không ghi đè nhạc nền được cấp phép:

- `select.ogg`, `open.ogg`, `collect.ogg`, `connect.ogg`, `reject.ogg`, `insight.ogg`, `chapter.ogg`, `final.ogg`: tám hiệu ứng.

Tệp cuối được giữ trong `public/audio`, không stream từ website bên ngoài khi chơi. `scripts/fetch-music.mjs` tải từ tệp tác giả đăng trên OpenGameArt. `scripts/prepare-music.mjs` xuất nhạc từ nguồn tải vào `.build/music-sources/verified`, lưu checksum/báo cáo xử lý trong `.build/music-sources/processing-report.json`. Chạy game không cần FFmpeg; chỉ cần khi tạo lại âm thanh.

## Font và biểu tượng

- Be Vietnam Pro Regular và SemiBold từ [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/bevietnampro).
- Lora variable từ [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/lora).
- Font và bản giấy phép SIL Open Font License được đóng gói trong `public/fonts`; không tải Google Fonts trong lúc chơi.
- Biểu tượng từ dependency lucide-react đã có của dự án; giữ giấy phép dependency. Đường nét cảnh và favicon dựng riêng bằng SVG.

Trạng thái duyệt học thuật được quản lý riêng trong `CONTENT_SOURCES.md`.
