# After Hours / Reading Notes — Stage

La collezione delle analisi approfondite vive **solo in `stage/insights/`**. La homepage in produzione (`/index.html`) e i file condivisi (`stage/app.js`, `stage/styles.css`, `stage/library-data.js`) non sono stati modificati.

## Pagine di anteprima
- Homepage After Hours: `/stage/`
- Indice Reading Notes: `/stage/insights/`
- Conversazioni cruciali: `/stage/insights/conversazioni-cruciali/`

Tutte le pagine nuove hanno `noindex,nofollow`.

## Convenzione per tutti i libri
1. Analizzare l'EPUB con la guida `Guida_Analisi_Libri_EPUB.md`; distinguere fonte, interpretazioni e esempi didattici.
2. Conservare l'analisi completa in `stage/insights/<slug>/analysis.md`; non includere laboratori personali salvo richiesta.
3. Aggiungere una voce in `stage/insights/catalog.json` con `slug`, `bookId`, `title`, `author`, `description`, `chapters`, `status`.
4. Generare la pagina HTML con il template del sito; riutilizzare `assets/article.css` e `assets/article.js` per tutte le pagine.
5. Validare integrità e qualità: tutti i capitoli presenti, ancore funzionanti, tabelle visibili su mobile, metadati, accessibilità, contenuti non duplicati, nessun materiale del libro riprodotto integralmente.
6. Solo dopo l'approvazione copiare le pagine da `/stage/insights/` a `/insights/`, aggiornare i link della homepage in produzione, e poi indicizzare se desiderato.

## Fonte unica del catalogo
`catalog.json` alimenta sia il pannello **Reading Notes** nella homepage stage sia il relativo indice, tramite `assets/catalog.js`. I collegamenti del libro in lettura sono ricavati automaticamente tramite `bookId`.

## Regole redazionali
- Nessun laboratorio personalizzato nel testo pubblico, salvo richiesta espressa.
- Rispettare la struttura dell'edizione EPUB realmente fornita, anche se cambia fra edizioni.
- Attribuire modelli e casi correttamente agli autori; separare sempre i commenti critici.
- Niente date di fine lettura e voti dedotti: il reading log resta invariato finché il lettore non li specifica.
- Markdown sorgente conservato per rigenerare pagina e versioni Kindle/PDF, senza pubblicare l'EPUB protetto.
- Tono editoriale informativo; template comune, colori copertina e grafica personalizzabili per libro.

## File aggiunti
- `catalog.json`: metadati dei libri con approfondimento
- `assets/article.css`: design editoriale e versione stampabile
- `assets/article.js`: indice, avanzamento, navigazione e stampa
- `assets/catalog.js`: schede generate dal catalogo
- `assets/preview-home.css`: integrazione esclusiva nella homepage stage
- `<slug>/analysis.md`: testo sorgente integrale
- `<slug>/index.html`: pagina di lettura statica

**Nota:** per la prima monografia abbiamo generato l'HTML a partire dal Markdown, conservando l'intera analisi eccetto la sezione dedicata al laboratorio.
## Interfaccia di collegamento alle analisi (stage)

- La homepage stage carica `stage/app-preview.js`, copia isolata del renderer: la produzione continua a usare `stage/app.js`.
- `catalog.js` passa le analisi disponibili al renderer tramite `window.CARDUX_STAGE_SET_INSIGHTS(items, prefix)`. La scheda della lettura in corso riceve il collegamento all'analisi; le card dei libri finiti mostrano un'azione **Approfondimento** accanto a **Dettagli**, soltanto per i titoli con una scheda nel catalogo.
- Le card hanno due controlli HTML separati (`button` per i dettagli e `a` per l'approfondimento), evitando link annidati nei pulsanti.
- Lo stato della lettura e le statistiche rimangono governati da `stage/library-data.js`. Non si deducono voti né date dal catalogo.
- I riferimenti tecnici al formato del file originale restano fuori dalle pagine destinate ai lettori.
