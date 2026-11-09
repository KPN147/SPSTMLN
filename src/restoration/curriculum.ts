import { chapters } from '../council/content';
import type { RoleId } from '../council/types';
import type { RoomId } from '../game/types';
import type { Choice, CouncilInteraction, LearningStep, RestorationRoom } from './model';

const choice = (id: string, text: string, feedback: string): Choice => ({ id, text, feedback });
const rotate = <T,>(values: T[], offset: number): T[] => [...values.slice(offset % values.length), ...values.slice(0, offset % values.length)];
const evidence = (roomId: RoomId, ...indices: number[]) => indices.map(i => `c${roomId}-e${i}`);
function base(roomId: RoomId, number: number, title: string, role: RoleId, concept: string, scenario: string, question: string, finding: string, hints: [string, string]): Omit<LearningStep, 'interaction'> {
  const id = `r${roomId}-p${number}`;
  return { id, objectiveId: id, sourceId: id, roomId, title, role, concept, scenario, question,
    requiresEvidence: evidence(roomId, ...(number === 1 ? [1] : number === 2 ? [3] : number === 3 ? [2, 4] : [2])),
    usesFindings: Array.from({ length: number - 1 }, (_, i) => ({ id: `f${roomId}-${i + 1}`, relation: 'context' as const })),
    finding: { id: `f${roomId}-${number}`, text: finding }, hints, success: finding };
}
function match(labels: [string, number, string][], targets: string[], timeline = false): LearningStep['interaction'] {
  return { kind: timeline ? 'timeline' : 'matching', items: labels.map(([label, target, feedback], i) => ({ id: `i${i}`, label, target: `t${target}`, feedback })), targets: targets.map((label, i) => ({ id: `t${i}`, label })) };
}
function councilInteraction(roomId: RoomId, decision: [string, string], wrong: [[string, string], [string, string]], proof: string, alternate: string, badProof: string, reason: [string, string], wrongReasons: [[string, string], [string, string]], extraEvidence = 5): CouncilInteraction {
  // The proof-to-reason relation is authored explicitly; document counts do not establish correctness.
  return {
    kind: 'council',
    decisions: rotate([choice('b', ...wrong[0]), choice('a', ...decision), choice('c', ...wrong[1])], roomId), correctDecision: 'a',
    proofOptions: rotate([
      { id: 'direct', text: proof, evidenceIds: evidence(roomId, 2), findingIds: [], reasonIds: ['a'] },
      { id: 'unrelated', text: badProof, evidenceIds: evidence(roomId, 1), findingIds: [], reasonIds: [] },
      { id: 'compare', text: alternate, evidenceIds: evidence(roomId, 2, extraEvidence), findingIds: [], reasonIds: ['a'] },
    ], roomId),
    reasons: rotate([choice('c', ...wrongReasons[1]), choice('b', ...wrongReasons[0]), choice('a', ...reason)], roomId + 1),
  };
}

