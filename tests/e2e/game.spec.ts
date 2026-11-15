import { test, expect, type Page } from '@playwright/test';
async function inspectWidths(page:Page,label:string){
 for(const width of [360,768,1440]){await page.setViewportSize({width,height:960});await page.screenshot({path:`test-results/${label}-${width}.png`,fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
}
async function start(page:Page){await page.goto('/kasus/buku-rusak');for(let i=0;i<4;i++)await page.getByRole('button',{name:'Lanjutkan',exact:true}).click();}
async function collect(page:Page){
 await page.getByRole('button',{name:'Periksa catatan peminjaman',exact:true}).first().click();
 await page.getByRole('button',{name:'Pojok Baca',exact:true}).click();
 await page.getByRole('button',{name:'Periksa buku yang basah',exact:true}).first().click();
 await page.getByRole('button',{name:'Minta foto rak kepada Sari',exact:true}).first().click();
 await page.getByRole('button',{name:'Koridor Kelas',exact:true}).click();
 await page.getByRole('button',{name:'Wawancarai Raka',exact:true}).first().click();
}
test('full case, mistakes, reload, reflection and scoped reset',async({page})=>{
 await start(page);await collect(page);await page.reload();
 await page.getByRole('button',{name:'Masuk Musyawarah'}).click();
 await page.getByRole('button',{name:'Pernyataan 2'}).click();await inspectWidths(page,'testimony');
 await page.getByRole('button',{name:'KEBERATAN!',exact:true}).click();await inspectWidths(page,'objection');
 await page.getByLabel('Foto Rak Buku').check();await page.getByLabel('Raka melihat buku kering saat dikembalikan pukul 09.00.',{exact:true}).check();
 await page.getByRole('button',{name:'Ajukan Bukti'}).click();await expect(page.getByRole('status')).toContainText('Foto membantu');
 await page.getByRole('button',{name:'KEBERATAN!',exact:true}).click();
 await page.getByLabel('Keterangan Raka',{exact:true}).check();await page.getByLabel('Raka melihat buku kering saat dikembalikan pukul 09.00.',{exact:true}).check();await page.getByRole('button',{name:'Ajukan Bukti'}).click();
 await page.getByRole('button',{name:'Pernyataan 3'}).click();await page.getByRole('button',{name:'Tanya Lagi',exact:true}).click();await page.reload();
 await expect(page.getByRole('button',{name:'Susun Penyelesaian'})).toBeEnabled();await page.getByRole('button',{name:'Susun Penyelesaian'}).click();await inspectWidths(page,'decision');
 await page.getByLabel('Bima harus bertanggung jawab karena ia peminjam terakhir.',{exact:true}).check();
 await page.getByLabel('Bukti menunjukkan buku terkena air setelah dikembalikan, tetapi belum menunjukkan siapa yang menjatuhkan botol.',{exact:true}).check();
 await page.getByRole('button',{name:'Sampaikan Solusi'}).click();await expect(page.getByRole('status')).toContainText('Bima merasa');
 await page.getByRole('button',{name:'Coba Solusi Lain'}).click();
 await page.getByLabel('Akui pelaku belum diketahui. Rawat buku bersama dengan bantuan guru dan pisahkan minuman dari rak.',{exact:true}).check();
 await page.getByLabel('Bukti menunjukkan buku terkena air setelah dikembalikan, tetapi belum menunjukkan siapa yang menjatuhkan botol.',{exact:true}).check();await page.getByRole('button',{name:'Sampaikan Solusi'}).click();
 await inspectWidths(page,'reflection');
 await page.getByRole('button',{name:'Fakta didukung pengamatan atau bukti; dugaan masih perlu diperiksa.',exact:true}).click();
 await page.getByRole('button',{name:'Supaya informasi lebih lengkap dan setiap orang diperlakukan adil.',exact:true}).click();
 await page.getByRole('button',{name:'Letakkan minuman jauh dari rak buku.',exact:true}).click();
 await page.getByLabel('Catatan kecilmu (boleh dikosongkan)').fill('Aku akan menjaga buku bersama.');
 await page.getByRole('button',{name:'Lihat Hasil Belajar'}).click();await expect(page.getByRole('heading',{name:'Keadilan dimulai dari mendengarkan.'})).toBeVisible();await expect(page.getByText('100 / 100',{exact:true})).toBeVisible();
 await inspectWidths(page,'result');
 await page.evaluate(()=>localStorage.setItem('unrelated','keep'));
 await page.getByRole('button',{name:'Pengaturan',exact:true}).click();await page.getByLabel('Teks langsung tampil').uncheck();await page.getByRole('button',{name:'Mulai Ulang Kasus'}).click();
 await page.getByRole('button',{name:'Ya, Mulai Ulang'}).click();await expect(page.getByRole('heading',{name:'Sebelum menyimpulkan, dengarkan.'})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('unrelated'))).toBe('keep');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('justice-room:settings')!).instantText)).toBe(false);
});
test('keyboard dialog focus, escape return and narrow layouts',async({page})=>{
 await start(page);
 const trigger=page.getByRole('button',{name:/Berkas Bukti/}).first();await trigger.focus();await page.keyboard.press('Enter');
 await expect(page.getByRole('dialog',{name:'Berkas Bukti'})).toBeVisible();await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
 for(const width of [360,768,1440]){
 await page.setViewportSize({width,height:960});await page.screenshot({path:`test-results/game-${width}.png`,fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.goto('/');await page.screenshot({path:`test-results/home-${width}.png`,fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.goto('/kasus/buku-rusak');
 }
});
test('corrupt saves are preserved until explicit reset; direct URLs cannot bypass phases',async({page})=>{
 await page.goto('/');await page.evaluate(()=>localStorage.setItem('justice-room:save:buku-rusak','broken'));
 await page.goto('/kasus/buku-rusak?phase=result');await expect(page.getByText('Progres belum bisa dibuka.')).toBeVisible();expect(await page.evaluate(()=>localStorage.getItem('justice-room:save:buku-rusak'))).toBe('broken');
 await page.getByRole('button',{name:'Mulai Ulang Kasus'}).click();await page.getByRole('button',{name:'Batal',exact:true}).click();expect(await page.evaluate(()=>localStorage.getItem('justice-room:save:buku-rusak'))).toBe('broken');
 await page.getByRole('button',{name:'Mulai Ulang Kasus'}).click();await page.getByRole('button',{name:'Ya, Mulai Ulang'}).click();await expect(page.getByRole('heading',{name:'Sebelum menyimpulkan, dengarkan.'})).toBeVisible();
});

test('unavailable storage stays playable in memory and displays a notice',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError');}});});
 await start(page);await expect(page.getByRole('alert').filter({hasText:'Penyimpanan browser'})).toContainText('Penyimpanan browser');await collect(page);await page.getByRole('button',{name:'Masuk Musyawarah'}).click();await expect(page.getByRole('button',{name:'Tanya Lagi',exact:true})).toBeVisible();
});
test('keyboard objection dialog traps focus and returns it on Escape',async({page})=>{
 await start(page);await collect(page);await page.getByRole('button',{name:'Masuk Musyawarah'}).click();
 const trigger=page.getByRole('button',{name:'KEBERATAN!',exact:true});await trigger.focus();await page.keyboard.press('Enter');
 const dialog=page.getByRole('dialog',{name:'Bukti dan Alasan'});await expect(dialog).toBeVisible();
 for(let i=0;i<14;i++){await page.keyboard.press('Tab');expect(await dialog.evaluate(d=>d.contains(document.activeElement))).toBe(true);}
 await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
});
test('reduced motion and instant text settings persist across reload',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await start(page);
 await page.getByRole('button',{name:'Pengaturan',exact:true}).click();await page.getByLabel('Kurangi gerakan').check();await page.getByLabel('Suara senyap').uncheck();await page.keyboard.press('Escape');await page.reload();
 await page.getByRole('button',{name:'Pengaturan',exact:true}).click();await expect(page.getByLabel('Kurangi gerakan')).toBeChecked();await expect(page.getByLabel('Suara senyap')).not.toBeChecked();await expect(page.getByLabel('Teks langsung tampil')).toBeChecked();
});

test('skipping animated dialogue keeps the full text visible and then advances once',async({page})=>{
 await page.goto('/kasus/buku-rusak');await page.getByRole('button',{name:'Pengaturan',exact:true}).click();await page.getByLabel('Teks langsung tampil').uncheck();await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Lanjutkan',exact:true}).click();
 const text=page.getByText('Buku kelas kita rusak. Sebelum menyimpulkan, mari dengarkan semua cerita. Di sini kita bermusyawarah untuk mencari penyelesaian yang adil.',{exact:true});
 await expect(text).toBeVisible();await expect(page.getByRole('button',{name:'Tampilkan Semua Teks'})).toHaveCount(0);await page.waitForTimeout(150);await expect(page.getByRole('button',{name:'Tampilkan Semua Teks'})).toHaveCount(0);
 await page.getByRole('button',{name:'Lanjutkan',exact:true}).click();await expect(page.getByText('Petugas pojok baca',{exact:true})).toBeVisible();
});
