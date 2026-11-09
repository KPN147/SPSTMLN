import { puzzles } from '../data/puzzles';
import { councilContent } from './councilContent';
import { discoveryHints, evidenceSummaries } from './evidenceContent';
import type { Character, Chapter, CouncilCase, DialogueNode, Evidence, Investigation, RoleId } from './types';
import type { RoomId } from '../game/types';

export const characters: Character[] = [
  { id: 'an', name: 'An', role: 'Người lưu trữ', ability: 'Đối chiếu tài liệu', color: '#D9B56E', description: 'Một kết luận tốt luôn có xuất xứ rõ ràng.' },
  { id: 'minh', name: 'Minh', role: 'Kỹ sư hệ thống', ability: 'Kiểm tra & chạy thử', color: '#8EBBD9', description: 'Đừng đoán lỗi. Hãy xem hệ thống đã làm gì.' },
  { id: 'vy', name: 'Vy', role: 'Điều tra viên', ability: 'Tìm lại bối cảnh', color: '#E6A18B', description: 'Chi tiết bị bỏ quên có thể thay đổi cách hiểu.' },
  { id: 'khoi', name: 'Khôi', role: 'Điều phối viên', ability: 'Kết nối chứng cứ', color: '#B6A1E0', description: 'Phân biệt điều đã biết với điều chưa chứng minh.' },
];
export const character = (id: RoleId) => characters.find(c => c.id === id)!;
export const finalReviewers: Record<RoomId, RoleId> = { 1: 'an', 2: 'vy', 3: 'minh', 4: 'khoi' };
export const knowledge = (id: string) => puzzles.find(p => p.id === id)!;
const eid = (room: RoomId, index: number) => `c${room}-e${index}`;
const sourceBody = (id: string) => knowledge(id).readingNote;
const ev = (room: RoomId, names: string[], log: string, lore: string, details: string[]): Evidence[] => {
  const roles: RoleId[] = ['an', 'minh', 'vy', 'an', 'minh', 'vy', 'vy'];
  return names.map((title, i): Evidence => {
    const sourceId = i === 0 ? `r${room}-p1` : i === 2 ? `r${room}-p2` : i === 3 ? `r${room}-p3` : i === 4 || i === 5 ? `r${room}-p4` : undefined;
    const history = knowledge('r1-p3');
    const dates = room === 1 && i === 3 && history.type === 'timeline' ? `\n\nBiên mục: ${history.events.map(e => `${e.year} — ${e.label}`).join(' ')} Thời gian không tự chứng minh quan hệ nhân quả.` : '';
    const body = i === 1 ? log : i === 6 ? lore : sourceBody(sourceId!) + dates + (i === 3 ? `\n\nChú thích trong cùng hồ sơ: ${sourceBody(`r${room}-p4`)}` : '');
    return { id: eid(room, i + 1), chapterId: room, index: i, title, body, summary: evidenceSummaries[room][i], kind: i < 4 ? 'essential' : i < 6 ? 'support' : 'story', fiction: i === 1 || i === 6, sourceId, relatedSources: i === 3 ? [`r${room}-p4`] : [], role: roles[i], requires: i === 4 ? [eid(room, 2)] : i === 5 ? [eid(room, 3)] : i === 6 ? [`c${room}-i2`] : [], discovery: discoveryHints[room][i] ?? details[i] ?? 'Một mảnh hồ sơ đã tìm lại được vị trí.', detail: evidenceSummaries[room][i] };
  });
};
function probe(room: RoomId, n: number, role: RoleId, title: string, prompt: string, type: Investigation['type'], required: number[], targets: string[], labels: [string, number][], hints: [string, string], success: string): Investigation {
  return { id: `c${room}-i${n}`, chapterId: room, objectiveId: `r${room}-p${n}`, role, title, prompt, type, requires: required.map(i => eid(room, i)), targets: targets.map((label, i) => ({ id: `t${i}`, label })), items: labels.map(([label, target], i) => ({ id: `item${i}`, label, target: `t${target}` })), hints, success };
}
function council(room: RoomId, final = false): CouncilCase {
  const id = `${final ? 'final' : 'case'}-${room}`;
  const copy = councilContent[id];
  const make = (prefix: string, correct: string, explanation: string, wrong: { text: string; why: string }[], position: number) => {
    let next = 0;
    return Array.from({ length: 3 }, (_, index) => {
      const choice = index === position ? { text: correct, why: explanation } : wrong[next++];
      return { id: `${id}-${prefix}${index}`, text: choice.text, explanation: choice.why };
    });
  };
  return {
    id, chapterId: room, title: copy.title, report: copy.report,
    guide: { question: copy.question, checkpoints: copy.checkpoints, hint: copy.hint, explanation: copy.explanation, repairExplanation: copy.repairExplanation, evidenceNotes: Object.fromEntries(Object.entries(copy.evidenceNotes).map(([index, note]) => [eid(room, Number(index)), note])) },
    conclusions: make('c', copy.conclusion, copy.explanation, copy.wrongConclusions, room % 3), correctConclusion: `${id}-c${room % 3}`,
    repairs: make('r', copy.repair, copy.repairExplanation, copy.wrongRepairs, (room + 1) % 3), correctRepair: `${id}-r${(room + 1) % 3}`,
    evidenceSets: copy.sets.map(set => set.map(index => eid(room, index))),
    rebuttals: { conclusion: copy.explanation, evidence: copy.hint, repair: copy.repairExplanation }, success: copy.success,
  };
}
const lores = [
  'Gửi người đến sau: Chúng tôi giữ sách rất cẩn thận, nhưng một trang mất xuất xứ có thể bị đọc như một câu chuyện khác. — An Nhiên, nhóm lưu trữ cũ. (Thư hư cấu)',
  'Tôi từng nghĩ chỉ cần giữ máy chạy. Hôm nay mới thấy hồ sơ của một người không thể thu vào một cột dữ liệu. Chúng tôi đã thêm ô “bối cảnh”. — Bảo. (Thư hư cấu)',
  'Bản vá đêm cuối chưa hoàn thành. Chương trình sao chép nội dung nhưng bỏ qua các mối liên hệ. Xin đừng xóa kho dữ liệu; hãy nối lại chúng. — Linh. (Thư hư cấu)',
  'Nếu thư viện thức dậy, hãy để người đọc kiểm tra nguồn, đặt câu hỏi và sửa những liên kết sai. Thứ chúng tôi muốn giữ không chỉ là những trang giấy, mà còn là cách hiểu chúng. — Nhóm phục dựng đầu tiên. (Thư hư cấu)',
];