const r1: RestorationRoom['steps'] = [
  { ...base(1, 1, 'Trả bản thảo về đúng ngăn', 'an',
    'Điều kiện kinh tế – xã hội nói về sản xuất và các giai cấp. Khoa học tự nhiên nghiên cứu tự nhiên. Tiền đề tư tưởng – lý luận là những học thuyết được tiếp thu có phê phán.',
    'Máy xếp cả ba bản thảo vào ngăn phát minh. Hãy sửa từng nhãn.', 'Mỗi bản thảo thuộc nhóm nào?',
    'Ba nhóm tiền đề đã tách rõ: bối cảnh xã hội, khoa học tự nhiên và tư tưởng – lý luận.',
    ['Xem đối tượng chính của từng thẻ.', 'Phong trào thuộc đời sống xã hội; tiến hóa thuộc tự nhiên; triết học thuộc lý luận.']),
    interaction: match([
      ['Đại công nghiệp và phong trào công nhân', 0, 'Thẻ nói về sản xuất và phong trào xã hội, thuộc điều kiện kinh tế – xã hội.'],
      ['Học thuyết tiến hóa', 1, 'Tiến hóa nghiên cứu giới tự nhiên, không mô tả một phong trào xã hội.'],
      ['Triết học cổ điển Đức', 2, 'Đây là một tiền đề tư tưởng – lý luận được xem xét tiếp thu.'],
    ], ['Kinh tế – xã hội', 'Khoa học tự nhiên', 'Tư tưởng – lý luận']) },
  { ...base(1, 2, 'Trả lại tên và đóng góp', 'vy',
    'Mác và Ăngghen đặt nền tảng chủ nghĩa xã hội khoa học; Lênin vận dụng, phát triển trong điều kiện mới. Tư tưởng không tưởng có giá trị và giới hạn. Tác phẩm khác với tác giả.',
    'Đã sửa các nhóm tiền đề, nhưng tủ chân dung vẫn lẫn người, trào lưu và tác phẩm.', 'Hãy sửa nhãn đóng góp của từng hồ sơ.',
    'Tác giả, trào lưu tiền thân và tác phẩm đã có nhãn riêng; đóng góp được đặt đúng bối cảnh.',
    ['Phân biệt người, trào lưu và tên sách trước.', 'Mác–Ăngghen đặt nền tảng; Lênin phát triển; tư tưởng không tưởng là tiền thân; Tuyên ngôn là tác phẩm.']),
    interaction: match([
      ['C. Mác và Ph. Ăngghen', 0, 'Mác và Ăngghen đặt nền tảng chủ nghĩa xã hội khoa học.'],
      ['V.I. Lênin', 1, 'Lênin vận dụng, phát triển lý luận trong điều kiện mới.'],
      ['Xanh Xi-mông, Phuriê, Ôoen', 2, 'Các nhà tư tưởng không tưởng có giá trị đóng góp và giới hạn lịch sử.'],
      ['Tuyên ngôn của Đảng Cộng sản', 3, 'Đây là tác phẩm, không phải tên của tác giả hay trào lưu.'],
    ], ['Đặt nền tảng', 'Vận dụng, phát triển', 'Trào lưu tiền thân', 'Tác phẩm']) },
  { ...base(1, 3, 'Khôi phục trình tự biên mục', 'minh',
    'Ngày tháng cho biết sự kiện nào diễn ra trước hoặc sau. Tuyên ngôn năm 1848, Công xã Paris năm 1871, Cách mạng Tháng Mười năm 1917, Đổi mới năm 1986. Trình tự không tự chứng minh nguyên nhân.',
    'Tên đã đúng. Máy lại xếp sự kiện theo thứ tự nhập, khiến bản giới thiệu sai mốc.', 'Trả mỗi sự kiện về đúng năm.',
    '1848 → 1871 → 1917 → 1986: các mốc đã về đúng trình tự, chưa phải một chuỗi nguyên nhân.',
    ['Đối chiếu tên sự kiện với biên mục, không đoán từ vị trí thẻ.', 'Tuyên ngôn 1848; Công xã Paris 1871; Tháng Mười 1917; Đổi mới 1986.']),
    interaction: match([
      ['Tuyên ngôn của Đảng Cộng sản', 0, 'Tuyên ngôn được công bố năm 1848.'], ['Công xã Paris', 1, 'Công xã Paris gắn với năm 1871.'],
      ['Cách mạng Tháng Mười Nga', 2, 'Sự kiện này gắn với năm 1917.'], ['Đổi mới ở Việt Nam', 3, 'Mốc Đổi mới ở Việt Nam là năm 1986.'],
    ], ['1848', '1871', '1917', '1986'], true) },
  { ...base(1, 4, 'Chốt bản giới thiệu', 'khoi',
    'Kế thừa có phê phán là tiếp nhận giá trị và xem xét giới hạn của tư tưởng trước đó. Các điều kiện, tiền đề cùng tạo bối cảnh hình thành lý luận; chúng không đồng nhất với nhau.',
    'Ba trường đã đúng. Bản giới thiệu vẫn ghi: “Lý luận mới sao chép toàn bộ tư tưởng tiền thân.”', 'Hội đồng nên duyệt cách sửa nào?',
    'Bản giới thiệu giữ đúng tiền đề, đóng góp, mốc thời gian và ý kế thừa có phê phán.',
    ['Đối chiếu từ “toàn bộ” với ý kế thừa có phê phán.', 'Tiếp nhận giá trị không đồng nghĩa giữ mọi quan điểm và giới hạn của tư tưởng cũ.']),
    interaction: councilInteraction(1,
      ['Ghi rõ tiếp nhận giá trị và xem xét giới hạn của tư tưởng tiền thân.', 'Bản sửa thể hiện kế thừa có phê phán.'],
      [['Giữ nguyên vì tiếp thu luôn nghĩa là đồng ý mọi quan điểm cũ.', 'Tiếp thu có phê phán vẫn phải xem xét giới hạn của tư tưởng trước đó.'], ['Bỏ mọi đóng góp của tư tưởng tiền thân vì lý luận mới khác trước.', 'Khác biệt không có nghĩa phủ nhận toàn bộ giá trị được kế thừa.']],
      'Nhật ký ghi mất chú thích; tài liệu tại đây nêu kế thừa có phê phán.',
      'Nhật ký và ghi chú kế thừa cùng chỉ ra giá trị và giới hạn cần giữ rõ.',
      'Ba nhóm tiền đề có tên gọi khác nhau.',
      ['Kế thừa đòi hỏi xem xét giá trị lẫn giới hạn, không sao chép nguyên vẹn.', 'Chi tiết “toàn bộ” trái với yêu cầu xem xét có phê phán.'],
      [['Sự kiện diễn ra sau phải đúng hơn mọi tư tưởng trước đó.', 'Năm xuất hiện không tự chứng minh mọi nhận định là đúng.'], ['Mọi tiền đề đều là phát minh tự nhiên nên có thể ghép chung.', 'Điều kiện xã hội, khoa học và lý luận là các nhóm khác nhau.']], 6) },
];

