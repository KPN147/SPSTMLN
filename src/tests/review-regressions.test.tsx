import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../App';
import { Dialog } from '../components/Dialog';
import { puzzles } from '../data/puzzles';

describe('Hồi quy sau rà soát',()=>{
 afterEach(()=>{document.body.style.overflow='';});
 it('giữ khóa cuộn đến khi dialog cuối đóng, kể cả đóng dialog đầu trước',()=>{
  document.body.style.overflow='clip';
  const view=render(<><Dialog key="puzzle" title="Mật mã" onClose={()=>{}}>Câu đố</Dialog><Dialog key="codex" title="Sổ tay" onClose={()=>{}}>Kiến thức</Dialog></>);
  expect(document.body.style.overflow).toBe('hidden');
  view.rerender(<Dialog key="codex" title="Sổ tay" onClose={()=>{}}>Kiến thức</Dialog>);
  expect(document.body.style.overflow).toBe('hidden');
  view.unmount();
  expect(document.body.style.overflow).toBe('clip');
 });
 it('khôi phục cuộn khi rời trang có hai dialog đang mở',()=>{
  const view=render(<><Dialog title="Mật mã" onClose={()=>{}}>Câu đố</Dialog><Dialog title="Sổ tay" onClose={()=>{}}>Kiến thức</Dialog></>);
  expect(document.body.style.overflow).toBe('hidden');
  view.unmount();
  expect(document.body.style.overflow).toBe('');
 });
 it('các link điều hướng vẫn có tên khi nhãn chữ bị ẩn trên mobile',()=>{
  localStorage.clear();window.history.replaceState({},'','/');render(<App/>);
  const nav=within(screen.getByRole('navigation',{name:'Điều hướng chính'}));
  for(const name of ['Bản đồ','Sổ chung']){
   const link=nav.getByRole('link',{name});link.querySelector('span')!.style.display='none';
   expect(nav.getByRole('link',{name})).toHaveAccessibleName(name);
  }
 });
 it('điểm cần nhớ là hai ý hoàn chỉnh, không bị cắt tại tên viết tắt',()=>{
  for(const p of puzzles){expect(p.keyTakeaways).toHaveLength(2);for(const takeaway of p.keyTakeaways){expect(takeaway.length).toBeGreaterThan(35);expect(takeaway).not.toMatch(/\.\.|\bC\.$|^Tr\.$/);}}
  expect(puzzles.find(p=>p.id==='r1-p2')!.keyTakeaways[0]).toContain('Mác và Ăngghen');
  expect(puzzles.find(p=>p.id==='r3-p4')!.keyTakeaways[1]).toContain('tiếp thu, kế thừa');
 });
});
