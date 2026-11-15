import {test,expect} from '@playwright/test';
import {startGuided,collectGuided,clickAction} from './helpers';
test('guided choices receive keyboard focus naturally when the step changes',async({page})=>{
 await startGuided(page);await collectGuided(page);await clickAction(page,'Lanjutkan Cerita');await clickAction(page,'KEBERATAN!');
 await expect(page.getByLabel('Catatan Peminjaman',{exact:true})).toBeFocused();
 await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');await expect(page.getByLabel('Keterangan Raka',{exact:true})).toBeChecked();
 await page.keyboard.press('Tab');await expect(page.getByRole('button',{name:'Pilih Alasan',exact:true})).toBeFocused();await page.keyboard.press('Enter');
 await expect(page.getByLabel('Raka melihat buku kering saat dikembalikan pukul 09.00.',{exact:true})).toBeFocused();
});
