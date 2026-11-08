import type { Chapter, ChapterProgress, Evidence, Investigation } from './types';

export type RoomStep =
  | { kind: 'evidence'; evidence: Evidence }
  | { kind: 'investigation'; task: Investigation; number: number }
  | { kind: 'council' }
  | { kind: 'complete' };

export function nextRoomStep(chapter: Chapter, progress: ChapterProgress): RoomStep {
  if (progress.restored) return { kind: 'complete' };
  const evidence = chapter.evidence.find(e => e.kind === 'essential' && !progress.discovered.includes(e.id));
  if (evidence) return { kind: 'evidence', evidence };
  const index = chapter.investigations.findIndex(task => !progress.completed.includes(task.id));
  if (index >= 0) return { kind: 'investigation', task: chapter.investigations[index], number: index + 1 };
  return { kind: 'council' };
}

export function investigationFeedback(task: Investigation, answer: Record<string, string>): string {
  const missing = task.items.filter(item => !answer[item.id]);
  if (missing.length) return `Còn ${missing.length} dữ kiện chưa gắn: ${missing.map(item => `“${item.label}”`).join(', ')}. Chọn một dữ kiện, rồi chọn vị trí ở bảng bên cạnh hoặc phía dưới.`;
  const wrong = task.items.find(item => answer[item.id] !== item.target);
  return wrong
    ? `Dữ kiện “${wrong.label}” chưa khớp với hồ sơ. Chọn lại thẻ này để đổi vị trí; đọc lại chứng cứ hoặc dùng Gợi ý nếu cần. Các thẻ khác vẫn được giữ.`
    : 'Lựa chọn còn dữ kiện không thuộc bước này. Hãy kiểm tra lại các thẻ trước khi nộp.';
}
