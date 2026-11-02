const fs = require('fs');
const html = fs.readFileSync('C:/gitrepo/D1/dom-dump.html', 'utf8');
const heroMatch = html.match(/<section[^>]*id="hero"[^>]*>([\s\S]*?)<\/section>/);
if (heroMatch) {
  console.log('Hero inner HTML:');
  // print tags and class names inside hero
  const tags = heroMatch[1].match(/<[a-z0-9]+[^>]*>/gi);
  console.log(tags.slice(0, 30).join('\n'));
} else {
  console.log('No hero found');
}