const r2: RestorationRoom['steps'] = [
  { ...base(2, 1, 'Tìm cột nhận diện còn thiếu', 'vy',
    'Xem xét giai cấp công nhân cần phương thức lao động, vị trí trong sản xuất và quan hệ chính trị – xã hội trong chủ nghĩa tư bản: sở hữu, bán sức lao động, quan hệ lợi ích.',
    'Hồ sơ ghi người vận hành dây chuyền công nghiệp. Cột sở hữu và quan hệ lao động đang trống.', 'Cần bổ sung dữ liệu nào trước khi nhận diện?',
    'Nhận diện cần cả phương thức lao động và quan hệ sở hữu, lao động, lợi ích trong bối cảnh cụ thể.',
    ['Hồ sơ đã cho biết cách lao động; xem phương diện nào còn trống.', 'Công cụ và trình độ chưa thay thế dữ liệu về sở hữu, bán sức lao động và lợi ích.']),
    interaction: { kind: 'decision', correct: 'a', options: [
      choice('b', 'Chỉ xác nhận công cụ sử dụng là máy công nghiệp.', 'Công cụ mới cho biết một phần phương thức lao động; cột quan hệ xã hội vẫn thiếu.'),
      choice('a', 'Bổ sung sở hữu, bán sức lao động và quan hệ lợi ích.', 'Đây là phương diện còn thiếu bên cạnh cách lao động trong hồ sơ.'),
      choice('c', 'Chỉ dùng trình độ học vấn để quyết định.', 'Trình độ học vấn không thay thế cả hai phương diện cần xem xét.'),
    ] } },
  { ...base(2, 2, 'Phân công ba hoạt động', 'minh',
    'Sứ mệnh lịch sử gồm kinh tế, chính trị – xã hội, văn hóa – tư tưởng. Xác định trọng tâm: phát triển sản xuất, tổ chức quyền lực hoặc xây dựng giá trị và ý thức.',
    'Hồ sơ đã đủ hai phương diện. Ba kế hoạch hoạt động lại bị dồn vào riêng khu sản xuất.', 'Chuyển mỗi kế hoạch về đúng khu vực.',
    'Ba nội dung sứ mệnh được phân biệt theo trọng tâm hoạt động, đồng thời có liên hệ với nhau.',
    ['Xem kết quả chính mỗi hoạt động hướng tới.', 'Năng suất gắn với kinh tế; quyền lực với chính trị – xã hội; giá trị với văn hóa – tư tưởng.']),
    interaction: match([
      ['Cải tiến dây chuyền, phát triển năng lực sản xuất', 0, 'Trọng tâm phát triển sản xuất thuộc nội dung kinh tế.'],
      ['Tham gia xây dựng và tổ chức quyền lực chính trị', 1, 'Tổ chức quyền lực thuộc nội dung chính trị – xã hội.'],
      ['Xây dựng giá trị và ý thức xã hội mới', 2, 'Giá trị, ý thức thuộc nội dung văn hóa – tư tưởng.'],
    ], ['Kinh tế', 'Chính trị – xã hội', 'Văn hóa – tư tưởng']) },
  { ...base(2, 3, 'Kiểm tra điều kiện thực hiện', 'an',
    'Điều kiện khách quan gắn với địa vị kinh tế, chính trị – xã hội. Chủ quan gồm phát triển số lượng, chất lượng giai cấp công nhân và vai trò tổ chức, lãnh đạo của Đảng Cộng sản.',
    'Địa vị xã hội đã được xác định. Kế hoạch chưa xét chất lượng đội ngũ và tổ chức lãnh đạo.', 'Kế hoạch đang bỏ sót lớp điều kiện nào?',
    'Địa vị khách quan không tự thay thế sự phát triển của chủ thể và vai trò tổ chức, lãnh đạo.',
    ['Phần thiếu nói về địa vị xã hội hay sự phát triển và tổ chức của chủ thể?', 'Số lượng, chất lượng đội ngũ và vai trò tổ chức, lãnh đạo thuộc điều kiện chủ quan.']),
    interaction: { kind: 'decision', correct: 'b', options: [
      choice('a', 'Chỉ cần xác định lại địa vị khách quan.', 'Địa vị đã được xác định; chất lượng và tổ chức của chủ thể vẫn chưa được xem xét.'),
      choice('b', 'Bổ sung điều kiện chủ quan về đội ngũ và tổ chức lãnh đạo.', 'Chi tiết thiếu thuộc sự phát triển của chủ thể và tổ chức, lãnh đạo.'),
      choice('c', 'Không thiếu vì địa vị khách quan đã bảo đảm mọi kết quả.', 'Điều kiện khách quan không tự thay cho các điều kiện chủ quan.'),
    ] } },
  { ...base(2, 4, 'Cập nhật hồ sơ lao động hiện đại', 'khoi',
    'Công nghệ hiện đại làm thay đổi kỹ năng, trình độ và cơ cấu lao động. Xu hướng trí thức hóa, trung lưu hóa ở một bộ phận không đồng nghĩa giai cấp công nhân hoàn toàn biến mất.',
    'Bộ đọc loại hồ sơ chỉ vì công việc chuyển từ thao tác tay sang điều khiển dây chuyền tự động.', 'Chọn cách cập nhật hồ sơ.',
    'Biến đổi công nghệ và trình độ được xem xét cùng các phương diện nhận diện, thay vì dùng để tự động loại hồ sơ.',
    ['Máy đang biến một thay đổi công nghệ thành kết luận về cả khái niệm.', 'Đối chiếu thay đổi công việc với tài liệu về biến đổi hiện nay và hai phương diện đã phục hồi.']),
    interaction: councilInteraction(2,
      ['Đọc lại cả hai phương diện, ghi nhận thay đổi công nghệ và trình độ.', 'Bản cập nhật giữ tiêu chí nhận diện và ghi nhận biến đổi thực tế.'],
      [['Loại hồ sơ vì công nhân chỉ có thể lao động bằng cơ bắp.', 'Công nghệ hiện đại có thể đòi hỏi tri thức, kỹ năng cao hơn.'], ['Xếp mọi người dùng máy tính vào cùng một giai cấp.', 'Cùng dùng máy tính chưa cho biết phương thức sản xuất và các quan hệ xã hội.']],
      'Nhật ký loại hồ sơ vì tự động hóa; tài liệu nêu biến đổi lao động hiện nay.',
      'Nhật ký và hồ sơ hiện đại cùng cho thấy thay đổi kỹ năng, công nghệ.',
      'Kế hoạch sản xuất được xếp vào khu kinh tế.',
      ['Thay đổi kỹ năng và công nghệ không tự phủ nhận các phương diện nhận diện.', 'Cần đọc biến đổi cùng bối cảnh và tiêu chí, thay vì loại hồ sơ từ một dấu hiệu.'],
      [['Lao động trí óc luôn loại trừ lao động công nghiệp.', 'Lao động công nghiệp hiện đại có thể đòi hỏi tri thức và kỹ năng.'], ['Một công cụ giống nhau chứng minh quan hệ sở hữu giống nhau.', 'Công cụ chưa cho biết sở hữu, bán sức lao động và quan hệ lợi ích.']]) },
];

