# Mật Mã Ký Ức — Hồ Sơ 2126 — Thiết kế và bản triển khai V2

## Quyết định sản phẩm

Một người điều khiển An, Minh, Vy và Khôi. Bốn cuộc điều tra nối tiếp, 16 mục tiêu học, một báo cáo tổng hợp cuối. Truyện tranh bí ẩn 2D, kiến trúc cổ kết hợp công nghệ tương lai, tranh tạo riêng và hiệu ứng CSS/SVG. Không có backend, AI runtime, đăng nhập, multiplayer hoặc 3D.

Vòng chơi: nhận sự cố → khám phá → đối thoại/đối chiếu → kiểm chứng → hội đồng → phục dựng. Thời lượng 25–35 phút là mục tiêu thiết kế; chưa có số đo từ sinh viên.

## Cấu trúc một cuộc điều tra

- Sáu hotspot; bốn điểm mở từ đầu. Điểm 05 mở sau chứng cứ 02, điểm 06 sau chứng cứ 03.
- Bốn chứng cứ thiết yếu, hai chứng cứ đối chiếu tùy chọn. Cả hai hướng tài liệu và kiểm tra máy đều đi đến kết luận hợp lệ.
- Một phong thư phụ mở sau kiểm chứng thứ hai; thao tác riêng để ghi nhận thư.
- Ba bước kiểm chứng dùng khả năng của An, Minh và Vy; Khôi tổng hợp tại phiên hội đồng.
- 16 nút hội thoại mỗi phòng, lựa chọn có điều kiện. Hỏi rõ mở diễn giải; đối chiếu đưa tài liệu liên quan vào panel và ghi liên kết trong Sổ chung; hướng tiếp cận đổi gợi ý điều tra; phản biện và chạy thử ghi nhận vào lịch sử.
- Thao tác tại đồ vật có thể tự chuyển vai. Chứng cứ đã tìm được chia sẻ; không yêu cầu đọc lại bằng mọi vai.

## Bản đồ nội dung

| Chương | Ba hoạt động điều tra | Phiên hội đồng |
|---|---|---|
| Khởi nguyên | Phân biệt nhóm tiền đề; sửa nhãn tác giả/tác phẩm; phục hồi mốc từ biên mục | Xuất xứ và kế thừa có phê phán |
| Sứ mệnh | Hai lớp nhận diện; nối ba nội dung; tìm điều kiện khách quan/chủ quan | Biến đổi hiện đại không thay thế các phương diện khái niệm |
| Chuyển mình | Chú giải đặc trưng; hai tuyến theo điều kiện xuất phát; bốn lĩnh vực | Sửa phạm vi lệnh “bỏ qua” |
| Quyền làm chủ | Ba phương diện; theo dấu chủ thể thực hiện quyền; tiêu chí chức năng | Nối quyền với cơ chế thực hiện |

Các ID `r1-p1`…`r4-p4` giữ vai trò mục tiêu học và tra cứu nguồn. Dữ liệu tham chiếu học thuật vẫn ở `src/data/puzzles.ts`; cấu trúc hành trình mới ở `src/council/content.ts`. Không chạy lại bộ sinh V1 trong quy trình V2.

## Hội đồng và Phòng Lõi

Mỗi đề xuất trả lời ba câu: bản ghi sai ở đâu, hồ sơ nào chứng minh và sửa bằng cách nào. Từng phiên có câu hỏi ngắn, ý cần kiểm tra, lý do dùng từng hồ sơ và cách trả lời mẫu có thể mở khi mắc. Mở mẫu không tự điền, nộp hoặc hoàn thành nhiệm vụ.

Kiểm tra yêu cầu điều tra trước, sau đó phản hồi cụ thể theo lựa chọn. Đủ một bộ chứng cứ hỗ trợ là hợp lệ; có thể thêm hồ sơ được xác định liên quan, nhưng không thêm hồ sơ phục vụ vấn đề khác. Phản hồi nêu tên thẻ cần bổ sung hoặc bỏ ra và có nút về bước sai. Giữ các bộ cũ để không làm hỏng bản lưu; riêng đoạn cuối về tuyến chuyển tiếp chấp nhận trực tiếp hồ sơ điều kiện xuất phát. Không phạt gợi ý hoặc lần thử.

