# Rà soát bảo mật — Mật Mã Ký Ức — Hồ Sơ 2126

Ngày kiểm tra: **09/11/2026**, múi giờ Asia/Bangkok.

## Cập nhật chế độ thuyết trình

Thêm `/admin` và Vercel Node Function tại `api/presenter/[action].mjs`, dùng chung `server/presenter.mjs`. Mã truy cập ngẫu nhiên 100 bit chỉ bàn giao trong chat, máy chủ lưu bản băm có muối scrypt (N=131072, r=8, p=1, 64 byte). Khóa phiên ngẫu nhiên 32 byte. Hai giá trị nhạy cảm là Vercel Secrets, chỉ Production; bản cấu hình cục bộ `.env.admin.local` bị Git/deployment ignore. Không lưu mã gốc trong tệp.

Phiên ký HMAC có hạn tuyệt đối hai giờ, gắn phiên bản bản băm và origin; cookie `__Host-`, Secure, HttpOnly, SameSite Strict. Kiểm tra Origin/Host và CSRF theo phiên cho các thao tác phát/đăng xuất; mỗi lần phát lại cần được máy chủ chấp nhận. Giới hạn thân JSON 1 KB, chỉ chấp nhận năm ID hiệu ứng, không ghi nội dung yêu cầu/cookie/mã vào log ứng dụng. Các tham số tuyến động Vercel phải khớp với đường dẫn, không được dùng để chọn thao tác khác. Thiếu cấu hình hoặc Preview giữ trạng thái khóa.

Quy tắc **Presenter login limit** đã được bật trên dự án `spstmln`: 5 POST `/api/presenter/login` mỗi 60 giây theo IP, vượt ngưỡng trả 429. Không dùng bộ đếm trong bộ nhớ cho Production. `ADMIN_RATE_LIMIT_READY` là xác nhận vận hành sau khi kiểm tra WAF, không phải tự kiểm chứng WAF. Đăng xuất xóa cookie; token đã bị đánh cắp vẫn cần hết hạn hoặc thay khóa để thu hồi vì thiết kế không có kho phiên trung tâm.

Kiểm tra mới: 13 bài API về cấu hình đóng an toàn, Origin, thân yêu cầu, mã sai/đúng, chữ ký, hết hạn, CSRF, thay khóa và đăng xuất; 192 bài Vitest; kiểm tra trình duyệt local với API thật và bí mật thử. Quét source/tệp có thể đưa lên Git và bản build không thấy bản băm/khóa thật; build với giá trị thử cũng không làm lộ các giá trị đó vào frontend. Gói gửi Vercel được kiểm tra bằng `vercel deploy --dry --json`: có đủ source/API/helper, không có `.env`, khóa riêng hoặc bài kiểm thử. Sửa quy tắc mở lại thư mục trong `.vercelignore` theo kết quả danh sách thực tế của CLI trên Windows.

Giao diện admin nằm ngoài bộ quản lý tiến độ: không đọc/ghi V1/V2/V3, không tạo tiến độ giả. Cảnh kết/tranh/âm thanh/đáp án vẫn công khai trong frontend. Các số liệu kiểm tra cũ dưới đây là mốc lịch sử của lần rà soát trước, không đại diện số bài kiểm thử hiện tại. Hướng dẫn vận hành: [PRESENTER.md](docs/PRESENTER.md).

## Phạm vi và kết quả

Đã rà soát mã ứng dụng V1/V2, các script nội bộ, cấu hình build/hosting, cách đọc bản lưu và ghi chú, tài nguyên công khai và bản production build. Quét mẫu thông tin nhạy cảm trên 93 tệp văn bản, gồm toàn bộ 31 tệp trong `src` và 9 tệp trong `scripts`. Không quét mã thư viện từng dòng; phụ thuộc được kiểm tra bằng npm audit. Bỏ qua cache thư viện và tệp nhị phân.

Không phát hiện khóa API, token, mật khẩu hoặc khóa riêng tư ghi cứng theo các mẫu đã kiểm tra. Không tìm thấy thao tác chèn HTML thô hoặc thực thi chuỗi JavaScript trong mã chạy trên trình duyệt. Ghi chú được hiển thị bằng giá trị textarea của React, không được đưa vào HTML. Đây là kết quả rà soát tại thời điểm trên, không phải bảo đảm không còn mọi loại lỗ hổng.

## Các điểm đã xử lý

| Điểm phát hiện | Mức độ và tác động | Thay đổi |
|---|---|---|
| `minimatch` 10.2.6 có lỗ hổng khuếch đại mẫu glob, kéo theo 10 cảnh báo trong chuỗi ESLint/TypeScript ESLint | Trung bình theo npm/GitHub; thuộc công cụ phát triển, không phải thư viện chạy trong game. Chưa có đường nhận glob từ người chơi. | Ghim bản vá 11.0.1 bằng `overrides`, cập nhật lockfile. Không hạ phiên bản ESLint. Đã kiểm tra tương thích bằng lint, kiểm thử và build. |
| `.gitignore` chỉ loại một số tệp cục bộ | Cần bổ sung phòng ngừa đưa nhầm tệp môi trường, credentials hoặc dữ liệu nội bộ vào Git; không phát hiện việc lộ khóa thực tế. | Loại `.env` và các biến thể, khóa ký, credentials, cấu hình xác thực/cloud cục bộ, thư mục riêng, dữ liệu dự phòng, log, output, giáo trình PDF và đáp án xuất riêng. Giữ mã nguồn, ảnh/nhạc/fonts và giấy phép. Chỉ cho phép các mẫu `.env.example`, `.env.sample`, `.env.template` không chứa bí mật. |
| Chưa giới hạn rõ tập tệp gửi khi deploy | Phòng ngừa gửi kèm tài liệu và dữ liệu máy cá nhân. | Thêm `.vercelignore` theo danh sách cho phép: mã nguồn, tài nguyên runtime và cấu hình cần cho build; loại thêm mẫu tệp nhạy cảm trong các thư mục được cho phép. |
| Chưa có các header bảo vệ trình duyệt trong cấu hình Vercel | Gia cố chống chèn script, nhúng trang trong iframe và rò rỉ thông tin qua referrer; không phải bằng chứng đã bị tấn công. | Thêm CSP, `nosniff`, chống nhúng iframe, `no-referrer` và vô hiệu camera/microphone/vị trí/payment/USB. Giữ điều hướng SPA. |