const r3: RestorationRoom['steps'] = [
  { ...base(3, 1, 'Sửa chú giải mô hình', 'an',
    'Một số đặc trưng chủ nghĩa xã hội: nhân dân lao động làm chủ; kinh tế có lực lượng sản xuất hiện đại, công hữu tư liệu sản xuất chủ yếu; văn hóa kế thừa giá trị.',
    'Máy ghi cả ba lớp mô hình là “sản lượng”. Cần trả lại những chú giải đã mất.', 'Mỗi mô tả cần đặt ở lớp nào?',
    'Mô hình có nhiều đặc trưng; sản lượng không thể thay cho quyền làm chủ, cơ sở kinh tế và văn hóa.',
    ['Xác định mô tả đang nói ai làm chủ, nền kinh tế dựa vào đâu hay giá trị văn hóa.', 'Quyền của nhân dân → làm chủ; lực lượng sản xuất và công hữu → kinh tế; kế thừa giá trị → văn hóa.']),
    interaction: match([
      ['Nhân dân lao động làm chủ', 0, 'Mô tả này nói về chủ thể làm chủ, không phải chỉ tiêu sản lượng.'],
      ['Lực lượng sản xuất hiện đại; công hữu tư liệu sản xuất chủ yếu', 1, 'Đây là cơ sở kinh tế được nêu trong giáo trình.'],
      ['Kế thừa giá trị dân tộc và tinh hoa nhân loại', 2, 'Mô tả nói về văn hóa, không đồng nhất với sản lượng.'],
    ], ['Quyền làm chủ', 'Kinh tế', 'Văn hóa']) },
  { ...base(3, 2, 'Chọn tuyến từ điểm xuất phát', 'vy',
    'Quá độ trực tiếp và gián tiếp được phân biệt theo điều kiện xuất phát: đã qua chủ nghĩa tư bản phát triển cao hoặc chưa qua trình độ ấy. Tên tuyến không chỉ tốc độ nhanh hay chậm.',
    'Mô hình đã rõ mục tiêu. Hồ sơ A đã qua chủ nghĩa tư bản phát triển cao; hồ sơ B chưa qua trình độ đó.', 'Chọn tuyến phù hợp cho cả hai hồ sơ.',
    'A đi tuyến trực tiếp, B đi tuyến gián tiếp theo điều kiện xuất phát; tên tuyến không dự đoán tốc độ.',
    ['Dữ kiện nào cho biết điều kiện xuất phát của A và B?', 'A đã qua chủ nghĩa tư bản phát triển cao; B chưa qua. Không dùng dự tính thời gian để đặt tên tuyến.']),
    interaction: { kind: 'decision', correct: 'c', options: [
      choice('a', 'A gián tiếp, B trực tiếp vì B cần thay đổi nhiều hơn.', 'Mức độ cần thay đổi không phải tiêu chí phân chia hai tuyến trong tình huống này.'),
      choice('b', 'A trực tiếp vì nhanh; B gián tiếp vì chậm.', 'Bạn gán tốc độ mà hồ sơ không cung cấp. Tiêu chí là điều kiện xuất phát.'),
      choice('c', 'A trực tiếp, B gián tiếp theo điều kiện xuất phát.', 'A đã qua chủ nghĩa tư bản phát triển cao; B chưa qua, nên hai tuyến được đặt theo dữ kiện đó.'),
    ] } },
  { ...base(3, 3, 'Khôi phục bốn lớp dữ liệu', 'minh',
    'Các lĩnh vực thời kỳ quá độ liên hệ nhau: sở hữu, thành phần thuộc kinh tế; thiết chế quyền lực thuộc chính trị; giá trị thuộc tư tưởng – văn hóa; giai cấp, tầng lớp thuộc xã hội.',
    'Hai tuyến đã đúng. Nhật ký cho thấy máy còn dồn mọi thay đổi vào một lớp kinh tế.', 'Phân lại dữ liệu theo lĩnh vực chính.',
    'Bốn lớp được giữ riêng để phân tích và nối lại trong mô hình; chúng vẫn có quan hệ với nhau.',
    ['Đọc đối tượng chính của từng dữ liệu.', 'Thành phần kinh tế; thiết chế chính trị; hệ tư tưởng và giá trị; giai cấp, tầng lớp xã hội.']),
    interaction: match([
      ['Nhiều hình thức sở hữu, thành phần', 0, 'Sở hữu và thành phần kinh tế thuộc lớp kinh tế.'],
      ['Biến đổi tổ chức và thiết chế quyền lực', 1, 'Tổ chức và thiết chế quyền lực thuộc chính trị.'],
      ['Các hệ tư tưởng, giá trị cùng tồn tại', 2, 'Hệ tư tưởng và giá trị thuộc tư tưởng – văn hóa.'],
      ['Nhiều giai cấp, tầng lớp và quan hệ', 3, 'Giai cấp, tầng lớp và các quan hệ giữa họ thuộc xã hội.'],
    ], ['Kinh tế', 'Chính trị', 'Tư tưởng – văn hóa', 'Xã hội']) },
  { ...base(3, 4, 'Giới hạn lại lệnh bỏ qua', 'khoi',
    '“Bỏ qua chế độ” không xác lập vị trí thống trị của quan hệ sản xuất và kiến trúc thượng tầng tư bản chủ nghĩa; vẫn tiếp thu, kế thừa thành tựu, đặc biệt khoa học – công nghệ.',
    'Các lớp đã rõ. Máy vẫn xóa dữ liệu khoa học và công nghệ khi thực hiện lệnh “bỏ qua chế độ”.', 'Hội đồng nên xử lý lệnh thế nào?',
    'Phạm vi lệnh đã được sửa: dữ liệu thành tựu được khôi phục để xem xét tiếp thu, kế thừa phù hợp.',
    ['So sánh đối tượng trong cụm “bỏ qua chế độ” với dữ liệu bị xóa.', 'Nhật ký mô tả hành động; tài liệu tại đây giúp phân biệt chế độ với các thành tựu có thể kế thừa.']),
    interaction: councilInteraction(3,
      ['Sửa phạm vi lệnh; khôi phục dữ liệu để xem xét tiếp thu, kế thừa.', 'Bản sửa phân biệt đúng đối tượng của lệnh với những thành tựu có thể kế thừa.'],
      [['Loại mọi thành tựu từng hình thành trong chủ nghĩa tư bản.', 'Đối tượng “bỏ qua” không phải toàn bộ thành tựu khoa học và công nghệ.'], ['Giữ mọi quan hệ cũ vì cần tiếp thu thành tựu.', 'Tiếp thu thành tựu không đồng nghĩa xác lập vị trí thống trị của quan hệ sản xuất và kiến trúc thượng tầng tư bản chủ nghĩa.']],
      'Nhật ký ghi xóa thành tựu; tài liệu phạm vi phân biệt chế độ với thành tựu.',
      'Nhật ký và chú thích tách rời cùng xác định đối tượng của lệnh.',
      'Mô hình có lớp thông tin về quyền làm chủ.',
      ['Bỏ qua chế độ không đồng nghĩa phủ nhận mọi thành tựu khoa học – công nghệ.', 'Nhật ký chứng minh xóa sai đối tượng; khái niệm cho phép xem xét tiếp thu thành tựu.'],
      [['Tên tuyến gián tiếp quy định phải xóa mọi dữ liệu trung gian.', 'Tên tuyến không quy định xóa dữ liệu hay phủ nhận mọi hình thức trung gian.'], ['Tiếp thu công nghệ nghĩa là giữ nguyên toàn bộ chế độ đã tạo ra nó.', 'Thành tựu khoa học – công nghệ và chế độ là các đối tượng cần phân biệt.']], 6) },
];

