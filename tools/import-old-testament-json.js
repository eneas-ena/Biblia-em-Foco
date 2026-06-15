#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const appRoot = path.resolve(__dirname, "..");
const inputFile = process.argv[2];

const books = [
  ["genesis", "Gênesis", "gn"],
  ["exodus", "Êxodo", "ex"],
  ["leviticus", "Levítico", "lv"],
  ["numbers", "Números", "nm"],
  ["deuteronomy", "Deuteronômio", "dt"],
  ["joshua", "Josué", "js"],
  ["judges", "Juízes", "jz"],
  ["ruth", "Rute", "rt"],
  ["1samuel", "1 Samuel", "1sm"],
  ["2samuel", "2 Samuel", "2sm"],
  ["1kings", "1 Reis", "1rs"],
  ["2kings", "2 Reis", "2rs"],
  ["1chronicles", "1 Crônicas", "1cr"],
  ["2chronicles", "2 Crônicas", "2cr"],
  ["ezra", "Esdras", "ed"],
  ["nehemiah", "Neemias", "ne"],
  ["esther", "Ester", "et"],
  ["job", "Jó", "jó"],
  ["psalms", "Salmos", "sl"],
  ["proverbs", "Provérbios", "pv"],
  ["ecclesiastes", "Eclesiastes", "ec"],
  ["song", "Cânticos", "ct"],
  ["isaiah", "Isaías", "is"],
  ["jeremiah", "Jeremias", "jr"],
  ["lamentations", "Lamentações", "lm"],
  ["ezekiel", "Ezequiel", "ez"],
  ["daniel", "Daniel", "dn"],
  ["hosea", "Oséias", "os"],
  ["joel", "Joel", "jl"],
  ["amos", "Amós", "am"],
  ["obadiah", "Obadias", "ob"],
  ["jonah", "Jonas", "jn"],
  ["micah", "Miquéias", "mq"],
  ["nahum", "Naum", "na"],
  ["habakkuk", "Habacuque", "hc"],
  ["zephaniah", "Sofonias", "sf"],
  ["haggai", "Ageu", "ag"],
  ["zechariah", "Zacarias", "zc"],
  ["malachi", "Malaquias", "ml"]
];

const newTestamentIds = [
  "matthew",
  "mark",
  "luke",
  "john",
  "acts",
  "romans",
  "1corinthians",
  "2corinthians",
  "galatians",
  "ephesians",
  "philippians",
  "colossians",
  "1thessalonians",
  "2thessalonians",
  "1timothy",
  "2timothy",
  "titus",
  "philemon",
  "hebrews",
  "james",
  "1peter",
  "2peter",
  "1john",
  "2john",
  "3john",
  "jude",
  "revelation"
];

function usage() {
  console.log([
    "Uso:",
    "  node tools/import-old-testament-json.js tools/acf.json",
    "",
    "Formato esperado: JSON em array, com livros contendo abbrev e chapters,",
    "como o arquivo json/acf.json do repositório thiagobodruk/biblia."
  ].join("\n"));
}

function cleanText(text) {
  return String(text)
    .replace(/^\uFEFF/, "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function loadBible(file) {
  const raw = fs.readFileSync(path.resolve(process.cwd(), file), "utf8").replace(/^\uFEFF/, "");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("O JSON precisa ser uma lista de livros.");
  }
  return parsed;
}

function findBook(source, abbrev) {
  return source.find(book => {
    const value = typeof book.abbrev === "string" ? book.abbrev : book.abbrev?.pt;
    return cleanText(value).toLowerCase() === abbrev;
  });
}