export const chapters: Chapter[] = [
  {
    id: 1, name: 'Thư viện Khởi nguyên', shortName: 'Khởi nguyên', subtitle: 'Hồ sơ bị đánh tráo', color: '#D9B56E', background: '/art/room-1.webp',
    incident: 'Máy chiếu đã ghép điều kiện ra đời, nhân vật và tác phẩm thành một hồ sơ sai. Một bản thảo đang bị gắn nhầm người và thời điểm.',
    question: 'Máy đang lẫn nhóm tiền đề, người viết và tác phẩm như thế nào?', intro: 'An: Máy đã ghép nhầm nhóm tiền đề, tác giả và tác phẩm. Đọc bốn hồ sơ bắt buộc, làm ba kiểm chứng rồi cùng giải thích cách sửa tại hội đồng.',
    hotspotNames: ['Kệ bản thảo', 'Máy chiếu lỗi', 'Tủ chân dung', 'Đồng hồ lịch sử', 'Ngăn đối chiếu', 'Dấu vết bàn giao'], lore: lores[0],
    evidence: ev(1, ['Ba nhóm tiền đề', 'Nhật ký gán nhãn', 'Hồ sơ tác giả & tác phẩm', 'Các mốc lịch sử', 'Bản đối chiếu xuất xứ', 'Ghi chú kế thừa', 'Thư 01 · Một trang mất tên'], 'Nhật ký hư cấu: hệ thống gộp một phong trào xã hội vào ngăn “phát minh tự nhiên”, gán tên tác phẩm cho tác giả và sắp mốc theo thứ tự nhập máy. Trường “xuất xứ” bị bỏ trống.', lores[0], [
      'An: Phong trào xã hội và phát minh tự nhiên không trả lời cùng một câu hỏi. Hãy giữ chúng ở đúng nhóm.',
      'Minh: Máy xếp theo thứ tự nhập, không theo thời gian. Tôi có thể khôi phục các mốc sau khi có hồ sơ lịch sử.',
      'Vy: Có cả nhân vật, trào lưu và một tác phẩm trong cùng tủ. Nhãn giống nhau không có nghĩa chúng cùng loại.',
      'An: Dấu ngày tháng còn trong biên mục. Ta có thể đưa từng sự kiện về đúng mốc mà không suy ra quan hệ nhân quả.',
      'Minh: Bản đối chiếu cho thấy lỗi gán nhãn xuất hiện trước khi máy chiếu khởi động.',
      'Vy: Dòng “kế thừa có phê phán” đã bị cắt mất nửa sau. Đó không phải sao chép nguyên vẹn.',
      'Vy: Một lá thư được kẹp dưới phiếu bàn giao. Người lưu trữ trước đây cũng lo về những trang mất xuất xứ.',
    ]),
    investigations: [
      probe(1, 1, 'an', 'Đưa bản thảo về đúng ngăn', "Xếp 3 thẻ vào 3 nhóm tiền đề. Hỏi mỗi thẻ nói về đời sống xã hội, khám phá tự nhiên hay một học thuyết.", 'archive', [1], ['Điều kiện kinh tế – xã hội', 'Tiền đề khoa học tự nhiên', 'Tiền đề tư tưởng – lý luận'], [['Đại công nghiệp và phong trào công nhân', 0], ['Học thuyết tiến hóa', 1], ['Triết học cổ điển Đức', 2]], ["Đời sống và phong trào lao động thuộc bối cảnh kinh tế – xã hội. Khám phá tự nhiên thuộc khoa học. Học thuyết triết học thuộc lý luận.","Đại công nghiệp và phong trào công nhân → kinh tế – xã hội; tiến hóa → khoa học tự nhiên; triết học cổ điển Đức → tư tưởng – lý luận."], 'Các ngăn bản thảo đã sáng đúng màu. Bối cảnh lịch sử và những thành tựu nhận thức được phân biệt.'),
      probe(1, 2, 'vy', 'Sửa nhãn hồ sơ', "Ghép mỗi tên với đúng vai trò: ai đặt nền tảng, ai phát triển tiếp và đâu là một tác phẩm.", 'archive', [3], ['Nền tảng lý luận', 'Vận dụng, phát triển trong điều kiện mới', 'Tác phẩm năm 1848'], [['C. Mác và Ph. Ăngghen', 0], ['V.I. Lênin', 1], ['Tuyên ngôn của Đảng Cộng sản', 2]], ["Trước hết phân biệt tên người với tên tác phẩm. Sau đó đọc đóng góp của từng người trong hồ sơ.","Mác và Ăngghen → nền tảng; Lênin → vận dụng, phát triển; Tuyên ngôn → tác phẩm năm 1848."], 'Chân dung và tác phẩm đã được trả về đúng hồ sơ. Trào lưu tiền thân có giá trị và giới hạn riêng, không đồng nhất với tác phẩm.'),
      probe(1, 3, 'minh', 'Khôi phục đồng hồ', "Đọc “Các mốc lịch sử”, rồi ghép từng sự kiện với năm của nó. Bài này chỉ yêu cầu đúng mốc năm.", 'timeline', [2, 4], ['1848', '1871', '1917', '1986'], [['Tuyên ngôn của Đảng Cộng sản', 0], ['Công xã Paris', 1], ['Cách mạng Tháng Mười Nga', 2], ['Đổi mới ở Việt Nam', 3]], ["Tìm tên sự kiện trong hồ sơ rồi đọc năm đi kèm. Không dùng mức độ quan trọng để xếp.","Tuyên ngôn → 1848; Công xã Paris → 1871; Cách mạng Tháng Mười Nga → 1917; Đổi mới → 1986."], 'Đồng hồ hoạt động. Thứ tự thời gian đã rõ, nhưng tự nó không chứng minh quan hệ nhân quả.'),
    ],
    council: council(1),
    finalCase: council(1, true),
    reward: 'Kệ sách mở. Máy chiếu lộ ra dòng cảnh báo: “Không tìm thấy ngữ cảnh”.',
  },
  {
    id: 2, name: 'Nhà máy Sứ mệnh', shortName: 'Sứ mệnh', subtitle: 'Bản nhận diện thiếu một nửa', color: '#8EBBD9', background: '/art/room-2.webp',
    incident: 'Dây chuyền nhận diện chỉ đọc một cột dữ liệu. Những thay đổi về công nghệ khiến nó gạt bỏ nhiều hồ sơ trước khi kiểm tra bối cảnh.', question: 'Máy đã bỏ thông tin nào khi nhận diện hồ sơ lao động?', intro: 'Vy: Máy đang nhận diện hồ sơ từ quá ít thông tin. Hãy đọc đủ hai phương diện và kiểm tra nhật ký để tìm phần bị bỏ sót.',
    hotspotNames: ['Hồ sơ lao động', 'Bộ đọc nhận diện', 'Sơ đồ ba hệ thống', 'Bảng điều kiện', 'Kho đối chiếu', 'Trạm bàn giao'], lore: lores[1],
    evidence: ev(2, ['Hai phương diện nhận diện', 'Nhật ký một cột dữ liệu', 'Ba nội dung sứ mệnh', 'Hai lớp điều kiện', 'Hồ sơ lao động hiện đại', 'Bản kiểm tra biến đổi', 'Thư 02 · Ô bối cảnh'], 'Nhật ký hư cấu: bộ đọc chỉ lưu phương thức lao động; bỏ qua vị trí sở hữu, việc bán sức lao động và quan hệ lợi ích trong bối cảnh CNTB. Ngoại hình và máy móc bị dùng thay cho hồ sơ.', lores[1], [
      'An: Hai phương diện phải được xem xét theo đúng bối cảnh. Không thể nhận diện một người chỉ từ trang phục.', 'Minh: Tôi tìm thấy bộ lọc chỉ giữ một cột. Lỗi nằm ở dữ liệu đầu vào, không phải màu nhãn.', 'Vy: Ba nội dung liên quan nhau nhưng có trọng tâm riêng. Hãy xem mỗi mô tả đang nói về hoạt động nào.', 'An: Có điều kiện khách quan và điều kiện chủ quan. Chúng không tự thay thế cho nhau.', 'Minh: Tự động hóa và trí thức hóa là biến đổi cần được xem xét, không phải lý do tự động xóa một nhóm hồ sơ.', 'Vy: Tên nghề đơn lẻ chưa cung cấp đủ căn cứ. Ta cần những phương diện mà tài liệu nêu.', 'Vy: Người kỹ sư cũ đã thêm ô bối cảnh bằng tay. Có lẽ bản phục hồi bỏ mất thay đổi này.',
    ]),
    investigations: [
      probe(2, 1, 'an', 'Bổ sung lớp nhận diện', "Chia hai mô tả theo câu hỏi chúng trả lời: người đó lao động thế nào, hay có những quan hệ sở hữu và lợi ích nào trong chủ nghĩa tư bản?", 'layers', [1], ['Kinh tế – xã hội', 'Chính trị – xã hội trong chủ nghĩa tư bản'], [['Phương thức lao động và vị trí trong sản xuất công nghiệp', 0], ['Sở hữu, bán sức lao động và quan hệ lợi ích', 1]], ["Cách lao động và vị trí trong sản xuất là một phương diện. Sở hữu, bán sức lao động và quan hệ lợi ích là phương diện còn lại.","Phương thức lao động → kinh tế – xã hội; sở hữu và bán sức lao động → chính trị – xã hội trong chủ nghĩa tư bản."], 'Bản nhận diện đã có hai lớp dữ liệu; không dùng ngoại hình làm căn cứ.'),
      probe(2, 2, 'minh', 'Khởi động ba hệ thống', "Nối 3 mô tả vào 3 nội dung sứ mệnh. Tìm từ khóa chính: sản xuất, quyền lực – tổ chức, hoặc giá trị – ý thức.", 'circuit', [2, 3], ['Kinh tế', 'Chính trị – xã hội', 'Văn hóa – tư tưởng'], [['Hoạt động trong sản xuất và phát triển lực lượng sản xuất', 0], ['Xây dựng, tổ chức và thực hiện quyền lực chính trị theo nội dung giáo trình', 1], ['Xây dựng giá trị, văn hóa và ý thức xã hội', 2]], ["Đọc trọng tâm của cả câu, thay vì chỉ chọn vì thấy một từ quen.","Sản xuất → kinh tế; quyền lực và tổ chức → chính trị – xã hội; giá trị và ý thức → văn hóa – tư tưởng."], 'Ba vùng dây chuyền khởi động, mỗi vùng giữ đúng nội dung thay vì gộp vào một nhãn.'),
      probe(2, 3, 'vy', 'Tìm điều kiện bị bỏ sót', "Chia các thẻ thành điều kiện khách quan và chủ quan. Hỏi thẻ nói về địa vị trong xã hội hay về sự phát triển, tổ chức của chủ thể.", 'layers', [4], ['Điều kiện khách quan', 'Điều kiện chủ quan'], [['Địa vị kinh tế – xã hội và đặc điểm của giai cấp công nhân', 0], ['Sự phát triển về số lượng và chất lượng của bản thân giai cấp công nhân', 1], ['Vai trò tổ chức, lãnh đạo theo giáo trình', 1]], ["Khách quan gắn với địa vị và đặc điểm trong xã hội. Chủ quan gắn với sự phát triển của bản thân và vai trò tổ chức, lãnh đạo.","Địa vị kinh tế – xã hội → khách quan; số lượng, chất lượng và tổ chức, lãnh đạo → chủ quan."], 'Hai lớp điều kiện được nối lại. Một lớp không tự bảo đảm thay cho lớp còn lại.'),
    ],
    council: council(2),
    finalCase: council(2, true),
    reward: 'Dây chuyền sáng lại. Nhật ký xác nhận: trường bối cảnh đã bị bỏ qua khi khôi phục.',
  },
  {
    id: 3, name: 'Phòng thí nghiệm Chuyển mình', shortName: 'Chuyển mình', subtitle: 'Lệnh “bỏ qua”', color: '#65D5C9', background: '/art/room-3.webp',
    incident: 'Máy trung tâm báo: “Đã loại bỏ toàn bộ dữ liệu thành tựu để thực hiện lệnh bỏ qua.” Mô hình thành phố đang tắt từng lớp.', question: 'Máy có hiểu nhầm “bỏ qua chế độ” thành “xóa mọi thành tựu” không?', intro: 'Minh: Đừng xóa thêm dữ liệu. Nhật ký cho biết máy đã làm gì; còn tài liệu và bối cảnh mới giúp chúng ta biết phải sửa gì.',
    hotspotNames: ['Bản thiết kế', 'Nhật ký lệnh', 'Hai tuyến chuyển tiếp', 'Bảng bốn lĩnh vực', 'Kho thành tựu', 'Phiếu bàn giao'], lore: lores[2],
    evidence: ev(3, ['Chú giải bản thiết kế', 'Nhật ký xóa toàn bộ', 'Điều kiện xuất phát', 'Bốn lớp chuyển đổi', 'Phạm vi của “bỏ qua”', 'Chú thích bị tách rời', 'Thư 03 · Bản vá đêm cuối'], 'Nhật ký hư cấu: bộ phục dựng nhận lệnh “bỏ qua chế độ” nhưng mở rộng đối tượng thành “mọi thành tựu”. Nó đánh dấu cả dữ liệu khoa học–công nghệ để xóa. Phần chú thích đi kèm không được nạp.', lores[2], [
      'An: Bản thiết kế mô tả nhiều đặc trưng; không thể thu cả mô hình về một chỉ số.', 'Minh: Lệnh đã được áp dụng rộng hơn cụm từ trong hồ sơ. Nhưng nhật ký chưa đủ để giải thích đúng khái niệm.', 'Vy: Hai hồ sơ có điều kiện xuất phát khác nhau. Tên tuyến chỉ có nghĩa khi giữ được bối cảnh ấy.', 'An: Kinh tế, chính trị, tư tưởng–văn hóa và xã hội là những góc nhìn phân tích; các biến đổi thực tế có thể liên hệ nhau.', 'Minh: Tài liệu phân biệt chế độ với những thành tựu có thể tiếp thu, kế thừa. Ta đã có căn cứ để thử bản sửa.', 'Vy: Chú thích không biến mất, nó bị lưu ở một ngăn khác. Ghép lại giúp làm rõ đối tượng của “bỏ qua”.', 'Vy: Lá thư đề nghị đừng xóa kho dữ liệu. Lỗi sao chép đã làm mất các liên kết, không làm mất mọi nội dung.',
    ]),
    investigations: [
      probe(3, 1, 'an', 'Phục hồi chú giải mô hình', "Ghép mỗi mô tả với điều nó đang nói tới: con người, kinh tế hay quyền làm chủ. Mỗi thẻ chỉ nêu một đặc trưng của chủ nghĩa xã hội.", 'layers', [1], ['Con người', 'Kinh tế', 'Quyền làm chủ'], [['Giải phóng con người, tạo điều kiện phát triển con người', 0], ['Nền kinh tế phát triển dựa trên lực lượng sản xuất hiện đại', 1], ['Nhân dân lao động làm chủ', 2]], ["Tìm đối tượng chính: phát triển ai, dựa vào cơ sở kinh tế nào, hoặc ai làm chủ.","Giải phóng và phát triển con người → con người; lực lượng sản xuất → kinh tế; nhân dân lao động làm chủ → quyền làm chủ."], 'Các lớp chú giải đã hiện lại. Không đồng nhất nhiều đặc trưng với một chỉ số đơn lẻ.'),
      probe(3, 2, 'vy', 'Đặt hồ sơ vào tuyến chuyển tiếp', "Đọc điểm xuất phát của mỗi hồ sơ rồi chọn tuyến quá độ. Không chọn theo cảm giác nhanh hoặc chậm.", 'flow', [3], ['Quá độ trực tiếp', 'Quá độ gián tiếp'], [['Từ chủ nghĩa tư bản đã phát triển cao lên chủ nghĩa xã hội', 0], ['Từ xã hội chưa trải qua chủ nghĩa tư bản phát triển đầy đủ lên chủ nghĩa xã hội', 1]], ["Trực tiếp và gián tiếp được phân biệt theo điều kiện xuất phát, không phải tốc độ.","Từ chủ nghĩa tư bản đã phát triển cao → trực tiếp; chưa qua chủ nghĩa tư bản phát triển đầy đủ → gián tiếp."], 'Hai hồ sơ đã về đúng tuyến. Tên tuyến không tự quy định tốc độ hay một khuôn mẫu cho mọi trường hợp.'),
      probe(3, 3, 'minh', 'Khởi động bốn lớp dữ liệu', "Ghép 4 mô tả vào lĩnh vực có cùng trọng tâm: sản xuất, quyền lực, giá trị – ý thức hoặc các nhóm xã hội.", 'circuit', [2, 4], ['Kinh tế', 'Chính trị', 'Tư tưởng – văn hóa', 'Xã hội'], [['Nhiều thành phần kinh tế', 0], ['Tổ chức và thiết chế quyền lực', 1], ['Hệ tư tưởng và giá trị', 2], ['Giai cấp, tầng lớp và quan hệ giữa họ', 3]], ["Bài này hỏi lĩnh vực chính đang được mô tả; không nói các lĩnh vực hoàn toàn tách rời nhau.","Thành phần kinh tế → kinh tế; thiết chế quyền lực → chính trị; giá trị → tư tưởng – văn hóa; giai cấp, tầng lớp → xã hội."], 'Mô hình chạy thử bốn lớp dữ liệu. Chưa thể xác nhận lệnh “bỏ qua” trước khi đối chiếu tài liệu phạm vi.'),
    ],
    council: council(3),
    finalCase: council(3, true),
    reward: 'Mô hình thành phố sáng lại. Các liên kết bị cắt đã trở về đúng chỗ.',
  },
  {
    id: 4, name: 'Hội trường Quyền làm chủ', shortName: 'Quyền làm chủ', subtitle: 'Quyết định bị đứt đoạn', color: '#B6A1E0', background: '/art/room-4.webp',
    incident: 'Kho biên bản chỉ giữ kết quả quyết định. Chủ thể tham gia và cơ chế bảo đảm thực hiện đã bị tách khỏi sơ đồ.', question: 'Ai tham gia quyết định và quyền làm chủ được thực hiện bằng cách nào?', intro: 'Khôi: Biên bản chỉ còn kết quả. Hãy tìm ai tham gia, qua hình thức nào và quyền được bảo đảm, thực hiện ra sao.',
    hotspotNames: ['Tường chú giải', 'Máy lưu biên bản', 'Ghế đại diện', 'Bảng chức năng', 'Kho quy trình', 'Hồ sơ hội trường'], lore: lores[3],
    evidence: ev(4, ['Ba phương diện dân chủ', 'Biên bản thiếu mắt xích', 'Chủ thể thực hiện quyền', 'Tiêu chí chức năng Nhà nước', 'Cơ chế bảo đảm thực hiện', 'Hai hình thức cùng tồn tại', 'Thư 04 · Người đọc đến sau'], 'Nhật ký hư cấu: hệ thống giữ “kết quả” nhưng tách các trường “chủ thể”, “hình thức tham gia” và “cơ chế thực hiện”. Ví dụ hội trường trong game là tình huống minh họa, không phải quy trình pháp lý ngoài thực tế.', lores[3], [
      'An: Ba phương diện là ba góc nhìn của khái niệm, không phải ba kiểu bỏ phiếu.', 'Minh: Kết quả được giữ, nhưng đường đi của quyết định đã mất. Cần phục hồi các trường dữ liệu.', 'Vy: Hãy xem ai đang trực tiếp thực hiện hành vi quyết định: người dân hay người đại diện.', 'An: Các nhóm chức năng dùng những tiêu chí khác nhau; cùng một hoạt động có thể được nhìn từ nhiều góc.', 'Minh: Tuyên bố quyền cần gắn với cơ chế bảo đảm và thực hiện, không chỉ một dòng trên màn hình.', 'Vy: Thiết chế đại diện không tự phủ nhận hình thức tham gia trực tiếp. Hai hình thức có thể cùng tồn tại.', 'Vy: Đây là lời nhắn cuối của nhóm cũ. Họ muốn giữ cả cách đặt câu hỏi và kiểm chứng tài liệu.',
    ]),
    investigations: [
      probe(4, 1, 'an', 'Nối ba lớp chú giải', "Ghép 3 mô tả với 3 góc nhìn về dân chủ: ai nắm quyền, quyền được tổ chức thế nào, hoặc dùng nguyên tắc nào để quản lý.", 'layers', [1], ['Quyền lực', 'Chế độ xã hội / chính trị', 'Nguyên tắc tổ chức, quản lý'], [['Quyền lực thuộc về nhân dân', 0], ['Hình thức tổ chức thực thi quyền lực trong xã hội', 1], ['Vận dụng dân chủ trong tổ chức và quản lý', 2]], ["Đừng hiểu đây là ba kiểu bỏ phiếu. Mỗi thẻ đang trả lời một câu hỏi khác nhau về dân chủ.","Nhân dân nắm quyền → quyền lực; tổ chức thực thi quyền lực trong xã hội → chế độ; tổ chức và quản lý → nguyên tắc."], 'Ba lớp chú giải được nối lại, không thu khái niệm vào một thao tác bỏ phiếu.'),
      probe(4, 2, 'vy', 'Theo dấu người tham gia', "Trong từng tình huống minh họa, xem ai đang trực tiếp thực hiện hành vi: người dân hay đại biểu thực hiện chức năng đại diện.", 'flow', [3], ['Trực tiếp', 'Gián tiếp / đại diện'], [['Người dân trực tiếp biểu quyết trong quy trình hợp lệ', 0], ['Đại biểu được bầu thực hiện chức năng trong cơ quan đại diện', 1]], ["Xét đúng hành vi được mô tả, không chỉ nhìn việc trước đó có bầu chọn hay không.","Người dân trực tiếp biểu quyết → trực tiếp; đại biểu thực hiện chức năng đại diện → gián tiếp / đại diện."], 'Chủ thể và hình thức thực hiện đã rõ. Hai hình thức không loại trừ nhau.'),
      probe(4, 3, 'minh', 'Phục hồi bảng chức năng', "Ghép từng cặp hoặc nhóm chức năng với tiêu chí phân chia: tác động ở đâu, thuộc lĩnh vực gì, hay có tính chất quyền lực nào.", 'circuit', [2, 4], ['Phạm vi tác động', 'Lĩnh vực', 'Tính chất quyền lực'], [['Đối nội và đối ngoại', 0], ['Chính trị, kinh tế, văn hóa, xã hội', 1], ['Tổ chức xây dựng và trấn áp theo giáo trình', 2]], ["Đối nội – đối ngoại hỏi phạm vi. Chính trị – kinh tế hỏi lĩnh vực. Tổ chức xây dựng – trấn áp hỏi tính chất quyền lực.","Đối nội / đối ngoại → phạm vi; chính trị / kinh tế / văn hóa / xã hội → lĩnh vực; xây dựng / trấn áp → tính chất quyền lực."], 'Bảng chức năng hiện theo ba góc nhìn, không thành các ngăn loại trừ nhau.'),
    ],
    council: council(4),
    finalCase: council(4, true),
    reward: 'Sơ đồ hội trường được nối lại. Cánh cửa Phòng Lõi mở ra.',
  },
];

