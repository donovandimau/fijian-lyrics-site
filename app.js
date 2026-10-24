const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const q=document.getElementById("q"),list=document.getElementById("list"),box=document.getElementById("songs"),count=document.getElementById("count");
function card(s){return `<article id="${s.id}"><h2>${esc(s.title)}</h2><p><strong>Artist:</strong> ${esc(s.artist)}${s.credit?`<br><strong>Credit:</strong> ${esc(s.credit)}`:""}</p>`+
(s.lyricsFijian?`<h3 lang="fj">Lyrics (Fijian)</h3><pre lang="fj">${esc(s.lyricsFijian)}</pre>`:"")+
(s.translationEnglish?`<h3>English translation</h3><pre>${esc(s.translationEnglish)}</pre>`:"")+
`<p><strong>Source:</strong> ${s.source?`<a href="${esc(s.source)}" rel="noopener">${esc(s.source)}</a>`:"none yet"}</p><p><a class="studio-link" href="studio.html?song=${encodeURIComponent(s.id)}">Create a lyric video</a></p></article>`}
function render(){const t=q.value.trim().toLowerCase();const r=SONGS.filter(s=>[s.title,s.artist,s.lyricsFijian,s.translationEnglish].join(" ").toLowerCase().includes(t));
count.textContent=`${r.length} song${r.length==1?"":"s"} with lyrics`;list.innerHTML=r.map(s=>`<li><a href="#${s.id}">${esc(s.title)}</a></li>`).join("");box.innerHTML=r.map(card).join("");
const catalogue=(window.CATALOGUE||[]).filter(s=>[s.title,s.artist,s.genre].join(' ').toLowerCase().includes(t));
document.getElementById('catalogue-count').textContent=`${catalogue.length} catalogue entr${catalogue.length===1?'y':'ies'}`;
document.getElementById('catalogue').innerHTML=catalogue.map(s=>`<article class="catalogue-card"><h3>${esc(s.title)}</h3><p>${esc(s.artist)}</p><p><a href="${esc(s.sourceUrl)}" target="_blank" rel="noopener">${esc(s.sourceName)}</a> · <a href="studio.html?song=${encodeURIComponent(s.title)}">Create video</a></p></article>`).join('')}
q.addEventListener("input",render);render();

