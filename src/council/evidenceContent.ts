import type { RoomId } from '../game/types';

export const discoveryHints: Record<RoomId, string[]> = {
  1: [
    'An: Hãy xem thẻ nói về đời sống xã hội, khám phá tự nhiên hay một học thuyết. Đó là cách chọn nhóm.',
    'Minh: Nhật ký cho thấy máy đã ghép nhầm. Ta cần tài liệu gốc để biết từng nhãn phải sửa ra sao.',
    'Vy: Tên người và tên tác phẩm khác loại. Hãy đọc vai trò trước khi ghép nhãn.',
    'An: Năm giúp xếp sự kiện trước – sau. Nó chưa tự giải thích nguyên nhân.',
    'Minh: Hồ sơ này giúp kiểm tra một nhận định bằng bối cảnh, thay vì chỉ nhìn tên hoặc năm.',
    'Vy: “Có phê phán” là phần quan trọng: tiếp nhận giá trị và xem xét giới hạn, không chép nguyên vẹn.',
  ],
  2: [
    'An: Có hai câu hỏi: lao động thế nào và có những quan hệ xã hội nào. Cần đọc cả hai.',
    'Minh: Bộ đọc đã bỏ một phần dữ liệu. Đổi màu nhãn sẽ không sửa được lỗi này.',
    'Vy: Tìm trọng tâm của mỗi thẻ: sản xuất, tổ chức quyền lực hay giá trị và ý thức.',
    'An: Hãy phân biệt điều kiện từ địa vị trong xã hội với sự phát triển và tổ chức của chủ thể.',
    'Minh: Công nghệ và trình độ thay đổi. Điều đó cần được phân tích, không dùng để tự động xóa hồ sơ.',
    'Vy: Một tên nghề chưa đủ nói hết câu chuyện. Ta phải đọc thêm những phương diện mà tài liệu yêu cầu.',
  ],
  3: [
    'An: Mỗi thẻ đang nói về con người, kinh tế hoặc quyền làm chủ. Đừng dùng một thẻ để thay cho cả khái niệm.',
    'Minh: Máy đã xóa cả thành tựu. Ta cần tài liệu để kiểm tra lệnh có cho phép làm như vậy không.',
    'Vy: Đọc điểm xuất phát trước rồi mới chọn tuyến. Trực tiếp không có nghĩa là nhanh hơn.',
    'An: Chọn lĩnh vực chính của từng câu. Các lĩnh vực vẫn có liên hệ với nhau.',
    'Minh: Chế độ và thành tựu là hai đối tượng khác nhau. Lệnh xóa của máy đã đánh đồng chúng.',
    'Vy: Chú thích còn ở đây. Đọc nó cùng nhật ký sẽ biết phạm vi lệnh cần sửa.',
  ],
  4: [
    'An: Ba mô tả trả lời ba câu hỏi: ai nắm quyền, quyền được tổ chức thế nào, và dùng nguyên tắc quản lý nào.',
    'Minh: Máy còn kết quả nhưng mất cách đi tới và thực hiện quyết định. Ta cần nối lại những phần thiếu đó.',
    'Vy: Xem ai đang thực hiện hành vi trong câu: người dân hay người đại diện.',
    'An: Cùng một hoạt động có thể được phân chia theo nhiều tiêu chí. Hãy đọc tiêu chí đang được dùng.',
    'Minh: Một lời tuyên bố cần đi cùng cách bảo đảm và thực hiện. Biên bản phải lưu phần này.',
    'Vy: Có đại diện không có nghĩa là bỏ tham gia trực tiếp. Hai hình thức có thể cùng tồn tại.',
  ],
};

