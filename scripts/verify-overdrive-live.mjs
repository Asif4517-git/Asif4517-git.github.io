// Actual public-site verification after Pages deployment. Requires Playwright.
import { chromium } from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={url:'https://asif4517-git.github.io/',viewports:[]};
try {
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(`${report.url}?overdrive=${Date.now()}`,{waitUntil:'domcontentloaded',timeout:60000});assert(response.ok());
  const card=page.locator('[data-project="overdrive"]');await card.waitFor({timeout:30000});await card.scrollIntoViewIfNeeded();
  await card.locator('img').evaluate(i=>i.decode());
  assert.equal(await card.getByRole('link',{name:/PLAY LIVE/}).getAttribute('href'),'https://asif4517-git.github.io/overdrive/');
  assert.equal(await card.getByRole('link',{name:/VIEW SOURCE/}).getAttribute('href'),'https://github.com/Asif4517-git/overdrive');
  assert.equal(await page.locator('.project-card').count(),14);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0);
  await card.locator('[data-open="overdrive"]').click();assert.equal(await page.locator('#projectDialog .dgallery img').count(),5);
  const images=[];for(const img of await page.locator('#projectDialog .dgallery img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());images.push(await img.evaluate(i=>({url:i.src,width:i.naturalWidth})));}
  assert(images.every(i=>i.width>0));await page.keyboard.press('Escape');
  assert.equal(await page.locator('[data-project="neon"]').count(),1);assert.deepEqual(errors,[]);
  report.viewports.push({width,cards:14,gallery:images,links:'correct',overflow:0,errors});await page.close();
 }
 report.passed=true;fs.mkdirSync('capture-output',{recursive:true});fs.writeFileSync('capture-output/overdrive-live-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
