#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const appRoot = path.resolve(__dirname, "..");
const context = { globalThis: { appData: { source: "", books: [], lexicon: {} } } };
vm.createContext(context);

function run(file) {
  vm.runInContext(fs.readFileSync(path.join(appRoot, file), "utf8"), context, { filename: file });
}

run("data/app-data.js");
fs.readdirSync(path.join(appRoot, "data/books"))
  .filter(file => file.endsWith(".js"))
  .sort()
  .forEach(file => run(`data/books/${file}`));
run("data/lexicon.js");

const appData = context.globalThis.appData;
const missing = [];
const books = appData.books.map(book => {
  let tokens = 0;
  const chapterStats = book.chapters.map(chapter => {
    const chapterTokens = chapter.verses.reduce((sum, verse) => {
      (verse.tokens || []).forEach(token => {
        if (!appData.lexicon[token.strong]) {
          missing.push(`${book.name} ${chapter.number}:${verse.n} ${token.word} ${token.strong}`);
        }
      });
      return sum + (verse.tokens || []).length;
    }, 0);
    tokens += chapterTokens;
    return { chapter: chapter.number, verses: chapter.verses.length, tokens: chapterTokens };
  });

  return {
    id: book.id,
    name: book.name,
    chapters: book.chapters.length,
    verses: book.chapters.reduce((sum, chapter) => sum + chapter.verses.length, 0),
    tokens,
    minChapterTokens: Math.min(...chapterStats.map(item => item.tokens)),
    maxChapterTokens: Math.max(...chapterStats.map(item => item.tokens))
  };
});

console.log(JSON.stringify({
  source: appData.source,
  books,
  lexiconCards: Object.keys(appData.lexicon).length,
  missingCount: missing.length,
  missing: missing.slice(0, 30)
}, null, 2));

if (missing.length) process.exitCode = 1;
