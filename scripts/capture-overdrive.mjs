import { chromium } from 'playwright';
import fs from 'node:fs';
const out='capture-output/overdrive';fs.mkdirSync(out,{recursive:true});
const report={url:'https://asif4517-git.github.io/overdrive/',portfolio:{},actions:[],errors:[]};
const browser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1440,height:900}});
page.on('pageerror',e=>report.errors.push(e.message));
function save(){fs.writeFileSync(`${out}/report.json`,JSON.stringify(report,null,2));}
async function shot(name){await page.waitForTimeout(1800);await page.screenshot({path:`${out}/${name}.png`,timeout:120000});report.actions.push({screenshot:name,text:(await page.locator('body').innerText()).slice(0,7000)});save();}
async function click(re){await page.getByRole('button',{name:re}).first().click({timeout:30000});}
try {
 await page.goto('https://asif4517-git.github.io/',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(4000);
 await page.locator('[data-project="neon"]').scrollIntoViewIfNeeded();await page.waitForTimeout(1200);
 report.portfolio=await page.locator('[data-project="neon"]').evaluate(el=>{const c=getComputedStyle(el),h=getComputedStyle(el.querySelector('h3'));return {class:el.className,cardBackground:c.backgroundColor,cardRadius:c.borderRadius,titleFont:h.fontFamily,titleColor:h.color,transition:c.transition,html:el.outerHTML}});
 await page.screenshot({path:`${out}/portfolio-before-desktop.png`});
 await page.locator('[data-open="neon"]').click();report.portfolio.galleryCount=await page.locator('#projectDialog .dgallery img').count();await page.keyboard.press('Escape');
 await page.setViewportSize({width:390,height:844});await page.locator('[data-project="neon"]').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/portfolio-before-mobile.png`});
 await page.setViewportSize({width:1440,height:810});
 await page.goto(report.url,{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(5000);await shot('01-menu');
 await click(/^Garage$/i);await page.waitForTimeout(2000);
 const car=page.locator('.car-card').filter({hasText:'M3 Competition'}).first();if(await car.count())await car.click();await shot('02-garage');
 await click(/^Circuits$/i);await shot('03-circuits');
 // Use the configured circuit through the real UI, not debug state.
 await page.setViewportSize({width:1280,height:720});await click(/^Start event$/i);
 await page.waitForFunction(()=>window.__OVERDRIVE__?.phase==='racing',{},{timeout:120000});
 await page.keyboard.down('w');await page.waitForTimeout(2500);await shot('04-circuit-driving');await page.keyboard.up('w');
 await page.keyboard.press('c');await shot('05-camera-view');
 // Return via a normal navigation reload, choose a different road in the UI.
 await page.goto(report.url,{waitUntil:'domcontentloaded'});await page.waitForTimeout(2500);await click(/^Circuits$/i);
 const hill=page.locator('.track-card').filter({hasText:'Munnar Hillclimb'});await hill.getByRole('button',{name:/^Select$/i}).click();
 await click(/^Start event$/i);await page.waitForFunction(()=>window.__OVERDRIVE__?.phase==='racing',{},{timeout:120000});
 await page.keyboard.down('w');await page.waitForTimeout(2200);await shot('06-munnar-driving');await page.keyboard.up('w');
 await page.keyboard.down('d');await page.keyboard.down('w');await page.waitForTimeout(450);await page.keyboard.up('d');await shot('07-munnar-road');await page.keyboard.up('w');
} catch(error){report.errors.push(error.message);await page.screenshot({path:`${out}/error-state.png`,timeout:120000}).catch(()=>{});}
finally {save();await browser.close();}
