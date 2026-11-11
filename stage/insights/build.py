#!/usr/bin/env python3
"""Build Cardux Reading Notes in staging from Markdown and a shared HTML template.

Setup: python -m pip install -r stage/insights/requirements.txt
Build: python stage/insights/build.py --write
Check: python stage/insights/build.py --check

Production is deliberately outside the scope of this command.
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
import unicodedata
from pathlib import Path

try:
    import mistune
except ImportError:
    raise SystemExit("Dipendenza mancante: python -m pip install -r stage/insights/requirements.txt")

BASE = Path(__file__).resolve().parent
TEMPLATE = BASE / "templates" / "article.html"
CATALOG = BASE / "catalog.json"
HEADING_RE = re.compile(r"<h([1-4])>(.*?)</h\1>", re.S)
CHAPTER_RE = re.compile(r"^Capitolo\s+(\d+)\s*[|:–-]\s*(.+)$", re.I)
MARKDOWN = mistune.create_markdown(escape=True, plugins=["table", "strikethrough", "url"])
RESERVED = {".", "..", "assets", "templates"}


def plain(text: str) -> str:
    return re.sub(r"<[^>]*>", "", html.unescape(text)).strip()


def slugify(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text.lower())
    normalized = "".join(x for x in normalized if not unicodedata.combining(x))
    return re.sub(r"\s+", "-", re.sub(r"[^a-z0-9 ]", "", normalized).strip()) or "section"


def escape(value: object) -> str:
    return html.escape(str(value), quote=True)


def safe_markdown(source: str) -> str:
    return MARKDOWN(source)


def split_intro(source: str) -> tuple[str, str]:
    # The opening H1 identifies the book. The first later H1 begins the actual guide.
    candidates = list(re.finditer(r"^#\s+(.+)$", source, re.M))
    if len(candidates) < 3:
        raise ValueError("Usare: # Titolo, poi almeno due sezioni di livello #")
    return source[:candidates[1].start()].strip(), source[candidates[1].start():].strip()


def render_sections(markdown: str) -> tuple[str, list[dict], list[dict]]:
    raw = safe_markdown(markdown)
    cursor, part_number, section_open = 0, 0, False
    chunks, sections, chapters = [], [], []
    used_ids: set[str] = set()

    def id_unique(base: str) -> str:
        name = base
        i = 2
        while name in used_ids:
            name = f"{base}-{i}"
            i += 1
        used_ids.add(name)
        return name

    for m in HEADING_RE.finditer(raw):
        chunks.append(raw[cursor:m.start()])
        level, inner = int(m.group(1)), m.group(2)
        title = plain(inner)
        if level == 1:
            if section_open:
                chunks.append("</div></section>\n")
            section_open = True
            part_number += 1
            section_id = id_unique(slugify(re.sub(r"^(?:[IVXLCDM]+|\d+)\.\s*", "", title, flags=re.I)))
            sections.append({"id": section_id, "title": title})
            chunks.append(f'<section class="reading-section" id="{section_id}">'
                          f'<header class="chapter-section-header"><span class="kicker">'
                          f'PART / {part_number:02d}</span><h2>{inner}</h2></header>'
                          '<div class="reading-prose">\n')
        elif level == 2 and (chapter := CHAPTER_RE.match(title)):
            number, name = chapter.groups()
            chapter_id = id_unique(f"capitolo-{int(number)}")
            chapters.append({"id": chapter_id, "title": name, "number": int(number)})
            chunks.append(f'<div class="chapter-break" id="{chapter_id}">'
                          f'<div class="chapter-index">CAPITOLO / {int(number):02d}</div>'
                          f'<h3>{escape(name)}</h3></div>')
        else:
            target = min(5, level + 1)
            hid = id_unique(slugify(title))
            chunks.append(f'<h{target} id="{hid}">{inner}</h{target}>')
        cursor = m.end()
    chunks.append(raw[cursor:])
    if section_open:
        chunks.append("</div></section>")
    if len(sections) < 2:
        raise ValueError("L'analisi richiede almeno due sezioni principali")
    return "\n".join(chunks), sections, chapters


def validate_item(item: dict, available_ids: set[str]) -> None:
    required = ["slug", "bookId", "title", "author", "description", "chapters", "status"]
    missing = [k for k in required if k not in item]
    if missing:
        raise ValueError("Metadati mancanti: " + ", ".join(missing))
    slug = item["slug"]
    if not isinstance(slug, str) or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug) or slug in RESERVED:
        raise ValueError(f"Slug non valido: {slug!r}")
    if not isinstance(item["chapters"], int) or item["chapters"] < 0:
        raise ValueError(f"{slug}: chapters deve essere un intero >= 0")
    if item["status"] not in ("preview", "published", "draft"):
        raise ValueError(f"{slug}: status non supportato")
    # The library data is an independent source. Catalog linkage uses the matching ID.
    if not isinstance(item["bookId"], str) or not re.fullmatch(r"[a-z0-9-]+", item["bookId"]):
        raise ValueError(f"{slug}: bookId non valido")
    if item["bookId"] in available_ids:
        raise ValueError(f"bookId duplicato nel catalogo: {item['bookId']}")
    available_ids.add(item["bookId"])


def make_metric_grid(item: dict, sections: list[dict], chapters: list[dict], words: int) -> str:
    defaults = [
        {"value": str(len(chapters)), "label": "CAPITOLI ANALIZZATI"},
        {"value": str(len(sections)), "label": "SEZIONI DI STUDIO"},
        {"value": str(item.get("ideas", 10)), "label": "IDEE FONDAMENTALI"},
        {"value": f"{round(words / 1000)}k", "label": "PAROLE DI STUDIO CIRCA"},
    ]
    metrics = item.get("metrics", defaults)
    if not isinstance(metrics, list) or not 1 <= len(metrics) <= 4:
        raise ValueError("metrics deve contenere da 1 a 4 elementi")
    return "\n".join(
        '<div class="rb-meta-item"><strong>' + escape(m["value"]) +
        '</strong><span>' + escape(m["label"]) + '</span></div>' for m in metrics
    )


def make_framework(item: dict) -> str:
    points = item.get("framework", [])
    if not points:
        return ""
    if not isinstance(points, list) or not 2 <= len(points) <= 4:
        raise ValueError("framework: specificare da due a quattro passaggi")
    entries = []
    for index, point in enumerate(points, 1):
        anchor = point.get("anchor", "")
        if not re.fullmatch(r"[a-zA-Z0-9-]+", anchor):
            raise ValueError("framework.anchor non valido")
        entries.append(f'<a href="#{escape(anchor)}"><small>{index:02d} / {escape(point["label"])}</small>'
                       f'<strong>{escape(point["text"])} ↗</strong></a>')
    return '<section class="rb-process" aria-label="Modello centrale"><div class="rb-container rb-process-grid">' + "\n".join(entries) + '</div></section>'


def page_html(item: dict) -> tuple[str, dict]:
    slug = item["slug"]
    source_path = BASE / slug / "analysis.md"
    if not source_path.is_file():
        raise ValueError(f"{slug}: analysis.md mancante")
    source = source_path.read_text(encoding="utf-8")
    if re.search(r"(?im)^#{1,4}\s+.*\blaboratorio pratico\b", source):
        raise ValueError(f"{slug}: rimuovere il laboratorio personalizzato prima di pubblicare")
    if re.search(r"\bEPUB\b", source, flags=re.I):
        raise ValueError(f"{slug}: rimuovere riferimenti tecnici al formato del file dal testo pubblico")
    intro, body = split_intro(source)
    rendered, sections, chapters = render_sections(body)
    actual_chapters = len(chapters)
    if actual_chapters != item["chapters"]:
        raise ValueError(f"{slug}: capitoli attesi {item['chapters']}, trovati {actual_chapters}")
    numbers = [c["number"] for c in chapters]
    if len(set(numbers)) != len(numbers):
        raise ValueError(f"{slug}: numerazione capitoli duplicata")
    if "sections" in item and item["sections"] != len(sections):
        raise ValueError(f"{slug}: sezioni attese {item['sections']}, trovate {len(sections)}")
    template = TEMPLATE.read_text(encoding="utf-8")
    title = item["title"]
    title_parts = title.split(" ")
    lead = item.get("heroLead", " ".join(title_parts[:-1]) or title)
    emphasis = item.get("heroEmphasis", title_parts[-1] if len(title_parts) > 1 else "")
    cover_lines = item.get("coverLines", [title])
    if not isinstance(cover_lines, list):
        raise ValueError(f"{slug}: coverLines deve essere una lista")
    words = len(source.split())
    substitutions = {
        "TITLE": escape(title),
        "DESCRIPTION": escape(item["description"]),
        "LABEL": escape(item.get("label", "READING NOTES")),
        "FIELD": escape(item.get("field", "LETTERATURA")),
        "HERO_MAIN": escape(lead),
        "HERO_EMPHASIS": escape(emphasis),
        "SUBTITLE": escape(item.get("subtitle", "")),
        "AUTHORS": escape(item["author"]).replace(", ", " · "),
        "EDITION": escape(item.get("editionLabel", item.get("year", ""))),
        "COVER_LINES": "<br>".join(escape(x) for x in cover_lines),
        "COVER_TAGLINE": escape(item.get("coverTagline", item.get("subtitle", ""))),
        "METRIC_ITEMS": make_metric_grid(item, sections, chapters, words),
        "FRAMEWORK_BLOCK": make_framework(item),
        "INTRO_HTML": safe_markdown(intro),
        "ARTICLE_HTML": rendered,
        "FIRST_SECTION": sections[0]["id"],
    }
    template = template.replace("<head>", '<head>\n<meta name="generator" content="Cardux-Reading-Notes-v1">', 1)
    for name, value in substitutions.items():
        template = template.replace("{{" + name + "}}", value)
    if re.search(r"\{\{[A-Z_]+\}\}", template):
        raise ValueError(f"{slug}: placeholder sconosciuto nel template")
    for tag in ("noindex,nofollow", 'class="reading-section"', 'id="reader-toc"'):
        if tag not in template:
            raise ValueError(f"{slug}: pagina senza elemento richiesto: {tag}")
    return template, {"chapters":actual_chapters, "sections":len(sections), "words":words}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--slug", help="genera solo il libro con questo slug")
    modes = parser.add_mutually_exclusive_group(required=True)
    modes.add_argument("--write", action="store_true", help="genera/aggiorna gli HTML stage")
    modes.add_argument("--check", action="store_true", help="verifica metadati, capitoli e HTML esistenti")
    args = parser.parse_args()
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    if catalog.get("version") != 1 or not isinstance(catalog.get("items"), list):
        raise ValueError("Formato catalog.json non riconosciuto")
    ids, slugs = set(), set()
    for item in catalog["items"]:
        validate_item(item, ids)
        slug = item["slug"]
        if slug in slugs:
            raise ValueError(f"slug duplicato: {slug}")
        slugs.add(slug)
        if args.slug and args.slug != slug:
            continue
        if item["status"] == "draft":
            print(f"SKIP {slug}: draft")
            continue
        document, meta = page_html(item)
        dest = BASE / slug / "index.html"
        if args.write:
            dest.write_text(document, encoding="utf-8")
            print(f"BUILD {slug}: {meta['chapters']} capitoli, {meta['sections']} sezioni, {meta['words']} parole")
        else:
            if not dest.is_file():
                raise ValueError(f"{slug}: index.html mancante")
            current = dest.read_text(encoding="utf-8")
            if 'name="generator" content="Cardux-Reading-Notes-v1"' in current:
                if current != document:
                    raise ValueError(f"{slug}: index.html non sincronizzato con analysis.md e catalog.json; usa --write")
                print(f"OK {slug}: HTML sincronizzato")
            else:
                # The first article predates the generator. Preserve its validated design
                # until the owner approves an explicit template-based regeneration.
                missing = [str(c) for c in range(1, item["chapters"] + 1)
                           if f'id="capitolo-{c}"' not in current]
                if missing or item["title"] not in current or 'noindex,nofollow' not in current:
                    raise ValueError(f"{slug}: pagina legacy non valida, capitoli mancanti: {missing}")
                print(f"OK {slug}: legacy verificato (rigenerazione disponibile con --write)")
    if args.slug and args.slug not in slugs:
        raise ValueError(f"slug non presente nel catalogo: {args.slug}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (ValueError, OSError, KeyError) as exc:
        sys.exit(f"ERRORE: {exc}")