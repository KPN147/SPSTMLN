import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App';
import { rooms } from '../restoration/curriculum';
import { chapter } from '../council/content';
import { SAVE_KEY, countGoals, parse, proofAvailable } from '../restoration/engine';
import type { LearningStep } from '../restoration/model';
import { completedRooms } from './restoration-fixtures';
import { GUIDE_INTRO_KEY } from '../council/GuideOnboarding';

beforeEach(()=>{localStorage.clear();sessionStorage.clear();localStorage.setItem(GUIDE_INTRO_KEY,'seen');window.history.replaceState({},'','/room/1');});
function collectNeeded(t:LearningStep){for(const id of t.requiresEvidence){const saved=localStorage.getItem(SAVE_KEY);if(saved&&parse(saved).rooms[t.roomId].evidence.includes(id))continue;fireEvent.click(screen.getByRole('button',{name:`Mở hồ sơ: ${chapter(t.roomId).evidence.find(e=>e.id===id)!.title}`}));fireEvent.click(within(screen.getByRole('dialog')).getByRole('button',{name:/^Ghi nhận chứng cứ/}));}}
function answer(t:LearningStep){const ui=within(screen.getByRole('region',{name:t.title})),i=t.interaction;if(i.kind==='matching'||i.kind==='timeline'){for(const item of i.items){fireEvent.click(ui.getByRole('button',{name:item.label}));fireEvent.click(within(ui.getByRole('group',{name:'Vị trí phục dựng'})).getByRole('button',{name:i.targets.find(v=>v.id===item.target)!.label}));}}else if(i.kind==='decision')fireEvent.click(ui.getByRole('radio',{name:i.options.find(o=>o.id===i.correct)!.text}));else{fireEvent.click(ui.getByRole('radio',{name:i.decisions.find(o=>o.id===i.correctDecision)!.text}));fireEvent.click(ui.getByRole('button',{name:'Tiếp theo'}));const s=parse(localStorage.getItem(SAVE_KEY)!);const proof=i.proofOptions.find(p=>p.reasonIds.length&&proofAvailable(s,t,p.id))!;fireEvent.click(ui.getByRole('radio',{name:proof.text}));fireEvent.click(ui.getByRole('button',{name:'Tiếp theo'}));fireEvent.click(ui.getByRole('radio',{name:i.reasons.find(o=>o.id===proof.reasonIds[0])!.text}));}fireEvent.click(ui.getByRole('button',{name:i.kind==='council'?'Xác nhận phục dựng':'Kiểm tra quyết định'}));}
describe('Hành trình V3 thực tế',()=>{
 it('đi hết16mục tiêu và bốn tình huống cuối bằng giao diện',()=>{
  render(<App/>);
  for(const r of rooms){expect(screen.getByRole('heading',{name:r.name})).toBeVisible();for(const t of r.steps){collectNeeded(t);answer(t);if(t!==r.steps[3])fireEvent.click(screen.getByRole('button',{name:'Tiếp tục'}));}const celebration=within(screen.getByRole('dialog'));fireEvent.click(celebration.getByRole('button',{name:'Bỏ qua hiệu ứng'}));fireEvent.click(celebration.getByRole('button',{name:r.id===4?'Đến Phòng Lõi':`Sang phòng ${r.id+1}`}));}
  for(const r of rooms){fireEvent.click(within(screen.getByRole('group',{name:'Các phần báo cáo'})).getByRole('button',{name:r.shortName}));answer(r.finalCase);}
  fireEvent.click(screen.getByRole('button',{name:'Khôi phục thư viện'}));const finale=within(screen.getByRole('dialog',{name:'Bạn đã hoàn thành hành trình'}));fireEvent.click(finale.getByRole('button',{name:'Bỏ qua hiệu ứng'}));fireEvent.click(finale.getByRole('button',{name:'Xem kết quả'}));expect(screen.getByRole('heading',{name:'Thư viện đã sáng lại.'})).toBeVisible();expect(countGoals(parse(localStorage.getItem(SAVE_KEY)!))).toBe(16);
 },20000);
 it('gợi ý theo nhu cầu không tự trả lời, câu đang làm giữ khi mở cẩm nang và tải lại',()=>{
  render(<App/>);const t=rooms[0].steps[0];collectNeeded(t);const ui=within(screen.getByRole('region',{name:t.title}));for(let n=0;n<3;n++)fireEvent.click(ui.getByRole('button',{name:/Cần gợi ý/}));fireEvent.click(ui.getByText('Xem lời giải và lý do'));expect(parse(localStorage.getItem(SAVE_KEY)!).rooms[1].answers).toEqual({});
  if(t.interaction.kind!=='matching')throw Error('Fixture cần ghép');const item=t.interaction.items[0];fireEvent.click(ui.getByRole('button',{name:item.label}));fireEvent.click(ui.getByRole('button',{name:t.interaction.targets[0].label}));
  const saved=localStorage.getItem(SAVE_KEY);fireEvent.click(within(screen.getByRole('navigation',{name:'Điều hướng chính'})).getByRole('link',{name:'Hướng dẫn'}));expect(localStorage.getItem(SAVE_KEY)).toBe(saved);fireEvent.click(screen.getAllByRole('link',{name:'Quay lại chơi'})[0]);expect(window.location.pathname).toBe('/room/1');expect(parse(localStorage.getItem(SAVE_KEY)!).rooms[1].answers[t.id].placements[item.id]).toBe(t.interaction.targets[0].id);
 });
 it('căn cứ sai bị từ chối dù quyết định đúng; sửa đúng màn không xóa phần đã chọn',()=>{
  const s=completedRooms(1);const t=rooms[0].steps[3];s.rooms[1].completed=s.rooms[1].completed.filter(id=>id!==t.id);delete s.rooms[1].answers[t.id];localStorage.setItem(SAVE_KEY,JSON.stringify(s));render(<App/>);const i=t.interaction;if(i.kind!=='council')throw Error('Fixture');const ui=within(screen.getByRole('region',{name:t.title}));fireEvent.click(ui.getByRole('radio',{name:i.decisions.find(v=>v.id===i.correctDecision)!.text}));fireEvent.click(ui.getByRole('button',{name:'Tiếp theo'}));fireEvent.click(ui.getByRole('radio',{name:i.proofOptions.find(v=>!v.reasonIds.length)!.text}));fireEvent.click(ui.getByRole('button',{name:'Tiếp theo'}));fireEvent.click(ui.getByRole('radio',{name:i.reasons[0].text}));fireEvent.click(ui.getByRole('button',{name:'Xác nhận phục dựng'}));expect(ui.getByRole('alert')).toHaveTextContent('chưa giải thích');fireEvent.click(ui.getByRole('button',{name:'Sửa bước 2'}));expect(ui.getByRole('radio',{checked:true})).toHaveAccessibleName(i.proofOptions.find(v=>!v.reasonIds.length)!.text);expect(parse(localStorage.getItem(SAVE_KEY)!).rooms[1].answers[t.id].decision).toBe(i.correctDecision);
 });
});
