import { chromium } from 'playwright';
import fs from 'node:fs';
fs.mkdirSync('capture-output', {recursive:true});
const browser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});
const report={url:'https://asif4517-git.github.io/neon-rush/',actions:[],errors:[]};
page.on('pageerror',e=>report.errors.push(e.message));
async function shot(name){await page.waitForTimeout(1300);await page.screenshot({path:`capture-output/${name}.png`,timeout:90000});report.actions.push({screenshot:name,text:(await page.locator('body').innerText()).slice(0,6000)});fs.writeFileSync('capture-output/report.json',JSON.stringify(report,null,2));}
async function click(pattern){const btn=page.getByRole('button',{name:pattern}).first();await btn.click({timeout:15000});}
try {
 await page.goto(report.url,{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(4000);await shot('01-menu');
 await click(/^garage$/i);await shot('02-garage');
 await click(/^circuits$/i);await shot('03-circuits');
 await click(/^race$/i);await page.waitForTimeout(6000);report.actions.push({action:'Race started, driving with real keyboard controls'});
 await page.keyboard.down('w');await page.waitForTimeout(2000);await page.keyboard.down('Shift');await page.waitForTimeout(700);await shot('05-driving-boost');
 await page.keyboard.up('Shift');await page.keyboard.down('a');await page.keyboard.down('Space');await page.waitForTimeout(500);await shot('06-driving-turn');
 await page.keyboard.up('Space');await page.keyboard.up('a');await page.keyboard.up('w');await page.keyboard.press('Escape');await shot('07-pause');
} catch(error) { report.errors.push(error.message); await shot('08-last-state'); console.log(error.message); } finally {fs.writeFileSync('capture-output/report.json',JSON.stringify(report,null,2));await browser.close();}
