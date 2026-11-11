# Reading Notes | Stage e generatore

La homepage pubblica non è modificata da questa pipeline. L'articolo pilota **Conversazioni cruciali** conserva la sua versione HTML già approvata: `--check` ne verifica titolo, capitoli e noindex. Per rigenerarlo dal template condiviso usare `--write --slug conversazioni-cruciali`, valutando prima il risultato sullo staging.

## Nuovo libro

1. Avvia una chat dedicata nel progetto **Book Partner**, analizza il testo e approva il contenuto.
2. Salva la guida completa in `stage/insights/<slug>/analysis.md`. Scrivi `# Titolo`, poi almeno due grandi sezioni `# I. ...` e `# II. ...`; per i capitoli numerati usa `## Capitolo N | Titolo`. Per narrativa adatta le sezioni al genere.
3. Aggiungi un elemento in `stage/insights/catalog.json` con `slug`, `bookId`, `title`, `author`, `description`, `chapters` e `status: "preview"`. Il `bookId` deve coincidere con `id` in `stage/library-data.js`.
4. Genera l'HTML e verifica il catalogo:

```bash
python -m pip install -r stage/insights/requirements.txt
python stage/insights/build.py --write --slug <slug>
python stage/insights/build.py --check
```

5. Controlla la pagina in staging, i collegamenti nelle card, indice, tabelle, leggibilità mobile e stampa. Richiedi sempre approvazione prima della produzione.

## Struttura

- `stage/insights/build.py`: generatore statico (Python 3.12+).
- `stage/insights/requirements.txt`: renderer Markdown con versione bloccata.
- `stage/insights/templates/article.html`: unico template di pagina.
- `stage/insights/assets/article.css`: design condiviso.
- `stage/insights/assets/article.js`: indice e navigazione dinamici.
- `stage/insights/catalog.json`: metadati e link delle analisi.
- `stage/insights/<slug>/analysis.md`: testo fonte.
- `stage/insights/<slug>/index.html`: pagina generata.

Il generatore valida conteggi, duplicati e riferimenti tecnici inopportuni. `--check` è utilizzato anche dalla GitHub Action di validazione.

## Collegamento ai libri

L'elenco degli approfondimenti deriva dal catalogo. `stage/app-preview.js` riceve `window.CARDUX_STAGE_SET_INSIGHTS(items,prefix)` da `stage/insights/assets/catalog.js`. L'azione **Approfondimento** compare solo se esiste la pagina relativa al `bookId`. Le date, i voti e lo stato di lettura restano in `stage/library-data.js`.

## Staging e produzione

- Homepage: https://hellocardux.github.io/books-library/stage/
- Indice: https://hellocardux.github.io/books-library/stage/insights/
- Libro: `https://hellocardux.github.io/books-library/stage/insights/<slug>/`

Le pagine stage usano `noindex,nofollow`, ma sono raggiungibili pubblicamente attraverso un link. La promozione in produzione richiede una conferma esplicita dell'utente e la verifica dei percorsi degli asset e dei link.

L'intero flusso, i prompt riutilizzabili e la checklist redazionale sono in [Workflow_Cardux_Books.md](../../Workflow_Cardux_Books.md) nella radice del repository.
