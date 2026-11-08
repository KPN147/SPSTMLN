import { ArrowRight, Check } from 'lucide-react';
import type { Chapter, ChapterProgress } from './types';
import type { RoomStep } from './guidance';

export function RoomGuide({ chapter, progress, step, onContinue }: {
  chapter: Chapter;
  progress: ChapterProgress;
  step: RoomStep;
  onContinue: () => void;
}) {
  const essential = chapter.evidence.filter(e => e.kind === 'essential');
  const found = essential.filter(e => progress.discovered.includes(e.id)).length;
  const completed = chapter.investigations.filter(task => progress.completed.includes(task.id)).length;
  const stage = step.kind === 'evidence' ? 0 : step.kind === 'investigation' ? 1 : step.kind === 'council' ? 2 : 3;
  const stages = [
    { name: 'Chứng cứ', count: `${found}/${essential.length} bắt buộc`, done: found === essential.length },
    { name: 'Kiểm chứng', count: `${completed}/${chapter.investigations.length} hoàn thành`, done: completed === chapter.investigations.length },
    { name: 'Hội đồng', count: progress.restored ? 'Đã qua phòng' : 'Chưa xác nhận', done: progress.restored },
  ];
  const description = step.kind === 'evidence'
    ? `Đọc “${step.evidence.title}” ở điểm ${step.evidence.index + 1}, rồi bấm “Ghi nhận chứng cứ”. Chỉ mở hoặc đọc hồ sơ chưa tính là thu thập.`
    : step.kind === 'investigation'
      ? `Đã đủ chứng cứ bắt buộc. Làm bước ${step.number}: chọn từng dữ kiện, chọn vị trí để gắn, rồi bấm nút kiểm tra. Có thể dùng Gợi ý và sửa lựa chọn.`
      : step.kind === 'council'
        ? 'Đã đủ 4 chứng cứ và 3 kiểm chứng. Mở hội đồng, chọn kết luận, chứng cứ liên quan và phương án sửa, rồi bấm “Đề xuất với hội đồng”.'
        : 'Bạn đã qua phòng này. Có thể đi tiếp ngay hoặc ở lại tìm các hồ sơ phụ.';
  const action = step.kind === 'evidence'
    ? `Mở hồ sơ ${step.evidence.index + 1}: ${step.evidence.title}`
    : step.kind === 'investigation'
      ? `Làm kiểm chứng ${step.number}: ${step.task.title}`
      : step.kind === 'council'
        ? 'Mở hội đồng để qua phòng'
        : chapter.id === 4 ? 'Đến Phòng Lõi' : `Sang phòng ${chapter.id + 1}`;

  return <section className={`room-guide ${progress.restored ? 'complete' : ''}`} aria-labelledby="room-guide-title">
    <div className="room-guide-heading"><span className="eyebrow">CÁCH QUA PHÒNG {chapter.id}</span><h2 id="room-guide-title">{progress.restored ? 'Phòng đã hoàn thành.' : 'Việc cần làm tiếp theo'}</h2></div>
    <ol className="room-guide-steps">{stages.map((item, index) => <li key={item.name} className={item.done ? 'done' : ''} aria-current={stage === index ? 'step' : undefined}><span className="guide-step-index">{item.done ? <Check size={17}/> : `0${index + 1}`}</span><span><strong>{item.name}</strong><small>{item.count}</small></span></li>)}</ol>
    <div className="room-guide-next"><p>{description}</p><button className="button" onClick={onContinue}>{action}<ArrowRight size={17}/></button></div>
    <p className="room-guide-note">Hai hồ sơ bổ trợ và phong thư là tùy chọn, không cần tìm đủ 7 hồ sơ để qua phòng. Bạn vẫn có thể khám phá theo thứ tự khác.</p>
  </section>;
}