function writeSourceBook([id, name, abbrev], source) {
  const sourceBook = findBook(source, abbrev);
  if (!sourceBook || !Array.isArray(sourceBook.chapters)) {
    throw new Error(`Livro não encontrado no JSON: ${name} (${abbrev}).`);
  }

  const book = {
    id,
    name,
    chapters: sourceBook.chapters.map((chapter, chapterIndex) => ({
      number: chapterIndex + 1,
      verses: chapter.map((text, verseIndex) => ({
        n: verseIndex + 1,
        text: cleanText(text)
      }))
    }))
  };

  const file = path.join(appRoot, "tools", "old-testament-sources", `${id}-source.json`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(book, null, 2) + "\n");
  return file;
}

function readVersion() {
  const indexPath = path.join(appRoot, "index.html");
  const indexHtml = fs.readFileSync(indexPath, "utf8");
  const versionMatch = indexHtml.match(/app\.js\?v=([^"]+)/);
  return versionMatch ? versionMatch[1] : "20260614-mobile-verse-rail";
}

function buildBook(sourceFile) {
  const result = spawnSync(process.execPath, [
    path.join(appRoot, "tools", "build-book.js"),
    path.relative(appRoot, sourceFile)
  ], {
    cwd: appRoot,
    encoding: "utf8"
  });

  if (result.status !== 0) {
    process.stderr.write(result.stdout);
    process.stderr.write(result.stderr);
    throw new Error(`Falha ao instalar ${path.basename(sourceFile)}.`);
  }

  return JSON.parse(result.stdout);
}

function installCanonicalScripts(version) {
  const indexPath = path.join(appRoot, "index.html");
  const indexHtml = fs.readFileSync(indexPath, "utf8");
  const allIds = [...books.map(([id]) => id), ...newTestamentIds];
  const scripts = allIds
    .map(id => `  <script src="./data/books/${id}.js?v=${version}"></script>`)
    .join("\n");

  const updated = indexHtml.replace(
    /  <script src="\.\/data\/app-data\.js\?v=[^"]+"><\/script>\n(?:  <script src="\.\/data\/books\/[^"]+"><\/script>\n)+  <script src="\.\/data\/lexicon\.js\?v=[^"]+"><\/script>/,
    `  <script src="./data/app-data.js?v=${version}"></script>\n${scripts}\n  <script src="./data/lexicon.js?v=${version}"></script>`
  );

  if (updated === indexHtml) {
    throw new Error("Nao consegui reorganizar os scripts dos livros no index.html.");
  }

  fs.writeFileSync(indexPath, updated, "utf8");
}

function installServiceWorkerAssets() {
  const swPath = path.join(appRoot, "sw.js");
  const sw = fs.readFileSync(swPath, "utf8");
  const allIds = [...books.map(([id]) => id), ...newTestamentIds];
  const bookAssets = allIds
    .map(id => `  "./data/books/${id}.js",`)
    .join("\n");

  const updated = sw.replace(
    /  "\.\/data\/app-data\.js",\n(?:  "\.\/data\/books\/[^"]+",\n)+  "\.\/data\/lexicon\.js",/,
    `  "./data/app-data.js",\n${bookAssets}\n  "./data/lexicon.js",`
  );

  if (updated === sw) {
    throw new Error("Nao consegui atualizar a lista offline no sw.js.");
  }

  fs.writeFileSync(swPath, updated, "utf8");
}

if (!inputFile || process.argv.includes("--help")) {
  usage();
  process.exit(inputFile ? 0 : 1);
}

const source = loadBible(inputFile);
const version = readVersion();
const installed = books.map(book => buildBook(writeSourceBook(book, source)));
installCanonicalScripts(version);
installServiceWorkerAssets();
const summary = {
  books: installed.length,
  chapters: installed.reduce((sum, book) => sum + book.chapters, 0),
  verses: installed.reduce((sum, book) => sum + book.verses, 0),
  markedWords: installed.reduce((sum, book) => sum + book.markedWords, 0),
  installed
};

fs.writeFileSync(
  path.join(appRoot, "tools", "old-testament-sources", "import-summary.json"),
  JSON.stringify(summary, null, 2) + "\n"
);
console.log(JSON.stringify(summary, null, 2));
