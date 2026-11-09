# Cardux Books | Stage (2026)

Due alternative visive per la stessa libreria, senza modificare `/index.html` (la pagina di produzione).

- **After Hours**: `/stage/`, versione scura e cinematografica.
- **Reading Room**: `/stage/reading-room.html`, versione chiara e più editoriale.

## Aggiornare le letture

**Modificare solo `stage/library-data.js`.** Entrambe le pagine si aggiornano da quel file.

### Aggiungere una lettura in corso

Inserire un elemento nell'array `reading`:

```js
{
  id: "nuovo-titolo",
  title: "Titolo del libro",
  author: "Autore",
  year: 2026,              // anno della prima pubblicazione dell'opera
  started: "2026-11-09",   // data effettiva, ISO YYYY-MM-DD
  cover: {bg:"#40594f",ink:"#fff4e5",accent:"#d9b78b",motif:"seal"}
}
```

Opzionali: `subtitle`, `editionLabel`, `sourceUrl`, `coverBy`.

### Segnare un libro come terminato

1. Spostare la scheda da `reading` a `finished`.
2. Aggiungere `finished: "2026-11-20"`.
3. Aggiungere `rating: 8.5` (voto in decimi).
4. Aggiornare `updated` con la data della modifica.

**Nessun conteggio manuale.** Numero di libri, giorni (inclusivi), media dei voti, media dei giorni, classifiche e grafici vengono calcolati automaticamente. Per le letture in corso non mostriamo una percentuale di avanzamento senza un valore reale.

### Cambiare colore o stile delle copertine

Ogni oggetto ha `cover` con tre colori HEX e un `motif`. Motivi disponibili:
`dialogue`, `seal`, `rings`, `asterisk`, `steps`, `lines`, `eye`.

Queste sono copertine tipografiche originali, non scansioni delle copertine degli editori.

## File

- `stage/library-data.js`: dati condivisi
- `stage/app.js`: calcoli, schede e grafici, da non modificare per aggiungere libri
- `stage/styles.css`: design di entrambe le versioni
- `stage/index.html`: After Hours
- `stage/reading-room.html`: Reading Room

Solo HTML, CSS e JavaScript. Nessun framework, database, build o servizio a pagamento richiesto. I dati restano nel repository pubblico.

Fonte bibliografica del titolo in lettura: https://www.roiedizioni.it/prodotto/libri/conversazioni-cruciali/