Bản vá được đối chiếu với [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249). Chỉ bỏ override khi các gói cha đã dùng bản an toàn và kiểm tra lại đạt.

CSP cho phép script, ảnh, font, nhạc và kết nối cùng nguồn; chặn script inline/eval, plugin, form và nhúng trang. `style-src` còn cho phép style inline vì giao diện React/SVG dùng style động. Khi cần nhúng game vào LMS bằng iframe, phải thiết kế lại chính sách nhúng theo danh sách nguồn cụ thể. Cấu hình tham khảo: [Vercel headers](https://vercel.com/docs/project-configuration/vercel-json#headers), [OWASP HTTP Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html).

## Kiểm chứng sau sửa

- `npm audit`: **0** info / low / moderate / high / critical; trước sửa có 10 cảnh báo moderate cùng xuất phát từ một advisory.
- `npm run lint`, `npm test`, `npm run build`: đạt; **89/89 kiểm thử**, 5 tệp kiểm thử.
- Kiểm tra 42 trường hợp đường dẫn cho Git/deployment ignore: tệp nhạy cảm bị loại, mã và tài nguyên cần thiết vẫn được giữ.
- Lượt chơi production tự động ở 1366px, 768px và 360px với các header Vercel áp dụng trên máy local: đạt, 13 ảnh kiểm tra, không lỗi JavaScript, lỗi tải tài nguyên hoặc vi phạm CSP ngoài ý muốn. Script `check-browser` đã áp dụng chính sách này cho các lượt kiểm tra local tiếp theo.
- Thử chèn thẻ HTML/script vào ghi chú: vẫn là văn bản, không tạo ảnh hoặc chạy script. Thử thêm script inline và ảnh từ nguồn ngoài: bị CSP chặn.
- Bản phát hành có 37 tệp, 7.594.728 byte; không thấy đường dẫn tệp môi trường, khóa, dữ liệu credentials, giáo trình, đáp án xuất riêng, mã nguồn rời hoặc source map.

Chi tiết kỹ thuật cục bộ ở `.build/security/` và `output/qa/browser-report.json`; cả hai thư mục được loại khỏi Git/deployment. Kết quả dependency audit không thay thế kiểm tra mã độc hoặc toàn bộ mã của nhà cung cấp thư viện.

## Những giới hạn cần giữ rõ

1. **Đáp án và tiến độ ở phía người chơi.** Nội dung lời giải cần cho game nằm trong JavaScript đã build; bản lưu nằm trong localStorage. Người có công cụ trình duyệt có thể đọc đáp án hoặc sửa một bản lưu có cấu trúc hợp lệ. Không sử dụng dữ liệu này làm kết quả thi, phần thưởng có giá trị hoặc xác thực người dùng. Các tính năng như vậy cần kiểm tra ở máy chủ.
2. **Ghi chú và tiến độ không được mã hóa.** Luồng ứng dụng hiện không gửi chúng đến dịch vụ ngoài; người có quyền truy cập cùng trình duyệt/thiết bị vẫn có thể đọc chúng.
3. **Ignore không xóa dữ liệu đã được Git theo dõi.** Dự án hiện được quản lý trong Git; bản cập nhật này kiểm tra tệp chuẩn bị commit, không phải bảo đảm mọi lịch sử hay kho khác không có bí mật. Nếu đã từng công bố bí mật ở nơi khác, phải thu hồi/thay và xử lý lịch sử riêng. [Tài liệu Git](https://git-scm.com/docs/gitignore).
4. **Không đặt bí mật trong `public`, mã frontend hoặc biến `VITE_*`.** Một tệp bị Git ignore vẫn có thể bị build đưa vào website nếu ứng dụng tham chiếu nó hoặc đặt trong thư mục public. `VITE_*` được đưa vào mã phía trình duyệt khi build. [Tài liệu Vite](https://vite.dev/guide/env-and-mode.html#env-variables).
5. **Phạm vi Production đã kiểm tra.** Đã kiểm tra `https://spstmln-rho.vercel.app`: API JSON, đăng nhập bằng mã thật, cookie bảo vệ, kiểm tra phiên/CSRF, năm hiệu ứng ở ba kích thước, giữ bản lưu, tải lại, đăng xuất và WAF trả429. Mã/cookie không được lưu trong ảnh hoặc báo cáo. Chưa đánh giá toàn bộ quyền tài khoản GitHub/Vercel hoặc hệ thống khác ngoài dự án này.

Các script sinh tranh/nhạc/slide chỉ dành cho máy phát triển. Lệnh xử lý media dùng `execFileSync` với mảng tham số; script slide có `new Function` để chạy mã TypeScript nội bộ đáng tin cậy và không được đóng gói vào game. Không dùng các script này để xử lý mã nguồn hoặc cấu hình do người lạ gửi.
