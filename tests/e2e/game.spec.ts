import {test,expect,type Page} from '@playwright/test';
import {startGuided,collectGuided,clickAction,objection} from './helpers';
import {paginateSubtitle} from '../../lib/game/guided';
import {bookCase} from '../../content/cases/buku-rusak';
async function inspectFrame(page:Page,label:string){
 const frame=page.getByRole('region',{name:'Panggung Cerita'});
 for(const width of [360,768,1440]){
  await page.setViewportSize({width,height:800});await page.screenshot({path:`test-results/${label}-${width}.png`,animations:'disabled'});
  expect(await frame.evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight;})).toBe(true);
  const choices=page.getByRole('radio');for(let i=0;i<await choices.count();i++){const box=await choices.nth(i).boundingBox();expect(box&&box.y>=0&&box.y+box.height<=800).toBeTruthy();}
 }
}
async function settings(page:Page){await page.getByRole('button',{name:'Menu Kasus'}).click();await page.getByRole('button',{name:'Pengaturan',exact:true}).click();}
test('full guided case, wrong evidence and decisions, reload, reflection and scoped reset',async({page})=>{
 await startGuided(page);await collectGuided(page);await page.reload();await clickAction(page,'Lanjutkan Cerita');await inspectFrame(page,'testimony');
 await objection(page,'Foto Rak Buku');await expect(page.getByRole('status')).toContainText('Foto membantu');
 await objection(page,'Keterangan Raka','Coba Bukti Lain');await clickAction(page,'Lanjutkan Cerita');await clickAction(page,'Tanya Lagi');await page.reload();
 await expect(page.getByRole('img',{name:'Rekonstruksi tumpahan berdasarkan keterangan Sari'})).toBeVisible();await clickAction(page,'Lanjutkan Cerita');await clickAction(page,'Susun Penyelesaian');
 await page.getByLabel('Bima harus bertanggung jawab karena ia peminjam terakhir.',{exact:true}).check();await inspectFrame(page,'decision');await clickAction(page,'Pilih Alasan');
 await page.getByLabel('Bukti menunjukkan buku terkena air setelah dikembalikan, tetapi belum menunjukkan siapa yang menjatuhkan botol.',{exact:true}).check();await inspectFrame(page,'decision-reasons');await clickAction(page,'Sampaikan Solusi');await expect(page.getByRole('status')).toContainText('Bima merasa');
 await clickAction(page,'Coba Solusi Lain');await page.getByLabel('Akui pelaku belum diketahui. Rawat buku bersama dengan bantuan guru dan pisahkan minuman dari rak.',{exact:true}).check();await clickAction(page,'Pilih Alasan');
 await page.getByLabel('Yang paling banyak dituduh pasti salah.',{exact:true}).check();await clickAction(page,'Sampaikan Solusi');await clickAction(page,'Coba Solusi Lain');
 await page.getByLabel('Akui pelaku belum diketahui. Rawat buku bersama dengan bantuan guru dan pisahkan minuman dari rak.',{exact:true}).check();await clickAction(page,'Pilih Alasan');await page.getByLabel('Bukti menunjukkan buku terkena air setelah dikembalikan, tetapi belum menunjukkan siapa yang menjatuhkan botol.',{exact:true}).check();await clickAction(page,'Sampaikan Solusi');
 await clickAction(page,'Mulai Refleksi');await inspectFrame(page,'reflection');
 await page.getByLabel('Dugaan menjadi fakta kalau banyak orang mengatakannya.',{exact:true}).check();await expect(page.getByRole('status')).toContainText('Mari pikirkan');
 await page.getByLabel('Fakta didukung pengamatan atau bukti; dugaan masih perlu diperiksa.',{exact:true}).check();await clickAction(page,'Pertanyaan Berikutnya');
 await page.getByLabel('Supaya informasi lebih lengkap dan setiap orang diperlakukan adil.',{exact:true}).check();await clickAction(page,'Pertanyaan Berikutnya');
 await page.getByLabel('Letakkan minuman jauh dari rak buku.',{exact:true}).check();await clickAction(page,'Catat Ide Kecilmu');await page.getByLabel('Catatan kecilmu (boleh dikosongkan)').fill('Aku akan menjaga buku bersama.');await clickAction(page,'Lihat Hasil Belajar');
 await expect(page.getByRole('heading',{name:'Keadilan dimulai dari mendengarkan.'})).toBeVisible();await expect(page.getByText('100 / 100',{exact:true})).toBeVisible();await inspectFrame(page,'result');
 await page.evaluate(()=>localStorage.setItem('unrelated','keep'));await settings(page);await page.getByLabel('Teks langsung tampil').uncheck();await page.getByRole('button',{name:'Mulai Ulang Kasus'}).click();await page.getByRole('button',{name:'Ya, Mulai Ulang'}).click();
 await expect(page.getByRole('heading',{name:'Sebelum menyimpulkan, dengarkan.'})).toBeVisible();expect(await page.evaluate(()=>localStorage.getItem('unrelated'))).toBe('keep');expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('justice-room:settings')!).instantText)).toBe(false);
});
test('keyboard evidence dialog traps focus and Escape returns to its trigger',async({page})=>{
 await startGuided(page);const trigger=page.getByRole('button',{name:'Berkas Bukti',exact:true});await trigger.focus();await page.keyboard.press('Enter');const dialog=page.getByRole('dialog',{name:'Berkas Bukti'});await expect(dialog).toBeVisible();
 for(let i=0;i<6;i++){await page.keyboard.press('Tab');expect(await dialog.evaluate(d=>d.contains(document.activeElement))).toBe(true);}
 await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
});
test('corrupt saves remain intact until confirmed reset and direct URLs cannot skip progress',async({page})=>{
 await page.goto('/');await page.evaluate(()=>localStorage.setItem('justice-room:save:buku-rusak','broken'));await page.goto('/kasus/buku-rusak?phase=result');await expect(page.getByText('Progres belum bisa dibuka.')).toBeVisible();expect(await page.evaluate(()=>localStorage.getItem('justice-room:save:buku-rusak'))).toBe('broken');
 await page.getByRole('button',{name:'Mulai Ulang Kasus'}).click();await page.getByRole('button',{name:'Batal',exact:true}).click();expect(await page.evaluate(()=>localStorage.getItem('justice-room:save:buku-rusak'))).toBe('broken');await page.getByRole('button',{name:'Mulai Ulang Kasus'}).click();await page.getByRole('button',{name:'Ya, Mulai Ulang'}).click();await expect(page.getByRole('heading',{name:'Sebelum menyimpulkan, dengarkan.'})).toBeVisible();
});
test('blocked storage keeps the guided case playable in memory',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError');}});});await startGuided(page);await expect(page.getByRole('alert').filter({hasText:'Penyimpanan browser'})).toBeVisible();await collectGuided(page);await clickAction(page,'Lanjutkan Cerita');await expect(page.getByRole('button',{name:'KEBERATAN!',exact:true})).toBeVisible();
});
test('inline evidence and reason choices work with keyboard in the same frame',async({page})=>{
 await startGuided(page);await collectGuided(page);await clickAction(page,'Lanjutkan Cerita');await clickAction(page,'KEBERATAN!');
 await expect(page.getByRole('dialog')).toHaveCount(0);const evidence=page.getByLabel('Keterangan Raka',{exact:true});await evidence.focus();await page.keyboard.press('Space');await expect(evidence).toBeChecked();await clickAction(page,'Pilih Alasan');
 const reason=page.getByLabel('Raka melihat buku kering saat dikembalikan pukul 09.00.',{exact:true});await reason.focus();await page.keyboard.press('Space');await expect(reason).toBeChecked();await page.getByRole('button',{name:'Ajukan Bukti',exact:true}).focus();await page.keyboard.press('Enter');await expect(page.getByRole('status')).toContainText('Raka');
});
test('motion and instant settings persist after reload',async({page})=>{
 await startGuided(page);await settings(page);await page.getByLabel('Kurangi gerakan').check();await page.getByLabel('Suara senyap').uncheck();await page.keyboard.press('Escape');await page.reload();await settings(page);await expect(page.getByLabel('Kurangi gerakan')).toBeChecked();await expect(page.getByLabel('Suara senyap')).not.toBeChecked();await expect(page.getByLabel('Teks langsung tampil')).toBeChecked();
});
test('animated subtitle can be revealed without moving to the next page',async({page})=>{
 await page.goto('/kasus/buku-rusak');await settings(page);await page.getByLabel('Teks langsung tampil').uncheck();await page.keyboard.press('Escape');await page.getByRole('button',{name:'Tampilkan Teks',exact:true}).click();
 const text=paginateSubtitle(bookCase.nodes[0].text)[0];await expect(page.getByText(text,{exact:true})).toBeVisible();await page.waitForTimeout(150);await expect(page.getByRole('button',{name:'Tampilkan Teks',exact:true})).toHaveCount(0);await expect(page.getByText(text,{exact:true})).toBeVisible();
});
