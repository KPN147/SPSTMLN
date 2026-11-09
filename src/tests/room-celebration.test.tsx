import { StrictMode } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { rooms } from '../restoration/curriculum';
import { SAVE_KEY, parse } from '../restoration/engine';
import { completedRooms, winningAnswer } from './restoration-fixtures';
import { GUIDE_INTRO_KEY } from '../council/GuideOnboarding';

const audio:HTMLAudioElement[]=[];
const settings=(reducedMotion=false,muted=false)=>localStorage.setItem('mln131-council-settings-v1',JSON.stringify({muted,reducedMotion,music:0,effects:.4}));
function seed(id=1){const r=rooms[id-1],s=completedRooms(id),p=s.rooms[r.id],t=r.steps[3];p.completed=p.completed.filter(v=>v!==t.id);delete p.answers[t.id];p.answers[t.id]=winningAnswer(t,s);s.currentRoom=r.id;localStorage.setItem(SAVE_KEY,JSON.stringify(s));window.history.replaceState({},'',`/room/${id}`);return {r,t,s};}
function finish(){const button=screen.getByRole('button',{name:'Xác nhận phục dựng'});fireEvent.click(button);return button;}
const chapterSounds=()=>audio.filter(v=>v.getAttribute('src')==='/audio/chapter.ogg');
beforeEach(()=>{
 localStorage.clear();sessionStorage.clear();localStorage.setItem(GUIDE_INTRO_KEY,'seen');settings();audio.length=0;
 vi.spyOn(document,'hidden','get').mockReturnValue(false);
 vi.mocked(window.matchMedia).mockImplementation(query=>({matches:false,media:query,addEventListener:vi.fn(),removeEventListener:vi.fn(),addListener:vi.fn(),removeListener:vi.fn(),dispatchEvent:vi.fn(),onchange:null}));
 vi.stubGlobal('Audio',function(src?:string){const element=document.createElement('audio');if(src)element.setAttribute('src',src);audio.push(element);return element;});
});
afterEach(()=>{vi.useRealTimers();vi.restoreAllMocks();vi.unstubAllGlobals();});