const r4: RestorationRoom['steps'] = [
  { ...base(4, 1, 'Làm rõ ba góc nhìn', 'an',
    'Dân chủ được xem xét ở phương diện quyền lực, chế độ xã hội – chính trị và nguyên tắc tổ chức, quản lý. Mỗi phương diện trả lời một câu hỏi khác nhau về cùng khái niệm.',
    'Biên bản gọi ba chú giải là “ba kiểu bỏ phiếu”. Hãy sửa tên từng chú giải.', 'Mỗi chú giải thuộc phương diện nào?',
    'Quyền lực, chế độ và nguyên tắc tổ chức là ba phương diện, không phải ba hình thức bỏ phiếu.',
    ['Xem câu đang nói ai nắm quyền hay cách tổ chức, thực thi quyền lực.', 'Ai nắm quyền → quyền lực; hình thức tổ chức thực thi → chế độ; cách quản lý → nguyên tắc.']),
    interaction: match([
      ['Quyền lực thuộc về nhân dân', 0, 'Câu này xác định chủ thể nắm quyền lực.'],
      ['Hình thức tổ chức thực thi quyền lực trong xã hội', 1, 'Câu này xét dân chủ như một chế độ xã hội – chính trị.'],
      ['Vận dụng dân chủ trong tổ chức, quản lý', 2, 'Câu này nói đến nguyên tắc tổ chức và quản lý.'],
    ], ['Quyền lực', 'Chế độ xã hội – chính trị', 'Nguyên tắc tổ chức, quản lý']) },
  { ...base(4, 2, 'Theo dấu người quyết định', 'vy',
    'Dân chủ trực tiếp là người dân trực tiếp thực hiện quyền; dân chủ gián tiếp thông qua đại biểu được lựa chọn. Cần xét hành vi đang diễn ra và điều kiện thẩm quyền, quy trình hợp lệ.',
    'Ví dụ minh họa: A là người dân trực tiếp biểu quyết hợp lệ; B là đại biểu được bầu quyết định trong cơ quan đại diện.', 'Chọn hình thức của A và B.',
    'Hành vi A là trực tiếp; B là đại diện. Việc có bầu chọn trước đó chưa xác định thay hành vi đang xét.',
    ['Ai đang trực tiếp thực hiện hành vi quyết định trong từng trường hợp?', 'A do người dân thực hiện; B do đại biểu thực hiện chức năng đại diện.']),
    interaction: { kind: 'decision', correct: 'a', options: [
      choice('a', 'A trực tiếp; B gián tiếp / đại diện.', 'A do người dân trực tiếp biểu quyết; B do đại biểu thực hiện chức năng trong cơ quan đại diện.'),
      choice('b', 'Cả hai trực tiếp vì đại biểu cũng từng được dân bầu.', 'Việc bầu trước đó không thay đổi chủ thể đang thực hiện hành vi quyết định ở B.'),
      choice('c', 'Cả hai gián tiếp vì đều có một quy trình tổ chức.', 'Có quy trình tổ chức không biến việc người dân trực tiếp biểu quyết thành đại diện.'),
    ] } },
  { ...base(4, 3, 'Xem hoạt động theo ba tiêu chí', 'minh',
    'Chức năng Nhà nước được phân chia theo phạm vi tác động, lĩnh vực và tính chất quyền lực. Một hoạt động có thể được nhìn theo nhiều tiêu chí; các cách chia không tạo những ngăn loại trừ nhau.',
    'Ví dụ minh họa: tổ chức phát triển giáo dục trong nước. Máy bắt chọn duy nhất “đối nội” hoặc “văn hóa”.', 'Cách ghi nào dùng đúng các tiêu chí?',
    'Cùng hoạt động được nhìn theo phạm vi, lĩnh vực và tính chất; các tiêu chí không loại trừ nhau.',
    ['“Trong nước” và “giáo dục” có trả lời cùng một câu hỏi không?', 'Trong nước chỉ phạm vi; giáo dục chỉ lĩnh vực; tổ chức phát triển gắn tính chất tổ chức xây dựng.']),
    interaction: { kind: 'decision', correct: 'c', options: [
      choice('b', 'Chọn văn hóa nên bỏ nhãn đối nội.', 'Lĩnh vực và phạm vi tác động là hai tiêu chí khác nhau, có thể cùng mô tả hoạt động.'),
      choice('c', 'Đối nội theo phạm vi; văn hóa theo lĩnh vực; tổ chức xây dựng theo tính chất.', 'Ba nhãn dùng ba tiêu chí, nên cùng mô tả được hoạt động minh họa.'),
      choice('a', 'Đã là đối nội thì không còn lĩnh vực hoặc tính chất.', 'Phạm vi tác động không thay thế hai tiêu chí phân chia còn lại.'),
    ] } },
  { ...base(4, 4, 'Nối quyền với cơ chế thực hiện', 'khoi',
    'Dân chủ xã hội chủ nghĩa là nền tảng Nhà nước xã hội chủ nghĩa; Nhà nước là công cụ thực hiện quyền làm chủ. Quyền cần được thể chế hóa, bảo đảm và thực thi.',
    'Biên bản đã rõ người tham gia và hình thức. Quyết định chưa có cơ chế bảo đảm, thực hiện quyền.', 'Hội đồng cần phục hồi mắt xích nào?',
    'Quyền làm chủ được nối với cơ chế thể chế hóa, bảo đảm và thực hiện; biên bản không dừng ở kết quả.',
    ['Kết quả quyết định khác với cơ chế bảo đảm thực hiện quyền.', 'Nối nền tảng dân chủ với vai trò của Nhà nước trong thể chế hóa và thực thi quyền.']),
    interaction: councilInteraction(4,
      ['Bổ sung cơ chế thể chế hóa, bảo đảm và thực hiện quyền làm chủ.', 'Bản phục dựng nối quyền làm chủ với cơ chế thực hiện thay vì chỉ lưu kết quả.'],
      [['Có tuyên bố quyền nên không còn cần thiết chế thực hiện.', 'Tuyên bố quyền không thay cho cơ chế thể chế hóa, bảo đảm và thực thi.'], ['Có cơ quan đại diện nên bỏ mọi hình thức tham gia trực tiếp.', 'Hai hình thức dân chủ có thể cùng tồn tại, không loại trừ nhau.']],
      'Biên bản thiếu cơ chế; tài liệu nêu vai trò Nhà nước thực hiện quyền làm chủ.',
      'Biên bản và hồ sơ cơ chế cùng nối quyền với việc bảo đảm thực hiện.',
      'Một chú giải nói quyền lực thuộc về nhân dân.',
      ['Quyền làm chủ cần được thể chế hóa, bảo đảm và thực hiện trong thực tế.', 'Cơ chế thực hiện là mắt xích còn thiếu bên cạnh chủ thể, hình thức và kết quả.'],
      [['Chọn đại biểu khiến quyền làm chủ tự thực hiện đầy đủ.', 'Lựa chọn đại biểu không tự thay thế cơ chế thực hiện và bảo đảm quyền.'], ['Nguyên tắc dân chủ thay thế mọi hoạt động của Nhà nước.', 'Dân chủ là nền tảng; Nhà nước vẫn giữ vai trò công cụ quan trọng thực hiện quyền.']]) },
];