28 hồ sơ có bản đọc ngắn, bản diễn giải gốc và nguồn. 12 nhiệm vụ dùng câu lệnh trực tiếp, tài liệu đọc nhanh, gợi ý hai cấp và bảng ghép mẫu sau cấp hai. Nội dung hội đồng ở `src/council/councilContent.ts`; bản đọc ngắn và lời phản ứng ở `src/council/evidenceContent.ts`. Các ID, nhóm đáp án thao tác và 16 mục tiêu học được giữ; trạng thái nguồn vẫn chờ duyệt.

Phòng Lõi dùng bốn vấn đề mới: trình tự và nhân quả; ngoại hình và hồ sơ; tuyến chuyển tiếp và bối cảnh; tuyên bố quyền và thực hiện. Phân công An, Vy, Minh, Khôi kiểm tra các đoạn tương ứng trước khi xác nhận. Không phát sinh khái niệm học thuật mới.

Hoàn thành báo cáo mở kết thúc thường; tìm đủ bốn thư mở kết thúc đặc biệt. Có thể tìm tiếp thư sau khi phá đảo và cập nhật đoạn kết mà không mất kết quả.

## Giao diện, chuyển động, âm thanh

- Desktop: cảnh trung tâm, panel bên phải, thanh vai và đối thoại bên dưới. Mobile: cảnh và danh sách điểm khám phá, panel đồ vật bằng native dialog từ đáy.
- Sổ chung: Chứng cứ / Giả thuyết / Kiến thức; lưu bộ lọc và vị trí đọc trong phiên. Ghi chú và lựa chọn đang làm được lưu cùng tiến độ.
- Nội dung điều tra, hội thoại và lập luận 16–18px; chữ trong tranh được dựng riêng bằng HTML. Font Be Vietnam Pro và Lora được đóng gói cục bộ.
- Năm biểu cảm cho từng nhân vật. Hai lớp SVG chuyển động tách nền mỗi cảnh: thiết bị quay và mô hình chiếu; đường nối sáng sau kiểm chứng, lớp phục dựng sau phiên họp.
- Thao tác 150–450ms, phục dựng phòng khoảng 1,6 giây, màn cuối khoảng 4,5 giây; đều không quyết định tiến độ. Có giảm chuyển động và bỏ qua.
- Hai bản ambient miễn phí trên OpenGameArt (CC0), thay nhạc tổng hợp cũ: Synthwave 4k (khoảng 2 phút 38 giây) và Contemplation (khoảng 2 phút), cân âm và fade đầu/cuối. Tám hiệu ứng thao tác vẫn là âm thanh gốc. Âm thanh mặc định tắt; tách âm lượng nhạc/hiệu ứng, chỉnh mức nhạc không tạo lại player; dừng khi tab ẩn.

## Tiến độ và tương thích

`mln131-council-save-v2` chứa vai, chương, chứng cứ, câu trả lời chưa nộp, hội thoại, hội đồng, ghi chú và kết quả. `mln131-escape-save-v1` không bị ghi đè hoặc xóa, kể cả reset V2. Không suy diễn kết quả điều tra từ các câu đã giải của V1. Demo không mount provider tiến độ.

Các hành động chỉ có tác dụng khi đúng vai, đúng chương và đủ điều kiện. Thử lại hoặc xem lại không nhân phần thưởng. Save lỗi được báo rõ; việc nạp lỗi không tự ghi đè dữ liệu. Khi người chơi thực hiện hành động mới, bản V2 mới được ghi. Khi không lưu được, game tiếp tục chạy trong tab.

## Kiểm chứng còn cần người tham gia

Kiểm tra tự động và chơi hết bằng trình duyệt xác nhận chức năng, không xác nhận mức hấp dẫn hoặc hiệu quả học tập. Chưa thực hiện khảo sát năm sinh viên hoặc thử trên điện thoại vật lý. Dùng `docs/PLAYTEST.md` trước khi chốt thời lượng và giới thiệu kết quả học tập.

Nội dung học vẫn có 0 verified / 16 needs-review; cần đối chiếu đầy đủ bản scan và người phụ trách học thuật xác nhận thực tế.
