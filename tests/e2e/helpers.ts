import {expect,type Page} from '@playwright/test';
export async function advanceTo(page:Page,label:string){
 await expect(page.getByRole('region',{name:'Dialog Cerita'})).toBeVisible();
 for(let i=0;i<30;i++){
  const target=page.getByRole('button',{name:label,exact:true}).last();
  if(await target.isVisible()){await expect(target).toBeEnabled();return target;}
  const next=page.getByRole('button',{name:'Lanjutkan',exact:true});
  if(await next.isVisible()){await next.click();continue;}
  const reveal=page.getByRole('button',{name:'Tampilkan Teks',exact:true});
  if(await reveal.isVisible()){await reveal.click();continue;}
  await expect(target).toBeVisible();
 }
 throw Error(`Action not reached: ${label}`);
}
export async function clickAction(page:Page,label:string){await (await advanceTo(page,label)).click();}
export async function startGuided(page:Page){await page.goto('/kasus/buku-rusak');await clickAction(page,'Mulai Penyelidikan');}
export async function collectGuided(page:Page){
 for(const [i,label] of ['Periksa catatan peminjaman','Periksa buku yang basah','Minta foto rak kepada Sari','Wawancarai Raka'].entries()){
  await clickAction(page,label);await clickAction(page,i===3?'Masuk Musyawarah':'Petunjuk Berikutnya');
 }
}
export async function objection(page:Page,evidence='Keterangan Raka',openLabel='KEBERATAN!'){
 await clickAction(page,openLabel);await page.getByLabel(evidence,{exact:true}).check();await clickAction(page,'Pilih Alasan');
 await page.getByLabel('Raka melihat buku kering saat dikembalikan pukul 09.00.',{exact:true}).check();await clickAction(page,'Ajukan Bukti');
}
