// Static production site: no bundler required. Run: node scripts/check-site.mjs
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const html=fs.readFileSync('index.html','utf8');
for(const f of ['js/main.js','js/data.js','js/media.js','js/particle-name.js','js/project-previews.js']) execFileSync(process.execPath,['--check',f]);
for(const file of ['index.html','js/data.js','js/main.js','js/media.js','css/styles.css','css/project-previews.css','js/particle-name.js','js/project-previews.js']) {
 const text=fs.readFileSync(file,'utf8');
 assert(!text.includes('images/pc-setup.webp'),`Old setup reference: ${file}`);
 for(const [,asset] of text.matchAll(/(?:src|href)=["']((?:images|fonts|css|js)\/[^"']+)["']/g)) assert(fs.existsSync(asset.split(/[?#]/)[0]),`Missing asset: ${asset}`);
 for(const [,asset] of text.matchAll(/src:\s*"(images\/[^"']+)"/g)) assert(fs.existsSync(asset.split(/[?#]/)[0]),`Missing case-study photo: ${asset}`);
}
assert.equal((html.match(/data-project=/g)||[]).length,14);
assert(!html.includes('portrait-stage'));
assert(!html.includes('images/asif.webp'));
assert(html.includes('data-count="3"'));
assert(html.indexOf('id="about"')<html.indexOf('id="achieve"'));
assert(html.indexOf('id="achieve"')<html.indexOf('id="projects"'));
for(const link of ['https://asif4517-git.github.io/neon-rush/','https://github.com/Asif4517-git/neon-rush','https://asif4517-git.github.io/overdrive/','https://github.com/Asif4517-git/overdrive']) assert(html.includes(`href="${link}" target="_blank" rel="noopener noreferrer"`));
assert(html.includes('PLAY LIVE'));assert(html.includes('VIEW SOURCE'));
console.log('PASS: JavaScript syntax, local media references, 14 cards, achievement order, portrait/setup removal, Neon Rush and OverDrive links.');
