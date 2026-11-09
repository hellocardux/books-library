/* Shared renderer for both Cardux Books stage concepts.
   All reading records live in library-data.js. */
(() => {
  "use strict";
  const data = window.CARDUX_BOOKS;
  const $ = (id) => document.getElementById(id);
  if (!data || !Array.isArray(data.finished) || !Array.isArray(data.reading)) {
    document.body.insertAdjacentHTML("afterbegin", '<p role="alert" style="padding:24px">Impossibile caricare il diario di lettura.</p>');
    return;
  }
  const escape = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const dayMillis = 86400000;
  const utcDay = (iso) => {
    const [y,m,d] = String(iso).split("-").map(Number);
    return Date.UTC(y,m-1,d);
  };
  const todayISO = () => {
    const d = new Date();
    return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
  };
  const inclusiveDays = (start,end) => Math.max(1, Math.round((utcDay(end || todayISO()) - utcDay(start))/dayMillis)+1);
  const date = (iso,year=false) => new Intl.DateTimeFormat("it-IT",{day:"numeric",month:"long",...(year?{year:"numeric"}:{}),timeZone:"UTC"}).format(new Date(utcDay(iso)));
  const num = (n,digits=1) => new Intl.NumberFormat("it-IT",{minimumFractionDigits:0,maximumFractionDigits:digits}).format(n);
  const shortAuthor = (book) => book.coverBy || (book.author.length>48?book.author.split(",")[0]+" e altri":book.author);
  const complete = data.finished;
  const current = data.reading;
  const totalDays = complete.reduce((sum,b)=>sum+inclusiveDays(b.started,b.finished),0);
  const meanRating = complete.length?complete.reduce((sum,b)=>sum+b.rating,0)/complete.length:0;
  const averageDays = complete.length?totalDays/complete.length:0;
  const cardTitle = (title) => title.replace(/\s+\(in inglese\)$/,"");
  function cover(book,kind="") {
    const c = book.cover || {bg:"#484b42",ink:"#f4eedf",accent:"#bd9671",motif:"seal"};
    const sizeClass = cardTitle(book.title).length>35 ? " long-title" : "";
    const alias = shortAuthor(book);
    return '<div class="book-cover motif-'+escape(c.motif)+' '+escape(kind)+sizeClass+'" style="--cover-bg:'+escape(c.bg)+';--cover-ink:'+escape(c.ink)+';--cover-accent:'+escape(c.accent)+'" aria-hidden="true">'
      +'<span class="cover-topline">CARDUX / READING LOG</span>'
      +'<span class="cover-symbol"></span>'
      +'<span class="cover-title">'+escape(cardTitle(book.title))+'</span>'
      +'<span class="cover-author">'+escape(alias)+'</span>'
      +'<span class="cover-side">C · B</span>'
      +'</div>';
  }
  function readingPanel(book) {
    if (!book) return '<div class="reading-empty"><span class="eyebrow">IN LETTURA</span><h3>Il prossimo capitolo deve ancora arrivare.</h3><p>Nessun titolo in lettura al momento.</p></div>';
    const days = inclusiveDays(book.started);
    const authors=escape(book.author);
    const extra=book.editionLabel?'<p class="edition">'+escape(book.editionLabel)+'</p>':"";
    const source=book.sourceUrl?'<a class="source-link" href="'+escape(book.sourceUrl)+'" target="_blank" rel="noopener noreferrer">Scheda del libro <span aria-hidden="true">↗</span></a>':"";
    return '<div class="current-layout"><div class="current-cover">'+cover(book,"cover-current")+'</div>'
      +'<div class="current-info"><div class="current-status"><span class="status-dot"></span> IN LETTURA / KINDLE</div>'
      +'<h3>'+escape(book.title)+'</h3>'
      +(book.subtitle?'<p class="current-subtitle">'+escape(book.subtitle)+'</p>':"")
      +'<p class="current-author">'+authors+'</p>'+extra
      +'<div class="reading-since"><span>INIZIATO IL</span><strong>'+date(book.started,true)+'</strong><small>'+days+' '+(days===1?"giorno":"giorni")+' dall’inizio</small></div>'
      +source+'</div></div>';
  }
  function finishedCard(book) {
    const days = inclusiveDays(book.started,book.finished);
    const title = escape(book.title);
    return '<button type="button" class="book-card" data-book="'+escape(book.id)+'" aria-label="Dettagli di '+title+'">'
      +'<span class="book-art">'+cover(book,"cover-small")+'</span>'
      +'<span class="book-info">'
      +'<span class="book-meta">'+escape(book.year)+' <span aria-hidden="true">·</span> '+days+' '+(days===1?"giorno":"giorni")+'</span>'
      +'<strong class="book-title">'+title+'</strong>'
      +'<span class="book-author">'+escape(book.author)+'</span>'
      +'<span class="book-end"><span>VOTO <strong>'+num(book.rating)+'/10</strong></span><span class="book-more">DETTAGLI ↗</span></span>'
      +'</span></button>';
  }
  function barChart(bookList,getValue,maxValue,suffix) {
    if(!bookList.length) return '<p class="empty">Nessun dato disponibile.</p>';
    return bookList.map((book,i)=>{
      const val=getValue(book);
      const width=Math.max(2,Math.min(100,(val/maxValue)*100));
      return '<div class="bar-row"><span class="bar-index">'+String(i+1).padStart(2,"0")+'</span>'
        +'<span class="bar-name" title="'+escape(book.title)+'">'+escape(book.title)+'</span>'
        +'<span class="bar-track"><span class="bar-fill" style="width:'+width+'%"></span></span>'
        +'<strong class="bar-value">'+num(val)+' '+suffix(val)+'</strong></div>';
    }).join("");
  }
  function renderModal(book) {
    const dialog = $("book-dialog");
    if(!dialog) return;
    $("modal-cover").innerHTML=cover(book,"cover-modal");
    $("modal-eyebrow").textContent="LETTURA COMPLETATA / "+book.finished.slice(0,4);
    $("modal-title").textContent=book.title;
    $("modal-author").textContent=book.author;
    $("modal-details").innerHTML='<div><span>PRIMA PUBBLICAZIONE</span><strong>'+escape(book.year)+'</strong></div>'
      +'<div><span>INIZIO</span><strong>'+date(book.started,true)+'</strong></div>'
      +'<div><span>FINE</span><strong>'+date(book.finished,true)+'</strong></div>'
      +'<div><span>DURATA</span><strong>'+inclusiveDays(book.started,book.finished)+' giorni</strong></div>'
      +'<div><span>VOTO</span><strong>'+num(book.rating)+' / 10</strong></div>';
    if(typeof dialog.showModal==="function") dialog.showModal();
  }
  function renderFinished(order="recent") {
    const books=complete.slice();
    if(order==="rating") books.sort((a,b)=>b.rating-a.rating||b.finished.localeCompare(a.finished));
    else if(order==="duration") books.sort((a,b)=>inclusiveDays(a.started,a.finished)-inclusiveDays(b.started,b.finished)||b.finished.localeCompare(a.finished));
    else books.sort((a,b)=>b.finished.localeCompare(a.finished));
    $("book-grid").innerHTML=books.map(finishedCard).join("");
    $("book-grid").querySelectorAll("[data-book]").forEach(btn=>btn.addEventListener("click",()=>renderModal(complete.find(b=>b.id===btn.dataset.book))));
  }
  function render() {
    $("stat-books").textContent=String(complete.length).padStart(2,"0");
    $("stat-days").textContent=String(totalDays).padStart(2,"0");
    $("stat-rating").textContent=complete.length?num(meanRating,2):"—";
    $("stat-pace").textContent=complete.length?num(averageDays,1):"—";
    $("count-books").textContent=String(complete.length).padStart(2,"0");
    $("reading-panel").innerHTML=readingPanel(current[0]);
    const readingExtra=$("reading-extra");
    if(readingExtra) readingExtra.textContent=current.length>1?"Altri "+(current.length-1)+" libri in lettura":'';
    $("rating-chart").innerHTML=barChart(complete.slice().sort((a,b)=>b.rating-a.rating),b=>b.rating,10,()=>"/ 10");
    const maxDays=Math.max(1,...complete.map(b=>inclusiveDays(b.started,b.finished)));
    $("duration-chart").innerHTML=barChart(complete.slice().sort((a,b)=>b.finished.localeCompare(a.finished)),b=>inclusiveDays(b.started,b.finished),maxDays,n=>n===1?"giorno":"giorni");
    $("last-update").textContent="Aggiornato il "+date(data.updated,true);
    $("year").textContent=new Date().getFullYear();
    renderFinished();
    document.querySelectorAll("[data-sort]").forEach((btn)=>btn.addEventListener("click",()=>{
      document.querySelectorAll("[data-sort]").forEach(x=>x.setAttribute("aria-pressed",String(x===btn)));
      renderFinished(btn.dataset.sort);
    }));
    const dialog=$("book-dialog");
    if(dialog) {
      dialog.addEventListener("click",(e)=>{if(e.target===dialog)dialog.close();});
    }
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",render,{once:true});
  else render();
})();
