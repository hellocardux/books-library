# Cardux Books | Workflow editoriale e tecnico

**Versione:** 1.0 · **Data:** 11 novembre 2026 · **Repository:** `hellocardux/books-library` · **Sito:** https://hellocardux.github.io/books-library/

## 1. Obiettivo

Creare un archivio personale di letture e approfondimenti. Ogni libro ha una chat dedicata in **Book Partner**, un'analisi di studio in Markdown e, se approvata, una pagina **Reading Notes** collegata alla sua scheda in **After Hours**. Staging e produzione restano distinti.

### Ruoli dei documenti

- **`Guida_Analisi_Libri_EPUB.md`**: stabilisce metodo, fedeltà e profondità dell'analisi del testo.
- **Questo workflow**: stabilisce preparazione, revisione, pubblicazione, controllo qualità e manutenzione della pagina web.
- **`stage/insights/README.md` nel repository**: fornisce i comandi tecnici e la struttura effettiva dei file.

In caso di conflitto, il metodo di analisi governa il contenuto; il workflow governa pubblicazione, stati e repository.

## 2. Regola organizzativa: una chat per libro

1. Avvia una nuova chat nel progetto **Book Partner** per ogni libro. Titolo consigliato: `Autore | Titolo`.
2. Usa la stessa chat per l'analisi, le correzioni e la pubblicazione di *quel* libro. Non occorre allegare nuovamente il libro se già disponibile nel progetto e accessibile.
3. Tieni una chat separata, `Cardux Books | Regia editoriale`, per il design del sito, il template, le funzionalità e le decisioni trasversali.
4. Non presupporre che le decisioni di una chat siano automaticamente presenti nell'altra: il workflow e il repository restano i riferimenti persistenti.

## 3. Le cinque fasi

### Fase A | Analisi

**Input:** testo del libro accessibile e richiesta dell'utente. Applicare `Guida_Analisi_Libri_EPUB.md`: ricostruire indice, executive summary, dieci idee (se adatte al genere), capitoli disponibili, analisi trasversale, modelli realmente presenti, critica e ripasso. Per narrativa: struttura adattata a personaggi, temi e spoiler. Non attribuire all'autore esempi creati dal modello.

**Output:** guida completa in `.md`. Non inserire *laboratori pratici personalizzati* nella versione pubblica, salvo richiesta esplicita. Distinguere osservazioni dell'autore, interpretazioni, esempi originali e applicazioni didattiche. Evitare riferimenti tecnici al formato del file nelle pagine destinate ai lettori.

### Fase B | Revisione editoriale

Controllare la presenza di tutti i capitoli accessibili, terminologia, fedeltà, nomi, titolo ed edizione. Verificare copyright: pubblicare sintesi e interpretazioni originali, non il testo integrale o lunghi brani del libro. Se l'utente non ha concluso un romanzo, limitarsi al punto letto ed evitare spoiler.

### Fase C | Preparazione dei dati

Nel repository, controllare che il libro esista in `stage/library-data.js`, nella lista `reading` oppure `finished`. Il campo **`id`** è la chiave di associazione, non deve cambiare senza migrazione.

Per la nuova analisi, creare:

- `stage/insights/<slug>/analysis.md`: contenuto completo, strutturato in Markdown.
- Un elemento in `stage/insights/catalog.json`: `slug`, `bookId` uguale all'`id` della libreria, `title`, `author`, `description`, `chapters`, `status: "preview"` e facoltativamente `subtitle`, `editionLabel`, `field`, `heroLead`, `heroEmphasis`, `coverLines`, `coverTagline`, `framework`, `metrics`.

**Importante:** `catalog.json` è l'unica fonte degli approfondimenti; `library-data.js` rimane la fonte delle letture, dei voti e delle date. Non inventare date o valutazioni.

### Fase D | Generazione e staging

Lanciare (locale o in ambiente di sviluppo):

```bash
python -m pip install -r stage/insights/requirements.txt
python stage/insights/build.py --write --slug <slug>
python stage/insights/build.py --check
```

Il generatore produce HTML statico tramite il template `stage/insights/templates/article.html`, gli stili e gli script condivisi. Aggiornare in GitHub soltanto i file di stage, il catalogo e la guida. Non modificare la homepage pubblica in questa fase.

Anteprime:

- Homepage: `https://hellocardux.github.io/books-library/stage/`
- Indice: `https://hellocardux.github.io/books-library/stage/insights/`
- Articolo: `https://hellocardux.github.io/books-library/stage/insights/<slug>/`