describe('Khoảnh khắc phòng thức tỉnh',()=>{
 it.each(rooms)('phòng$id lưu hoàn thành trước cảnh, phát một âm và đi đúng khu vực',r=>{
  seed(r.id);render(<App/>);finish();
  const saved=localStorage.getItem(SAVE_KEY)!;
  expect(parse(saved).rooms[r.id].completed).toContain(r.steps[3].id);
  const dialog=screen.getByRole('dialog',{name:`${r.shortName} đã sáng lại.`});expect(dialog).toHaveClass('celebration-dialog');
  expect(document.body.style.overflow).toBe('hidden');expect(chapterSounds()).toHaveLength(1);
  expect(audio.filter(v=>v.getAttribute('src')==='/audio/insight.ogg')).toHaveLength(0);
  expect(within(dialog).queryByRole('button',{name:r.id===4?'Đến Phòng Lõi':`Sang phòng ${r.id+1}`})).not.toBeInTheDocument();
  fireEvent.click(within(dialog).getByRole('button',{name:'Bỏ qua hiệu ứng'}));
  expect(localStorage.getItem(SAVE_KEY)).toBe(saved);
  expect(within(dialog).getByRole('button',{name:r.id===4?'Đến Phòng Lõi':`Sang phòng ${r.id+1}`})).toHaveFocus();
  fireEvent.click(within(dialog).getByRole('button',{name:r.id===4?'Đến Phòng Lõi':`Sang phòng ${r.id+1}`}));
  expect(window.location.pathname).toBe(r.id===4?'/final':`/room/${r.id+1}`);expect(document.body.style.overflow).toBe('');
 });
 it('chạy3giây rồi giữ cảnh, nhấp đôi/StrictMode không nhân hiệu ứng hoặc âm thanh',()=>{
  vi.useFakeTimers();seed();render(<StrictMode><App/></StrictMode>);const submit=finish();fireEvent.click(submit);
  expect(screen.getAllByRole('dialog')).toHaveLength(1);expect(chapterSounds()).toHaveLength(1);
  act(()=>vi.advanceTimersByTime(2999));expect(screen.queryByRole('button',{name:'Ở lại khám phá'})).not.toBeInTheDocument();
  act(()=>vi.advanceTimersByTime(1));expect(screen.getByRole('button',{name:'Ở lại khám phá'})).toBeVisible();
  act(()=>vi.advanceTimersByTime(10000));expect(screen.getByRole('dialog')).toBeVisible();expect(chapterSounds()).toHaveLength(1);
 });
 it.each(['Ở lại khám phá','Đóng cửa sổ','Escape'])('%s giữ tiến độ và trả focus về tổng kết',action=>{
  seed();render(<App/>);finish();const saved=localStorage.getItem(SAVE_KEY);const dialog=screen.getByRole('dialog');
  fireEvent.click(within(dialog).getByRole('button',{name:'Bỏ qua hiệu ứng'}));
  if(action==='Escape')fireEvent(dialog,new Event('cancel',{cancelable:true}));else fireEvent.click(within(dialog).getByRole('button',{name:action}));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();expect(screen.getByLabelText('Tổng kết phục dựng')).toHaveFocus();expect(document.body.style.overflow).toBe('');expect(localStorage.getItem(SAVE_KEY)).toBe(saved);
 });
 it('sai lý do không mở cảnh hoặc phát âm hoàn thành',()=>{
  const {s,t}=seed();if(t.interaction.kind!=='council')throw Error('Fixture');s.rooms[1].answers[t.id].reason=t.interaction.reasons.find(v=>v.id!=='a')!.id;localStorage.setItem(SAVE_KEY,JSON.stringify(s));render(<App/>);finish();expect(screen.getByRole('alert')).toBeVisible();expect(screen.queryByRole('dialog')).not.toBeInTheDocument();expect(chapterSounds()).toHaveLength(0);
 });
 it('giảm chuyển động có nút ngay, tắt âm không tạo hiệu ứng âm thanh',()=>{
  seed();settings(true,true);render(<App/>);finish();expect(document.querySelector('.restoration-celebration')).toHaveClass('is-reduced','is-ready');expect(screen.getByRole('button',{name:'Ở lại khám phá'})).toBeVisible();expect(chapterSounds()).toHaveLength(0);
 });
 it('hệ thống bật giảm chuyển động giữa cảnh thì hoàn tất ngay',()=>{
  const handlers:(()=>void)[]=[],media={matches:false,media:'(prefers-reduced-motion: reduce)',addEventListener:(_type:string,handler:()=>void)=>handlers.push(handler),removeEventListener:vi.fn(),addListener:vi.fn(),removeListener:vi.fn(),dispatchEvent:vi.fn(),onchange:null};vi.mocked(window.matchMedia).mockReturnValue(media as unknown as MediaQueryList);
  seed();render(<App/>);finish();act(()=>{media.matches=true;handlers.forEach(fn=>fn());});expect(screen.getByRole('button',{name:'Ở lại khám phá'})).toBeVisible();expect(document.querySelector('.restoration-celebration')).toHaveClass('is-reduced');
 });
 it('chuyển tab giữa hiệu ứng hoàn tất cảnh và không phát lại âm khi trở về',()=>{
  seed();render(<App/>);finish();vi.mocked(vi.spyOn(document,'hidden','get')).mockReturnValue(true);fireEvent(document,new Event('visibilitychange'));expect(screen.getByRole('button',{name:'Ở lại khám phá'})).toBeVisible();vi.mocked(vi.spyOn(document,'hidden','get')).mockReturnValue(false);fireEvent(document,new Event('visibilitychange'));expect(chapterSounds()).toHaveLength(1);
 });
 it('ảnh lỗi vẫn có lời xác nhận và nút đi tiếp',()=>{
  seed();render(<App/>);finish();fireEvent.error(document.querySelector('.celebration-image-lit')!);expect(screen.getByRole('dialog',{name:'Khởi nguyên đã sáng lại.'})).toBeVisible();expect(within(screen.getByRole('dialog')).getByRole('button',{name:'Sang phòng 2'})).toBeVisible();expect(document.querySelector('.celebration-frame')).toHaveClass('image-failed');
 });
 it('tải lại hoặc mở lại bản lưu hoàn thành không phát cảnh, giữ kết quả',()=>{
  seed();let view=render(<App/>);finish();const saved=localStorage.getItem(SAVE_KEY);view.unmount();view=render(<App/>);expect(screen.queryByRole('dialog')).not.toBeInTheDocument();expect(parse(localStorage.getItem(SAVE_KEY)!).rooms[1].completed).toHaveLength(4);expect(parse(saved!).rooms[1].completed).toEqual(parse(localStorage.getItem(SAVE_KEY)!).rooms[1].completed);expect(chapterSounds()).toHaveLength(1);view.unmount();
 });
});
