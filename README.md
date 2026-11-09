# Cardux Books

Diario personale di lettura Kindle di Massimo Cardolicchio.

**Sito pubblico:** https://hellocardux.github.io/books-library/

## Versioni

- `index.html`: **After Hours**, pagina ufficiale.
- `stage/index.html`: After Hours in stage (noindex).
- `stage/reading-room.html`: concept alternativo Reading Room (noindex).
- `archive/2026-11-09/index.html`: versione originale conservata nell'archivio.

## Aggiornare i libri

**Modifica unicamente `stage/library-data.js`.** La homepage ufficiale e le due versioni stage leggono tutte questo file. Non serve modificare l'HTML o i grafici.

1. Per iniziare un libro, aggiungi un oggetto a `reading` con `id`, `title`, `author`, `year`, `started` (formato `YYYY-MM-DD`) e `cover`.
2. Quando lo concludi, sposta l'oggetto da `reading` a `finished`, aggiungendo `finished: "YYYY-MM-DD"` e `rating: 8.5`.
3. Aggiorna la data `updated`.

Il sito calcola automaticamente numero di libri, giorni inclusivi, medie, graduatorie e grafici. La durata della lettura in corso viene calcolata a partire dalla data iniziale.

Personalizza i colori e il motivo geometrico di ogni copertina tramite il campo `cover`. Le copertine sono composizioni originali e non riproducono immagini degli editori.

Per esempi e dettagli consulta [stage/README.md](stage/README.md).

## Struttura tecnica

HTML, CSS e JavaScript statico, senza database, abbonamenti o build. `stage/app.js` genera pagine e grafici; `stage/styles.css` contiene entrambi i temi e `stage/library-data.js` è l'unica fonte dei dati.