function finalStep(roomId: RoomId, sourceNumber: number, title: string, scenario: string, question: string, decision: [string, string], wrong: [[string, string], [string, string]], proof: [string, string, string], reason: [string, string], wrongReasons: [[string, string], [string, string]], supportedFinding: number, sourceEvidence: number): LearningStep {
  const teaching = [r1, r2, r3, r4][roomId - 1][sourceNumber - 1];
  return { ...teaching, id: `final-${roomId}`, title, role: (['an', 'vy', 'minh', 'khoi'] as RoleId[])[roomId - 1], scenario, question,
    requiresEvidence: [], usesFindings: [{ id: `f${roomId}-${supportedFinding}`, relation: 'supports' }, ...[1, 2, 3, 4].filter(n => n !== supportedFinding).map(n => ({ id: `f${roomId}-${n}`, relation: 'context' as const }))],
    finding: { id: `final-f${roomId}`, text: decision[0] }, success: `Đoạn ${roomId} đã có quyết định, căn cứ và lý do phù hợp.`,
    hints: [`Dùng phát hiện đã kiểm chứng ở phòng ${roomId}; xem chi tiết nào trong đoạn báo cáo cần sửa.`, reason[1]],
    interaction: {
      kind: 'council', decisions: rotate([choice('c', ...wrong[1]), choice('a', ...decision), choice('b', ...wrong[0])], roomId + 1), correctDecision: 'a',
      proofOptions: rotate([
        { id: 'finding', text: proof[0], findingIds: [`f${roomId}-${supportedFinding}`], evidenceIds: [], reasonIds: ['a'] },
        { id: 'document', text: proof[1], findingIds: [], evidenceIds: evidence(roomId, sourceEvidence), reasonIds: ['a'] },
        { id: 'unrelated', text: proof[2], findingIds: [], evidenceIds: [], reasonIds: [] },
      ], roomId + 1), reasons: rotate([choice('b', ...wrongReasons[0]), choice('a', ...reason), choice('c', ...wrongReasons[1])], roomId + 2),
    } };
}

