# Thuyết trình Mật Mã Ký Ức

## Sử dụng

Mở `/admin` trên website Vercel, nhập mã riêng được bàn giao trong chat. Chọn một trong bốn phòng hoặc Toàn thư viện. Bật âm thanh và toàn màn hình bằng các nút phía trên khi cần. Kết thúc cảnh có Phát lại/Về bảng thuyết trình; Escape và nút đóng luôn dùng được. Khóa bảng điều khiển sau buổi học.

Phiên kéo dài tối đa hai giờ. Hiệu ứng chỉ xuất hiện trên máy đang mở trang, không phát tới thiết bị sinh viên. Không cần hoàn thành game trước khi trình diễn. Trang admin nằm ngoài bộ quản lý tiến độ: không đọc/ghi bản lưu V1/V2/V3, không mở hộp chuyển tiến độ, không trao mục tiêu học. Cài đặt âm thanh/chuyển động được dùng chung.

## Cấu hình Vercel

Giữ React/Vite. `api/presenter/[action].mjs` là một Vercel Node Function dùng định tuyến động cho `/api/presenter/:action`; các route giao diện vẫn dùng SPA. Giữ đường dẫn API gốc để máy chủ kiểm tra thao tác và WAF nhận diện đúng đường đăng nhập. `server/presenter.mjs` không được import vào frontend. Phát hành bằng Vercel từ root dự án; chỉ upload `dist` lên static hosting sẽ không có đăng nhập admin.

Chỉ cấu hình Production; Preview không bật admin. Các biến:

| Tên | Giá trị/kiểu |
|---|---|
| `ADMIN_ORIGIN` | Origin HTTPS chính xác, không có dấu `/` cuối; hiện dùng `https://spstmln-rho.vercel.app` |
| `ADMIN_CODE_HASH` | **Secret**, bản băm scrypt có muối, không phải mã gốc |
| `ADMIN_SESSION_SECRET` | **Secret**, khóa ngẫu nhiên 32 byte dạng hex |
| `ADMIN_ENABLED` | `true` sau khi chuẩn bị cấu hình |
| `ADMIN_RATE_LIMIT_READY` | `true` sau khi quy tắc WAF được bật và kiểm tra |

Quy tắc WAF **Presenter login limit**: path bằng `/api/presenter/login` và method POST; rate limit 5 yêu cầu/60 giây, fixed window, key IP, hành động vượt ngưỡng trả 429. Chỉ thêm quy tắc này, giữ nguyên các quy tắc khác. Mã trả lỗi 503 nếu thiếu cấu hình an toàn; biến READY là xác nhận của người triển khai, không tự chứng minh trạng thái WAF.

Sau khi đổi biến cần redeploy. Nếu đổi domain, cập nhật `ADMIN_ORIGIN` và redeploy. Thay bản băm hoặc khóa phiên sẽ làm phiên cũ hết hiệu lực trên bản triển khai mới. Giữ Deployment Protection cho các URL triển khai/Preview riêng khi có thể; không dùng lại bí mật Production cho môi trường khác.

## Lưu và thay mã

Mã gốc được tạo ngẫu nhiên 20 ký tự, trình bày thành bốn nhóm; hệ thống chấp nhận nhập có/không dấu gạch, chữ thường/hoa. Mã chỉ được bàn giao trong chat. Tệp `.env.admin.local` cục bộ chỉ chứa bản băm, khóa phiên và cấu hình; không chứa mã gốc. Tệp này được bỏ qua bởi Git và Vercel upload. Không chia sẻ ảnh chụp hoặc nội dung tệp.

`scripts/admin-credentials.mjs` cung cấp bộ tạo trong bộ nhớ; không tự in hoặc ghi mã. Khi cần thay mã, tạo mã mới, thay hai Secret trên Production, rồi redeploy. Không đưa mã vào `VITE_*`, `public`, URL, source, ảnh QA hoặc nhật ký ứng dụng. Cookie phiên dùng HTTPS, HttpOnly, SameSite Strict, chữ ký HMAC và hạn hai giờ; CSRF kiểm tra theo phiên cùng origin cho các thao tác POST. Đăng xuất xóa cookie trình duyệt; cơ chế không có danh sách thu hồi token riêng. Thay khóa để thu hồi các token cũ nếu nghi bị lộ.

## Chạy local

Sau khi có `.env.admin.local` hợp lệ, chạy `npm run dev:presenter`, mở `http://localhost:5173/admin`. Máy chủ này chỉ lắng nghe loopback, dùng cùng mã đã được băm và có giới hạn đăng nhập cục bộ. Giới hạn trong bộ nhớ chỉ phục vụ local; Production dùng WAF. `npm run dev` và `npm run preview` riêng chỉ phục vụ giao diện, không tạo API admin.

## Kiểm tra

- `npm test`: kiểm thử giao diện/luật chơi và API bảo mật.
- `npm run check:presenter`: tạo mã thử ngẫu nhiên trong bộ nhớ, build với bí mật thử, quét bản build, chạy HTTP thật và trình duyệt tại 1366/768/360px. Không dùng mã thật. Giới hạn WAF được mô phỏng riêng trên local.
- `npm run check:browser`, `npm run check:celebration`: kiểm tra hành trình chính và bốn cảnh hoàn thành phòng.
- Trên Vercel thật: kiểm tra API trả JSON, chưa đăng nhập không phát được, mã đúng đăng nhập được, các hiệu ứng hoạt động, nút Khóa xóa phiên và yêu cầu vượt giới hạn trả 429. Không lưu mã hoặc cookie trong báo cáo.

Bí mật được bảo vệ phía máy chủ; tranh, âm thanh, mã hiệu ứng và đáp án học tập vẫn là tài nguyên phía trình duyệt. Chế độ này không xác thực kết quả học của lớp và không dùng làm hệ thống thi.
