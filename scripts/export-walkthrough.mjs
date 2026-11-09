import fs from 'node:fs';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
try {
  const { chapters, character, finalReviewers, knowledge } = await server.ssrLoadModule('/src/council/content.ts');
  const lines = ['# Đáp án & hướng dẫn Mật Mã Ký Ức — Hồ Sơ 2126 V2', '', '> Có spoiler. Dành cho kiểm tra, học lại và chuẩn bị buổi trình diễn. Nội dung vẫn cần duyệt học thuật: 0 verified / 16 needs-review.', '', '## Nguyên tắc chung', '', 'Bốn chứng cứ đầu và ba bước kiểm chứng đủ để mở phiên hội đồng của mỗi chương. Hai chứng cứ bổ trợ có thể thay cho một số bộ chứng cứ khác, không bắt buộc thu thập toàn bộ. Phong thư mở sau bước kiểm chứng thứ hai và dùng thao tác ghi nhận riêng.', '', 'Kết luận đúng chưa đủ: cần đủ một bộ chứng cứ chứng minh và cách sửa phù hợp. Có thể thêm hồ sơ liên quan, nhưng không thêm hồ sơ phục vụ câu hỏi khác. Dùng gợi ý hoặc thử sai không làm mất tiến độ.', ''];
  const renderCase = (c, definition) => {
    lines.push(`**Câu hỏi:** ${definition.guide.question}`, '', `**Kết luận:** ${definition.conclusions.find(o => o.id === definition.correctConclusion).text}`, '', `**Cách phục dựng:** ${definition.repairs.find(o => o.id === definition.correctRepair).text}`, '', '**Một số bộ đủ căn cứ (có thể thêm hồ sơ liên quan):**', '');
    for (const set of definition.evidenceSets) lines.push(`- ${set.map(id => c.evidence.find(e => e.id === id).title).join(' + ')}`);
    lines.push('', `**Vì sao:** ${definition.guide.explanation}`, '', `**Vì sao cách sửa phù hợp:** ${definition.guide.repairExplanation}`, '', definition.success, '');
  };
  for (const c of chapters) {
    lines.push(`## ${c.id}. ${c.name} — ${c.subtitle}`, '', c.incident, '', '### Tìm chứng cứ', '', '| Điểm | Hồ sơ | Thành viên | Điều kiện |', '|---|---|---|---|');
    for (const e of c.evidence) lines.push(`| ${e.index + 1} | ${e.title} | ${character(e.role).name} | ${e.requires.length ? e.requires.map(id => c.evidence.find(e => e.id === id)?.title ?? c.investigations.find(t => t.id === id)?.title).join(', ') : 'Mở từ đầu'} |`);
    lines.push('');
    for (const t of c.investigations) {
      lines.push(`### ${t.title} · ${character(t.role).name}`, '', t.prompt, '', '| Dữ kiện | Vị trí đúng |', '|---|---|');
      for (const i of t.items) lines.push(`| ${i.label} | ${t.targets.find(target => target.id === i.target).label} |`);
      const p = knowledge(t.objectiveId); lines.push('', t.success, '', `Nguồn: Chương ${c.id}, trang in ${p.source.printedPages.join(', ')}. Mục tiêu tham chiếu: ${t.objectiveId}.`, '');
    }
    lines.push('### Phiên hội đồng', ''); renderCase(c, c.council);
    lines.push(`**Phần thưởng:** ${c.reward}`, '');
  }
  lines.push('## Phòng Lõi — Báo cáo tổng hợp', '', 'Phục dựng đủ bốn khu vực. Với mỗi đoạn, phân công thành viên tương ứng kiểm tra trước, rồi nộp kết luận–chứng cứ–cách sửa.', '');
  for (const c of chapters) { lines.push(`### ${c.finalCase.title}`, '', `Người kiểm tra: **${character(finalReviewers[c.id]).name}**.`, ''); renderCase(c, c.finalCase); }
  lines.push('## Hai kết thúc', '', '- Hoàn thành báo cáo: Thư viện đã sáng lại.', '- Hoàn thành báo cáo và ghi nhận cả bốn thư: Ký ức được nối lại.', '- Có thể tìm thư sau khi hoàn thành, không cần reset hoặc làm lại các phiên hội đồng.', '', '## Demo', '', 'Tìm Nhật ký xóa toàn bộ bằng Minh và Phạm vi của “bỏ qua” bằng An. Kết luận và cách sửa giống phiên hội đồng phòng 3; gắn đúng cả hai chứng cứ. Demo không truy cập tiến độ chính.', '');
  fs.writeFileSync('DAP_AN_HOI_DONG.md', lines.join('\n'));
  console.log('Exported DAP_AN_HOI_DONG.md from canonical TypeScript content.');
} finally { await server.close(); }
