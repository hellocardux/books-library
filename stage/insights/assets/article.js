
(function(){
"use strict";
const q=s=>document.querySelector(s),qa=s=>Array.from(document.querySelectorAll(s));
const parts=qa(".reading-section"), chapters=qa(".chapter-break");
const toc=q("#reader-toc"),mobile=q("#mobile-nav");
const partNames=["Executive summary","Capitolo per capitolo","Analisi trasversale","Modelli e glossario","Analisi critica","Memorizzazione","Strategia di studio"];
function link(id,title,cls){const a=document.createElement("a");a.href="#"+id;a.textContent=title;if(cls)a.className=cls;return a}
if(toc){parts.forEach((s,i)=>{toc.appendChild(link(s.id,(i+1)+". "+(partNames[i]||"Sezione")))});const hr=document.createElement("hr");hr.className="toc-divider";toc.appendChild(hr);chapters.forEach((s,i)=>toc.appendChild(link(s.id,"Cap. "+(i+1)+" · "+s.querySelector("h3").textContent,"toc-chapter")))}
if(mobile){parts.forEach((s,i)=>mobile.appendChild(link(s.id,(i+1)+". "+(partNames[i]||"Sezione"))));chapters.forEach((s,i)=>mobile.appendChild(link(s.id,"Capitolo "+(i+1))));mobile.addEventListener("click",e=>{if(e.target.closest("a")){const d=mobile.closest("details");if(d)d.open=false}})}
const progress=q("#reading-progress");
function update(){if(!progress)return;const max=document.documentElement.scrollHeight-innerHeight;const val=max>0?Math.min(1,Math.max(0,scrollY/max)):0;progress.style.transform="scaleX("+val+")"}
document.addEventListener("scroll",update,{passive:true});addEventListener("resize",update,{passive:true});update();
if("IntersectionObserver"in window&&toc){const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){qa("#reader-toc a").forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id))}})},{rootMargin:"-12% 0px -70% 0px"});parts.forEach(x=>io.observe(x))}
const print=q("#print-note");if(print)print.addEventListener("click",()=>window.print());
})();
