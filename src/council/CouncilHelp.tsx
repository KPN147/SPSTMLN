import { Lightbulb } from 'lucide-react';
import { allEvidence } from './content';
import type { CouncilCase, CouncilDraft, Evidence } from './types';

export function CouncilHelp({ definition: c, draft, cards, resolved }: { definition: CouncilCase; draft: CouncilDraft; cards: Evidence[]; resolved: boolean }) {
  const sample = c.evidenceSets.find(set => set.every(id => cards.some(e => e.id === id)));
  const chosen = resolved ? draft.evidence : sample ?? [];
  return <div className="council-help">
    <div className="council-question"><h3>Câu hỏi cần trả lời</h3><p>{c.guide.question}</p><ul>{c.guide.checkpoints.map(point => <li key={point}>{point}</li>)}</ul></div>
    {!resolved && <details className="reasoning-help"><summary><Lightbulb size={17}/>Chưa biết chọn? Xem cách suy luận</summary><p>{c.guide.hint}</p><p>Làm lần lượt: xác định câu sai → tìm hồ sơ chứng minh → chọn cách sửa đúng câu sai đó. Không phải đoán cùng lúc cả ba phần.</p></details>}
    {sample || resolved ? <details className="worked-answer" open={resolved || undefined}><summary>{resolved ? 'Vì sao câu trả lời này phù hợp?' : 'Xem một cách trả lời mẫu và lý do'}</summary><p className="muted small">{resolved ? 'Đây là cách kết luận, chứng cứ và phương án sửa hỗ trợ nhau.' : 'Mở khi bạn đang mắc. Ví dụ giải thích cách chọn; bạn tự chọn các ô và nộp. Các lựa chọn đang làm được giữ nguyên.'}</p><ol>
      <li><strong>1. Bản ghi sai ở đâu?</strong><p>{c.conclusions.find(o => o.id === c.correctConclusion)?.text}</p><p className="answer-reason">Vì sao: {c.guide.explanation}</p></li>
      <li><strong>2. Dùng hồ sơ nào để chứng minh?</strong><ul>{chosen.map(id => <li key={id}><strong>{allEvidence.find(e => e.id === id)?.title}</strong><p>{c.guide.evidenceNotes[id]}</p></li>)}</ul><p className="answer-reason">Có thể có cách kết hợp khác. Hồ sơ bổ sung được chấp nhận khi vẫn liên quan và đã đủ căn cứ cho kết luận.</p></li>
      <li><strong>3. Sửa bằng cách nào?</strong><p>{c.repairs.find(o => o.id === c.correctRepair)?.text}</p><p className="answer-reason">Vì sao: {c.guide.repairExplanation}</p></li>
    </ol></details> : <p className="council-help-notice">Ghi nhận thêm hồ sơ để mở ví dụ có đủ chứng cứ. Bạn vẫn có thể đọc cách suy luận hoặc đề xuất trước.</p>}
  </div>;
}
