const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const q=document.getElementById("q"),list=document.getElementById("list"),box=document.getElementById("songs"),count=document.getElementById("count");
function card(s){return `<article id="${s.id}"><h2>${esc(s.title)}</h2><p><strong>Artist:</strong> ${esc(s.artist)}<br><strong>Credit:</strong> ${esc(s.credit)}</p>`+
(s.lyricsFijian?`<h3 lang="fj">Lyrics (Fijian)</h3><pre lang="fj">${esc(s.lyricsFijian)}</pre>`:`<p class="pending">${esc(s.status)}</p>`)+
(s.translationEnglish?`<h3>English translation</h3><pre>${esc(s.translationEnglish)}</pre>`:"")+
`<p><strong>Source:</strong> ${s.source?`<a href="${esc(s.source)}" rel="noopener">${esc(s.source)}</a>`:"none yet"}. ${esc(s.sourceNote)}</p></article>`}
function render(){const t=q.value.trim().toLowerCase();const r=SONGS.filter(s=>[s.title,s.artist,s.lyricsFijian,s.translationEnglish].join(" ").toLowerCase().includes(t));
count.textContent=`${r.length} song${r.length==1?"":"s"}`;list.innerHTML=r.map(s=>`<li><a href="#${s.id}">${esc(s.title)}</a></li>`).join("");box.innerHTML=r.map(card).join("")}
q.addEventListener("input",render);render();
