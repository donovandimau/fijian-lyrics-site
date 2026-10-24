const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const q=document.getElementById("q"),list=document.getElementById("list"),box=document.getElementById("songs"),count=document.getElementById("count");
const pageSize=30;let cataloguePage=0;
document.getElementById('catalogue-overview').textContent=`${(window.CATALOGUE||[]).length} song entries and their sources. Add a recording and lyrics in the studio to create a video.`;
function card(s){return `<article id="${s.id}"><h2>${esc(s.title)}</h2><p><strong>Artist:</strong> ${esc(s.artist)}${s.credit?`<br><strong>Credit:</strong> ${esc(s.credit)}`:""}</p>`+
(s.lyricsFijian?`<h3 lang="fj">Lyrics (Fijian)</h3><pre lang="fj">${esc(s.lyricsFijian)}</pre>`:"")+
(s.translationEnglish?`<h3>English translation</h3><pre>${esc(s.translationEnglish)}</pre>`:"")+
`<p><strong>Source:</strong> ${s.source?`<a href="${esc(s.source)}" rel="noopener">${esc(s.source)}</a>`:"none yet"}</p><p><a class="studio-link" href="studio.html?song=${encodeURIComponent(s.id)}">Create a lyric video</a></p></article>`}
function render(){const t=q.value.trim().toLowerCase();const r=SONGS.filter(s=>[s.title,s.artist,s.lyricsFijian,s.translationEnglish].join(" ").toLowerCase().includes(t));
count.textContent=`${r.length} song${r.length==1?"":"s"} with lyrics`;list.innerHTML=r.map(s=>`<li><a href="#${s.id}">${esc(s.title)}</a></li>`).join("");box.innerHTML=r.map(card).join("");
const catalogue=(window.CATALOGUE||[]).filter(s=>[s.title,s.artist,s.genre].join(' ').toLowerCase().includes(t));
const pages=Math.max(1,Math.ceil(catalogue.length/pageSize));cataloguePage=Math.max(0,Math.min(cataloguePage,pages-1));
document.getElementById('catalogue-count').textContent=`${catalogue.length} catalogue entr${catalogue.length===1?'y':'ies'}`;
document.getElementById('catalogue-page').textContent=`Page ${cataloguePage+1} of ${pages}`;
document.getElementById('catalogue-previous').disabled=cataloguePage===0;
document.getElementById('catalogue-next').disabled=cataloguePage>=pages-1;
document.getElementById('catalogue').innerHTML=catalogue.slice(cataloguePage*pageSize,(cataloguePage+1)*pageSize).map(s=>`<article class="catalogue-card"><h3>${esc(s.title)}</h3><p>${esc(s.artist)}</p><p><a href="${esc(s.fijianUrl||s.sourceUrl)}" target="_blank" rel="noopener">${esc(s.sourceName)}</a>${s.recordingUrls?.[0]?` · <a href="${esc(s.recordingUrls[0])}" target="_blank" rel="noopener">Recording source</a>`:''} · <a href="studio.html?song=${encodeURIComponent(s.id)}">Create video</a></p></article>`).join('') || '<p>No catalogue entries match your search.</p>'}
q.addEventListener('input',()=>{cataloguePage=0;render()});
document.getElementById('catalogue-previous').addEventListener('click',()=>{cataloguePage--;render()});
document.getElementById('catalogue-next').addEventListener('click',()=>{cataloguePage++;render()});render();

