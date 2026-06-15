#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const appRoot = path.resolve(__dirname, "..");
const args = process.argv.slice(2);

function usage() {
  console.log([
    "Uso:",
    "  node tools/build-book.js caminho/livro.json [--install] [--out data/books/livro.js]",
    "",
    "O JSON deve seguir o formato de tools/book-source.example.json.",
    "--install adiciona o novo livro ao index.html antes do lexicon.js."
  ].join("\n"));
}

if (!args.length || args.includes("--help")) {
  usage();
  process.exit(args.length ? 0 : 1);
}

const sourceArg = args[0];
const install = args.includes("--install");
const outIndex = args.indexOf("--out");
const explicitOut = outIndex >= 0 ? args[outIndex + 1] : null;

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.resolve(process.cwd(), file), "utf8"));
}

function loadCurrentData() {
  const context = { globalThis: { appData: { source: "", books: [], lexicon: {} } } };
  vm.createContext(context);
  const files = [
    "data/app-data.js",
    ...fs.readdirSync(path.join(appRoot, "data/books"))
      .filter(file => file.endsWith(".js"))
      .map(file => `data/books/${file}`),
    "data/lexicon.js"
  ];

  files.forEach(file => {
    vm.runInContext(fs.readFileSync(path.join(appRoot, file), "utf8"), context, { filename: file });
  });

  return context.globalThis.appData;
}

function normalize(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function wordsFrom(value) {
  return normalize(value).match(/[\p{L}\p{N}]+/gu) || [];
}

function escapeJs(value) {
  return JSON.stringify(value, null, 2);
}

function buildAliasMap(appData, extraBank) {
  const aliasMap = new Map();

  function add(strong, word) {
    if (!appData.lexicon[strong]) return;
    const clean = normalize(word).trim();
    if (!clean || clean.length < 3) return;
    if (!aliasMap.has(clean)) aliasMap.set(clean, new Set());
    aliasMap.get(clean).add(strong);
  }

  appData.books.forEach(book => {
    book.chapters.forEach(chapter => {
      chapter.verses.forEach(verse => {
        (verse.tokens || []).forEach(token => add(token.strong, token.word));
      });
    });
  });

  Object.entries(extraBank).forEach(([strong, words]) => {
    words.forEach(word => add(strong, word));
  });

  return aliasMap;
}

const preferredStrongByWord = {
  novo: "G2537",
  nova: "G2537",
  novos: "G2537",
  novas: "G2537",
  reino: "G932",
  reinos: "G932",
  rei: "G935",
  reis: "G935",
  servo: "G1401",
  servos: "G1401",
  templo: "G2411",
  templos: "G2411",
  poder: "G1411",
  poderes: "G1411",
  primeiro: "G4413",
  primeira: "G4413",
  primeiros: "G4413",
  primeiras: "G4413"
};

function findTokens(text, aliasMap) {
  const matches = [];
  const seen = new Set();
  const occupied = [];
  const normalizedText = normalize(text);

  function overlaps(start, end) {
    return occupied.some(range => start < range.end && end > range.start);
  }

  function addMatch(start, end, word, strong) {
    const key = `${start}:${word}:${strong}`;
    if (seen.has(key) || overlaps(start, end)) return;
    seen.add(key);
    occupied.push({ start, end });
    matches.push({ start, word, strong });
  }

  Array.from(aliasMap.entries())
    .filter(([alias]) => alias.includes(" "))
    .forEach(([alias, strongs]) => {
      let start = normalizedText.indexOf(alias);
      while (start >= 0) {
        const end = start + alias.length;
        const before = start === 0 ? "" : normalizedText[start - 1];
        const after = end >= normalizedText.length ? "" : normalizedText[end];
        const hasBoundary = (!before || !/[\p{L}\p{N}_]/u.test(before)) && (!after || !/[\p{L}\p{N}_]/u.test(after));
        if (hasBoundary) {
          Array.from(strongs).forEach(strong => addMatch(start, end, text.slice(start, end), strong));
        }
        start = normalizedText.indexOf(alias, start + 1);
      }
    });

  const regex = /[\p{L}\p{N}]+/gu;
  let match;

  while ((match = regex.exec(text))) {
    const word = match[0];
    const normalized = normalize(word);
    const strongs = aliasMap.get(normalized);
    if (!strongs || overlaps(match.index, match.index + word.length)) continue;

    const preferred = preferredStrongByWord[normalized];
    const selectedStrongs = preferred && strongs.has(preferred) ? [preferred] : Array.from(strongs);

    selectedStrongs.forEach(strong => {
      addMatch(match.index, match.index + word.length, word, strong);
    });
  }

  return matches
    .sort((left, right) => left.start - right.start || left.strong.localeCompare(right.strong))
    .map(({ word, strong }) => ({ word, strong }));
}

function normalizeBook(sourceBook, aliasMap) {
  return {
    id: sourceBook.id,
    name: sourceBook.name,
    chapters: sourceBook.chapters.map(chapter => ({
      number: Number(chapter.number),
      verses: chapter.verses.map(verse => ({
        n: Number(verse.n),
        text: verse.text,
        tokens: findTokens(verse.text, aliasMap)
      }))
    }))
  };
}

function installScript(bookFile) {
  const indexPath = path.join(appRoot, "index.html");
  const indexHtml = fs.readFileSync(indexPath, "utf8");
  const src = `./data/books/${path.basename(bookFile)}`;

  if (indexHtml.includes(src)) return false;

  const versionMatch = indexHtml.match(/app\.js\?v=([^"]+)/);
  const version = versionMatch ? versionMatch[1] : "20260612-lucas";
  const script = `  <script src="${src}?v=${version}"></script>\n`;
  const updated = indexHtml.replace(
    /  <script src="\.\/data\/lexicon\.js\?v=[^"]+"><\/script>\n/,
    `${script}$&`
  );

  if (updated === indexHtml) {
    throw new Error("Nao encontrei o ponto de instalacao antes de lexicon.js.");
  }

  fs.writeFileSync(indexPath, updated, "utf8");
  return true;
}

const sourceBook = readJson(sourceArg);
if (!sourceBook.id || !sourceBook.name || !Array.isArray(sourceBook.chapters)) {
  throw new Error("Arquivo de entrada incompleto. Confira tools/book-source.example.json.");
}

const appData = loadCurrentData();
const extraBankPath = path.join(appRoot, "tools/strong-word-bank.json");
const extraBank = fs.existsSync(extraBankPath) ? JSON.parse(fs.readFileSync(extraBankPath, "utf8")) : {};
const aliasMap = buildAliasMap(appData, extraBank);
const book = normalizeBook(sourceBook, aliasMap);
const outFile = path.resolve(appRoot, explicitOut || `data/books/${book.id}.js`);

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `globalThis.appData.books.push(${escapeJs(book)});\n`, "utf8");

const chapterCount = book.chapters.length;
const verseCount = book.chapters.reduce((sum, chapter) => sum + chapter.verses.length, 0);
const tokenCount = book.chapters.reduce((sum, chapter) => (
  sum + chapter.verses.reduce((chapterSum, verse) => chapterSum + verse.tokens.length, 0)
), 0);
const installed = install ? installScript(outFile) : false;

console.log(JSON.stringify({
  book: book.name,
  file: path.relative(appRoot, outFile),
  installed,
  chapters: chapterCount,
  verses: verseCount,
  markedWords: tokenCount
}, null, 2));