export const chapter = (id: RoomId) => chapters.find(c => c.id === id)!;
export const allEvidence = chapters.flatMap(c => c.evidence);
export const allInvestigations = chapters.flatMap(c => c.investigations);

export const dialogues: DialogueNode[] = chapters.flatMap(c => [
  { id: `c${c.id}-intro`, chapterId: c.id, speaker: ({ 1: 'an', 2: 'vy', 3: 'minh', 4: 'khoi' } as const)[c.id], emotion: 'thinking' as const, text: c.intro.replace(/^(An|Minh|Vy|Khôi): /, ''), choices: [{ id: 'documents', label: 'Bắt đầu từ tài liệu', next: `c${c.id}-approach`, flag: `c${c.id}-documents` }, { id: 'system', label: 'Kiểm tra hệ thống trước', next: `c${c.id}-approach`, flag: `c${c.id}-system` }] },
  { id: `c${c.id}-approach`, chapterId: c.id, speaker: 'vy' as const, emotion: 'neutral' as const, text: 'Ta có thể xem các điểm đang mở theo bất kỳ thứ tự nào. Khi thiếu dữ kiện, hãy hỏi thành viên khác hoặc mở Sổ chung; không cần đoán mò.', choices: [] },
  ...c.evidence.slice(0, 6).flatMap(e => [
    { id: `${e.id}-found`, chapterId: c.id, speaker: e.role, emotion: e.index === 1 ? 'surprise' as const : 'thinking' as const, text: e.discovery, choices: [{ id: 'clarify', label: 'Hồ sơ này nói ngắn gọn điều gì?', next: `${e.id}-detail`, flag: `${e.id}-clarified` }, { id: 'compare', label: 'So với hồ sơ đã tìm, có gì khác?', next: `${e.id}-detail`, requires: [eid(c.id, e.index === 0 ? 2 : 1)], flag: `${e.id}-compared` }] },
    { id: `${e.id}-detail`, chapterId: c.id, speaker: (e.role === 'an' ? 'khoi' : 'an') as RoleId, emotion: 'doubt' as const, text: e.detail, choices: [] },
  ]),
  { id: `c${c.id}-debate`, chapterId: c.id, speaker: 'khoi' as const, emotion: 'thinking' as const, text: 'Hãy trả lời ba câu: máy sai ở đâu, hồ sơ nào chứng minh điều đó, và phải sửa phần nào. Nhật ký cho biết máy đã làm gì; tài liệu cho biết cách hiểu đúng.', choices: [{ id: 'challenge', label: 'Phản biện bằng chứng cứ', next: `c${c.id}-recap`, requires: [eid(c.id, 1), eid(c.id, 2)], flag: `c${c.id}-challenged` }, { id: 'test', label: 'Đề xuất kiểm tra bản phục dựng', next: `c${c.id}-recap`, requires: [`c${c.id}-i3`], flag: `c${c.id}-tested` }] },
  { id: `c${c.id}-recap`, chapterId: c.id, speaker: 'minh' as const, emotion: 'agree' as const, text: 'Ta có thể sửa và kiểm tra lại mà không mất chứng cứ. Nếu còn mâu thuẫn, quay lại hồ sơ sẽ hữu ích hơn đoán một kết luận mới.', choices: [] },
]);
export const dialogue = (id: string) => dialogues.find(d => d.id === id);
