import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import QRCode from 'qrcode';

const workspaceDir=process.cwd();
const runtimeRoot=process.env.CODEX_PRIMARY_RUNTIME_ROOT??path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime');
const modules=process.env.RUNTIME_NODE_MODULES??process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES??path.join(runtimeRoot,'dependencies/node/node_modules');
process.env.RUNTIME_NODE_MODULES=modules;
const skillDir=process.env.PRESENTATIONS_SKILL_DIR??path.join(os.homedir(),'.codex/plugins/cache/openai-primary-runtime/presentations/26.1030.10813/skills/presentations');
const runtimePython=process.env.RUNTIME_PYTHON??path.join(runtimeRoot,'dependencies/python/python.exe');
const runtimeRequire=createRequire(path.join(modules,'__runtime__.cjs'));
const localRequire=createRequire(path.join(workspaceDir,'package.json'));
const {Presentation,PresentationFile}=await import(pathToFileURL(runtimeRequire.resolve('@oai/artifact-tool')).href);
const sharp=runtimeRequire('sharp');
const React=localRequire('react'),{renderToStaticMarkup}=localRequire('react-dom/server'),ts=localRequire('typescript');
const buildDir=path.join(workspaceDir,'.build/presentation');
const outputDir=path.join(workspaceDir,'output');
await fs.mkdir(buildDir,{recursive:true});await fs.mkdir(outputDir,{recursive:true});
const flag=process.argv.indexOf('--demo-url');let demoUrl=null;
if(flag!==-1){const u=new URL(process.argv[flag+1]);if(!['http:','https:'].includes(u.protocol)||['localhost','127.0.0.1','0.0.0.0','[::1]'].includes(u.hostname)||u.username||u.password)throw Error('Cần URL http(s) của LAN/hosting thật, không dùng localhost hoặc URL có thông tin đăng nhập.');u.pathname='/demo';u.search='';u.hash='';demoUrl=u.href;}
const presentation=Presentation.create({slideSize:{width:1280,height:720}});
function transpile(source){const compiled=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const exports={};new Function('require','exports',compiled)(localRequire,exports);return exports;}
const sceneSource=await fs.readFile(path.join(workspaceDir,'src/components/RoomScene.tsx'),'utf8');
const {RoomArt}=transpile(sceneSource.slice(sceneSource.indexOf('export function RoomArt'),sceneSource.indexOf('export function RoomScene')));
const {rooms}=transpile(await fs.readFile(path.join(workspaceDir,'src/data/rooms.ts'),'utf8'));
const artwork=[];
for(const room of rooms){const svg=renderToStaticMarkup(React.createElement(RoomArt,{room})).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="650" ');const png=await sharp(Buffer.from(svg)).png().toBuffer();artwork.push(png);await fs.writeFile(path.join(buildDir,`room-${room.id}.png`),png);}
const ink='#10182B',cream='#F3EBDC',gold='#D9B56E',muted='#B1BDCA';
function text(slide,value,x,y,w,h,size=26,color=cream,bold=false){const shape=slide.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});shape.text=value;shape.text.style={typeface:'Arial',fontSize:size,color,bold};return shape;}
function image(slide,bytes,x,y,w,h,alt){slide.images.add({blob:bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),contentType:'image/png',alt,fit:'contain',position:{left:x,top:y,width:w,height:h}});}
function slide(title,notes){const s=presentation.slides.add();s.background.fill=ink;text(s,title,64,54,1145,80,46);text(s,`MLN131  /  MẬT MÃ TRI THỨC`,64,676,800,22,14,muted);text(s,String(presentation.slides.items.length).padStart(2,'0'),1156,670,60,28,18,gold);s.speakerNotes.text=notes;return s;}
let s=slide('','0:00–0:45. Giới thiệu một cách học thông qua khám phá. Người chưa học có thể đọc tài liệu tại đồ vật, giải câu đố rồi xem lời giải học thuật. Bối cảnh thư viện năm 2126 là giả tưởng. Nguồn nội dung: plan.md §1–2 và §6. Hình: artwork SVG gốc của game, xuất từ RoomArt, không phải ảnh chụp trình duyệt.');
text(s,'TRÒ CHƠI KHÁM PHÁ TRI THỨC',64,94,650,38,19,gold);text(s,'Mật Mã\nTri Thức',64,180,620,240,96);text(s,'Giải câu đố. Mở cánh cửa.\nHiểu tri thức.',68,448,570,100,29,muted);image(s,artwork[0],600,190,650,355,'Artwork thư viện Khởi nguyên trong game');text(s,'4 căn phòng     16 mật mã',68,588,700,50,24,gold);
s=slide('Bốn phòng, bốn chương','0:45–1:30. Giới thiệu bốn chủ đề. Mỗi phòng có bốn đồ vật tương tác, ba manh mối và một khóa cửa. Hoàn thành lần lượt để nhận bốn mảnh tri thức. Không diễn giải thứ tự chơi thành quan hệ nhân quả đơn tuyến giữa các chương. Nguồn: plan.md §6; src/data/rooms.ts. Hình: artwork nhà máy Sứ mệnh từ game.');
text(s,'Mỗi phòng có một chủ đề và một mảnh tri thức.',68,142,1120,55,27,muted);
const desc=['Sự hình thành và phát triển lý luận','Sứ mệnh của giai cấp công nhân','Chủ nghĩa xã hội và thời kỳ quá độ','Dân chủ và Nhà nước XHCN'];
rooms.forEach((r,i)=>{text(s,`0${r.id}   ${r.shortName}`,68,224+i*103,610,45,30,r.color);text(s,desc[i],132,270+i*103,560,45,24,muted);});image(s,artwork[1],710,230,505,300,'Artwork nhà máy Sứ mệnh');text(s,'Khám phá đồ vật, thu thập manh mối,\nmở khóa cửa để tiếp tục hành trình.',726,548,475,100,24,muted);
s=slide('Demo: Thư viện Khởi nguyên','1:30–3:30. Chuyển sang ứng dụng local, mở phòng 1. Chỉ vào bốn đồ vật và trạng thái khóa. Mở kệ bản thảo, đọc tài liệu trước khi phân loại. Minh họa sửa đáp án, dùng gợi ý và xem lời giải có nguồn. Sau câu đúng, mở túi manh mối và Sổ tay. Không cần giải toàn bộ 16 câu khi thuyết trình. Nguồn: Giáo trình CNXHKH (2021), Chương 1, tr. 12–16; plan.md R1-P1. Hình: artwork RoomArt gốc của game.');
image(s,artwork[0],64,183,750,407,'Artwork cảnh phòng 1 dùng trong game');text(s,'Khám phá đồ vật',854,205,355,50,30,gold);text(s,'Đọc dữ kiện ngay tại kệ bản thảo.',854,260,355,100,26);text(s,'Giải mã và thu thập',854,388,355,50,30,gold);text(s,'Lời giải có nguồn.\nManh mối được lưu lại.',854,445,355,120,26);text(s,'Chương 1, tr. 12–16. Hình xuất từ mã nguồn cảnh phòng.',68,621,1100,38,20,muted);
s=slide('Thời kỳ quá độ','3:30–4:45. Dùng phòng 3 đã mở bằng quá trình chơi trước buổi trình bày. Chỉ vào tài liệu tại máy tính trung tâm. Phân biệt bỏ qua chế độ với phủ nhận thành tựu. Chọn các chứng cứ được nguồn hỗ trợ. Nếu chưa chuẩn bị tiến độ, dùng hình cảnh và giải thích trên slide, không can thiệp save chính giữa buổi. Nguồn: Giáo trình CNXHKH (2021), Chương 3, tr. 110–112; plan.md R3-P4. Hình: artwork phòng thí nghiệm từ game.');
text(s,'“Bỏ qua chế độ”',68,222,540,76,40,gold);text(s,'Phân biệt quan hệ sản xuất,\nkiến trúc thượng tầng với\nnhững thành tựu khoa học\nvà công nghệ có thể kế thừa.',68,320,555,220,28);image(s,artwork[2],624,220,594,340,'Artwork phòng thí nghiệm Chuyển mình');text(s,'Khóa chứng cứ của Room 3',650,570,535,45,24,muted);text(s,'Nguồn: Chương 3, tr. 110–112',68,618,1100,38,22,muted);
s=slide('Mini demo trong lớp','4:45–5:45. Mở /demo. Mời cả lớp phân biệt ai trực tiếp thực hiện hành vi quyết định. Hai tình huống do nhóm xây dựng, không phải ví dụ nguyên văn của giáo trình. Không hiển thị số người chơi hoặc tổng hợp lớp vì không có backend. Demo tách khỏi tiến độ chính. Nếu có URL LAN/hosting thật, tạo lại slide với --demo-url trước buổi học và thử quét QR trên điện thoại cùng mạng. Nguồn: Giáo trình CNXHKH (2021), Chương 4, tr. 153; plan.md R4-P2.'+(demoUrl?` URL demo: ${demoUrl}`:' Chưa có URL dùng chung. Mở bản local tại /demo trên máy trình chiếu.'));
text(s,'Người dân tự biểu quyết',68,225,725,55,32);text(s,'Dân chủ trực tiếp',68,291,700,45,27,gold);text(s,'Đại biểu thực hiện quyền đại diện',68,411,735,90,32);text(s,'Dân chủ gián tiếp',68,513,700,45,27,gold);
if(demoUrl){const png=await QRCode.toBuffer(demoUrl,{width:320,margin:2,color:{dark:ink,light:'#FFFFFF'}});image(s,png,864,220,310,310,'Mã QR mở mini demo trên LAN hoặc hosting');text(s,demoUrl,810,553,405,70,18,muted);await fs.writeFile(path.join(outputDir,'demo-qr.png'),png);}else{text(s,'/demo',835,268,385,110,75,gold);text(s,'60–90 giây',846,395,350,55,31);text(s,'Mở bản local trên\nmáy trình chiếu.',847,471,340,100,25,muted);}
text(s,'Tình huống minh họa của nhóm. Nguồn khái niệm: Chương 4, tr. 153.',68,618,1130,36,20,muted);
s=slide('Kiến thức mang theo','5:45–6:30. Mở Sổ tay. Chỉ vào một mục đã giải, lời giải, đáp án và nguồn theo trang in. Trình bày kết quả: 16 câu tương ứng 80 điểm, Final thêm 20 điểm. Điểm là tiến độ khám phá, không phải dữ liệu chứng minh hiệu quả học tập. Các mục chưa giải khóa phần lời giải để giữ trải nghiệm suy luận. Nguồn: plan.md §7 và §11. Hình: artwork hội trường Quyền làm chủ từ game.');
text(s,'16 mục Sổ tay có lời giải và trang nguồn.',68,165,1135,70,29,muted);text(s,'Khởi nguyên của lý luận\nSứ mệnh của giai cấp công nhân\nĐặc trưng và thời kỳ quá độ\nDân chủ và Nhà nước XHCN',68,273,645,255,29);image(s,artwork[3],711,252,504,300,'Artwork hội trường Quyền làm chủ');text(s,'100 điểm khi hoàn thành cả hành trình',68,574,1135,60,31,gold);
s=slide('Nguồn và giới hạn','6:30–7:00. Kết lại bằng khả năng dùng game để làm quen và ôn tập. Nội dung dựa trên sách đã cung cấp. Giữ rõ phạm vi trang 11–153, không nói PDF chỉ có 150 trang vì tệp thực tế có 273 trang. Tất cả 16 câu đang ở trạng thái needs-review, chờ người phụ trách học thuật xác nhận. Không khẳng định đã xác minh nguyên văn. Game lưu trên thiết bị, chưa có hosting public, backend hoặc đo lường hiệu quả học tập. Nguồn: PDF giáo trình do người dùng cung cấp; CONTENT_SOURCES.md; plan.md §2.');
text(s,'Giáo trình Chủ nghĩa xã hội khoa học',68,182,1120,60,32,gold);text(s,'Bộ Giáo dục và Đào tạo\nNXB Chính trị quốc gia Sự thật, Hà Nội, 2021',68,252,1120,105,28);text(s,'Phạm vi trò chơi',68,398,500,45,28,gold);text(s,'Chương 1–4, trang in 11–153.\n16 câu đang chờ duyệt nguồn.',68,455,545,110,26);text(s,'Tiến độ trên thiết bị',704,398,510,45,28,gold);text(s,'Lưu localStorage, không cần tài khoản.\nBối cảnh năm 2126 là giả tưởng.',704,455,510,110,26);text(s,'Mục tiêu: hỗ trợ làm quen và ôn tập kiến thức MLN131.',68,600,1120,45,25,muted);
for(const [i,item] of presentation.slides.items.entries()){const png=await presentation.export({slide:item,format:'png',scale:1.25});await fs.writeFile(path.join(buildDir,`slide-${i+1}.png`),new Uint8Array(await png.arrayBuffer()));}
const candidatePath=path.join(buildDir,'candidate.pptx');await(await PresentationFile.exportPptx(presentation)).save(candidatePath);
const {finalizePresentation}=await import(pathToFileURL(path.join(skillDir,'container_tools/artifact_tool_utils.mjs')).href);
const finalPath=path.join(outputDir,demoUrl?'MLN131-Mat-Ma-Tri-Thuc-QR.pptx':'MLN131-Mat-Ma-Tri-Thuc.pptx');
// The finalizer deliberately refuses overwrites. Rotate only files this script generated.
try{await fs.access(finalPath);await fs.rename(finalPath,path.join(buildDir,`previous-${Date.now()}.pptx`));}catch(error){if(error.code!=='ENOENT')throw error;}
const receiptPath=path.join(buildDir,`validation-${Date.now()}.json`);
const result=await finalizePresentation({workspaceDir,candidatePath,finalPath,explicitTotalSlideCount:7,pythonExecutable:runtimePython,integrityValidatorPath:path.join(skillDir,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skillDir,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[],fontPolicy:{basis:'design',families:['Arial']},verifyArtifactToolImport:true,receiptPath});
await fs.copyFile(receiptPath,path.join(buildDir,'validation-latest.json'));
console.log(JSON.stringify({finalPath,demoUrl,validation:result},null,2));
