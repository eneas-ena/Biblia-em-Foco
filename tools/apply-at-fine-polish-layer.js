#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const appRoot = path.resolve(__dirname, "..");
const booksDir = path.join(appRoot, "data", "books");
const lexiconFile = path.join(appRoot, "data", "lexicon.js");

const otIds = [
  "genesis", "exodus", "leviticus", "numbers", "deuteronomy", "joshua", "judges", "ruth",
  "1samuel", "2samuel", "1kings", "2kings", "1chronicles", "2chronicles", "ezra", "nehemiah",
  "esther", "job", "psalms", "proverbs", "ecclesiastes", "song", "isaiah", "jeremiah",
  "lamentations", "ezekiel", "daniel", "hosea", "joel", "amos", "obadiah", "jonah", "micah",
  "nahum", "habakkuk", "zephaniah", "haggai", "zechariah", "malachi"
];

const entries = {
  H52: ["Avishay", "אֲבִישַׁי", "Avishay", "nome próprio", "Abisai", "Abisai é filho de Zeruia e guerreiro ligado a Davi.", "Sua presença em Samuel mostra lealdade militar, zelo e também impulsividade diante dos inimigos de Davi.", ["1 Samuel 26:6", "2 Samuel 10:10", "2 Samuel 18:2"]],
  H769: ["Arnon", "אַרְנוֹן", "Arnon", "nome próprio", "Arnom", "Arnom é rio/fronteira importante a leste do Jordão.", "A referência ajuda a mapear a entrada de Israel nas regiões de Moabe e dos amorreus.", ["Números 21:13", "Deuteronômio 2:24", "Juízes 11:18"]],
  H6177: ["Aroer", "עֲרוֹעֵר", "Aroer", "nome próprio", "Aroer", "Aroer é cidade/fronteira mencionada em territórios a leste e ao sul.", "O nome aparece em listas territoriais e narrativas de expansão, guerra e limites de Israel.", ["Números 32:34", "Josué 13:16", "2 Samuel 24:5"]],
  H1391: ["Givon", "גִּבְעוֹן", "Givon", "nome próprio", "Gibeom", "Gibeom é cidade dos heveus que fez aliança com Israel.", "A narrativa de Gibeom levanta temas de engano, juramento, misericórdia e consequências comunitárias.", ["Josué 9:3", "Josué 10:12", "1 Reis 3:4"]],
  H2518: ["Chilqiyahu", "חִלְקִיָּהוּ", "Chilqiyahu", "nome próprio", "Hilquias", "Hilquias é sacerdote associado à descoberta do livro da lei no tempo de Josias.", "Sua atuação marca uma renovação espiritual centrada na Palavra e na reforma do culto.", ["2 Reis 22:8", "2 Crônicas 34:14"]],
  H2574: ["Chamath", "חֲמָת", "Chamath", "nome próprio", "Hamate", "Hamate é cidade/região ao norte, frequentemente usada como referência de fronteira.", "A expressão entrada de Hamate ajuda a situar os limites ideais e históricos da terra.", ["Números 13:21", "Josué 13:5", "2 Reis 14:25"]],
  H3077: ["Yehoyada", "יְהוֹיָדָע", "Yehoyada", "nome próprio", "Joiada", "Joiada é sacerdote importante na preservação da linhagem davídica e na restauração do culto.", "Sua liderança mostra aliança, reforma e proteção da casa de Davi.", ["2 Reis 11:4", "2 Reis 12:2", "2 Crônicas 23:1"]],
  H3316: ["Yiphtach", "יִפְתָּח", "Yiphtach", "nome próprio", "Jefté", "Jefté é juiz de Israel vindo de contexto marginalizado.", "Sua história reúne libertação, conflito familiar, voto precipitado e complexidade moral.", ["Juízes 11:1", "Juízes 11:30", "Hebreus 11:32"]],
  H3841: ["Livnah", "לִבְנָה", "Livnah", "nome próprio", "Libna", "Libna é cidade mencionada em itinerários, territórios e conflitos de Judá.", "O nome aparece em listas geográficas e episódios militares, ajudando a compor o mapa narrativo.", ["Números 33:20", "Josué 10:29", "2 Reis 8:22"]],
  H5022: ["Navoth", "נָבוֹת", "Navoth", "nome próprio", "Nabote", "Nabote é o jezreelita cuja vinha foi tomada por Acabe e Jezabel.", "Sua história denuncia abuso de poder, falsa justiça e violência contra o inocente.", ["1 Reis 21:1", "1 Reis 21:19"]],
  H5416: ["Nathan", "נָתָן", "Nathan", "nome próprio", "Natã", "Natã é profeta que confronta Davi e participa da transição para Salomão.", "Sua atuação une palavra profética, correção moral e proteção da promessa davídica.", ["2 Samuel 7:2", "2 Samuel 12:1", "1 Reis 1:11"]],
  H5654: ["Oved Edom", "עֹבֵד אֱדֹם", "Oved Edom", "nome próprio", "Obede-Edom", "Obede-Edom guarda a arca e sua casa é abençoada.", "A narrativa destaca reverência, presença de Deus e bênção ligada à arca.", ["2 Samuel 6:10", "1 Crônicas 13:14", "1 Crônicas 15:18"]],
  H6578: ["Perath", "פְּרָת", "Perath", "nome próprio", "Eufrates", "Eufrates é grande rio associado a fronteiras, impérios e promessas territoriais.", "O rio marca horizontes geográficos amplos na história bíblica.", ["Gênesis 2:14", "Gênesis 15:18", "Jeremias 46:2"]],
  H7084: ["Qeilah", "קְעִילָה", "Qeilah", "nome próprio", "Queila", "Queila é cidade de Judá libertada por Davi.", "O episódio mostra Davi buscando direção do Senhor em meio a perigo político.", ["Josué 15:44", "1 Samuel 23:1", "1 Samuel 23:12"]],
  H7417: ["Rimmon", "רִמּוֹן", "Rimmon", "nome próprio", "Rimom", "Rimom é nome de lugares e pessoas no Antigo Testamento.", "O nome aparece em listas geográficas e narrativas tribais, exigindo atenção ao contexto.", ["Josué 15:32", "Juízes 20:45", "2 Samuel 4:2"]],
  H7927: ["Shekhem", "שְׁכֶם", "Shekhem", "nome próprio", "Siquém", "Siquém é cidade central na história dos patriarcas, da aliança e das tribos.", "O lugar conecta promessa, conflito familiar, renovação da aliança e divisão do reino.", ["Gênesis 12:6", "Josué 24:1", "1 Reis 12:1"]],
  H8098: ["Shemayah", "שְׁמַעְיָה", "Shemayah", "nome próprio", "Semaías", "Semaías é nome de profetas e levitas em diferentes contextos.", "O nome aparece em momentos de advertência, organização cultual e retorno pós-exílico.", ["1 Reis 12:22", "2 Crônicas 12:5", "Neemias 6:10"]],
  H8227: ["Shaphan", "שָׁפָן", "Shaphan", "nome próprio", "Safã", "Safã é escriba ligado à reforma de Josias e à leitura do livro encontrado no templo.", "Sua família aparece em momentos decisivos de preservação da palavra e discernimento profético.", ["2 Reis 22:3", "Jeremias 26:24", "Jeremias 36:10"]],
  H5523: ["Sukkoth", "סֻכּוֹת", "Sukkoth", "nome próprio", "Sucote", "Sucote é lugar associado a Jacó e a narrativas posteriores de Israel.", "O nome ajuda a acompanhar movimentos patriarcais e conflitos no período dos juízes.", ["Gênesis 33:17", "Josué 13:27", "Juízes 8:5"]],
  H6870: ["Tseruyah", "צְרוּיָה", "Tseruyah", "nome próprio", "Zeruia", "Zeruia é mãe de Joabe, Abisai e Asael, parentes de Davi.", "A expressão filhos de Zeruia identifica um grupo influente e por vezes difícil no círculo de Davi.", ["1 Samuel 26:6", "2 Samuel 2:18", "2 Samuel 16:10"]]
};