Le pagine di stage usano `noindex,nofollow`. **Staging non significa accesso privato**: i link possono essere visitati da chi li conosce.

### Fase E | Approvazione e produzione

L'utente approva esplicitamente la pagina. Solo dopo si copiano le risorse nell'area di produzione e si aggiornano i link della homepage ufficiale. Si confermano prima i percorsi relativi degli asset, i collegamenti dai libri in lettura e finiti, l'indice e la navigazione. Se il contenuto deve essere indicizzabile, cambiare il `noindex` solo sulla versione pubblica. Non pubblicare in produzione sulla base di una generica approvazione dell'analisi.

## 4. Regole di design e struttura dei documenti

- Riutilizzare layout, tipografia, colori e componenti di **After Hours / Reading Notes**. Consentire variazioni della copertina e delle evidenze visive per singolo libro.
- Conservare una homepage e un indice leggibili; la pagina del libro ha hero editoriale, indice, contenuto, conclusioni e stampa.
- Usare **intestazioni Markdown `#` per le grandi parti** e **`## Capitolo N | Titolo`** per i capitoli numerati (consigliato per saggistica). Per narrativa, adattare lo schema e i metadati al genere, senza inventare parti non presenti.
- Navigazione e capitoli devono derivare dal contenuto, non da elenchi hardcoded.
- Il CTA **Approfondimento** nella card appare solo se `bookId` è presente nel catalogo; lo stesso vale per la scheda del libro sul comodino.
- Conservare `analysis.md` come sorgente. Non trattare l'HTML renderizzato come testo principale da correggere a mano.

## 5. Checklist di validazione

- [ ] Tutti i capitoli disponibili nel testo sono presenti e corretti.
- [ ] Le affermazioni del libro sono distinte dalle interpretazioni.
- [ ] Non sono presenti laboratori personalizzati non richiesti né lunghi brani protetti.
- [ ] Titolo, autori, edizione e metadati sono corretti.
- [ ] `bookId` corrisponde alla scheda in `library-data.js`.
- [ ] Il generatore termina senza errori e `--check` ha esito positivo.
- [ ] Il numero di capitoli in `catalog.json` corrisponde al contenuto.
- [ ] Indice, collegamenti, pulsanti e eventuali diagrammi funzionano.
- [ ] Desktop, mobile, leggibilità, contrasto, stampa e navigazione tastiera sono controllati.
- [ ] Staging usa `noindex`; produzione non è stata toccata prima dell'approvazione.
- [ ] Il link **Approfondimento** appare solo nei libri per cui la pagina esiste.

## 6. Prompt riutilizzabili

### Nuova analisi

> Analizza `[Titolo]` seguendo la Guida_Analisi_Libri_EPUB.md e il Workflow_Cardux_Books.md del progetto. Prepara una guida di studio fedele e completa, adatta al genere, senza laboratorio personalizzato. Mantieni separate le idee dell'autore dalle tue interpretazioni. Non procedere ancora alla pubblicazione.

### Nuova pagina in staging

> Considera approvata l'analisi di `[Titolo]`. Crea la pagina Reading Notes in **staging** nel repository `hellocardux/books-library` usando catalogo, template e generatore standard. Associa la pagina al `bookId` del libro nella libreria e verifica i collegamenti. Non modificare la produzione. Dammi i link alla homepage staging, all'indice e alla pagina del libro.

### Pubblicazione

> Approvo l'anteprima Reading Notes di `[Titolo]`. Pubblica solo questa pagina e i collegamenti necessari in produzione, preservando il resto della homepage. Verifica gli URL e indicami il commit GitHub. Non modificare voto, date o stato di lettura senza miei dati espliciti.

## 7. Libri già conclusi

Per un libro nell'array `finished`, conserva `started`, `finished` e `rating`. Prepara l'analisi nella sua chat dedicata, genera la pagina e associa `bookId` allo stesso `id`. Il link appare nella card vicino a **Dettagli** quando esiste una pagina di approfondimento. Non spostare il libro tra gli stati per pubblicare un'analisi.

## 8. Manutenzione, versioni e rollback

Aggiorna il Markdown, quindi rigenera l'HTML. Crea commit con messaggi espliciti. In caso di errore, ripristina il commit precedente della pagina interessata. Non eliminare le analisi passate per ricostruire il sito. Durante la fase pilota, tutte le modifiche rimangono nello staging fino a conferma.

**Comando operativo di riferimento:** una chat per libro, una fonte Markdown, una pagina stage, una validazione esplicita e una pubblicazione controllata.
