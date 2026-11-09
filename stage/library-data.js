/* CARDUX BOOKS / SINGLE SOURCE OF TRUTH
   Edit this file to update BOTH stage designs. No build tools required.

   To finish a book: move its object from reading[] into finished[] and add
   finished: "YYYY-MM-DD" and rating: 8.5. Leave started unchanged.
   Reading-day counts, rankings and all statistics are calculated automatically.
   The "year" field refers to the original work's first publication.
   An editionLabel can specify the edition actually being read.
*/
window.CARDUX_BOOKS = {
  updated: "2026-11-09",
  reading: [
    {
      id: "conversazioni-cruciali",
      title: "Conversazioni cruciali",
      subtitle: "Strumenti per dialogare meglio quando la posta in gioco è alta",
      author: "Joseph Grenny, Kerry Patterson, Ron McMillan, Al Switzler, Emily Gregory",
      year: 2002,
      editionLabel: "ROI Edizioni · edizione italiana 2024",
      started: "2026-11-07",
      sourceUrl: "https://www.roiedizioni.it/prodotto/libri/conversazioni-cruciali/",
      cover: { bg:"#8e3c32", ink:"#fff4e6", accent:"#f3b18c", motif:"dialogue" }
    }
  ],
  finished: [
    {
      id: "cimitero-praga",
      title: "Il cimitero di Praga",
      author: "Umberto Eco",
      year: 2010,
      started: "2026-10-10",
      finished: "2026-10-17",
      rating: 8,
      cover: { bg:"#444b45", ink:"#f6eddb", accent:"#d4b786", motif:"seal" }
    },
    {
      id: "diversamente",
      title: "DiversaMente",
      author: "Immanuel Casto",
      year: 2025,
      started: "2026-10-18",
      finished: "2026-10-20",
      rating: 6,
      cover: { bg:"#b65b50", ink:"#fff3e8", accent:"#f2c19f", motif:"rings" }
    },
    {
      id: "sottile-arte",
      title: "La sottile arte di fare quello che cazzo ti pare",
      author: "Mark Manson",
      year: 2016,
      started: "2026-10-21",
      finished: "2026-10-24",
      rating: 6.5,
      cover: { bg:"#b89560", ink:"#262822", accent:"#efe0bb", motif:"asterisk" }
    },
    {
      id: "coraggio-provarci",
      title: "Il coraggio di provarci",
      author: "Cristina Scocchia & Francesca Gambarini",
      year: 2024,
      started: "2026-10-25",
      finished: "2026-10-25",
      rating: 6.5,
      cover: { bg:"#b3c0af", ink:"#253c35", accent:"#eaf0de", motif:"steps" }
    },
    {
      id: "effective-executive",
      title: "The Effective Executive (in inglese)",
      author: "Peter F. Drucker",
      year: 1967,
      started: "2026-10-25",
      finished: "2026-10-30",
      rating: 7.5,
      cover: { bg:"#263a4b", ink:"#f4eee0", accent:"#cead72", motif:"lines" }
    },
    {
      id: "1984",
      title: "1984",
      author: "George Orwell",
      year: 1949,
      started: "2026-10-31",
      finished: "2026-11-04",
      rating: 8.5,
      cover: { bg:"#c45140", ink:"#fff6e8", accent:"#492523", motif:"eye" }
    }
  ]
};
