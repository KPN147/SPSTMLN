import { useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check, Fingerprint, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { characters } from '../council/content';
import { brand } from '../council/brand';

const topics = [
  ['boi-canh', 'Bối cảnh và đích đến'], ['nhan-vat', 'Bốn nhân vật'],
  ['tung-buoc', 'Một phòng chơi như thế nào?'], ['ho-so', 'Tìm và ghi nhận hồ sơ'],
  ['kiem-chung', 'Làm câu hỏi trong phòng'], ['hoi-dong', 'Trả lời hội đồng'],
  ['tro-giup', 'Gợi ý và kiến thức'], ['so-chung', 'Tra cứu Sổ chung'],
  ['luu-tien-do', 'Lưu và chuyển tiến độ'], ['go-roi', 'Điều khiển và gỡ rối'],
];

function GuideTopic({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <details id={id} className="guide-example"><summary>{title}</summary><div className="guide-topic-content">{children}</div></details>;
}

function CouncilPractice() {
  const [phase, setPhase] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const [feedback, setFeedback] = useState('');
  const [done, setDone] = useState(false);
  const questions = [
    { title: '1. Chọn quyết định', choices: ['Đọc đủ hai phần hồ sơ trước khi kết luận.', 'Chỉ dựa vào dòng đầu tiên.'] },
    { title: '2. Chọn căn cứ', choices: ['Hồ sơ cho biết nội dung và bối cảnh ở hai phần khác nhau.', 'Màu bìa hồ sơ giống nhau.'] },
    { title: '3. Chọn lý do', choices: ['Bối cảnh giúp xác định cách hiểu nội dung.', 'Các hồ sơ cùng màu luôn có cùng ý nghĩa.'] },
  ];
  const active = questions[phase];
  function submit() {
    if (answers[phase] === null) { setFeedback('Chọn một phương án trước khi kiểm tra.'); return; }
    if (answers[phase] !== 0) {
      setFeedback(['Một dòng chưa đủ bối cảnh. Đọc cả hai phần rồi kết luận.', 'Màu bìa chưa chứng minh nội dung. Tìm dữ kiện trong hồ sơ.', 'Cùng màu không có nghĩa cùng ý. Hãy xét bối cảnh của nội dung.'][phase]);
      return;
    }
    setFeedback('Phù hợp. Quyết định của bạn có dữ kiện và lý do hỗ trợ.');
    if (phase === 2) setDone(true); else { setPhase(phase + 1); setFeedback(''); }
  }
  return <div className="guide-practice" aria-label="Tập trả lời hội đồng">
    <p className="eyebrow">VÍ DỤ THAO TÁC · KHÔNG TÍNH TIẾN ĐỘ</p><h3>Thử ba bước trả lời</h3>
    <p>Một hồ sơ có hai phần: nội dung và bối cảnh. Bạn cần chọn cách đọc phù hợp.</p>
    {!done && <fieldset><legend>{active.title}</legend>{active.choices.map((choice, index) => <label className="council-option" key={choice}>
      <input type="radio" name="guide-practice-answer" checked={answers[phase] === index} onChange={() => { setAnswers(old => old.map((answer, i) => i === phase ? index : answer)); setFeedback(''); }}/><span>{choice}</span>
    </label>)}</fieldset>}
    {feedback && <p role="status" className="practice-feedback"><span>{feedback}</span></p>}
    {done && <p className="task-success"><Check size={18}/>Bạn đã nối quyết định với căn cứ và lý do.</p>}
    <div className="button-row">{!done && <button className="button" onClick={submit}>Kiểm tra ví dụ<ArrowRight size={16}/></button>}
      {phase > 0 && !done && <button className="text-button" onClick={() => { setPhase(phase - 1); setFeedback(''); }}>Quay lại bước trước</button>}
      <button className="text-button" onClick={() => { setPhase(0); setAnswers([null, null, null]); setFeedback(''); setDone(false); }}>Làm lại ví dụ</button>
    </div>
  </div>;
}

export function Guide({ backTo }: { backTo: string }) {
  return <div className="page guide-page">
    <header className="guide-page-heading"><p className="eyebrow">CẨM NANG / {brand.subtitle.toUpperCase()}</p><h1>Chơi từng bước.<br/><em>Hiểu từng quyết định.</em></h1>
      <p className="lead">Chỉ cần nhớ ba việc dưới đây. Mở thêm phần bạn cần khi đang chơi.</p>
      <ol className="guide-instructions"><li><strong>Tìm dữ kiện:</strong> dùng nút việc tiếp theo để mở hồ sơ cần cho bước hiện tại.</li><li><strong>Áp dụng kiến thức:</strong> đọc ý ngắn, chọn cách xử lý rồi kiểm tra.</li><li><strong>Nối phát hiện:</strong> dùng kết quả vừa có để hoàn thiện hồ sơ và trình bày tại hội đồng.</li></ol>
      <div className="button-row"><Link className="button" to={backTo}><ArrowLeft size={17}/>Quay lại chơi</Link><Link className="button secondary" to="/demo">Thử trong 3 phút<ArrowRight size={17}/></Link></div>
    </header>
    <div className="guide-layout"><aside className="guide-toc"><h2>Bạn cần tìm phần nào?</h2><nav aria-label="Mục lục hướng dẫn">{topics.map(([id, label], index) => <a href={`#${id}`} key={id} onClick={() => {
      const topic = document.getElementById(id); if (topic instanceof HTMLDetailsElement) topic.open = true;
    }}><span>{String(index + 1).padStart(2, '0')}</span>{label}</a>)}</nav></aside>
      <article className="guide-article">
        <GuideTopic id="boi-canh" title="Bối cảnh và đích đến">
          <p>Năm 2126, thư viện phục hồi lỗi. Nội dung vẫn còn nhưng xuất xứ, bối cảnh và các mối liên hệ bị tách rời. Bạn điều khiển hội đồng để đối chiếu và nối lại chúng.</p>
          <p>Phục dựng bốn khu vực, rồi hoàn thiện bốn phần của hồ sơ mở lại thư viện tại Phòng Lõi. Hành trình có 16 mục tiêu học; mục tiêu thời lượng là 25–35 phút, chưa phải số đo chơi thử.</p>
          <p>Tìm thêm bốn lá thư để mở đoạn kết về nhóm lưu trữ trước. Thư và hồ sơ bổ trợ là tùy chọn; kết thúc chính vẫn là một hành trình đầy đủ.</p>
        </GuideTopic>
        <GuideTopic id="nhan-vat" title="Bốn nhân vật">
          <ul className="guide-bullet-list">{characters.map(person => <li key={person.id}><strong>{person.name} — {person.role}:</strong> {person.ability}.</li>)}</ul>
          <p>Bấm chân dung để đổi vai. Hành động chuyên môn có thể tự chuyển sang thành viên phù hợp. Hồ sơ dùng chung; không cần thu thập lại bằng bốn người.</p>
        </GuideTopic>
        <GuideTopic id="tung-buoc" title="Một phòng chơi như thế nào?">
          <ol className="guide-instructions"><li>Đọc sự cố và xem bước hiện tại.</li><li>Mở hồ sơ mà bước này cần. Không cần tìm đủ mọi hồ sơ trước khi trả lời.</li><li>Đọc một ý kiến thức, xử lý tình huống và bấm kiểm tra.</li><li>Khi đúng, một phần của bản phục dựng được điền và cảnh thay đổi.</li><li>Làm ba bước đầu, rồi trả lời hội đồng ở bước thứ tư để phục dựng phòng.</li></ol>
          <p>Phát hiện bước trước có thể là bối cảnh hoặc căn cứ của bước sau. Đọc phần liên kết để biết bạn đang dùng lại điều gì.</p>
        </GuideTopic>
        <GuideTopic id="ho-so" title="Tìm và ghi nhận hồ sơ">
          <p>Bấm đồ vật trong tranh hoặc danh sách điểm khám phá. Đọc đoạn cần dùng rồi bấm nút ghi nhận. Chỉ mở tài liệu chưa tính là đã lưu hồ sơ.</p>
          <p>Hồ sơ chưa mở cho biết điều kiện còn thiếu. Có thể đi theo nút việc tiếp theo hoặc tự khám phá. Nguồn học thuật đi cùng tài liệu; nhật ký máy và thư thuộc câu chuyện hư cấu.</p>
        </GuideTopic>
        <GuideTopic id="kiem-chung" title="Làm câu hỏi trong phòng">
          <p>Mỗi bước có tình huống, câu hỏi và một ý kiến thức ngắn. Dùng ý đó để chọn cách xử lý, thay vì chỉ tìm từ giống nhau.</p>
          <ul className="guide-bullet-list"><li><strong>Bài chọn quyết định:</strong> chọn một phương án rồi kiểm tra.</li><li><strong>Bài ghép:</strong> chọn thẻ trước, chọn vị trí sau; làm đủ các thẻ rồi kiểm tra.</li><li><strong>Dòng thời gian:</strong> dùng dấu ngày tháng trong hồ sơ để gắn đúng sự kiện.</li></ul>
          <p>Phản hồi chỉ phần cần sửa. Bạn có thể đổi một lựa chọn; các lựa chọn khác được giữ. Kết quả đúng tạo phát hiện để dùng tiếp.</p>
        </GuideTopic>
        <GuideTopic id="hoi-dong" title="Trả lời hội đồng">
          <ol className="guide-instructions"><li><strong>Quyết định:</strong> bạn xử lý hồ sơ hoặc sự cố thế nào?</li><li><strong>Căn cứ:</strong> dữ kiện hay phát hiện nào hỗ trợ cách xử lý đó?</li><li><strong>Lý do:</strong> khái niệm đã học giải thích mối liên hệ này ra sao?</li></ol>
          <p>Làm từng phần, có thể quay lại sửa. Chọn nhiều dữ kiện không thay thế cho căn cứ phù hợp. Quyết định đúng nhưng lý do không liên quan vẫn cần sửa.</p>
          <p>Phòng Lõi dùng cùng cách trả lời cho bốn phần của một hồ sơ mới. Bạn được tra các phát hiện cũ; không có khái niệm mới.</p>
          <CouncilPractice/>
        </GuideTopic>
        <GuideTopic id="tro-giup" title="Gợi ý và kiến thức">
          <p>Nút <strong>Cần gợi ý?</strong> mở trợ giúp theo nhu cầu: chú ý chi tiết nào → đối chiếu với khái niệm → mở lời giải có lý do. Không cần trả lời sai mới dùng được.</p>
          <p>Mở lời giải không tự chọn hoặc nộp bài. Đọc xong, tự làm lại để kiểm tra cách hiểu. Dùng gợi ý và thử sai không làm mất tiến độ.</p>
          <p>Mở phần diễn giải và nguồn khi muốn đọc sâu hơn. Trạng thái <strong>needs-review</strong> cho biết nội dung còn chờ xác nhận học thuật; kiểm thử game không tự xác nhận nguồn.</p>
        </GuideTopic>
        <GuideTopic id="so-chung" title="Tra cứu Sổ chung">
          <p>Sổ chung giữ hồ sơ đã ghi nhận, các phát hiện và ghi chú của bạn. Phát hiện ghi rõ xuất phát từ bước nào và được dùng ở đâu. Diễn giải đầy đủ có thể mở khi cần.</p>
          <p>Ghi chú không bị chấm điểm. Phát hiện chuyển từ bản lưu cũ có nhãn kế thừa; đó không phải câu trả lời mới bạn vừa thực hiện.</p>
          <Link className="text-button" to="/codex">Mở Sổ chung<ArrowRight size={15}/></Link>
        </GuideTopic>
        <GuideTopic id="luu-tien-do" title="Lưu và chuyển tiến độ">
          <p>Tiến độ và lựa chọn đang làm được tự lưu trên cùng trình duyệt, thiết bị và địa chỉ website. Mở Hướng dẫn hoặc Sổ chung rồi quay lại không làm mất lựa chọn.</p>
          <p>Khi có bản lưu cũ hợp lệ, bạn được chọn tiếp tục với các phòng đã qua hoặc bắt đầu hành trình mới. Bản lưu cũ được giữ riêng. Dự thảo chưa nộp không tương thích sẽ được báo trước khi chuyển.</p>
          <p>Nếu thiết bị chặn lưu, hãy giữ tab để tiếp tục. Xóa dữ liệu trình duyệt có thể xóa tiến độ. Demo là lượt thử riêng, không hoàn thành phòng hoặc đổi tiến độ chính.</p>
        </GuideTopic>
        <GuideTopic id="go-roi" title="Điều khiển và gỡ rối">
          <ul className="guide-bullet-list"><li><strong>Chuột/chạm:</strong> chọn đồ vật, lựa chọn và ô ghép; không bắt buộc kéo thả.</li><li><strong>Bàn phím:</strong> Tab để di chuyển, Enter/Space để chọn nút, Escape để đóng cửa sổ.</li><li><strong>Âm thanh:</strong> mặc định tắt; nút loa và Cài đặt trải nghiệm chỉnh nhạc, hiệu ứng, giảm chuyển động.</li></ul>
          <p><strong>Chưa biết bấm đâu?</strong> Dùng nút việc tiếp theo. <strong>Đọc rồi chưa được tính?</strong> Kiểm tra đã bấm ghi nhận chưa. <strong>Ô ghép chưa bấm được?</strong> Chọn thẻ trước.</p>
          <p><strong>Hội đồng chưa chấp nhận?</strong> Xem phản hồi về quyết định, căn cứ hoặc lý do; quay lại đúng phần đó. <strong>Phòng tiếp theo chưa mở?</strong> Hoàn thành hội đồng của phòng trước.</p>
        </GuideTopic>
        <div className="guide-finish"><h2>Đi từng việc một.</h2><p>Thấy dữ kiện → dùng kiến thức → giải thích quyết định.</p><div className="button-row"><Link className="button" to={backTo}><Fingerprint size={17}/>Quay lại chơi</Link><Link className="text-button" to="/demo"><Lightbulb size={17}/>Thử trước bằng demo</Link></div></div>
      </article>
    </div>
  </div>;
}
