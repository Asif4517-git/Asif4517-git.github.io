import { chromium } from 'playwright';
import fs from 'node:fs';
const out='capture-output/realshift';fs.mkdirSync(out,{recursive:true});
const report={url:'https://asif4517-git.github.io/RealShift/',actions:[],errors:[]};
const browser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1600,height:1000}});page.on('pageerror',e=>report.errors.push(e.message));
const save=()=>fs.writeFileSync(`${out}/report.json`,JSON.stringify(report,null,2));
async function shot(name){await page.waitForTimeout(1800);await page.screenshot({path:`${out}/${name}.png`,timeout:120000});report.actions.push({screenshot:name,text:(await page.locator('body').innerText()).slice(0,14000)});save();}
async function click(pattern){await page.getByRole('button',{name:pattern}).first().click({timeout:30000});}
try {
 await page.goto(report.url,{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(5000);await shot('01-dyno-bay');
 await click(/Start engine/i);await page.waitForTimeout(2000);
 await click(/^Bypass$/i);await click(/^Select gear 1$/i);await page.evaluate(()=>scrollTo(0,0));
 await page.keyboard.down('w');await page.waitForTimeout(1800);await shot('02-engine-running');await page.keyboard.up('w');
 await click(/^Arm dyno pull$/i);await page.keyboard.down('w');await page.waitForTimeout(3000);await page.keyboard.press('ArrowUp');await page.waitForTimeout(1500);await page.keyboard.up('w');
 // The bottom control ends/saves the run; this is a normal UI interaction.
 await click(/End.*save pull/i);await page.getByText('Live instrument cluster',{exact:true}).scrollIntoViewIfNeeded();await shot('03-instruments-and-dyno');
 await click(/^Cutaway$/i);await page.evaluate(()=>scrollTo(0,0));await shot('04-engine-cutaway');
 await click(/^Garage/i);await page.evaluate(()=>scrollTo(0,0));await shot('05-garage');
 await click(/^Data Log/i);await page.evaluate(()=>scrollTo(0,0));await shot('06-data-log');
} catch(error) {report.errors.push(error.message);await page.screenshot({path:`${out}/error-state.png`,timeout:120000}).catch(()=>{});}
finally {save();await browser.close();}
