// 1) Yazı efekti
const words = ['Endüstri Mühendisiyim', 'Yazılım Mühendisliği öğrencisiyim', 'Süreç iyileştirmeyi seviyorum'];
const typedEl = document.getElementById('typed');
let w = 0, c = 0, del = false;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
function type() {
  const word = words[w];
  if (reduce) { typedEl.textContent = words[0]; return; }
  typedEl.textContent = word.slice(0, c);
  if (!del && c < word.length) c++;
  else if (!del) { del = true; return setTimeout(type, 1600); }
  else if (c > 0) c--;
  else { del = false; w = (w + 1) % words.length; }
  setTimeout(type, del ? 35 : 75);
}
type();

// 2) Yan menü: hangi bölümdeyiz?
const links = [...document.querySelectorAll('.side a')];
const sections = links.map(a => document.querySelector(a.getAttribute('href')));
function spy() {
  const y = scrollY + innerHeight / 3;
  let cur = 0;
  sections.forEach((s, i) => { if (s.offsetTop <= y) cur = i; });
  links.forEach((a, i) => a.classList.toggle('active', i === cur));
  document.querySelector('.up').classList.toggle('show', scrollY > 400);
}
addEventListener('scroll', spy, { passive: true });
spy();

// 3) Beceri çubukları görününce dolsun
const skills = document.querySelector('.skills');
new IntersectionObserver((e, o) => {
  if (e[0].isIntersecting) { skills.classList.add('go'); o.disconnect(); }
}, { threshold: .3 }).observe(skills);

// 4) OEE hesaplayıcı: OEE = Kullanılabilirlik x Performans x Kalite
const C = 2 * Math.PI * 54;
const $ = id => document.getElementById(id);
function update() {
  const a = +$('ia').value, p = +$('ip').value, q = +$('iq').value;
  $('oa').textContent = a + '%'; $('op').textContent = p + '%'; $('oq').textContent = q + '%';
  const oee = (a / 100) * (p / 100) * (q / 100), pct = Math.round(oee * 100);
  $('oee-val').textContent = pct + '%';
  $('ring').style.strokeDashoffset = C * (1 - oee);
  const weakest = Object.entries({ 'Kullanılabilirlik': a, 'Performans': p, 'Kalite': q }).sort((x, y) => x[1] - y[1])[0][0];
  $('oee-note').textContent = pct >= 85
    ? 'Genellikle %85 ve üzeri dünya standardı kabul edilir.'
    : 'En çok kayıp "' + weakest + '" göstergesinde. İyileştirmeye buradan başlamak mantıklı.';
}
document.querySelectorAll('.sliders input').forEach(i => i.addEventListener('input', update));
update();