const finals: LearningStep[] = [
  finalStep(1, 3, 'Đoạn 1 · Xuất xứ triển lãm',
    'Hồ sơ mở lại thư viện ghi: “Công xã Paris xuất hiện trước Tuyên ngôn; thứ tự ấy chứng minh Công xã tạo ra tác phẩm.”',
    'Cần sửa chú giải triển lãm như thế nào?',
    ['Trả Tuyên ngôn về 1848, Công xã về 1871; bỏ suy luận nguyên nhân từ thứ tự.', 'Hai mốc cho thấy thứ tự sai, đồng thời thứ tự thời gian chưa chứng minh nguyên nhân.'],
    [['Giữ thứ tự vì Công xã có ý nghĩa thực tiễn.', 'Ý nghĩa thực tiễn không thay đổi mốc thời gian của sự kiện.'], ['Sửa năm rồi coi mọi sự kiện trước là nguyên nhân của sự kiện sau.', 'Trước – sau không tự chứng minh quan hệ nhân quả.']],
    ['Phát hiện biên mục: Tuyên ngôn 1848; Công xã Paris 1871.', 'Hồ sơ các mốc lịch sử ghi hai sự kiện năm 1848 và 1871.', 'Tên các ngăn tiền đề khác nhau.'],
    ['Mốc năm xác định trước – sau; muốn kết luận nguyên nhân cần căn cứ khác.', 'Năm 1848 trước 1871, còn quan hệ nhân quả cần được chứng minh riêng.'],
    [['Sự kiện thực tiễn luôn xuất hiện trước tác phẩm lý luận.', 'Không thể dùng nhận định chung ấy thay cho ngày tháng được ghi nguồn.'], ['Một năm xuất hiện đủ chứng minh nguyên nhân của mọi sự kiện sau.', 'Mốc thời gian không cung cấp toàn bộ căn cứ cho quan hệ nguyên nhân.']], 3, 4),
  finalStep(2, 1, 'Đoạn 2 · Hồ sơ nhân sự mới',
    'Báo cáo xếp hai người cùng dùng phần mềm vào một nhóm, dù chưa ghi vị trí sản xuất, sở hữu và quan hệ lao động.',
    'Hội đồng nên yêu cầu bổ sung gì?',
    ['Kiểm tra cả phương thức lao động, vị trí sản xuất và các quan hệ xã hội.', 'Các phương diện nhận diện cần được đọc cùng bối cảnh cụ thể.'],
    [['Dùng tên phần mềm làm tiêu chí duy nhất.', 'Cùng dùng một công cụ chưa cho biết vị trí sản xuất và quan hệ xã hội.'], ['Chỉ cần xác nhận hai người có bằng cấp giống nhau.', 'Bằng cấp không thay thế các phương diện của khái niệm cần xem xét.']],
    ['Phát hiện nhận diện yêu cầu hai phương diện và bối cảnh.', 'Hồ sơ hai phương diện nêu phương thức lao động cùng quan hệ xã hội.', 'Hai người đều có thao tác với bàn phím.'],
    ['Cùng công cụ không chứng minh cùng vị trí sản xuất, sở hữu hoặc quan hệ lợi ích.', 'Công cụ là một chi tiết; cần thêm các phương diện nhận diện đã học.'],
    [['Sử dụng công nghệ quyết định toàn bộ quan hệ sở hữu.', 'Công cụ không tự cho biết ai sở hữu tư liệu sản xuất.'], ['Chỉ cần nghề nghiệp ghi trên thẻ là đủ mọi căn cứ.', 'Nhãn nghề nghiệp đơn lẻ chưa cung cấp đủ các phương diện và bối cảnh.']], 1, 1),
  finalStep(3, 2, 'Đoạn 3 · Tuyến chuyển tiếp mới',
    'Báo cáo gọi một hồ sơ là “quá độ gián tiếp” chỉ vì dự kiến kéo dài; điều kiện xuất phát chưa được ghi.',
    'Chọn cách xử lý nhãn tuyến này.',
    ['Bổ sung điều kiện xuất phát trước khi xác nhận tên tuyến.', 'Hồ sơ thiếu đúng tiêu chí phân chia trực tiếp và gián tiếp.'],
    [['Duyệt vì gián tiếp luôn đồng nghĩa lâu hơn.', 'Thời gian dài không phải tiêu chí đặt tên hai tuyến trong giáo trình.'], ['Đổi sang trực tiếp nếu muốn rút ngắn thời gian.', 'Đổi tên không xác định được điều kiện xuất phát hay tốc độ thực tế.']],
    ['Phát hiện hai tuyến được phân biệt theo điều kiện xuất phát.', 'Hồ sơ điều kiện xuất phát phân biệt đã qua hoặc chưa qua chủ nghĩa tư bản phát triển cao.', 'Mô hình có nhiều lớp thông tin.'],
    ['Trực tiếp và gián tiếp dựa vào điều kiện xuất phát, không phải dự tính nhanh chậm.', 'Cần biết điểm xuất phát rồi mới có căn cứ đặt tên tuyến.'],
    [['Mỗi tên tuyến quy định sẵn một khoảng thời gian cố định.', 'Giáo trình không dùng số năm dự kiến để phân chia hai tuyến.'], ['Đã chọn mục tiêu thì mọi hồ sơ có cùng một tuyến.', 'Cùng mục tiêu không có nghĩa điều kiện xuất phát giống nhau.']], 2, 3),
  finalStep(4, 4, 'Đoạn 4 · Cơ chế tham gia',
    'Bản đề xuất chỉ giữ cơ quan đại diện và kết luận rằng mọi hình thức người dân tham gia trực tiếp đều phải bỏ.',
    'Chọn bản sửa để hoàn thiện hồ sơ.',
    ['Giữ cơ chế đại diện và bổ sung hình thức trực tiếp phù hợp, có bảo đảm thực hiện.', 'Hai hình thức có thể cùng tồn tại trong cơ chế thực hiện quyền.'],
    [['Bỏ hình thức trực tiếp vì đã có cơ quan đại diện.', 'Dân chủ trực tiếp và đại diện không phải hai lựa chọn loại trừ nhau.'], ['Bỏ mọi cơ quan đại diện vì chỉ trực tiếp mới là dân chủ.', 'Thực hiện thông qua đại biểu cũng là một hình thức dân chủ theo giáo trình.']],
    ['Phát hiện cuối hội trường nối quyền với cơ chế bảo đảm, thực hiện.', 'Hồ sơ cơ chế nêu cả việc bảo đảm quyền và các hình thức thực hiện.', 'Biên bản có một kết quả biểu quyết.'],
    ['Trực tiếp và đại diện có thể cùng tồn tại; quyền vẫn cần cơ chế thực hiện.', 'Có cơ quan đại diện không tự xóa hình thức tham gia trực tiếp; cần bảo đảm thực hiện quyền.'],
    [['Hai hình thức không thể có mặt trong cùng một hệ thống.', 'Giáo trình trình bày trực tiếp và gián tiếp như các hình thức có thể cùng tồn tại.'], ['Chỉ cần ghi kết quả thì quyền làm chủ đã được bảo đảm đầy đủ.', 'Kết quả không thay thế các cơ chế thể chế hóa, bảo đảm và thực hiện quyền.']], 4, 5),
];

export const rooms: RestorationRoom[] = chapters.map((c, index) => ({
  id: c.id, name: c.name, shortName: c.shortName, color: c.color, background: c.background,
  incident: [
    'Bản giới thiệu bị ghép sai người, tiền đề và mốc thời gian. Hãy phục hồi từng trường rồi chốt bản giới thiệu.',
    'Bộ đọc chỉ giữ một phần hồ sơ lao động. Hãy khôi phục tiêu chí trước khi cập nhật bản nhận diện.',
    'Một lệnh đang xóa dữ liệu của mô hình. Hãy kiểm tra từng lớp hồ sơ rồi giới hạn lại lệnh.',
    'Biên bản còn kết quả nhưng mất đường đi của quyết định. Hãy nối lại người tham gia và cơ chế thực hiện.',
  ][index], steps: [r1, r2, r3, r4][index], finalCase: finals[index],
}));
export const learningSteps = rooms.flatMap(r => r.steps);
export const allSteps = rooms.flatMap(r => [...r.steps, r.finalCase]);
export const room = (id: RoomId) => rooms.find(r => r.id === id)!;
export const step = (id: string) => allSteps.find(s => s.id === id);