const wordBank = {
  H52: ["Abisai"],
  H769: ["Arnom"],
  H6177: ["Aroer"],
  H1391: ["Gibeom"],
  H2518: ["Hilquias"],
  H2574: ["Hamate"],
  H3077: ["Joiada"],
  H3316: ["Jefté", "Jefte"],
  H3841: ["Libna"],
  H5022: ["Nabote"],
  H5416: ["Natã", "Nata"],
  H5654: ["Obede-Edom"],
  H6578: ["Eufrates"],
  H7084: ["Queila"],
  H7417: ["Rimom"],
  H7927: ["Siquém", "Siquem"],
  H8098: ["Semaías", "Semaias"],
  H8227: ["Safã", "Safa"],
  H5523: ["Sucote"],
  H6870: ["Zeruia"]
};

function readBook(id) {
  const file = path.join(booksDir, `${id}.js`);
  const source = fs.readFileSync(file, "utf8");
  const match = source.match(/globalThis\.appData\.books\.push\((\{[\s\S]*\})\);\s*$/u);
  if (!match) throw new Error(`Formato inesperado em ${file}`);
  return { file, book: JSON.parse(match[1]) };
}

function writeBook(file, book) {
  fs.writeFileSync(file, `globalThis.appData.books.push(${JSON.stringify(book, null, 2)});\n`);
}

function normalize(value) {
  return String(value || "").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function wordPattern(word) {
  return new RegExp(`(^|[^\\p{L}\\p{N}_])(${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})(?=[^\\p{L}\\p{N}_]|$)`, "iu");
}

let added = 0;

for (const id of otIds) {
  const { file, book } = readBook(id);
  let changed = false;

  for (const chapter of book.chapters) {
    for (const verse of chapter.verses) {
      verse.tokens ||= [];
      const existing = new Set(verse.tokens.map(token => `${normalize(token.word)}:${String(token.strong).toUpperCase()}`));
      for (const [strong, words] of Object.entries(wordBank)) {
        for (const word of words) {
          const found = verse.text.match(wordPattern(word));
          if (!found) continue;
          const visibleWord = found[2];
          const key = `${normalize(visibleWord)}:${strong}`;
          if (existing.has(key)) continue;
          verse.tokens.push({ word: visibleWord, strong });
          existing.add(key);
          added += 1;
          changed = true;
          break;
        }
      }
    }
  }

  if (changed) writeBook(file, book);
}

const payload = Object.fromEntries(Object.entries(entries).map(([strong, values]) => ([
  strong,
  {
    lemma: values[0],
    original: values[1],
    translit: values[2],
    grammar: values[3],
    gloss: values[4],
    exegetic: values[5],
    culture: values[6],
    parallels: values[7]
  }
])));

let lexicon = fs.readFileSync(lexiconFile, "utf8");
lexicon = lexicon.replace(/\n\/\/ BEGIN AT FINE POLISH LAYER[\s\S]*?\/\/ END AT FINE POLISH LAYER\n?/u, "\n");
lexicon += `\n// BEGIN AT FINE POLISH LAYER\nObject.assign(globalThis.appData.lexicon, ${JSON.stringify(payload, null, 2)});\n// END AT FINE POLISH LAYER\n`;
fs.writeFileSync(lexiconFile, lexicon);

console.log(JSON.stringify({ added, entries: Object.keys(entries).length }, null, 2));
