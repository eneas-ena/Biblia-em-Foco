#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const appRoot = path.resolve(__dirname, "..");
const booksDir = path.join(appRoot, "data", "books");
const lexiconFile = path.join(appRoot, "data", "lexicon.js");

const ntIds = [
  "acts", "romans", "1corinthians", "2corinthians", "galatians", "ephesians", "philippians",
  "colossians", "1thessalonians", "2thessalonians", "1timothy", "2timothy", "titus",
  "philemon", "hebrews", "james", "1peter", "2peter", "1john", "2john", "3john", "jude",
  "revelation"
];

const entries = {
  G67: ["Agrippas", "Ἀγρίππας", "Agrippas", "nome próprio", "Agripa", "Agripa é o rei diante de quem Paulo apresenta sua defesa.", "A cena mostra o evangelho sendo anunciado também diante de autoridades políticas.", ["Atos 25:13", "Atos 26:1"]],
  G207: ["Akylas", "Ἀκύλας", "Akylas", "nome próprio", "Áquila", "Áquila é colaborador de Paulo e marido de Priscila.", "O casal une trabalho, hospitalidade e ensino cuidadoso na missão apostólica.", ["Atos 18:2", "Atos 18:26", "Romanos 16:3"]],
  G116: ["Athenai", "Ἀθῆναι", "Athenai", "nome próprio", "Atenas", "Atenas é centro cultural grego visitado por Paulo.", "No Areópago, Paulo dialoga com religiosidade, filosofia e anúncio do Deus criador.", ["Atos 17:16", "Atos 17:22"]],
  G223: ["Alexandros", "Ἀλέξανδρος", "Alexandros", "nome próprio", "Alexandre", "Alexandre aparece como nome de personagens no ambiente apostólico.", "O nome ajuda a situar conflitos e personagens das comunidades cristãs primitivas.", ["Atos 19:33", "1 Timóteo 1:20", "2 Timóteo 4:14"]],
  G367: ["Ananias", "Ἀνανίας", "Ananias", "nome próprio", "Ananias", "Ananias é nome de personagens diferentes em Atos.", "O nome aparece tanto em juízo comunitário quanto na cura e acolhida de Saulo.", ["Atos 5:1", "Atos 9:10", "Atos 23:2"]],
  G490: ["Antiocheia", "Ἀντιόχεια", "Antiocheia", "nome próprio", "Antioquia", "Antioquia torna-se uma base missionária decisiva da igreja primitiva.", "Ali os discípulos são chamados cristãos e dali partem missões gentílicas.", ["Atos 11:26", "Atos 13:1", "Gálatas 2:11"]],
  G625: ["Apollos", "Ἀπολλώς", "Apollos", "nome próprio", "Apolo", "Apolo é pregador eloquente e conhecedor das Escrituras, instruído com mais precisão por Priscila e Áquila.", "Sua presença em Corinto mostra a necessidade de maturidade para evitar partidos em torno de líderes.", ["Atos 18:24", "Atos 18:26", "1 Coríntios 3:6"]],
  G708: ["Aristarchos", "Ἀρίσταρχος", "Aristarchos", "nome próprio", "Aristarco", "Aristarco é companheiro de Paulo em viagens e prisões.", "Seu nome testemunha a rede de colaboradores por trás da missão apostólica.", ["Atos 19:29", "Atos 27:2", "Colossenses 4:10"]],
  G735: ["Artemis", "Ἄρτεμις", "Artemis", "nome próprio", "Ártemis, Diana", "Ártemis era divindade cultuada em Éfeso, chamada Diana em algumas traduções.", "O conflito em Éfeso mostra o evangelho confrontando economia, culto e identidade cívica.", ["Atos 19:24", "Atos 19:28"]],
  G882: ["Achaia", "Ἀχαΐα", "Achaia", "nome próprio", "Acaia", "Acaia é região da Grécia ligada às viagens e cartas paulinas.", "A menção situa comunidades como Corinto dentro da missão no mundo greco-romano.", ["Atos 18:12", "Romanos 15:26", "2 Coríntios 1:1"]],
  G921: ["Barnabas", "Βαρνάβας", "Barnabas", "nome próprio", "Barnabé", "Barnabé é colaborador, encorajador e companheiro missionário de Paulo.", "Seu papel mostra mediação, generosidade e discernimento comunitário.", ["Atos 4:36", "Atos 9:27", "Atos 13:2"]],
  G958: ["Beniamin", "Βενιαμίν", "Beniamin", "nome próprio", "Benjamim", "Benjamim é tribo de Israel mencionada no NT.", "A referência liga identidade judaica, genealogia e memória das tribos.", ["Romanos 11:1", "Filipenses 3:5"]],
  G1050: ["Gaios", "Γάϊος", "Gaios", "nome próprio", "Gaio", "Gaio é nome de cristãos ligados à hospitalidade e à missão.", "A repetição do nome revela redes domésticas e comunitárias no cristianismo antigo.", ["Atos 19:29", "Romanos 16:23", "3 João 1:1"]],
  G1053: ["Galatia", "Γαλατία", "Galatia", "nome próprio", "Galácia", "Galácia é região associada às igrejas destinatárias da carta aos Gálatas.", "A carta discute evangelho, liberdade, lei, fé e vida no Espírito.", ["Gálatas 1:2", "1 Coríntios 16:1"]],
  G1154: ["Damaskos", "Δαμασκός", "Damaskos", "nome próprio", "Damasco", "Damasco é cidade ligada à conversão e chamado de Saulo.", "A estrada para Damasco se torna símbolo de encontro, queda e nova missão.", ["Atos 9:2", "Atos 22:6", "Atos 26:12"]],
  G1191: ["Derbe", "Δέρβη", "Derbe", "nome próprio", "Derbe", "Derbe é cidade visitada por Paulo em suas viagens missionárias.", "A cidade pertence ao circuito missionário de anúncio, discipulado e fortalecimento das igrejas.", ["Atos 14:6", "Atos 16:1"]],
  G2181: ["Ephesos", "Ἔφεσος", "Ephesos", "nome próprio", "Éfeso", "Éfeso é cidade importante da missão paulina e uma das igrejas de Apocalipse.", "O lugar une ensino prolongado, conflito religioso e chamada ao primeiro amor.", ["Atos 19:1", "Efésios 1:1", "Apocalipse 2:1"]],
  G2332: ["Thessalonike", "Θεσσαλονίκη", "Thessalonike", "nome próprio", "Tessalônica", "Tessalônica é cidade macedônica evangelizada por Paulo.", "As cartas aos tessalonicenses tratam fé, esperança, perseverança e vinda do Senhor.", ["Atos 17:1", "1 Tessalonicenses 1:1"]],
  G2363: ["Thyateira", "Θυάτειρα", "Thyateira", "nome próprio", "Tiatira", "Tiatira é cidade ligada a Lídia e a uma das igrejas de Apocalipse.", "O nome conecta missão em Atos e exortação profética em Apocalipse.", ["Atos 16:14", "Apocalipse 2:18"]],
  G2394: ["Iason", "Ἰάσων", "Iason", "nome próprio", "Jasom", "Jasom hospeda Paulo e Silas em Tessalônica.", "Sua casa se torna ponto de tensão entre hospitalidade cristã e oposição pública.", ["Atos 17:5", "Atos 17:7", "Romanos 16:21"]],
  G2430: ["Ikonion", "Ἰκόνιον", "Ikonion", "nome próprio", "Icônio", "Icônio é cidade visitada por Paulo e Barnabé.", "A narrativa mostra anúncio, divisão, perseguição e perseverança missionária.", ["Atos 13:51", "Atos 14:1"]],
  G2445: ["Ioppe", "Ἰόππη", "Ioppe", "nome próprio", "Jope", "Jope é cidade costeira ligada a Pedro, Dorcas e à visão que prepara a missão aos gentios.", "O episódio em Jope abre caminho para a casa de Cornélio.", ["Atos 9:36", "Atos 10:5"]],
  G2542: ["Kaisareia", "Καισάρεια", "Kaisareia", "nome próprio", "Cesaréia", "Cesaréia é cidade administrativa romana importante em Atos.", "Ali ocorrem encontros decisivos entre evangelho, gentios e autoridades.", ["Atos 10:1", "Atos 23:23", "Atos 25:1"]],
  G2791: ["Kilikia", "Κιλικία", "Kilikia", "nome próprio", "Cilícia", "Cilícia é região associada à origem de Paulo e suas viagens.", "A menção ajuda a mapear a expansão do evangelho no Mediterrâneo oriental.", ["Atos 6:9", "Atos 15:41", "Gálatas 1:21"]],
  G2786: ["Kephas", "Κηφᾶς", "Kephas", "nome próprio", "Cefas", "Cefas é o nome aramaico de Pedro.", "Paulo usa o nome em contextos de testemunho apostólico e debates da igreja primitiva.", ["João 1:42", "1 Coríntios 15:5", "Gálatas 2:9"]],
  G2857: ["Kolossai", "Κολοσσαί", "Kolossai", "nome próprio", "Colossos", "Colossos é cidade da comunidade destinatária de Colossenses.", "A carta exalta a supremacia de Cristo sobre criação, poderes e vida da igreja.", ["Colossenses 1:2"]],
  G2882: ["Korinthos", "Κόρινθος", "Korinthos", "nome próprio", "Corinto", "Corinto é cidade portuária e comunidade central nas cartas paulinas.", "As cartas aos coríntios tratam dons, santidade, unidade, amor e ressurreição.", ["Atos 18:1", "1 Coríntios 1:2", "2 Coríntios 1:1"]],
  G2883: ["Kornelios", "Κορνήλιος", "Kornelios", "nome próprio", "Cornélio", "Cornélio é centurião gentio alcançado pelo evangelho por meio de Pedro.", "Sua conversão marca momento decisivo da inclusão dos gentios.", ["Atos 10:1", "Atos 10:44"]],
  G2914: ["Krete", "Κρήτη", "Krete", "nome próprio", "Creta", "Creta é ilha ligada à viagem de Paulo e ao ministério de Tito.", "A carta a Tito situa organização comunitária, liderança e ensino saudável em Creta.", ["Atos 27:7", "Tito 1:5"]],
  G2954: ["Kypros", "Κύπρος", "Kypros", "nome próprio", "Chipre", "Chipre é ilha ligada a Barnabé e à primeira viagem missionária.", "A ilha mostra a passagem da igreja de Antioquia para uma missão mais ampla.", ["Atos 4:36", "Atos 13:4"]],
  G2993: ["Laodikeia", "Λαοδίκεια", "Laodikeia", "nome próprio", "Laodicéia", "Laodicéia é cidade de uma igreja mencionada em Colossenses e Apocalipse.", "A carta de Apocalipse denuncia mornidão espiritual e chama ao arrependimento.", ["Colossenses 4:16", "Apocalipse 3:14"]],
  G3070: ["Lydia", "Λυδία", "Lydia", "nome próprio", "Lídia", "Lídia é vendedora de púrpura em Filipos e uma das primeiras convertidas na Macedônia.", "Sua casa se torna espaço de hospitalidade e apoio à missão.", ["Atos 16:14", "Atos 16:40"]],
  G3082: ["Lystra", "Λύστρα", "Lystra", "nome próprio", "Listra", "Listra é cidade visitada por Paulo, ligada também a Timóteo.", "Ali aparecem cura, confusão religiosa, perseguição e formação de liderança.", ["Atos 14:8", "Atos 16:1"]],
  G3109: ["Makedonia", "Μακεδονία", "Makedonia", "nome próprio", "Macedônia", "Macedônia é região-chave da missão paulina na Europa.", "A visão macedônica marca nova etapa da expansão do evangelho.", ["Atos 16:9", "2 Coríntios 8:1", "Filipenses 4:15"]],
  G3198: ["Melchisedek", "Μελχισέδεκ", "Melchisedek", "nome próprio", "Melquisedeque", "Melquisedeque é rei-sacerdote usado em Hebreus para explicar o sacerdócio de Cristo.", "A leitura cristológica destaca um sacerdócio anterior e superior ao levítico.", ["Gênesis 14:18", "Salmo 110:4", "Hebreus 7:1"]],
  G3828: ["Pamphylia", "Παμφυλία", "Pamphylia", "nome próprio", "Panfília", "Panfília é região atravessada nas viagens missionárias.", "A menção ajuda a acompanhar o deslocamento do evangelho pelo Mediterrâneo.", ["Atos 13:13", "Atos 14:24"]],
  G3963: ["Patmos", "Πάτμος", "Patmos", "nome próprio", "Patmos", "Patmos é ilha onde João recebe a visão de Apocalipse.", "O exílio se torna lugar de revelação, adoração e esperança para igrejas perseguidas.", ["Apocalipse 1:9"]],
  G4010: ["Pergamos", "Πέργαμος", "Pergamos", "nome próprio", "Pérgamo", "Pérgamo é uma das igrejas destinatárias de Apocalipse.", "A cidade aparece em contexto de pressão imperial, fidelidade e mistura espiritual.", ["Apocalipse 2:12"]],
  G4252: ["Priskilla", "Πρίσκιλλα", "Priskilla", "nome próprio", "Priscila", "Priscila é colaboradora de Paulo, junto com Áquila.", "O casal participa de hospitalidade, ensino e fortalecimento da missão.", ["Atos 18:2", "Atos 18:26", "Romanos 16:3"]],
  G4516: ["Rhome", "Ῥώμη", "Rhome", "nome próprio", "Roma", "Roma é centro imperial e destino final da narrativa de Atos.", "A chegada de Paulo a Roma simboliza o evangelho avançando até o coração do império.", ["Atos 28:14", "Romanos 1:7"]],
  G4554: ["Sardeis", "Σάρδεις", "Sardeis", "nome próprio", "Sardes", "Sardes é uma das igrejas de Apocalipse.", "A exortação chama uma comunidade com aparência de vida a despertar.", ["Apocalipse 3:1"]],
  G4609: ["Silas", "Σίλας", "Silas", "nome próprio", "Silas", "Silas é companheiro missionário de Paulo e participante do anúncio apostólico.", "Sua presença em Atos une missão, sofrimento, louvor na prisão e confirmação das igrejas.", ["Atos 15:22", "Atos 16:25", "2 Coríntios 1:19"]],
  G4614: ["Sina", "Σινᾶ", "Sina", "nome próprio", "Sinai", "Sinai é monte associado à aliança e à lei.", "No NT, Sinai é usado em reflexão sobre lei, promessa e liberdade.", ["Gálatas 4:24", "Hebreus 12:18"]],
  G4667: ["Smyrna", "Σμύρνα", "Smyrna", "nome próprio", "Esmirna", "Esmirna é uma das igrejas de Apocalipse.", "A carta destaca sofrimento, fidelidade e promessa da coroa da vida.", ["Apocalipse 2:8"]],
  G4947: ["Syria", "Συρία", "Syria", "nome próprio", "Síria", "Síria é região ligada a Antioquia e às viagens missionárias.", "A região aparece como corredor importante entre Jerusalém, Antioquia e as igrejas gentílicas.", ["Atos 15:23", "Gálatas 1:21"]],
  G5019: ["Tarsos", "Ταρσός", "Tarsos", "nome próprio", "Tarso", "Tarso é cidade de origem de Paulo.", "A origem de Paulo ajuda a entender sua cidadania, formação e circulação no mundo greco-romano.", ["Atos 9:11", "Atos 21:39"]],
  G5174: ["Troas", "Τρῳάς", "Troas", "nome próprio", "Trôade", "Trôade é cidade costeira ligada à visão macedônica e às viagens de Paulo.", "O lugar marca deslocamentos missionários e encontros da comunidade cristã.", ["Atos 16:8", "Atos 20:6", "2 Timóteo 4:13"]],
  G5190: ["Tychikos", "Τυχικός", "Tychikos", "nome próprio", "Tíquico", "Tíquico é colaborador e mensageiro de Paulo.", "Seu papel mostra a importância de portadores de cartas, notícias e encorajamento.", ["Efésios 6:21", "Colossenses 4:7", "2 Timóteo 4:12"]],
  G5359: ["Philadelphia", "Φιλαδέλφεια", "Philadelphia", "nome próprio", "Filadélfia", "Filadélfia é uma das igrejas de Apocalipse.", "A carta destaca fidelidade, porta aberta e perseverança.", ["Apocalipse 3:7"]],
  G5375: ["Philippoi", "Φίλιπποι", "Philippoi", "nome próprio", "Filipos", "Filipos é cidade macedônica evangelizada por Paulo.", "A comunidade de Filipos é marcada por hospitalidade, parceria no evangelho e alegria.", ["Atos 16:12", "Filipenses 1:1"]],
  G5376: ["Philippos", "Φίλιππος", "Philippos", "nome próprio", "Filipe", "Filipe é nome de apóstolo e de evangelista em Atos.", "Sua atuação inclui serviço, evangelização em Samaria e encontro com o etíope.", ["João 1:43", "Atos 8:5", "Atos 21:8"]],
  G5344: ["Phelix", "Φῆλιξ", "Phelix", "nome próprio", "Félix", "Félix é governador romano diante de quem Paulo se defende.", "As audiências de Paulo expõem justiça, domínio próprio e juízo vindouro.", ["Atos 23:24", "Atos 24:25"]],
  G5347: ["Phestos", "Φῆστος", "Phestos", "nome próprio", "Festo", "Festo é governador romano no processo de Paulo.", "Sua atuação conduz o apelo de Paulo a César e a apresentação diante de Agripa.", ["Atos 24:27", "Atos 25:12"]],
  G717: ["Harmagedon", "Ἁρμαγεδών", "Harmagedon", "nome próprio", "Armagedom", "Armagedom é nome simbólico associado ao ajuntamento final em Apocalipse.", "A imagem concentra conflito escatológico, juízo e vitória de Deus.", ["Apocalipse 16:16"]]
};

const wordBank = Object.fromEntries(Object.entries(entries).map(([strong, values]) => {
  const gloss = values[4].split(",").map(item => item.trim()).filter(Boolean);
  return [strong, gloss];
}));

Object.assign(wordBank, {
  G3972: ["Paulo"],
  G4569: ["Saulo"],
  G5103: ["Tito"],
  G5371: ["Filemom"],
  G897: ["Babilônia", "Babilonia"],
  G2541: ["César", "Cesar"]
});

function normalize(value) {
  return String(value || "").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

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

function wordPattern(word) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}\\p{N}_])(${escaped})(?=[^\\p{L}\\p{N}_]|$)`, "iu");
}

let added = 0;

for (const id of ntIds) {
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
lexicon = lexicon.replace(/\n\/\/ BEGIN NT POLISH LAYER[\s\S]*?\/\/ END NT POLISH LAYER\n?/u, "\n");
lexicon += `\n// BEGIN NT POLISH LAYER\nObject.assign(globalThis.appData.lexicon, ${JSON.stringify(payload, null, 2)});\n// END NT POLISH LAYER\n`;
fs.writeFileSync(lexiconFile, lexicon);

console.log(JSON.stringify({ added, entries: Object.keys(entries).length }, null, 2));