// Short reading aids; the full source-based body and review status stay available.
export const evidenceSummaries: Record<RoomId, string[]> = {
  1: [
    'Có ba nhóm cần phân biệt: điều kiện kinh tế – xã hội, tiền đề khoa học tự nhiên và tiền đề tư tưởng – lý luận. Tư tưởng được tiếp thu có phê phán, không phải sao chép nguyên vẹn.',
    'Máy gộp phong trào xã hội vào khoa học tự nhiên, lẫn nhãn tác giả với tác phẩm và xếp sự kiện theo thứ tự nhập. Đây là nhật ký hư cấu cho biết máy đã làm sai những gì.',
    'Mác và Ăngghen đặt nền tảng lý luận; Lênin vận dụng, phát triển trong điều kiện mới. “Tuyên ngôn của Đảng Cộng sản” là tác phẩm năm 1848: cần phân biệt người với tác phẩm.',
    'Các mốc cần dùng: Tuyên ngôn 1848; Công xã Paris 1871; Cách mạng Tháng Mười Nga 1917; Đổi mới ở Việt Nam 1986. Thứ tự trước – sau chưa chứng minh quan hệ nhân quả.',
    'Muốn kiểm tra một nhận định, cần đọc xuất xứ và bối cảnh của thông tin. Sắp đúng năm chưa đủ để kết luận mọi sự kiện có cùng ý nghĩa hoặc tạo thành một chuỗi nguyên nhân.',
    'Kế thừa có phê phán là tiếp nhận giá trị và xem xét, khắc phục giới hạn. Nó không có nghĩa sao chép nguyên vẹn, cũng không phải xóa hết tư tưởng trước đó.',
    'Nhóm lưu trữ cũ lo rằng một trang mất xuất xứ có thể bị hiểu sai.',
  ],
  2: [
    'Xem xét giai cấp công nhân qua hai phương diện. Kinh tế – xã hội: cách lao động và vị trí trong sản xuất công nghiệp. Chính trị – xã hội trong chủ nghĩa tư bản: sở hữu, bán sức lao động và quan hệ lợi ích.',
    'Máy chỉ giữ cách lao động, bỏ dữ liệu về sở hữu, bán sức lao động và quan hệ lợi ích. Nó còn dùng ngoại hình hoặc máy móc thay cho việc đọc đủ hồ sơ. Đây là nhật ký hư cấu.',
    'Ba nội dung sứ mệnh có trọng tâm khác nhau: kinh tế nói về sản xuất; chính trị – xã hội nói về quyền lực và tổ chức; văn hóa – tư tưởng nói về giá trị và đời sống tinh thần.',
    'Điều kiện khách quan gắn với địa vị và đặc điểm trong xã hội. Điều kiện chủ quan gắn với sự phát triển và tổ chức của chủ thể. Chú thích kèm hồ sơ cũng lưu ý: biến đổi công nghệ không đồng nghĩa giai cấp công nhân biến mất.',
    'Công nghệ, trình độ và cơ cấu lao động có thể thay đổi; giáo trình đề cập trí thức hóa và trung lưu hóa ở một bộ phận. Không thể từ những biến đổi này suy ra toàn bộ giai cấp công nhân đã biến mất.',
    'Một tên nghề hoặc công cụ lao động chưa đủ để nhận diện. Cần đọc các phương diện của khái niệm trong bối cảnh cụ thể; phân biệt “một bộ phận” với “toàn bộ”.',
    'Người kỹ sư cũ nhận ra một cột dữ liệu chưa đủ, nên thêm ô bối cảnh.',
  ],
  3: [
    'Các mô tả đang nói về những đặc trưng của chủ nghĩa xã hội: phát triển con người, cơ sở kinh tế hiện đại và nhân dân lao động làm chủ. Mỗi thẻ nêu một phương diện, không phải toàn bộ khái niệm.',
    'Máy nhận lệnh về “bỏ qua chế độ” nhưng lại xóa mọi thành tựu, kể cả khoa học – công nghệ. Phần chú thích không được đọc. Đây là nhật ký hư cấu mô tả lỗi của chương trình.',
    'Theo cách phân chia của giáo trình: từ chủ nghĩa tư bản đã phát triển cao là quá độ trực tiếp; từ xã hội chưa qua chủ nghĩa tư bản phát triển đầy đủ là quá độ gián tiếp. Hai tên gọi không có nghĩa nhanh và chậm.',
    'Bốn lĩnh vực là kinh tế, chính trị, tư tưởng – văn hóa và xã hội. Chú thích đi kèm phân biệt “bỏ qua chế độ” với việc phủ nhận mọi thành tựu có thể tiếp thu, kế thừa.',
    '“Bỏ qua chế độ” không đồng nghĩa phủ nhận mọi thành tựu từng hình thành trong chế độ đó. Cần xem xét tiếp thu, kế thừa những thành tựu phù hợp, trong đó có khoa học và công nghệ.',
    'Chú thích làm rõ đối tượng của cụm từ “bỏ qua”. Chế độ và các thành tựu có thể tiếp thu, kế thừa là hai nội dung cần phân biệt; không dùng một lệnh xóa cho tất cả.',
    'Lá thư đề nghị nối lại các liên kết thay vì tiếp tục xóa kho dữ liệu.',
  ],
  4: [
    'Dân chủ được xem từ ba phương diện: quyền lực thuộc về ai; chế độ tổ chức thực hiện quyền lực; và nguyên tắc tổ chức, quản lý. Đây là ba góc nhìn, không phải ba kiểu bỏ phiếu.',
    'Máy chỉ giữ kết quả, bỏ thông tin ai tham gia, qua hình thức nào và quyền được thực hiện ra sao. Đây là nhật ký hư cấu; tình huống hội trường chỉ dùng để minh họa.',
    'Dân chủ trực tiếp: người dân trực tiếp thực hiện quyền trong quy trình phù hợp. Dân chủ gián tiếp: người đại diện thực hiện chức năng đại diện. Hai hình thức có thể cùng tồn tại.',
    'Chức năng Nhà nước có thể chia theo phạm vi, lĩnh vực hoặc tính chất quyền lực. Chú thích kèm hồ sơ nói thêm: quyền làm chủ cần được thể chế hóa, bảo đảm và tổ chức thực hiện.',
    'Trong bài học này, dân chủ xã hội chủ nghĩa là nền tảng. Nhà nước xã hội chủ nghĩa thể chế hóa, bảo đảm và tổ chức thực hiện quyền làm chủ; một lời tuyên bố chưa thay thế được những cơ chế này.',
    'Có thiết chế đại diện không có nghĩa phải bỏ mọi hình thức tham gia trực tiếp. Cần đọc cả chủ thể tham gia lẫn cơ chế bảo đảm, thực hiện quyền.',
    'Nhóm lưu trữ muốn giữ cả khả năng đọc, đặt câu hỏi và kiểm chứng tài liệu.',
  ],
};
