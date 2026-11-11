
(async function(){
"use strict";
const box=document.querySelector("[data-insights-list]");
if(!box)return;
const catalogPath=box.getAttribute("data-catalog");
const prefix=box.getAttribute("data-prefix")||"./";
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
try{
 const res=await fetch(catalogPath,{cache:"no-store"});if(!res.ok)throw new Error("catalog");
 const catalog=await res.json(), items=(catalog.items||[]).filter(x=>x.status==="published");
 box.innerHTML=items.length?items.map((b,i)=>'<a class="note-card" href="'+esc(prefix+b.slug+'/')+'" aria-label="Leggi l’analisi di '+esc(b.title)+'"><div class="note-cover"><small>CARDUX / NOTES</small><strong>'+esc(b.title)+'</strong></div><div class="note-info"><span class="tag">'+esc(b.label||("READING NOTES / "+(i+1)))+'</span><h3>'+esc(b.title)+'</h3><p>'+esc(b.description||"")+'</p><div class="card-foot"><span>'+esc(b.chapters||"")+' capitoli</span><b>Esplora l’analisi ↗</b></div></div></a>').join(""):'<p class="empty-notes">Nessuna analisi disponibile.</p>';
 if(typeof window.CARDUX_PUBLIC_SET_INSIGHTS==="function") window.CARDUX_PUBLIC_SET_INSIGHTS(items,prefix);
 const reading=window.CARDUX_BOOKS&&window.CARDUX_BOOKS.reading&&window.CARDUX_BOOKS.reading[0];
 if(reading){
  const match=items.find(x=>x.bookId===reading.id),target=document.querySelector("#reading-panel .current-info");
  if(match&&target&&!target.querySelector(".stage-insight-link")){const a=document.createElement("a");a.className="stage-insight-link";a.href=prefix+match.slug+"/";a.textContent="Leggi l’approfondimento ↗";target.appendChild(a)}
 }
}catch(e){box.setAttribute("data-error","true")}
})();
