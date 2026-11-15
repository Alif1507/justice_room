import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'./tests/e2e',timeout:60000,fullyParallel:false,workers:1,
 use:{baseURL:'http://127.0.0.1:3000',headless:true,launchOptions:{executablePath:process.env.CHROME_PATH||(process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':undefined),args:['--no-sandbox']}},
 webServer:{command:'npm run dev',url:'http://127.0.0.1:3000',reuseExistingServer:true,timeout:120000}
});
