import { puzzles } from '../data/puzzles';
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
    return { id: eid(room, i + 1), chapterId: room, index: i, title, body, kind: i < 4 ? 'essential' : i < 6 ? 'support' : 'story', fiction: i === 1 || i === 6, sourceId, relatedSources: i === 3 ? [`r${room}-p4`] : [], role: roles[i], requires: i === 4 ? [eid(room, 2)] : i === 5 ? [eid(room, 3)] : i === 6 ? [`c${room}-i2`] : [], discovery: details[i] ?? 'Một mảnh hồ sơ đã tìm lại được vị trí.', detail: i === 1 ? 'Nhật ký này thuộc cốt truyện hư cấu. Muốn đánh giá khái niệm, cần đối chiếu thêm tài liệu nguồn.' : i === 6 ? 'Ký ức của nhóm lưu trữ trước đây, bổ sung câu chuyện và không thay đổi kết luận học thuật.' : knowledge(sourceId!).keyTakeaways.join(' ') };
  });
};
function probe(room: RoomId, n: number, role: RoleId, title: string, prompt: string, type: Investigation['type'], required: number[], targets: string[], labels: [string, number][], hints: [string, string], success: string): Investigation {
  return { id: `c${room}-i${n}`, chapterId: room, objectiveId: `r${room}-p${n}`, role, title, prompt, type, requires: required.map(i => eid(room, i)), targets: targets.map((label, i) => ({ id: `t${i}`, label })), items: labels.map(([label, target], i) => ({ id: `item${i}`, label, target: `t${target}` })), hints, success };
}
function council(room: RoomId, title: string, report: string, conclusions: string[], repairs: string[], sets: number[][], success: string, final = false): CouncilCase {
  const id = `${final ? 'final' : 'case'}-${room}`;
  // Correct choices occupy different positions; every choice has a stable, authored ID.
  const make = (items: string[], prefix: string) => items.map((text, i) => ({ id: `${id}-${prefix}${i}`, text }));
  const conclusionNotes = final ? [
    'An: Biên mục chỉ cho biết thứ tự thời gian. Muốn kết luận về ý nghĩa hoặc nguyên nhân còn cần xuất xứ và bối cảnh của từng sự kiện.',
    'Vy: Một ảnh chân dung hoặc tên nghề không cung cấp đủ những phương diện mà hồ sơ khái niệm đang xét.',
    'Minh: Hai tuyến có điều kiện xuất phát khác nhau. Không thể bỏ trường điều kiện rồi áp một tuyến cho mọi hồ sơ.',
    'Khôi: Báo cáo đã mất phần bảo đảm và thực hiện quyền. Một lời tuyên bố không tự khôi phục được các cơ chế này.',
  ] : [
    'An: Hãy phân biệt ba nhóm tiền đề và đọc lại ý “kế thừa có phê phán”. Đó không phải sao chép nguyên vẹn; xếp đúng năm cũng chưa sửa được nhãn sai.',
    'Vy: Tự động hóa và trí thức hóa là những biến đổi cần xem xét. Chúng không cho phép bỏ qua hai phương diện của khái niệm hoặc nhận diện từ ngoại hình.',
    'Minh: Hãy kiểm tra đối tượng của cụm từ “bỏ qua”. Máy đã mở rộng từ chế độ sang mọi thành tựu; cần đối chiếu tài liệu phạm vi.',
    'Khôi: Quyền cần gắn với cơ chế thực hiện. Cũng không thể suy từ có đại diện sang phủ nhận mọi hình thức tham gia trực tiếp.',
  ];
  return { id, chapterId: room, title, report, conclusions: make(conclusions, 'c'), correctConclusion: `${id}-c${room % 3}`, repairs: make(repairs, 'r'), correctRepair: `${id}-r${(room + 1) % 3}`, evidenceSets: sets.map(s => s.map(i => eid(room, i))), rebuttals: { conclusion: conclusionNotes[room - 1], evidence: 'Chứng cứ đang gắn chưa đủ hỗ trợ kết luận, hoặc có thẻ không liên quan. Đối chiếu nguồn khái niệm với bản ghi cụ thể; tháo thẻ thừa rồi thử lại.', repair: 'Cách phục dựng chưa sửa đúng nguyên nhân đã xác định. Hãy giữ lại nội dung có căn cứ và sửa phần bị gán sai.' }, success };
}
function ordered(room: RoomId, correct: string, wrong1: string, wrong2: string, repair = false): string[] {
  const position = repair ? (room + 1) % 3 : room % 3;
  const rest = [wrong1, wrong2];
  return Array.from({ length: 3 }, (_, i) => i === position ? correct : rest.shift()!);
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
    question: 'Hồ sơ đã nhầm lẫn xuất xứ nào?', intro: 'An: Sách vẫn còn nguyên, nhưng nhãn đã đi lạc. Chúng ta có thể bắt đầu ở bàn bản thảo hoặc kiểm tra máy chiếu; mỗi hướng sẽ cho một nửa bức tranh.',
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
      probe(1, 1, 'an', 'Đưa bản thảo về đúng ngăn', 'Đối chiếu bản thảo rồi chọn ngăn phù hợp. Mỗi ngăn là một góc nhìn khác nhau về sự ra đời của lý luận.', 'archive', [1], ['Điều kiện kinh tế – xã hội', 'Tiền đề khoa học tự nhiên', 'Tiền đề tư tưởng – lý luận'], [['Đại công nghiệp và phong trào công nhân', 0], ['Học thuyết tiến hóa', 1], ['Triết học cổ điển Đức', 2]], ['Hãy tìm đối tượng mà mỗi bản thảo đang nói đến.', 'Phong trào lao động là bối cảnh xã hội; tiến hóa thuộc khoa học tự nhiên; triết học là tiền đề lý luận.'], 'Các ngăn bản thảo đã sáng đúng màu. Bối cảnh lịch sử và những thành tựu nhận thức được phân biệt.'),
      probe(1, 2, 'vy', 'Sửa nhãn hồ sơ', 'Dùng hồ sơ xuất xứ để trả lại đúng vai trò cho từng nhãn.', 'archive', [3], ['Nền tảng lý luận', 'Vận dụng, phát triển trong điều kiện mới', 'Tác phẩm năm 1848'], [['C. Mác và Ph. Ăngghen', 0], ['V.I. Lênin', 1], ['Tuyên ngôn của Đảng Cộng sản', 2]], ['Phân biệt người đặt nền tảng, người phát triển và tác phẩm.', 'Tuyên ngôn là tác phẩm; Mác–Ăngghen gắn với nền tảng, Lênin gắn với vận dụng và phát triển.'], 'Chân dung và tác phẩm đã được trả về đúng hồ sơ. Trào lưu tiền thân có giá trị và giới hạn riêng, không đồng nhất với tác phẩm.'),
      probe(1, 3, 'minh', 'Khôi phục đồng hồ', 'Tìm năm trong thẻ Các mốc lịch sử, rồi đặt sự kiện vào ô năm. Các ô biểu diễn thời gian, không phải một chuỗi nguyên nhân.', 'timeline', [2, 4], ['1848', '1871', '1917', '1986'], [['Tuyên ngôn của Đảng Cộng sản', 0], ['Công xã Paris', 1], ['Cách mạng Tháng Mười Nga', 2], ['Đổi mới ở Việt Nam', 3]], ['Mở thẻ Các mốc lịch sử trong Sổ chung; dấu ngày tháng nằm ở đó.', 'Tuyên ngôn 1848; Công xã Paris 1871; Tháng Mười Nga 1917; Đổi mới 1986.'], 'Đồng hồ hoạt động. Thứ tự thời gian đã rõ, nhưng tự nó không chứng minh quan hệ nhân quả.'),
    ],
    council: council(1, 'Trả lại xuất xứ', 'Bản giới thiệu lỗi: “Lý luận hình thành bằng cách sao chép nguyên vẹn tư tưởng trước đó; các tiền đề đều là phát minh tự nhiên.”', ordered(1, 'Hồ sơ đánh đồng các nhóm tiền đề và hiểu sai sự kế thừa có phê phán.', 'Mọi tiền đề đều thuộc khoa học tự nhiên.', 'Chỉ cần xếp đúng năm là mọi kết luận đều đúng.'), ordered(1, 'Tách các nhóm tiền đề, phục hồi xuất xứ và nội dung kế thừa có phê phán.', 'Giữ nguyên bản giới thiệu, chỉ đổi tên tệp.', 'Xóa toàn bộ tư tưởng tiền thân.', true), [[1, 2, 3], [1, 3, 6]], 'Hồ sơ xuất xứ được xác nhận. Máy chiếu hiện lại một bản giới thiệu có căn cứ.'),
    finalCase: council(1, 'Đoạn 1 · Một mốc, nhiều ý nghĩa', 'Báo cáo lõi suy ra rằng các sự kiện liên tiếp trên đồng hồ có cùng ý nghĩa và tự động tạo thành một chuỗi nhân quả.', ordered(1, 'Trình tự thời gian không tự chứng minh quan hệ nhân quả hoặc cùng ý nghĩa.', 'Mốc xuất hiện sau luôn quan trọng hơn.', 'Các sự kiện cùng chương có cùng ý nghĩa.'), ordered(1, 'Giữ mốc thời gian và bổ sung xuất xứ, loại sự kiện, bối cảnh.', 'Sắp lại màu của các mốc.', 'Xóa các mốc trước thế kỷ XX.', true), [[3, 4], [4, 5]], 'Đã tách trật tự thời gian khỏi suy diễn về ý nghĩa.', true),
    reward: 'Kệ sách mở. Máy chiếu lộ ra dòng cảnh báo: “Không tìm thấy ngữ cảnh”.',
  },
  {
    id: 2, name: 'Nhà máy Sứ mệnh', shortName: 'Sứ mệnh', subtitle: 'Bản nhận diện thiếu một nửa', color: '#8EBBD9', background: '/art/room-2.webp',
    incident: 'Dây chuyền nhận diện chỉ đọc một cột dữ liệu. Những thay đổi về công nghệ khiến nó gạt bỏ nhiều hồ sơ trước khi kiểm tra bối cảnh.', question: 'Hệ thống đang bỏ sót phương diện nào?', intro: 'Vy: Một nhãn nghề nghiệp chưa kể hết câu chuyện. Tôi sẽ xem hồ sơ bối cảnh; Minh có thể kiểm tra cách máy đọc chúng.',
    hotspotNames: ['Hồ sơ lao động', 'Bộ đọc nhận diện', 'Sơ đồ ba hệ thống', 'Bảng điều kiện', 'Kho đối chiếu', 'Trạm bàn giao'], lore: lores[1],
    evidence: ev(2, ['Hai phương diện nhận diện', 'Nhật ký một cột dữ liệu', 'Ba nội dung sứ mệnh', 'Hai lớp điều kiện', 'Hồ sơ lao động hiện đại', 'Bản kiểm tra biến đổi', 'Thư 02 · Ô bối cảnh'], 'Nhật ký hư cấu: bộ đọc chỉ lưu phương thức lao động; bỏ qua vị trí sở hữu, việc bán sức lao động và quan hệ lợi ích trong bối cảnh CNTB. Ngoại hình và máy móc bị dùng thay cho hồ sơ.', lores[1], [
      'An: Hai phương diện phải được xem xét theo đúng bối cảnh. Không thể nhận diện một người chỉ từ trang phục.', 'Minh: Tôi tìm thấy bộ lọc chỉ giữ một cột. Lỗi nằm ở dữ liệu đầu vào, không phải màu nhãn.', 'Vy: Ba nội dung liên quan nhau nhưng có trọng tâm riêng. Hãy xem mỗi mô tả đang nói về hoạt động nào.', 'An: Có điều kiện khách quan và điều kiện chủ quan. Chúng không tự thay thế cho nhau.', 'Minh: Tự động hóa và trí thức hóa là biến đổi cần được xem xét, không phải lý do tự động xóa một nhóm hồ sơ.', 'Vy: Tên nghề đơn lẻ chưa cung cấp đủ căn cứ. Ta cần những phương diện mà tài liệu nêu.', 'Vy: Người kỹ sư cũ đã thêm ô bối cảnh bằng tay. Có lẽ bản phục hồi bỏ mất thay đổi này.',
    ]),
    investigations: [
      probe(2, 1, 'an', 'Bổ sung lớp nhận diện', 'Đặt mỗi mô tả vào đúng lớp hồ sơ. Cả hai lớp đều cần được giữ khi xem xét khái niệm trong bối cảnh được nêu.', 'layers', [1], ['Kinh tế – xã hội', 'Chính trị – xã hội trong CNTB'], [['Phương thức lao động và vị trí trong sản xuất công nghiệp', 0], ['Sở hữu, bán sức lao động và quan hệ lợi ích', 1]], ['Hãy hỏi mô tả đang nói đến hoạt động sản xuất hay quan hệ xã hội trong CNTB.', 'Lao động công nghiệp thuộc lớp kinh tế–xã hội; sở hữu và bán sức lao động thuộc phương diện chính trị–xã hội trong CNTB.'], 'Bản nhận diện đã có hai lớp dữ liệu; không dùng ngoại hình làm căn cứ.'),
      probe(2, 2, 'minh', 'Khởi động ba hệ thống', 'Nối mô tả với vùng chức năng có cùng trọng tâm, rồi chạy thử dây chuyền.', 'circuit', [2, 3], ['Kinh tế', 'Chính trị – xã hội', 'Văn hóa – tư tưởng'], [['Hoạt động trong sản xuất và phát triển lực lượng sản xuất', 0], ['Xây dựng, tổ chức và thực hiện quyền lực chính trị theo nội dung giáo trình', 1], ['Xây dựng giá trị, văn hóa và ý thức xã hội', 2]], ['Tìm trọng tâm sản xuất, tổ chức chính trị hoặc giá trị và ý thức.', 'Sản xuất → kinh tế; quyền lực và tổ chức → chính trị–xã hội; giá trị và ý thức → văn hóa–tư tưởng.'], 'Ba vùng dây chuyền khởi động, mỗi vùng giữ đúng nội dung thay vì gộp vào một nhãn.'),
      probe(2, 3, 'vy', 'Tìm điều kiện bị bỏ sót', 'Đối chiếu bảng điều kiện. Đặt dữ kiện theo nguồn hình thành điều kiện, không theo mức độ quan trọng.', 'layers', [4], ['Điều kiện khách quan', 'Điều kiện chủ quan'], [['Địa vị kinh tế – xã hội và đặc điểm của giai cấp công nhân', 0], ['Sự phát triển về số lượng và chất lượng của bản thân giai cấp công nhân', 1], ['Vai trò tổ chức, lãnh đạo theo giáo trình', 1]], ['Điều kiện từ địa vị và đặc điểm khác với sự phát triển, tổ chức của chủ thể.', 'Địa vị kinh tế–xã hội là khách quan; phát triển bản thân và tổ chức, lãnh đạo thuộc nhóm chủ quan.'], 'Hai lớp điều kiện được nối lại. Một lớp không tự bảo đảm thay cho lớp còn lại.'),
    ],
    council: council(2, 'Một hồ sơ đủ góc nhìn', 'Bản nhận diện lỗi: “Có tự động hóa và lao động trí óc thì không còn cần xem xét các phương diện của khái niệm giai cấp công nhân.”', ordered(2, 'Biến đổi công nghệ, trình độ cần được xem xét trong các phương diện của khái niệm, không tự phủ nhận khái niệm.', 'Mọi người dùng máy tính đều thuộc cùng một giai cấp.', 'Chỉ có lao động chân tay mới cần hồ sơ.'), ordered(2, 'Khôi phục hai lớp nhận diện và xét biến đổi theo bối cảnh, không theo ngoại hình.', 'Loại mọi hồ sơ có lao động trí óc.', 'Chỉ đổi hình đại diện cho bộ đọc.', true), [[1, 2, 4], [1, 2, 5], [1, 2, 6]], 'Hệ thống nhận diện đọc đủ dữ kiện và giữ lại bối cảnh của những biến đổi hiện nay.'),
    finalCase: council(2, 'Đoạn 2 · Nhãn không thay hồ sơ', 'Báo cáo lõi xếp mọi hồ sơ theo trang phục và tên nghề, bỏ qua phương thức lao động và các quan hệ xã hội liên quan.', ordered(2, 'Ngoại hình và tên nghề đơn lẻ không thay thế các phương diện của khái niệm.', 'Đổi trang phục sẽ đổi toàn bộ quan hệ xã hội.', 'Tên nghề luôn cung cấp đủ dữ kiện.'), ordered(2, 'Phục hồi dữ liệu về phương thức lao động và phương diện chính trị–xã hội trong bối cảnh được nêu.', 'Chỉ giữ ảnh chân dung.', 'Thêm nhiều màu cho nhãn nghề.', true), [[1, 2], [1, 6]], 'Đã phục hồi các lớp dữ liệu cần thiết cho bản nhận diện.', true),
    reward: 'Dây chuyền sáng lại. Nhật ký xác nhận: trường bối cảnh đã bị bỏ qua khi khôi phục.',
  },
  {
    id: 3, name: 'Phòng thí nghiệm Chuyển mình', shortName: 'Chuyển mình', subtitle: 'Lệnh “bỏ qua”', color: '#65D5C9', background: '/art/room-3.webp',
    incident: 'Máy trung tâm báo: “Đã loại bỏ toàn bộ dữ liệu thành tựu để thực hiện lệnh bỏ qua.” Mô hình thành phố đang tắt từng lớp.', question: 'Khái niệm đã bị áp dụng sai phạm vi ở đâu?', intro: 'Minh: Đừng xóa thêm dữ liệu. Nhật ký cho biết máy đã làm gì; còn tài liệu và bối cảnh mới giúp chúng ta biết phải sửa gì.',
    hotspotNames: ['Bản thiết kế', 'Nhật ký lệnh', 'Hai tuyến chuyển tiếp', 'Bảng bốn lĩnh vực', 'Kho thành tựu', 'Phiếu bàn giao'], lore: lores[2],
    evidence: ev(3, ['Chú giải bản thiết kế', 'Nhật ký xóa toàn bộ', 'Điều kiện xuất phát', 'Bốn lớp chuyển đổi', 'Phạm vi của “bỏ qua”', 'Chú thích bị tách rời', 'Thư 03 · Bản vá đêm cuối'], 'Nhật ký hư cấu: bộ phục dựng nhận lệnh “bỏ qua chế độ” nhưng mở rộng đối tượng thành “mọi thành tựu”. Nó đánh dấu cả dữ liệu khoa học–công nghệ để xóa. Phần chú thích đi kèm không được nạp.', lores[2], [
      'An: Bản thiết kế mô tả nhiều đặc trưng; không thể thu cả mô hình về một chỉ số.', 'Minh: Lệnh đã được áp dụng rộng hơn cụm từ trong hồ sơ. Nhưng nhật ký chưa đủ để giải thích đúng khái niệm.', 'Vy: Hai hồ sơ có điều kiện xuất phát khác nhau. Tên tuyến chỉ có nghĩa khi giữ được bối cảnh ấy.', 'An: Kinh tế, chính trị, tư tưởng–văn hóa và xã hội là những góc nhìn phân tích; các biến đổi thực tế có thể liên hệ nhau.', 'Minh: Tài liệu phân biệt chế độ với những thành tựu có thể tiếp thu, kế thừa. Ta đã có căn cứ để thử bản sửa.', 'Vy: Chú thích không biến mất, nó bị lưu ở một ngăn khác. Ghép lại giúp làm rõ đối tượng của “bỏ qua”.', 'Vy: Lá thư đề nghị đừng xóa kho dữ liệu. Lỗi sao chép đã làm mất các liên kết, không làm mất mọi nội dung.',
    ]),
    investigations: [
      probe(3, 1, 'an', 'Phục hồi chú giải mô hình', 'Đặt các mô tả vào đúng lớp chú giải. Đây là mô hình minh họa khái niệm, không dự đoán kết quả phát triển xã hội.', 'layers', [1], ['Con người', 'Kinh tế', 'Quyền làm chủ'], [['Giải phóng con người, tạo điều kiện phát triển con người', 0], ['Nền kinh tế phát triển dựa trên lực lượng sản xuất hiện đại', 1], ['Nhân dân lao động làm chủ', 2]], ['Chú ý mô tả nói về con người, cơ sở kinh tế hay chủ thể làm chủ.', 'Phát triển con người → con người; lực lượng sản xuất → kinh tế; nhân dân làm chủ → quyền làm chủ.'], 'Các lớp chú giải đã hiện lại. Không đồng nhất nhiều đặc trưng với một chỉ số đơn lẻ.'),
      probe(3, 2, 'vy', 'Đặt hồ sơ vào tuyến chuyển tiếp', 'Tìm điều kiện xuất phát trong hồ sơ rồi chọn tuyến theo cách phân chia của giáo trình.', 'flow', [3], ['Quá độ trực tiếp', 'Quá độ gián tiếp'], [['Từ chủ nghĩa tư bản đã phát triển lên CNXH', 0], ['Từ xã hội chưa trải qua CNTB phát triển đầy đủ lên CNXH', 1]], ['Trực tiếp và gián tiếp gắn với điều kiện xuất phát, không phải nhanh và chậm.', 'CNTB đã phát triển → trực tiếp; chưa qua CNTB phát triển đầy đủ → gián tiếp.'], 'Hai hồ sơ đã về đúng tuyến. Tên tuyến không tự quy định tốc độ hay một khuôn mẫu cho mọi trường hợp.'),
      probe(3, 3, 'minh', 'Khởi động bốn lớp dữ liệu', 'Nối dữ kiện với lĩnh vực đang được mô tả; một biến đổi thực tế có thể liên quan nhiều lĩnh vực.', 'circuit', [2, 4], ['Kinh tế', 'Chính trị', 'Tư tưởng – văn hóa', 'Xã hội'], [['Nhiều thành phần kinh tế', 0], ['Tổ chức và thiết chế quyền lực', 1], ['Hệ tư tưởng và giá trị', 2], ['Giai cấp, tầng lớp và quan hệ giữa họ', 3]], ['Hãy tìm trọng tâm của mô tả, không coi bốn lĩnh vực là các ngăn tách rời tuyệt đối.', 'Thành phần → kinh tế; thiết chế → chính trị; giá trị → tư tưởng–văn hóa; giai cấp, tầng lớp → xã hội.'], 'Mô hình chạy thử bốn lớp dữ liệu. Chưa thể xác nhận lệnh “bỏ qua” trước khi đối chiếu tài liệu phạm vi.'),
    ],
    council: council(3, 'Sửa phạm vi lệnh “bỏ qua”', 'Máy đã đánh dấu xóa mọi thành tựu từng hình thành trong CNTB. Hội đồng cần xác định lệnh sai ở đâu và cách phục dựng có căn cứ.', ordered(3, 'Máy đánh đồng bỏ qua chế độ với phủ nhận mọi thành tựu; tài liệu phân biệt hai nội dung này.', 'Bỏ qua nghĩa là xóa mọi thành tựu khoa học–công nghệ.', 'Bỏ qua nghĩa là không có hình thức trung gian.'), ordered(3, 'Giới hạn đúng đối tượng của “bỏ qua”, phục hồi dữ liệu thành tựu phù hợp để xem xét tiếp thu, kế thừa.', 'Xóa luôn các bản chú thích.', 'Áp dụng một lệnh xóa cho mọi lớp dữ liệu.', true), [[2, 4], [2, 5], [2, 6]], 'Bản sửa giữ đúng phạm vi khái niệm. Mô hình phục hồi các dữ liệu bị loại nhầm, không mô phỏng kết quả chính sách.'),
    finalCase: council(3, 'Đoạn 3 · Hai tuyến, một khuôn mẫu?', 'Báo cáo lõi xóa điều kiện xuất phát của hai hồ sơ và khẳng định mọi trường hợp phải theo cùng một tuyến chuyển tiếp.', ordered(3, 'Phải phân biệt tuyến chuyển tiếp theo điều kiện xuất phát; không gộp mọi trường hợp vào một khuôn mẫu.', 'Trực tiếp luôn có nghĩa là nhanh hơn.', 'Chỉ cần một tuyến cho mọi hồ sơ.'), ordered(3, 'Trả lại điều kiện xuất phát và chú giải cho từng hồ sơ.', 'Đổi tên cả hai thành cùng một tuyến.', 'Xóa lịch sử của hai hồ sơ.', true), [[1, 3], [3, 4]], 'Đã trả lại bối cảnh cho hai tuyến chuyển tiếp.', true),
    reward: 'Mô hình thành phố sáng lại. Các liên kết bị cắt đã trở về đúng chỗ.',
  },
  {
    id: 4, name: 'Hội trường Quyền làm chủ', shortName: 'Quyền làm chủ', subtitle: 'Quyết định bị đứt đoạn', color: '#B6A1E0', background: '/art/room-4.webp',
    incident: 'Kho biên bản chỉ giữ kết quả quyết định. Chủ thể tham gia và cơ chế bảo đảm thực hiện đã bị tách khỏi sơ đồ.', question: 'Ai thực hiện quyền, qua hình thức và cơ chế nào?', intro: 'Khôi: Một kết quả chưa kể hết cách quyết định được hình thành và thực hiện. Hãy nối lại các mắt xích trước khi xác nhận hồ sơ.',
    hotspotNames: ['Tường chú giải', 'Máy lưu biên bản', 'Ghế đại diện', 'Bảng chức năng', 'Kho quy trình', 'Hồ sơ hội trường'], lore: lores[3],
    evidence: ev(4, ['Ba phương diện dân chủ', 'Biên bản thiếu mắt xích', 'Chủ thể thực hiện quyền', 'Tiêu chí chức năng Nhà nước', 'Cơ chế bảo đảm thực hiện', 'Hai hình thức cùng tồn tại', 'Thư 04 · Người đọc đến sau'], 'Nhật ký hư cấu: hệ thống giữ “kết quả” nhưng tách các trường “chủ thể”, “hình thức tham gia” và “cơ chế thực hiện”. Ví dụ hội trường trong game là tình huống minh họa, không phải quy trình pháp lý ngoài thực tế.', lores[3], [
      'An: Ba phương diện là ba góc nhìn của khái niệm, không phải ba kiểu bỏ phiếu.', 'Minh: Kết quả được giữ, nhưng đường đi của quyết định đã mất. Cần phục hồi các trường dữ liệu.', 'Vy: Hãy xem ai đang trực tiếp thực hiện hành vi quyết định: người dân hay người đại diện.', 'An: Các nhóm chức năng dùng những tiêu chí khác nhau; cùng một hoạt động có thể được nhìn từ nhiều góc.', 'Minh: Tuyên bố quyền cần gắn với cơ chế bảo đảm và thực hiện, không chỉ một dòng trên màn hình.', 'Vy: Thiết chế đại diện không tự phủ nhận hình thức tham gia trực tiếp. Hai hình thức có thể cùng tồn tại.', 'Vy: Đây là lời nhắn cuối của nhóm cũ. Họ muốn giữ cả cách đặt câu hỏi và kiểm chứng tài liệu.',
    ]),
    investigations: [
      probe(4, 1, 'an', 'Nối ba lớp chú giải', 'Gắn mỗi mô tả với phương diện mà nó đang xem xét.', 'layers', [1], ['Quyền lực', 'Chế độ xã hội / chính trị', 'Nguyên tắc tổ chức, quản lý'], [['Quyền lực thuộc về nhân dân', 0], ['Hình thức tổ chức thực thi quyền lực trong xã hội', 1], ['Vận dụng dân chủ trong tổ chức và quản lý', 2]], ['Ba phương diện là các góc nhìn của cùng một khái niệm.', 'Ai nắm quyền → quyền lực; hình thức tổ chức xã hội → chế độ; cách tổ chức quản lý → nguyên tắc.'], 'Ba lớp chú giải được nối lại, không thu khái niệm vào một thao tác bỏ phiếu.'),
      probe(4, 2, 'vy', 'Theo dấu người tham gia', 'Hai tình huống do nhóm xây dựng. Xét chủ thể trực tiếp thực hiện quyền trong phạm vi, thẩm quyền và quy trình được cho phép.', 'flow', [3], ['Trực tiếp', 'Gián tiếp / đại diện'], [['Người dân trực tiếp biểu quyết trong quy trình hợp lệ', 0], ['Đại biểu được bầu thực hiện chức năng trong cơ quan đại diện', 1]], ['Có bầu chọn không có nghĩa mọi hành vi sau đó đều trực tiếp.', 'Người dân tự thực hiện quyền → trực tiếp; đại biểu thực hiện chức năng đại diện → gián tiếp.'], 'Chủ thể và hình thức thực hiện đã rõ. Hai hình thức không loại trừ nhau.'),
      probe(4, 3, 'minh', 'Phục hồi bảng chức năng', 'Chọn tiêu chí đang được dùng. Các tiêu chí có thể cùng mô tả một hoạt động từ những góc khác nhau.', 'circuit', [2, 4], ['Phạm vi tác động', 'Lĩnh vực', 'Tính chất quyền lực'], [['Đối nội và đối ngoại', 0], ['Chính trị, kinh tế, văn hóa, xã hội', 1], ['Tổ chức xây dựng và trấn áp theo giáo trình', 2]], ['Đừng đặt mọi nhóm vào cùng một cấp phân loại.', 'Trong/ngoài nước → phạm vi; chính trị/kinh tế → lĩnh vực; xây dựng/trấn áp → tính chất quyền lực.'], 'Bảng chức năng hiện theo ba góc nhìn, không thành các ngăn loại trừ nhau.'),
    ],
    council: council(4, 'Nối quyền với cơ chế thực hiện', 'Biên bản lỗi khẳng định: “Chỉ cần tuyên bố quyền làm chủ là đủ; có đại diện thì không còn hình thức tham gia trực tiếp.”', ordered(4, 'Quyền làm chủ cần cơ chế thể chế hóa, bảo đảm và thực hiện; hình thức trực tiếp và gián tiếp không tự loại trừ nhau.', 'Chỉ một lời tuyên bố là đủ để bảo đảm quyền.', 'Có đại diện thì phải bỏ mọi hình thức trực tiếp.'), ordered(4, 'Khôi phục chủ thể, hình thức tham gia và cơ chế bảo đảm thực hiện quyền.', 'Giữ kết quả và xóa mọi thông tin về chủ thể.', 'Chỉ bổ sung một khẩu hiệu vào biên bản.', true), [[1, 3, 4], [1, 3, 5], [3, 5, 6]], 'Biên bản đã có chủ thể, hình thức và cơ chế thực hiện. Hội trường sáng lại.'),
    finalCase: council(4, 'Đoạn 4 · Quyền cần được thực hiện', 'Báo cáo lõi chỉ giữ tuyên bố về quyền và xóa toàn bộ phần thể chế hóa, bảo đảm, tổ chức thực hiện.', ordered(4, 'Tuyên bố về quyền cần gắn với cơ chế bảo đảm và thực hiện trong thực tế.', 'Cơ chế thực hiện không liên quan quyền.', 'Giữ mỗi kết quả là đủ.'), ordered(4, 'Phục hồi mối liên hệ giữa nền tảng dân chủ và vai trò bảo đảm, thực hiện quyền của Nhà nước.', 'Chỉ đổi tên báo cáo.', 'Xóa các trường liên quan đến thực hiện.', true), [[1, 4], [1, 5], [3, 5]], 'Đã nối lại quyền với cơ chế bảo đảm và thực hiện.', true),
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
    { id: `${e.id}-found`, chapterId: c.id, speaker: e.role, emotion: e.index === 1 ? 'surprise' as const : 'thinking' as const, text: e.discovery, choices: [{ id: 'clarify', label: 'Hỏi rõ ý nghĩa', next: `${e.id}-detail`, flag: `${e.id}-clarified` }, { id: 'compare', label: 'Đối chiếu với chứng cứ trước', next: `${e.id}-detail`, requires: [eid(c.id, e.index === 0 ? 2 : 1)], flag: `${e.id}-compared` }] },
    { id: `${e.id}-detail`, chapterId: c.id, speaker: (e.role === 'an' ? 'khoi' : 'an') as RoleId, emotion: 'doubt' as const, text: e.detail, choices: [] },
  ]),
  { id: `c${c.id}-debate`, chapterId: c.id, speaker: 'khoi' as const, emotion: 'thinking' as const, text: 'Hãy phân biệt kết luận, chứng cứ và cách sửa. Nhật ký cho biết hệ thống làm gì; tài liệu nguồn giúp ta kiểm tra cách hiểu.', choices: [{ id: 'challenge', label: 'Phản biện bằng chứng cứ', next: `c${c.id}-recap`, requires: [eid(c.id, 1), eid(c.id, 2)], flag: `c${c.id}-challenged` }, { id: 'test', label: 'Đề xuất kiểm tra bản phục dựng', next: `c${c.id}-recap`, requires: [`c${c.id}-i3`], flag: `c${c.id}-tested` }] },
  { id: `c${c.id}-recap`, chapterId: c.id, speaker: 'minh' as const, emotion: 'agree' as const, text: 'Ta có thể sửa và kiểm tra lại mà không mất chứng cứ. Nếu còn mâu thuẫn, quay lại hồ sơ sẽ hữu ích hơn đoán một kết luận mới.', choices: [] },
]);
export const dialogue = (id: string) => dialogues.find(d => d.id === id);
