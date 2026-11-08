import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, Compass, Fingerprint, Link2, MessageCircle, Sparkles, Users } from 'lucide-react';

const steps = [
  { title: 'Nhận vụ điều tra', icon: Compass, text: 'Mở Bản đồ, vào khu vực đang mở và đọc “Vấn đề cần làm rõ”. Đây là câu hỏi bạn cần tìm lời giải trong căn phòng.' },
  { title: 'Ghi nhận 4 chứng cứ bắt buộc', icon: Fingerprint, text: 'Dùng “Việc cần làm tiếp theo” trong phòng để mở hồ sơ, đọc tài liệu rồi bấm “Ghi nhận chứng cứ”. Hai hồ sơ bổ trợ và phong thư là tùy chọn.', tip: 'Chỉ đọc chưa tính là thu thập.' },
  { title: 'Trao đổi cùng đồng đội', icon: MessageCircle, text: 'Chọn câu hỏi hoặc đối chiếu chứng cứ trong hội thoại. Đổi vai bằng chân dung; hành động chuyên môn cũng tự chuyển sang người phù hợp.' },
  { title: 'Hoàn thành 3 kiểm chứng', icon: Link2, text: 'Ở phần “Kiểm chứng hồ sơ”, chọn từng bước. Chọn một dữ kiện, chọn vị trí để gắn, rồi bấm kiểm tra hoặc chạy thử.', tip: 'Chọn thẻ trước → chọn vị trí sau.' },
  { title: 'Đề xuất với hội đồng', icon: Users, text: 'Sau 3 kiểm chứng, chọn kết luận, đúng số hồ sơ liên quan và phương án sửa. Không chọn tất cả chứng cứ; thẻ thừa có thể khiến đề xuất bị từ chối.', tip: 'Kết luận → Chứng cứ → Cách sửa.' },
  { title: 'Phục dựng và đi tiếp', icon: Sparkles, text: 'Đề xuất được chấp nhận sẽ làm căn phòng sáng lại và mở khu vực tiếp theo. Phục dựng đủ bốn khu vực để vào Phòng Lõi.' },
];

export function HowToPlay() {
  return <section id="cach-choi" className="how-to-play" aria-labelledby="how-to-title" tabIndex={-1}>
    <div className="how-to-heading"><div><p className="eyebrow">HƯỚNG DẪN / DÀNH CHO NGƯỜI MỚI</p><h2 id="how-to-title">Cách chơi.<br/><em>Từ dấu vết đến lời giải.</em></h2></div><p>Bạn điều khiển cả bốn thành viên trong một cuộc điều tra. Tìm thông tin còn thiếu, kiểm chứng bằng tài liệu rồi cùng hội đồng sửa hồ sơ.</p></div>
    <ol className="how-to-steps">{steps.map((step, i) => <li key={step.title}><div className="how-to-step-top"><span className="how-to-number">0{i + 1}</span><step.icon size={21} aria-hidden="true"/></div><h3>{step.title}</h3><p>{step.text}</p>{step.tip && <small className="how-to-tip"><Check size={13} aria-hidden="true"/>{step.tip}</small>}</li>)}</ol>
    <div className="how-to-finish"><span className="how-to-finish-icon"><BookOpen size={23} aria-hidden="true"/></span><p><strong>Đích đến: Phòng Lõi Tri Thức.</strong> Phân công thành viên kiểm tra bốn đoạn báo cáo, dùng lại chứng cứ đã tìm và xác nhận bản sửa để khôi phục thư viện.</p></div>
    <div className="how-to-questions">
      <details><summary>Mắc ở một bước thì làm gì?<span aria-hidden="true">＋</span></summary><p>Mở Sổ chung để đọc lại chứng cứ hoặc dùng Gợi ý trong bước kiểm chứng. Bạn có thể sửa lựa chọn và thử lại; dùng gợi ý hay trả lời sai không làm mất tiến độ.</p></details>
      <details><summary>Có cần tìm đủ 7 hồ sơ mỗi phòng?<span aria-hidden="true">＋</span></summary><p>Bốn chứng cứ thiết yếu và ba bước kiểm chứng đủ để giải quyết căn phòng. Hai hồ sơ đối chiếu là bổ sung; lá thư truyện phụ mở sau bước kiểm chứng thứ hai. Tìm đủ bốn lá thư sẽ mở thêm kết thúc đặc biệt.</p></details>
      <details><summary>Lần sau có phải chơi lại từ đầu?<span aria-hidden="true">＋</span></summary><p>Tiến độ và lựa chọn đang làm được tự lưu trên trình duyệt đang dùng. Trở lại bằng cùng thiết bị và trình duyệt để tiếp tục hành trình. Bạn cũng có thể mở Sổ chung để xem lại kiến thức đã khám phá.</p></details>
    </div>
    <div className="how-to-actions"><span><Users size={16} aria-hidden="true"/>Một người chơi · Bốn vai đồng hành</span><Link className="button secondary" to="/demo">Thử cách chơi trong 3 phút<ArrowRight size={16}/></Link><Link className="text-button" to="/play">Đến bản đồ thư viện<ArrowRight size={16}/></Link></div>
  </section>;
}
