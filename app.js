const appData = globalThis.appData;

const state = {
      bookId: appData.books[0]?.id || "matthew",
      chapter: 1,
      selected: null,
      selectedVerseNote: null,
      tab: "original",
      readerTheme: loadUiPreference("reader-theme:v1", "light"),
      readerFontSize: loadUiPreference("reader-font-size:v1", "m"),
      ai: loadAiSettings()
    };

    const els = {
      homeScreen: document.getElementById("homeScreen"),
      enterStudy: document.getElementById("enterStudy"),
      skipHome: document.getElementById("skipHome"),
      bookSelect: document.getElementById("bookSelect"),
      chapterSelect: document.getElementById("chapterSelect"),
      verses: document.getElementById("verses"),
      chapterTitle: document.getElementById("chapterTitle"),
      sourceNote: document.getElementById("sourceNote"),
      studyCard: document.getElementById("studyCard"),
      noteText: document.getElementById("noteText"),
      noteHint: document.getElementById("noteHint"),
      saveNote: document.getElementById("saveNote"),
      clearNote: document.getElementById("clearNote"),
      noteStatus: document.getElementById("noteStatus"),
      favoritesList: document.getElementById("favoritesList"),
      studySummary: document.getElementById("studySummary"),
      myStudyList: document.getElementById("myStudyList"),
      downloadMyStudy: document.getElementById("downloadMyStudy"),
      clearMyStudy: document.getElementById("clearMyStudy"),
      customMarksList: document.getElementById("customMarksList"),
      historyList: document.getElementById("historyList"),
      prevChapter: document.getElementById("prevChapter"),
      nextChapter: document.getElementById("nextChapter"),
      themeToggle: document.getElementById("themeToggle"),
      fontSizeToggle: document.getElementById("fontSizeToggle"),
      searchInput: document.getElementById("searchInput"),
      searchButton: document.getElementById("searchButton"),
      clearSearch: document.getElementById("clearSearch"),
      searchResults: document.getElementById("searchResults"),
      aiEndpoint: document.getElementById("aiEndpoint"),
      aiModel: document.getElementById("aiModel"),
      aiKey: document.getElementById("aiKey"),
      saveAiSettings: document.getElementById("saveAiSettings"),
      clearHistory: document.getElementById("clearHistory"),
      themeList: document.getElementById("themeList"),
      themeName: document.getElementById("themeName"),
      themeQuery: document.getElementById("themeQuery"),
      addTheme: document.getElementById("addTheme"),
      toast: document.getElementById("toast")
    };

const defaultStudyThemes = [
  { name: "Amor", query: "G25|amor", hint: "amor do Pai, do Filho e dos discípulos" },
  { name: "Fé", query: "G4100|crer|creu", hint: "crer, confiar, responder a Cristo" },
  { name: "Vida eterna", query: "G2222|G166|vida eterna", hint: "vida, eternidade e ressurreição" },
  { name: "Luz e trevas", query: "G5457|G4653|luz|trevas", hint: "revelação, juízo e resistência" },
  { name: "Testemunho", query: "G3140|G3141|G3144|testemunho", hint: "testemunhas que apontam para Cristo" },
  { name: "Espírito", query: "G4151|espírito", hint: "vento, sopro, Espírito e vida" },
  { name: "Reino", query: "G932|G935|rei|reino", hint: "rei, reino e autoridade de Jesus" },
  { name: "Glória", query: "G1391|glória", hint: "glória revelada nos sinais e na cruz" },
  { name: "Paixão", query: "G4091|G4716|G4717|G1115|Pilatos|cruz", hint: "julgamento, cruz e Gólgota" }
];

    function getBook() {
      return appData.books.find(book => book.id === state.bookId);
    }

    function enterStudy() {
      els.homeScreen.classList.add("hidden");
      localStorage.setItem("home-seen:v1", "true");
    }

    function loadUiPreference(key, fallback) {
      try {
        return localStorage.getItem(key) || fallback;
      } catch (error) {
        return fallback;
      }
    }

    function saveUiPreference(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {}
    }

    function applyReaderTheme(theme = state.readerTheme) {
      const nextTheme = theme === "dark" ? "dark" : "light";
      state.readerTheme = nextTheme;
      document.documentElement.dataset.theme = nextTheme;
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", nextTheme === "dark" ? "#07110f" : "#082a5c");
      if (els.themeToggle) {
        els.themeToggle.textContent = nextTheme === "dark" ? "Claro" : "Escuro";
        els.themeToggle.dataset.icon = nextTheme === "dark" ? "☀" : "☾";
        els.themeToggle.title = nextTheme === "dark" ? "Usar modo claro" : "Usar modo escuro";
        els.themeToggle.setAttribute("aria-label", els.themeToggle.title);
      }
      saveUiPreference("reader-theme:v1", nextTheme);
    }

    function applyReaderFontSize(size = state.readerFontSize) {
      const allowedSizes = new Set(["s", "m", "l", "xl"]);
      const nextSize = allowedSizes.has(size) ? size : "m";
      const labels = {
        s: "A-",
        m: "A",
        l: "A+",
        xl: "A++"
      };
      const names = {
        s: "Texto pequeno",
        m: "Texto normal",
        l: "Texto grande",
        xl: "Texto maior"
      };
      state.readerFontSize = nextSize;
      document.documentElement.dataset.readerFont = nextSize;
      if (els.fontSizeToggle) {
        els.fontSizeToggle.textContent = labels[nextSize];
        els.fontSizeToggle.title = `${names[nextSize]}. Toque para mudar.`;
        els.fontSizeToggle.setAttribute("aria-label", els.fontSizeToggle.title);
      }
      saveUiPreference("reader-font-size:v1", nextSize);
    }

    function cycleReaderFontSize() {
      const sizes = ["s", "m", "l", "xl"];
      const currentIndex = sizes.indexOf(state.readerFontSize);
      applyReaderFontSize(sizes[(currentIndex + 1) % sizes.length]);
    }

    function getChapter() {
      return getBook().chapters.find(chapter => chapter.number === state.chapter);
    }

    function populateControls() {
      els.bookSelect.innerHTML = appData.books.map(book => `<option value="${book.id}">${book.name}</option>`).join("");
      els.bookSelect.value = state.bookId;
      updateChapterSelect();
      els.sourceNote.textContent = appData.source;
    }

    function updateChapterSelect() {
      const book = getBook();
      els.chapterSelect.innerHTML = book.chapters
        .map(chapter => `<option value="${chapter.number}">Capítulo ${chapter.number}</option>`)
        .join("");
      els.chapterSelect.value = String(state.chapter);
    }

    function renderChapter() {
      const book = getBook();
      const chapter = getChapter();
      els.chapterTitle.textContent = `${book.name} ${chapter.number}`;
      els.verses.innerHTML = chapter.verses.map(renderVerse).join("");
      els.prevChapter.disabled = chapter.number === book.chapters[0].number;
      els.nextChapter.disabled = chapter.number === book.chapters[book.chapters.length - 1].number;
      bindTokens();
      bindUnmarkedWords();
      bindFavoriteButtons();
      bindVerseNoteButtons();
      renderFavorites();
      renderMyStudy();
      renderCustomMarks();
    }

    function renderVerse(verse) {
      const html = renderVerseText(verse);

      const favoriteActive = isFavorite(state.bookId, state.chapter, verse.n);
      const favoriteLabel = favoriteActive ? "Remover dos favoritos" : "Adicionar aos favoritos";
      const hasVerseNote = Boolean(localStorage.getItem(verseNoteKey(state.bookId, state.chapter, verse.n)));
      const verseNoteActive = state.selectedVerseNote?.verse === verse.n && state.selectedVerseNote?.chapter === state.chapter && state.selectedVerseNote?.bookId === state.bookId;
      return `<p class="verse" id="verse-${verse.n}"><span class="verse-num">${verse.n}</span><button class="favorite-button ${favoriteActive ? "active" : ""}" type="button" data-favorite-verse="${verse.n}" title="${favoriteLabel}" aria-label="${favoriteLabel}">${favoriteActive ? "★" : "☆"}</button><button class="verse-note-button ${hasVerseNote || verseNoteActive ? "active" : ""}" type="button" data-note-verse="${verse.n}" title="Nota do versículo" aria-label="Nota do versículo">✎</button>${html}</p>`;
    }

    function renderVerseText(verse) {
      const tokens = getVerseTokens(state.bookId, state.chapter, verse);
      const ranges = buildTokenRanges(verse.text, tokens);
      let cursor = 0;
      const pieces = [];

      ranges.forEach(range => {
        if (range.start > cursor) {
          pieces.push(renderUnmarkedSegment(verse.text.slice(cursor, range.start), verse.n));
        }

        const visibleWord = verse.text.slice(range.start, range.end);
        const personalClass = range.token.personal ? " personal-token" : "";
        pieces.push(`<span class="token${personalClass}" data-verse="${verse.n}" data-strong="${escapeHtml(range.token.strong)}" data-word="${escapeHtml(range.token.word)}" tabindex="0" role="button" title="Strong ${escapeHtml(range.token.strong)}">${escapeHtml(visibleWord)}</span>`);
        cursor = range.end;
      });

      if (cursor < verse.text.length) {
        pieces.push(renderUnmarkedSegment(verse.text.slice(cursor), verse.n));
      }

      return pieces.join("");
    }

    function buildTokenRanges(text, tokens) {
      const ranges = [];

      function overlaps(start, end) {
        return ranges.some(range => start < range.end && end > range.start);
      }

      tokens.forEach(token => {
        const pattern = new RegExp(`(^|[^\\p{L}\\p{N}_])(${escapeRegExp(token.word)})(?=[^\\p{L}\\p{N}_]|$)`, "giu");
        let match;

        while ((match = pattern.exec(text))) {
          const start = match.index + match[1].length;
          const end = start + match[2].length;
          if (!overlaps(start, end)) {
            ranges.push({ start, end, token });
            break;
          }
        }
      });

      return ranges.sort((left, right) => left.start - right.start || right.end - left.end);
    }

    function renderUnmarkedSegment(segment, verseNumber) {
      return escapeHtml(segment).replace(/[\p{L}\p{N}]+/gu, word => {
        if (normalizeText(word).length < 2) return word;
        return `<span class="plain-word" data-verse="${verseNumber}" data-word="${escapeHtml(word)}" tabindex="0" role="button">${word}</span>`;
      });
    }

    function bindTokens() {
      document.querySelectorAll(".token").forEach(el => {
        el.addEventListener("click", () => selectToken(el));
        el.addEventListener("keydown", event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectToken(el);
          }
        });
      });
    }

    function bindUnmarkedWords() {
      document.querySelectorAll(".plain-word").forEach(el => {
        el.addEventListener("click", () => openMarkingAssistant(el));
        el.addEventListener("keydown", event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openMarkingAssistant(el);
          }
        });
      });
    }

    function bindFavoriteButtons() {
      document.querySelectorAll("[data-favorite-verse]").forEach(button => {
        button.addEventListener("click", () => {
          toggleFavorite(state.bookId, state.chapter, Number(button.dataset.favoriteVerse));
          renderChapter();
        });
      });
    }

    function bindVerseNoteButtons() {
      document.querySelectorAll("[data-note-verse]").forEach(button => {
        button.addEventListener("click", () => selectVerseNote(Number(button.dataset.noteVerse)));
      });
    }

    function customMarkKey(bookId, chapter, verse) {
      return `${bookId}:${chapter}:${verse}`;
    }

    function loadCustomMarks() {
      try {
        return JSON.parse(localStorage.getItem("assisted-marks:v1") || "{}");
      } catch (error) {
        return {};
      }
    }

    function saveCustomMarks(marks) {
      localStorage.setItem("assisted-marks:v1", JSON.stringify(marks));
    }

    function getCustomMarksForVerse(bookId, chapter, verse) {
      const marks = loadCustomMarks();
      return marks[customMarkKey(bookId, chapter, verse)] || [];
    }

    function getVerseTokens(bookId, chapterNumber, verse) {
      return [
        ...(verse.tokens || []),
        ...getCustomMarksForVerse(bookId, chapterNumber, verse.n).map(mark => ({ ...mark, personal: true }))
      ];
    }

    function openMarkingAssistant(el) {
      const verseNumber = Number(el.dataset.verse);
      const word = el.dataset.word || el.textContent.trim();
      const verse = getChapter().verses.find(item => item.n === verseNumber);
      document.querySelectorAll(".token.active, .plain-word.active").forEach(active => active.classList.remove("active"));
      el.classList.add("active");
      state.selected = null;
      state.selectedVerseNote = null;
      renderMarkingAssistant(word, verse);
    }

    function renderMarkingAssistant(word, verse) {
      const suggestions = findStrongSuggestionsForWord(word);
      const suggestionButtons = suggestions.length
        ? suggestions.map(suggestion => `
            <div class="suggestion-item">
              <div>
                <strong>${escapeHtml(suggestion.strong)} - ${escapeHtml(suggestion.gloss)}</strong>
                <span>${escapeHtml(suggestion.reason)}</span>
                <small>${escapeHtml(suggestion.refs.join(", "))}</small>
              </div>
              <button class="primary suggestion-mark" type="button" data-suggest-strong="${escapeHtml(suggestion.strong)}" data-suggest-word="${escapeHtml(word)}" data-suggest-verse="${verse.n}">Marcar ${escapeHtml(suggestion.strong)}</button>
            </div>
          `).join("")
        : `<p class="assistant-empty">Ainda não achei essa palavra marcada em outro lugar nem no léxico local. A IA pode investigar o termo no versículo e sugerir um Strong para revisão.</p>`;

      els.studyCard.innerHTML = `
        <div class="card-header">
          <span class="label">Marcação assistida</span>
          <h3>${escapeHtml(word)}</h3>
          <p>${escapeHtml(getBook().name)} ${state.chapter}:${verse.n}</p>
        </div>
        <div class="assistant-panel">
          <p class="prose">Escolha uma sugestão para marcar esta palavra neste versículo. Esta marcação ficará salva neste navegador como marcação pessoal.</p>
          <div class="suggestion-list">${suggestionButtons}</div>
          <div class="assistant-actions">
            <button id="suggestStrongAi" class="secondary" type="button">Sugerir com IA</button>
            <button id="copyStrongPrompt" class="secondary" type="button">Copiar prompt</button>
          </div>
          <div id="strongAiResponse" class="ai-response"></div>
        </div>
      `;

      document.querySelectorAll("[data-suggest-strong]").forEach(button => {
        button.addEventListener("click", () => {
          addCustomStrongMark(Number(button.dataset.suggestVerse), button.dataset.suggestWord, button.dataset.suggestStrong);
        });
      });

      const suggestStrongAi = document.getElementById("suggestStrongAi");
      if (suggestStrongAi) {
        suggestStrongAi.addEventListener("click", () => runStrongSuggestion(word, verse, suggestions));
      }

      const copyStrongPrompt = document.getElementById("copyStrongPrompt");
      if (copyStrongPrompt) {
        copyStrongPrompt.addEventListener("click", async () => {
          await navigator.clipboard.writeText(buildStrongSuggestionPrompt(word, verse));
          showToast("Prompt copiado.");
        });
      }
    }

    function findStrongSuggestionsForWord(word) {
      const normalizedWord = normalizeText(word);
      const exact = new Map();
      const related = new Map();

      function addSuggestion(map, strong, reason, ref) {
        const entry = appData.lexicon[strong];
        if (!entry) return;
        if (!map.has(strong)) {
          map.set(strong, {
            strong,
            gloss: entry.gloss || entry.lemma || "",
            reason,
            refs: []
          });
        }
        if (ref && map.get(strong).refs.length < 4) map.get(strong).refs.push(ref);
      }

      appData.books.forEach(book => {
        book.chapters.forEach(chapter => {
          chapter.verses.forEach(verse => {
            getVerseTokens(book.id, chapter.number, verse).forEach(token => {
              const normalizedToken = normalizeText(token.word);
              const ref = `${book.name} ${chapter.number}:${verse.n}`;
              if (normalizedToken === normalizedWord) {
                addSuggestion(exact, token.strong, "Já existe marcada com esta mesma palavra.", ref);
              }
            });
          });
        });
      });

      if (!exact.size) {
        findMatchingStrong(word).forEach(strong => {
          addSuggestion(related, strong, "O léxico Strong combina com sua busca.", "Léxico");
        });
      }

      return [...exact.values(), ...related.values()].slice(0, 8);
    }

    function buildStrongSuggestionPrompt(word, verse) {
      return [
        `Estou estudando ${getBook().name} ${state.chapter}:${verse.n}.`,
        `Palavra em português a investigar: "${word}".`,
        "",
        `Texto do versículo: ${verse.text}`,
        "",
        "Identifique qual palavra hebraica ou grega provavelmente está por trás dessa tradução e sugira o número Strong mais provável.",
        "Responda em português, com:",
        "1. Strong sugerido.",
        "2. Palavra original, transliteração e sentido básico.",
        "3. Motivo contextual.",
        "4. Grau de confiança: alto, médio ou baixo.",
        "5. Se houver ambiguidade, diga claramente.",
        "",
        "Não invente certeza. Se depender de conferir texto crítico/interlinear, diga que é uma inferência."
      ].join("\n");
    }

    async function runStrongSuggestion(word, verse, currentSuggestions = []) {
      const responseBox = document.getElementById("strongAiResponse");
      const runButton = document.getElementById("suggestStrongAi");
      const settings = loadAiSettings();
      const isLocal = /^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])/i.test(settings.endpoint || "");

      if (currentSuggestions.length === 1) {
        addCustomStrongMark(verse.n, word, currentSuggestions[0].strong);
        showToast(`Sugestão ${currentSuggestions[0].strong} aplicada.`);
        return;
      }

      if (!settings.endpoint || !settings.model) {
        openAiSettings();
        showToast("Confira endpoint e modelo da IA.");
        return;
      }

      if (!settings.apiKey && !isLocal) {
        openAiSettings();
        showToast("Cole sua chave da IA e salve.");
        return;
      }

      runButton.disabled = true;
      responseBox.textContent = "Investigando...";

      try {
        const headers = { "Content-Type": "application/json" };
        if (settings.apiKey) headers.Authorization = `Bearer ${settings.apiKey}`;

        const result = await fetch(settings.endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: settings.model,
            temperature: 0.1,
            messages: [
              {
                role: "system",
                content: "Você ajuda a identificar possíveis números Strong em textos bíblicos. Seja cauteloso, sinalize incerteza e não invente fonte."
              },
              { role: "user", content: buildStrongSuggestionPrompt(word, verse) }
            ]
          })
        });

        if (!result.ok) {
          const errorText = await result.text();
          throw new Error(errorText || `Erro ${result.status}`);
        }

        const data = await result.json();
        const text = extractAiText(data);
        const strongs = extractStrongCodes(text)
          .filter(strong => appData.lexicon[strong]);

        if (strongs.length === 1) {
          responseBox.innerHTML = renderMarkdown(text);
          addCustomStrongMark(verse.n, word, strongs[0]);
          showToast(`Sugestão ${strongs[0]} aplicada.`);
          return;
        }

        const actionButtons = strongs.map(strong => `
          <button class="secondary strong-ai-mark" type="button" data-ai-strong="${escapeHtml(strong)}" data-ai-word="${escapeHtml(word)}" data-ai-verse="${verse.n}">
            Marcar ${escapeHtml(strong)}
          </button>
        `).join("");

        responseBox.innerHTML = `${renderMarkdown(text)}${actionButtons ? `<div class="assistant-actions">${actionButtons}</div>` : `<p class="assistant-empty">A IA não indicou um Strong que já tenha card no app.</p>`}`;
        document.querySelectorAll("[data-ai-strong]").forEach(button => {
          button.addEventListener("click", () => {
            addCustomStrongMark(Number(button.dataset.aiVerse), button.dataset.aiWord, button.dataset.aiStrong);
          });
        });
        showToast("Sugestão da IA pronta.");
      } catch (error) {
        responseBox.textContent = `Não foi possível chamar a IA.\n\n${error.message}`;
        showToast("IA não respondeu.");
      } finally {
        runButton.disabled = false;
      }
    }

    function extractStrongCodes(text) {
      const matches = [
        ...(text.match(/H\s*[-:]?\s*\d+/gi) || []),
        ...(text.match(/G\s*[-:]?\s*\d+/gi) || []),
        ...(text.match(/Strong\s*[-:]?\s*(\d+)/gi) || [])
      ];

      return [...new Set(matches.map(item => {
        const number = item.match(/\d+/)?.[0];
        if (!number) return "";
        const explicitPrefix = item.match(/[HG]/i)?.[0]?.toUpperCase();
        if (explicitPrefix) return `${explicitPrefix}${number}`;
        const currentBookHasHebrew = getBook()?.chapters?.some(chapter => (
          chapter.verses.some(verse => (verse.tokens || []).some(token => /^H\d+$/i.test(token.strong)))
        ));
        return `${currentBookHasHebrew ? "H" : "G"}${number}`;
      }).filter(Boolean))];
    }

    function addCustomStrongMark(verseNumber, word, strong) {
      if (!/^[HG]\d+$/i.test(strong || "")) {
        showToast("A sugestão precisa ter um Strong válido.");
        return;
      }

      const normalizedStrong = strong.toUpperCase();
      const entry = appData.lexicon[normalizedStrong];
      if (!entry) {
        showToast("Esse Strong ainda não tem card no app.");
        return;
      }

      const verse = getChapter().verses.find(item => item.n === verseNumber);
      const existing = getVerseTokens(state.bookId, state.chapter, verse).some(token => (
        normalizeText(token.word) === normalizeText(word) &&
        token.strong === normalizedStrong
      ));

      if (existing) {
        showToast("Essa marcação já existe neste versículo.");
        return;
      }

      const marks = loadCustomMarks();
      const key = customMarkKey(state.bookId, state.chapter, verseNumber);
      marks[key] = [...(marks[key] || []), {
        word,
        strong: normalizedStrong,
        addedAt: new Date().toISOString()
      }];
      saveCustomMarks(marks);
      renderChapter();
      openStrongOccurrence(state.bookId, state.chapter, verseNumber, normalizedStrong);
      showToast("Palavra marcada.");
    }

    function collectCustomMarkItems() {
      const marks = loadCustomMarks();
      const items = [];

      Object.entries(marks).forEach(([key, entries]) => {
        if (!Array.isArray(entries) || !entries.length) return;
        const [bookId, chapterValue, verseValue] = key.split(":");
        const chapterNumber = Number(chapterValue);
        const verseNumber = Number(verseValue);
        const book = appData.books.find(item => item.id === bookId);
        const chapter = book?.chapters.find(item => item.number === chapterNumber);
        const verse = chapter?.verses.find(item => item.n === verseNumber);
        if (!book || !chapter || !verse) return;

        entries.forEach((mark, index) => {
          items.push({
            key,
            index,
            bookId,
            bookName: book.name,
            chapter: chapterNumber,
            verse: verseNumber,
            word: mark.word,
            strong: mark.strong,
            text: verse.text,
            addedAt: mark.addedAt || ""
          });
        });
      });

      return items.sort((left, right) => {
        const dateSort = String(right.addedAt).localeCompare(String(left.addedAt));
        if (dateSort) return dateSort;
        return `${left.bookName} ${left.chapter}:${left.verse}`.localeCompare(`${right.bookName} ${right.chapter}:${right.verse}`);
      });
    }

    function renderCustomMarks() {
      if (!els.customMarksList) return;
      const items = collectCustomMarkItems();

      if (!items.length) {
        els.customMarksList.innerHTML = `<p class="custom-mark-empty">Nenhuma marcação pessoal ainda.</p>`;
        return;
      }

      els.customMarksList.innerHTML = items.map(item => `
        <div class="custom-mark-row">
          <button class="custom-mark-item" type="button" data-custom-open="${escapeHtml(encodeCustomMarkItem(item))}">
            <strong>${escapeHtml(item.word)} (${escapeHtml(item.strong)})</strong>
            ${escapeHtml(item.bookName)} ${item.chapter}:${item.verse}
            <span>${escapeHtml(item.text.slice(0, 76))}${item.text.length > 76 ? "..." : ""}</span>
          </button>
          <button class="remove-custom-mark" type="button" data-custom-remove="${escapeHtml(encodeCustomMarkItem(item))}" title="Remover marcação" aria-label="Remover marcação">×</button>
        </div>
      `).join("");

      document.querySelectorAll("[data-custom-open]").forEach(button => {
        button.addEventListener("click", () => {
          const item = decodeCustomMarkItem(button.dataset.customOpen);
          if (item) openStrongOccurrence(item.bookId, item.chapter, item.verse, item.strong);
        });
      });

      document.querySelectorAll("[data-custom-remove]").forEach(button => {
        button.addEventListener("click", () => {
          const item = decodeCustomMarkItem(button.dataset.customRemove);
          if (item) removeCustomMark(item);
        });
      });
    }

    function encodeCustomMarkItem(item) {
      return JSON.stringify({
        key: item.key,
        index: item.index,
        bookId: item.bookId,
        chapter: item.chapter,
        verse: item.verse,
        strong: item.strong
      });
    }

    function decodeCustomMarkItem(raw) {
      try {
        return JSON.parse(raw);
      } catch (error) {
        return null;
      }
    }

    function removeCustomMark(item) {
      const marks = loadCustomMarks();
      const entries = marks[item.key];
      if (!Array.isArray(entries)) return;

      entries.splice(item.index, 1);
      if (entries.length) {
        marks[item.key] = entries;
      } else {
        delete marks[item.key];
      }

      saveCustomMarks(marks);
      state.selected = null;
      renderChapter();
      loadNote();
      showToast("Marcação removida.");
    }

    function selectVerseNote(verseNumber) {
      const verse = getChapter().verses.find(item => item.n === verseNumber);
      document.querySelectorAll(".token.active").forEach(active => active.classList.remove("active"));
      state.selected = null;
      state.selectedVerseNote = {
        bookId: state.bookId,
        book: getBook().name,
        chapter: state.chapter,
        verse: verseNumber,
        verseText: verse.text
      };
      renderChapter();
      loadNote();
      addHistoryItem({
        type: "verse",
        key: `verse:${state.bookId}:${state.chapter}:${verseNumber}`,
        title: `${state.selectedVerseNote.book} ${state.chapter}:${verseNumber}`,
        subtitle: "Nota do versículo",
        bookId: state.bookId,
        chapter: state.chapter,
        verse: verseNumber
      });
    }

    function selectToken(el) {
      document.querySelectorAll(".token.active").forEach(active => active.classList.remove("active"));
      el.classList.add("active");

      const verseNumber = Number(el.dataset.verse);
      const verse = getChapter().verses.find(item => item.n === verseNumber);
      const selectedToken = {
        word: el.dataset.word || el.textContent.trim(),
        strong: el.dataset.strong
      };

      state.selected = {
        book: getBook().name,
        chapter: state.chapter,
        verse: verseNumber,
        word: selectedToken.word,
        strong: selectedToken.strong,
        verseText: verse.text
      };
      state.selectedVerseNote = null;
      state.tab = "original";

      renderStudyCard();
      loadNote();
      addHistoryItem({
        type: "word",
        key: `word:${state.bookId}:${state.chapter}:${verseNumber}:${selectedToken.strong}:${selectedToken.word}`,
        title: `${selectedToken.word} (${selectedToken.strong})`,
        subtitle: `${getBook().name} ${state.chapter}:${verseNumber}`,
        bookId: state.bookId,
        chapter: state.chapter,
        verse: verseNumber,
        strong: selectedToken.strong,
        word: selectedToken.word
      });
    }

    function renderStudyCard() {
      if (!state.selected) return;
      const entry = appData.lexicon[state.selected.strong];
      const occurrences = findOccurrences(state.selected.strong);
      const occurrenceSummary = buildOccurrenceSummary(occurrences);
      const prompt = buildAiPrompt(entry, occurrences);

      els.studyCard.innerHTML = `
        <div class="card-header">
          <span class="label">Strong ${state.selected.strong}</span>
          <h3>${escapeHtml(state.selected.word)}</h3>
          <p>${escapeHtml(state.selected.book)} ${state.selected.chapter}:${state.selected.verse}</p>
        </div>
        <div class="tabs" role="tablist">
          ${tabButton("original", "Original")}
          ${tabButton("exegese", "Exegese")}
          ${tabButton("paralelos", "Paralelos")}
          ${tabButton("ia", "IA")}
        </div>
        <div class="tab-panel ${state.tab === "original" ? "active" : ""}" data-panel="original">
          <div class="strong-insight">
            <strong>${escapeHtml(occurrenceSummary)}</strong>
            <span>${escapeHtml(buildWhyItMatters(entry))}</span>
          </div>
          <dl class="data-list">
            ${dataRow("Original", entry.original)}
            ${dataRow("Translit.", entry.translit)}
            ${dataRow("Lema", entry.lemma)}
            ${dataRow("Gramática", entry.grammar)}
            ${dataRow("Sentido", entry.gloss)}
          </dl>
        </div>
        <div class="tab-panel ${state.tab === "exegese" ? "active" : ""}" data-panel="exegese">
          <p class="mini-heading">Análise exegética</p>
          <p class="prose">${escapeHtml(entry.exegetic)}</p>
          <div style="height:14px"></div>
          <p class="mini-heading">Contexto cultural</p>
          <p class="prose">${escapeHtml(entry.culture)}</p>
        </div>
        <div class="tab-panel ${state.tab === "paralelos" ? "active" : ""}" data-panel="paralelos">
          <p class="mini-heading">Textos paralelos</p>
          <div class="chips">${entry.parallels.map(item => `<span class="chip">${escapeHtml(item)}</span>`).join("")}</div>
          <div style="height:14px"></div>
          <p class="mini-heading">Ocorrências-chave</p>
          <div class="chips occurrence-chips">
            ${occurrences.slice(0, 8).map(item => `<button class="chip-button occurrence-item" type="button" data-book="${escapeHtml(item.bookId)}" data-chapter="${item.chapter}" data-verse="${item.verse}" data-strong="${escapeHtml(state.selected.strong)}">${escapeHtml(item.ref)}</button>`).join("")}
          </div>
          <div style="height:14px"></div>
          <p class="mini-heading">Dossiê da palavra</p>
          <ul class="occurrence-list">
            ${occurrences.map(item => `<li><button class="occurrence-item" type="button" data-book="${escapeHtml(item.bookId)}" data-chapter="${item.chapter}" data-verse="${item.verse}" data-strong="${escapeHtml(state.selected.strong)}"><strong>${escapeHtml(item.ref)}</strong> ${escapeHtml(item.text)}</button></li>`).join("")}
          </ul>
        </div>
        <div class="tab-panel ${state.tab === "ia" ? "active" : ""}" data-panel="ia">
          <div class="ai-box">
            <p class="prose">Com a IA configurada, este painel envia o prompt e recebe a análise aqui. Sem configuração, você ainda pode copiar o prompt.</p>
            <textarea id="aiPrompt" readonly>${escapeHtml(prompt)}</textarea>
            <div class="ai-actions">
              <button id="runAi" class="primary" type="button">Analisar com IA</button>
              <button id="copyPrompt" class="secondary" type="button">Copiar prompt</button>
              <button id="toggleAiResponse" class="secondary" type="button">Minimizar</button>
              <button id="saveAiNote" class="secondary" type="button">Usar resposta na nota</button>
            </div>
            <div id="aiResponse" class="ai-response">${renderMarkdown(loadAiResult())}</div>
          </div>
        </div>
      `;

      document.querySelectorAll(".tab").forEach(button => {
        button.addEventListener("click", () => {
          state.tab = button.dataset.tab;
          renderStudyCard();
        });
      });

      const copyPrompt = document.getElementById("copyPrompt");
      if (copyPrompt) {
        copyPrompt.addEventListener("click", async () => {
          await navigator.clipboard.writeText(document.getElementById("aiPrompt").value);
          showToast("Prompt copiado.");
        });
      }

      const saveAiNote = document.getElementById("saveAiNote");
      if (saveAiNote) {
        saveAiNote.addEventListener("click", () => {
          const response = document.getElementById("aiResponse").textContent.trim();
          els.noteText.value = response || document.getElementById("aiPrompt").value;
          showToast(response ? "Resposta colocada na nota." : "Prompt colocado na nota.");
        });
      }

      const runAi = document.getElementById("runAi");
      if (runAi) {
        runAi.addEventListener("click", () => runAiAnalysis(prompt));
      }

      document.querySelectorAll(".occurrence-item").forEach(button => {
        button.addEventListener("click", () => openStrongOccurrence(
          button.dataset.book,
          Number(button.dataset.chapter),
          Number(button.dataset.verse),
          button.dataset.strong
        ));
      });

      const toggleAiResponse = document.getElementById("toggleAiResponse");
      if (toggleAiResponse) {
        toggleAiResponse.addEventListener("click", () => {
          const responseBox = document.getElementById("aiResponse");
          responseBox.classList.toggle("collapsed");
          toggleAiResponse.textContent = responseBox.classList.contains("collapsed") ? "Expandir" : "Minimizar";
        });
      }
    }

    function tabButton(id, label) {
      return `<button class="tab ${state.tab === id ? "active" : ""}" data-tab="${id}" type="button" role="tab">${label}</button>`;
    }

    function dataRow(label, value) {
      return `<div class="data-row"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`;
    }

    function findOccurrences(strong) {
      const matches = [];
      appData.books.forEach(book => {
        book.chapters.forEach(chapter => {
          chapter.verses.forEach(verse => {
            if (getVerseTokens(book.id, chapter.number, verse).some(item => item.strong === strong)) {
              matches.push({
                bookId: book.id,
                ref: `${book.name} ${chapter.number}:${verse.n}`,
                chapter: chapter.number,
                verse: verse.n,
                text: verse.text
              });
            }
          });
        });
      });
      return matches;
    }

    function buildOccurrenceSummary(occurrences) {
      if (!occurrences.length) return "Sem outras ocorrências marcadas no app.";
      const first = occurrences[0];
      const last = occurrences[occurrences.length - 1];
      if (occurrences.length === 1) return `1 ocorrência marcada no app: ${first.ref}.`;
      return `${occurrences.length} ocorrências marcadas no app, de ${first.ref} a ${last.ref}.`;
    }

    function buildWhyItMatters(entry) {
      const firstSentence = entry.exegetic?.split(/(?<=[.!?])\s+/)[0];
      return firstSentence || "Esta palavra ajuda a perceber o foco do texto e suas conexões no Evangelho.";
    }

    function buildAiPrompt(entry, occurrences) {
      return [
        `Analise ${state.selected.book} ${state.selected.chapter}:${state.selected.verse}, com foco na palavra "${state.selected.word}" (${state.selected.strong}).`,
        "",
        `Texto do versículo: ${state.selected.verseText}`,
        `Grego/Hebraico: ${entry.original} (${entry.translit}); lema: ${entry.lemma}; gramatica: ${entry.grammar}; sentido-base: ${entry.gloss}.`,
        "",
        "Responda em portugues, separando:",
        "1. Observacao gramatical e lexical.",
        "2. Sentido da palavra no contexto imediato.",
        "3. Contexto histórico-cultural relevante.",
        "4. Textos paralelos e conexoes biblicas.",
        "5. Cuidados contra interpretacoes exageradas.",
        "",
        `Ocorrências no protótipo: ${occurrences.map(item => item.ref).join(", ")}.`,
        "Não invente fontes. Quando estiver inferindo, diga que é uma inferência."
      ].join("\n");
    }

    function loadAiSettings() {
      const fallback = {
        endpoint: "https://api.openai.com/v1/chat/completions",
        model: "gpt-4.1-mini",
        apiKey: ""
      };

      try {
        const saved = { ...fallback, ...JSON.parse(localStorage.getItem("ai-settings") || "{}") };
        return {
          endpoint: saved.endpoint?.trim() || fallback.endpoint,
          model: saved.model?.trim() || fallback.model,
          apiKey: saved.apiKey?.trim() || ""
        };
      } catch (error) {
        return fallback;
      }
    }

    function initAiSettings() {
      els.aiEndpoint.value = state.ai.endpoint || "";
      els.aiModel.value = state.ai.model || "";
      els.aiKey.value = state.ai.apiKey || "";
    }

    function saveAiSettings() {
      const fallback = loadAiSettings();
      state.ai = {
        endpoint: els.aiEndpoint.value.trim() || fallback.endpoint,
        model: els.aiModel.value.trim() || fallback.model,
        apiKey: els.aiKey.value.trim()
      };
      initAiSettings();
      localStorage.setItem("ai-settings", JSON.stringify(state.ai));
      showToast("Configuração da IA salva.");
    }

    function openAiSettings() {
      const settingsDetails = document.querySelector(".settings-panel details");
      if (settingsDetails) settingsDetails.open = true;
      els.aiKey.focus();
    }

    function aiResultKey() {
      if (!state.selected) return "ai-result:none";
      return `ai-result:${state.bookId}:${state.chapter}:${state.selected.verse}:${state.selected.strong}:${state.selected.word}`;
    }

    function loadAiResult() {
      return localStorage.getItem(aiResultKey()) || "";
    }

    async function runAiAnalysis(prompt) {
      const responseBox = document.getElementById("aiResponse");
      const runButton = document.getElementById("runAi");
      const settings = loadAiSettings();
      const isLocal = /^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])/i.test(settings.endpoint || "");

      if (!settings.endpoint || !settings.model) {
        openAiSettings();
        showToast("Confira endpoint e modelo da IA.");
        return;
      }

      if (!settings.apiKey && !isLocal) {
        openAiSettings();
        showToast("Cole sua chave da IA e salve.");
        return;
      }

      runButton.disabled = true;
      responseBox.textContent = "Analisando...";
      responseBox.classList.remove("collapsed");

      try {
        const headers = { "Content-Type": "application/json" };
        if (settings.apiKey) headers.Authorization = `Bearer ${settings.apiKey}`;

        const result = await fetch(settings.endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: settings.model,
            temperature: 0.2,
            messages: [
              {
                role: "system",
                content: "Você é um assistente de estudo bíblico. Responda com cuidado, separe texto, contexto e inferência, e evite afirmar fontes que não foram fornecidas."
              },
              { role: "user", content: prompt }
            ]
          })
        });

        if (!result.ok) {
          const errorText = await result.text();
          throw new Error(errorText || `Erro ${result.status}`);
        }

        const data = await result.json();
        const text = extractAiText(data);
        responseBox.innerHTML = renderMarkdown(text);
        localStorage.setItem(aiResultKey(), text);
        renderMyStudy();
        showToast("Analise concluída.");
      } catch (error) {
        responseBox.textContent = `Não foi possível chamar a IA.\n\n${error.message}`;
        showToast("IA não respondeu.");
      } finally {
        runButton.disabled = false;
      }
    }

    function renderMarkdown(text) {
      if (!text) return "";

      const blocks = escapeHtml(text)
        .split(/\n{2,}/)
        .map(block => block.trim())
        .filter(Boolean);

      return blocks.map(block => {
        if (/^###\s+/.test(block)) return `<h3>${inlineMarkdown(block.replace(/^###\s+/, ""))}</h3>`;
        if (/^##\s+/.test(block)) return `<h2>${inlineMarkdown(block.replace(/^##\s+/, ""))}</h2>`;
        if (/^#\s+/.test(block)) return `<h1>${inlineMarkdown(block.replace(/^#\s+/, ""))}</h1>`;

        const lines = block.split("\n");
        if (lines.every(line => /^[-*]\s+/.test(line))) {
          return `<ul>${lines.map(line => `<li>${inlineMarkdown(line.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`;
        }

        if (lines.every(line => /^\d+\.\s+/.test(line))) {
          return `<ol>${lines.map(line => `<li>${inlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>`).join("")}</ol>`;
        }

        return `<p>${inlineMarkdown(lines.join("<br>"))}</p>`;
      }).join("");
    }

    function inlineMarkdown(text) {
      return text
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>");
    }

    function extractAiText(data) {
      if (data?.choices?.[0]?.message?.content) return data.choices[0].message.content.trim();
      if (data?.choices?.[0]?.text) return data.choices[0].text.trim();
      if (data?.output_text) return data.output_text.trim();
      if (Array.isArray(data?.output)) {
        const text = data.output
          .flatMap(item => item.content || [])
          .map(item => item.text || "")
          .join("\n")
          .trim();
        if (text) return text;
      }
      return JSON.stringify(data, null, 2);
    }

    function noteKey() {
      if (state.selected) {
        return `note:${state.bookId}:${state.chapter}:${state.selected.verse}:${state.selected.strong}:${state.selected.word}`;
      }
      if (state.selectedVerseNote) {
        return verseNoteKey(state.selectedVerseNote.bookId, state.selectedVerseNote.chapter, state.selectedVerseNote.verse);
      }
      return `note:${state.bookId}:${state.chapter}`;
    }

    function verseNoteKey(bookId, chapter, verse) {
      return `verse-note:${bookId}:${chapter}:${verse}`;
    }

    function loadNote() {
      const key = noteKey();
      els.noteText.value = localStorage.getItem(key) || "";
      if (state.selected) {
        els.noteHint.textContent = `Nota para ${state.selected.word} em ${state.selected.book} ${state.selected.chapter}:${state.selected.verse}.`;
      } else if (state.selectedVerseNote) {
        els.noteHint.textContent = `Nota do versículo ${state.selectedVerseNote.book} ${state.selectedVerseNote.chapter}:${state.selectedVerseNote.verse}.`;
      } else {
        els.noteHint.textContent = "Selecione uma palavra ou versículo para escrever uma nota.";
      }
      els.noteStatus.textContent = "";
    }

    function saveNote() {
      const noteText = els.noteText.value.trim();
      const aiText = getCurrentAiAnalysis();

      localStorage.setItem(noteKey(), els.noteText.value);
      renderChapter();
      els.noteText.value = localStorage.getItem(noteKey()) || "";
      renderMyStudy();

      if (noteText || aiText) {
        const context = getCurrentStudyContext();
        const markdown = buildCurrentStudyMarkdown(context, noteText, aiText);
        downloadTextFile(markdown, `${buildCurrentStudyFilename(context)}.md`, "text/markdown;charset=utf-8");
        els.noteStatus.textContent = "Salvo e baixado";
        showToast("Nota salva e arquivo gerado.");
      } else {
        els.noteStatus.textContent = "Salvo";
        showToast("Nada para baixar.");
      }

      window.setTimeout(() => { els.noteStatus.textContent = ""; }, 1800);
    }

    function clearCurrentNote() {
      const key = noteKey();
      const hasSavedNote = Boolean(localStorage.getItem(key));
      const hasTypedNote = Boolean(els.noteText.value.trim());

      if (!hasSavedNote && !hasTypedNote) {
        showToast("Não há nota para limpar.");
        return;
      }

      localStorage.removeItem(key);
      els.noteText.value = "";
      renderChapter();
      loadNote();
      renderMyStudy();
      els.noteStatus.textContent = "Limpo";
      showToast("Nota limpa.");
      window.setTimeout(() => { els.noteStatus.textContent = ""; }, 1800);
    }

    function getCurrentAiAnalysis() {
      if (!state.selected) return "";
      return loadAiResult().trim();
    }

    function getCurrentStudyContext() {
      if (state.selected) {
        return {
          type: "word",
          title: `${state.selected.book} ${state.selected.chapter}:${state.selected.verse} - ${state.selected.word} (${state.selected.strong})`,
          reference: `${state.selected.book} ${state.selected.chapter}:${state.selected.verse}`,
          verseText: state.selected.verseText,
          word: state.selected.word,
          strong: state.selected.strong
        };
      }

      if (state.selectedVerseNote) {
        return {
          type: "verse",
          title: `${state.selectedVerseNote.book} ${state.selectedVerseNote.chapter}:${state.selectedVerseNote.verse}`,
          reference: `${state.selectedVerseNote.book} ${state.selectedVerseNote.chapter}:${state.selectedVerseNote.verse}`,
          verseText: state.selectedVerseNote.verseText
        };
      }

      return {
        type: "chapter",
        title: `${getBook().name} ${state.chapter}`,
        reference: `${getBook().name} ${state.chapter}`,
        verseText: ""
      };
    }

    function buildCurrentStudyMarkdown(context, noteText, aiText) {
      const today = new Date().toISOString().slice(0, 10);
      const sections = [
        `# ${context.title}`,
        "",
        `Exportado em ${today}.`,
        ""
      ];

      if (context.verseText) {
        sections.push(`> ${context.verseText}`, "");
      }

      if (aiText) {
        sections.push("## Análise com IA", "", aiText, "");
      }

      if (noteText) {
        sections.push("## Nota pessoal", "", noteText, "");
      }

      return sections.join("\n").trimEnd() + "\n";
    }

    function buildCurrentStudyFilename(context) {
      const today = new Date().toISOString().slice(0, 10);
      const suffix = context.type === "word" ? `${context.word}-${context.strong}` : context.reference;
      return `biblia-em-foco-${slugify(suffix)}-${today}`;
    }

    function slugify(value) {
      return String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80) || "estudo";
    }

    function downloadTextFile(text, filename, type) {
      const blob = new Blob([text], { type });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }

    function favoriteKey(bookId, chapter, verse) {
      return `${bookId}:${chapter}:${verse}`;
    }

    function loadFavorites() {
      try {
        return JSON.parse(localStorage.getItem("favorites:v1") || "[]");
      } catch (error) {
        return [];
      }
    }

    function saveFavorites(favorites) {
      localStorage.setItem("favorites:v1", JSON.stringify(favorites));
    }

    function isFavorite(bookId, chapter, verse) {
      const key = favoriteKey(bookId, chapter, verse);
      return loadFavorites().some(item => item.key === key);
    }

    function toggleFavorite(bookId, chapter, verse) {
      const key = favoriteKey(bookId, chapter, verse);
      const favorites = loadFavorites();
      const existingIndex = favorites.findIndex(item => item.key === key);

      if (existingIndex >= 0) {
        favorites.splice(existingIndex, 1);
        showToast("Favorito removido.");
      } else {
        const book = appData.books.find(item => item.id === bookId);
        const chapterData = book.chapters.find(item => item.number === chapter);
        const verseData = chapterData.verses.find(item => item.n === verse);
        favorites.push({
          key,
          bookId,
          bookName: book.name,
          chapter,
          verse,
          text: verseData.text
        });
        showToast("Favorito salvo.");
      }

      saveFavorites(favorites);
      renderFavorites();
      renderMyStudy();
    }

    function renderFavorites() {
      const favorites = loadFavorites();

      if (!favorites.length) {
        els.favoritesList.innerHTML = `<p class="favorite-empty">Nenhum versículo marcado ainda.</p>`;
        return;
      }

      els.favoritesList.innerHTML = favorites.map(item => `
        <button class="favorite-item" type="button" data-favorite-key="${escapeHtml(item.key)}">
          <strong>${escapeHtml(item.bookName)} ${item.chapter}:${item.verse}</strong>
          ${escapeHtml(item.text.slice(0, 96))}${item.text.length > 96 ? "..." : ""}
        </button>
      `).join("");

      document.querySelectorAll("[data-favorite-key]").forEach(button => {
        button.addEventListener("click", () => {
          const favorite = loadFavorites().find(item => item.key === button.dataset.favoriteKey);
          if (favorite) goToVerse(favorite.bookId, favorite.chapter, favorite.verse);
        });
      });
    }

    function collectStudyItems() {
      const notes = [];
      const aiResults = [];
      const studiedWords = [];

      appData.books.forEach(book => {
        book.chapters.forEach(chapter => {
          chapter.verses.forEach(verse => {
            const verseNote = localStorage.getItem(verseNoteKey(book.id, chapter.number, verse.n));
            if (verseNote?.trim()) {
              notes.push({
                type: "note",
                title: `${book.name} ${chapter.number}:${verse.n}`,
                subtitle: "Nota do versículo",
                bookId: book.id,
                chapter: chapter.number,
                verse: verse.n,
                body: verseNote.trim(),
                context: verse.text
              });
            }

            getVerseTokens(book.id, chapter.number, verse).forEach(token => {
              const note = localStorage.getItem(`note:${book.id}:${chapter.number}:${verse.n}:${token.strong}:${token.word}`);
              if (note?.trim()) {
                notes.push({
                  type: "note",
                  title: `${token.word} (${token.strong})`,
                  subtitle: `${book.name} ${chapter.number}:${verse.n}`,
                  bookId: book.id,
                  chapter: chapter.number,
                  verse: verse.n,
                  strong: token.strong,
                  word: token.word,
                  body: note.trim(),
                  context: verse.text
                });
              }

              const ai = localStorage.getItem(`ai-result:${book.id}:${chapter.number}:${verse.n}:${token.strong}:${token.word}`);
              if (ai?.trim()) {
                aiResults.push({
                  type: "ai",
                  title: `${token.word} (${token.strong})`,
                  subtitle: `${book.name} ${chapter.number}:${verse.n}`,
                  bookId: book.id,
                  chapter: chapter.number,
                  verse: verse.n,
                  strong: token.strong,
                  word: token.word,
                  body: ai.trim(),
                  context: verse.text
                });
              }
            });
          });
        });
      });

      loadHistory()
        .filter(item => item.type === "word")
        .forEach(item => studiedWords.push({ ...item, type: "word" }));

      return { notes, aiResults, studiedWords, favorites: loadFavorites() };
    }

    function renderMyStudy() {
      if (!els.myStudyList || !els.studySummary) return;
      const study = collectStudyItems();
      const total = study.notes.length + study.aiResults.length + study.favorites.length + study.studiedWords.length;

      els.studySummary.innerHTML = [
        summaryPill(study.notes.length, "notas"),
        summaryPill(study.aiResults.length, "IA"),
        summaryPill(study.favorites.length, "favoritos"),
        summaryPill(study.studiedWords.length, "palavras")
      ].join("");

      if (!total) {
        els.myStudyList.innerHTML = `<p class="study-empty">Seu estudo vai aparecer aqui conforme você salvar notas, favoritos e análises.</p>`;
        return;
      }

      const blocks = [
        studySection("Notas", study.notes.slice(0, 5)),
        studySection("Análises com IA", study.aiResults.slice(0, 4)),
        studySection("Favoritos", study.favorites.slice(0, 4).map(item => ({
          type: "favorite",
          title: `${item.bookName} ${item.chapter}:${item.verse}`,
          subtitle: item.text,
          bookId: item.bookId,
          chapter: item.chapter,
          verse: item.verse
        }))),
        studySection("Palavras recentes", study.studiedWords.slice(0, 5))
      ].filter(Boolean);

      els.myStudyList.innerHTML = blocks.join("");
      document.querySelectorAll("[data-study-open]").forEach(button => {
        button.addEventListener("click", () => openStudyItem(button.dataset.studyOpen));
      });
    }

    function summaryPill(value, label) {
      return `<div class="summary-pill"><strong>${value}</strong>${label}</div>`;
    }

    function studySection(title, items) {
      if (!items.length) return "";
      return `
        <p class="study-section-label">${escapeHtml(title)}</p>
        ${items.map(item => `
          <button class="study-item" type="button" data-study-open="${escapeHtml(encodeStudyItem(item))}">
            <strong>${escapeHtml(item.title)}</strong>
            ${escapeHtml((item.subtitle || "").slice(0, 96))}${(item.subtitle || "").length > 96 ? "..." : ""}
            ${item.body ? `<span>${escapeHtml(item.body.slice(0, 82))}${item.body.length > 82 ? "..." : ""}</span>` : ""}
          </button>
        `).join("")}
      `;
    }

    function encodeStudyItem(item) {
      return JSON.stringify({
        type: item.type,
        bookId: item.bookId,
        chapter: item.chapter,
        verse: item.verse,
        strong: item.strong || "",
        word: item.word || ""
      });
    }

    function openStudyItem(raw) {
      let item;
      try {
        item = JSON.parse(raw);
      } catch (error) {
        return;
      }

      if (item.type === "word" || item.type === "note" || item.type === "ai") {
        if (item.strong) {
          openStrongOccurrence(item.bookId, item.chapter, item.verse, item.strong);
        } else {
          goToVerse(item.bookId, item.chapter, item.verse);
          selectVerseNote(item.verse);
        }
      } else {
        goToVerse(item.bookId, item.chapter, item.verse);
      }
    }

    function downloadMyStudy() {
      const study = collectStudyItems();
      const total = study.notes.length + study.aiResults.length + study.favorites.length;

      if (!total) {
        showToast("Ainda não há estudo salvo.");
        return;
      }

      const today = new Date().toISOString().slice(0, 10);
      const sections = [
        "# Bíblia em Foco - Meu estudo",
        "",
        `Exportado em ${today}.`,
        ""
      ];

      if (study.notes.length) {
        sections.push("## Notas", "", ...study.notes.flatMap(item => [
          `### ${item.title} - ${item.subtitle}`,
          "",
          `> ${item.context}`,
          "",
          item.body,
          ""
        ]));
      }

      if (study.aiResults.length) {
        sections.push("## Análises com IA", "", ...study.aiResults.flatMap(item => [
          `### ${item.title} - ${item.subtitle}`,
          "",
          `> ${item.context}`,
          "",
          item.body,
          ""
        ]));
      }

      if (study.favorites.length) {
        sections.push("## Favoritos", "", ...study.favorites.flatMap(item => [
          `### ${item.bookName} ${item.chapter}:${item.verse}`,
          "",
          `> ${item.text}`,
          ""
        ]));
      }

      downloadTextFile(sections.join("\n").trimEnd() + "\n", `biblia-em-foco-meu-estudo-${today}.md`, "text/markdown;charset=utf-8");
      showToast("Meu estudo foi baixado.");
    }

    function clearMyStudy() {
      const confirmed = window.confirm("Limpar notas, análises salvas, favoritos e histórico deste estudo? A chave da IA e os temas serão mantidos.");
      if (!confirmed) return;

      const keys = [];
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index);
        if (
          key === "favorites:v1" ||
          key === "history:v1" ||
          key?.startsWith("note:") ||
          key?.startsWith("verse-note:") ||
          key?.startsWith("ai-result:")
        ) {
          keys.push(key);
        }
      }

      keys.forEach(key => localStorage.removeItem(key));
      state.selected = null;
      state.selectedVerseNote = null;
      renderChapter();
      renderHistory();
      renderMyStudy();
      loadNote();
      showToast("Meu estudo foi limpo.");
    }

    function goToVerse(bookId, chapter, verse) {
      state.bookId = bookId;
      state.chapter = chapter;
      state.selected = null;
      state.selectedVerseNote = null;
      els.bookSelect.value = bookId;
      updateChapterSelect();
      renderChapter();
      const target = document.getElementById(`verse-${verse}`);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function openStrongOccurrence(bookId, chapter, verse, strong) {
      state.bookId = bookId;
      state.chapter = chapter;
      state.selected = null;
      state.selectedVerseNote = null;
      els.bookSelect.value = bookId;
      updateChapterSelect();
      renderChapter();

      const token = Array.from(document.querySelectorAll(".token")).find(el => (
        Number(el.dataset.verse) === verse &&
        el.dataset.strong === strong
      ));

      if (token) {
        selectToken(token);
      }

      const target = document.getElementById(`verse-${verse}`);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function loadHistory() {
      try {
        return JSON.parse(localStorage.getItem("history:v1") || "[]");
      } catch (error) {
        return [];
      }
    }

    function saveHistory(history) {
      localStorage.setItem("history:v1", JSON.stringify(history.slice(0, 8)));
    }

    function addHistoryItem(item) {
      const history = loadHistory().filter(historyItem => historyItem.key !== item.key);
      history.unshift({ ...item, openedAt: new Date().toISOString() });
      saveHistory(history);
      renderHistory();
      renderMyStudy();
    }

    function renderHistory() {
      const history = loadHistory();

      if (!history.length) {
        els.historyList.innerHTML = `<p class="history-empty">Nada aberto ainda.</p>`;
        return;
      }

      els.historyList.innerHTML = history.map(item => `
        <button class="history-item" type="button" data-history-key="${escapeHtml(item.key)}">
          <strong>${escapeHtml(item.title)}</strong>
          ${escapeHtml(item.subtitle || "")}
        </button>
      `).join("");

      document.querySelectorAll("[data-history-key]").forEach(button => {
        button.addEventListener("click", () => {
          const item = loadHistory().find(historyItem => historyItem.key === button.dataset.historyKey);
          if (item) openHistoryItem(item);
        });
      });
    }

    function renderThemes() {
      const themes = loadThemes();
      els.themeList.innerHTML = themes.map((theme, index) => `
        <span class="theme-chip">
          <button class="theme-button" type="button" data-theme-query="${escapeHtml(theme.query)}" title="${escapeHtml(theme.hint || theme.query)}">${escapeHtml(theme.name)}</button>
          <button class="remove-theme" type="button" data-theme-index="${index}" title="Remover tema" aria-label="Remover tema">×</button>
        </span>
      `).join("");

      document.querySelectorAll("[data-theme-query]").forEach(button => {
        button.addEventListener("click", () => {
          els.searchInput.value = button.dataset.themeQuery;
          runSearch();
          showToast(`Tema: ${button.textContent}`);
        });
      });

      document.querySelectorAll("[data-theme-index]").forEach(button => {
        button.addEventListener("click", () => removeTheme(Number(button.dataset.themeIndex)));
      });
    }

    function loadThemes() {
      try {
        const saved = JSON.parse(localStorage.getItem("themes:v1") || "null");
        if (Array.isArray(saved) && saved.length) {
          const savedNames = new Set(saved.map(theme => theme.name));
          const missingDefaults = defaultStudyThemes.filter(theme => !savedNames.has(theme.name));
          return [...saved, ...missingDefaults];
        }
        return defaultStudyThemes;
      } catch (error) {
        return defaultStudyThemes;
      }
    }

    function saveThemes(themes) {
      localStorage.setItem("themes:v1", JSON.stringify(themes));
    }

    function addTheme() {
      const name = els.themeName.value.trim();
      const query = els.themeQuery.value.trim();

      if (!name || !query) {
        showToast("Informe tema e busca.");
        return;
      }

      const themes = loadThemes();
      themes.push({ name, query, hint: query });
      saveThemes(themes);
      els.themeName.value = "";
      els.themeQuery.value = "";
      renderThemes();
      showToast("Tema adicionado.");
    }

    function removeTheme(index) {
      const themes = loadThemes();
      themes.splice(index, 1);
      saveThemes(themes.length ? themes : defaultStudyThemes);
      renderThemes();
      showToast("Tema removido.");
    }

    function clearHistory() {
      localStorage.removeItem("history:v1");
      renderHistory();
      renderMyStudy();
      showToast("Histórico limpo.");
    }

    function openHistoryItem(item) {
      state.bookId = item.bookId;
      state.chapter = item.chapter;
      els.bookSelect.value = item.bookId;
      updateChapterSelect();
      renderChapter();

      if (item.type === "word") {
        const token = Array.from(document.querySelectorAll(".token")).find(el => (
          Number(el.dataset.verse) === item.verse &&
          el.dataset.strong === item.strong &&
          el.textContent === item.word
        ));
        if (token) selectToken(token);
      } else {
        selectVerseNote(item.verse);
      }

      const target = document.getElementById(`verse-${item.verse}`);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function runSearch() {
      const rawQuery = els.searchInput.value.trim();
      const query = normalizeText(rawQuery);
      if (!rawQuery) {
        els.searchResults.classList.remove("active");
        els.searchResults.innerHTML = "";
        return;
      }

      const reference = parseReference(rawQuery);
      if (reference) {
        goToVerse(reference.bookId, reference.chapter, reference.verse);
        renderReferenceResult(reference);
        showToast(`Aberto em ${reference.bookName} ${reference.chapter}:${reference.verse}.`);
        return;
      }

      const results = [];
      const queryTerms = rawQuery
        .split("|")
        .map(item => item.trim())
        .filter(Boolean);
      const normalizedTerms = queryTerms.map(normalizeText);
      const matchingStrong = [...new Set(queryTerms.flatMap(findMatchingStrong))];

      appData.books.forEach(book => {
        book.chapters.forEach(chapter => {
          chapter.verses.forEach(verse => {
            const normalizedVerse = normalizeText(verse.text);
            const textMatch = normalizedTerms.some(term => normalizedVerse.includes(term));
            const tokenMatches = getVerseTokens(book.id, chapter.number, verse)
              .map((item, index) => ({ item, index }))
              .filter(({ item }) => (
                normalizedTerms.some(term => (
                  normalizeText(item.word).includes(term) ||
                  item.strong.toLowerCase() === term
                )) ||
                matchingStrong.includes(item.strong)
              ));

            if (tokenMatches.length) {
              tokenMatches.forEach(({ item, index }) => {
                results.push({ book, chapter, verse, token: item, tokenIndex: index, kind: "strong" });
              });
            } else if (textMatch) {
              results.push({ book, chapter, verse, token: null, tokenIndex: null, kind: "text" });
            }
          });
        });
      });

      els.searchResults.classList.add("active");
      els.searchResults.innerHTML = `
        <h3>${results.length} resultado(s)</h3>
        ${results.map(result => `
          <div class="result-item" data-book="${result.book.id}" data-chapter="${result.chapter.number}" data-verse="${result.verse.n}" data-strong="${escapeHtml(result.token?.strong || "")}" data-word="${escapeHtml(result.token?.word || "")}">
            <strong>${result.book.name} ${result.chapter.number}:${result.verse.n}${result.token ? ` - ${escapeHtml(result.token.word)} (${escapeHtml(result.token.strong)})` : ""}</strong> ${escapeHtml(result.verse.text)}
          </div>
        `).join("")}
      `;

      document.querySelectorAll(".result-item").forEach(item => {
        item.addEventListener("click", () => {
          const bookId = item.dataset.book;
          const chapter = Number(item.dataset.chapter);
          const verse = Number(item.dataset.verse);

          if (item.dataset.strong) {
            openStrongOccurrence(bookId, chapter, verse, item.dataset.strong);
          } else {
            goToVerse(bookId, chapter, verse);
          }
        });
      });
      els.searchResults.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function renderReferenceResult(reference) {
      const book = appData.books.find(item => item.id === reference.bookId);
      const chapter = book.chapters.find(item => item.number === reference.chapter);
      const verse = chapter.verses.find(item => item.n === reference.verse);
      els.searchResults.classList.add("active");
      els.searchResults.innerHTML = `
        <h3>Referência aberta</h3>
        <div class="result-item" data-book="${book.id}" data-chapter="${chapter.number}" data-verse="${verse.n}" data-strong="" data-word="">
          <strong>${book.name} ${chapter.number}:${verse.n}</strong> ${escapeHtml(verse.text)}
        </div>
      `;

      document.querySelector(".result-item").addEventListener("click", () => {
        goToVerse(book.id, chapter.number, verse.n);
      });
      els.searchResults.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function parseReference(value) {
      const cleaned = normalizeText(value).replace(/\s+/g, " ").trim();
      const match = cleaned.match(/^(?:(.+?)\s+)?(\d{1,2})\s*[:.]\s*(\d{1,3})$/);
      if (!match) return null;

      const book = match[1] ? findBookByReferenceName(match[1]) : getBook();
      if (!book) return null;

      const chapterNumber = Number(match[2]);
      const verseNumber = Number(match[3]);
      const chapter = book.chapters.find(item => item.number === chapterNumber);
      if (!chapter || !chapter.verses.some(item => item.n === verseNumber)) return null;

      return {
        bookId: book.id,
        bookName: book.name,
        chapter: chapterNumber,
        verse: verseNumber
      };
    }

    function findBookByReferenceName(value) {
      const aliases = {
        matthew: ["mateus", "mt", "mat"],
        mark: ["marcos", "mc", "mar"],
        luke: ["lucas", "lc", "lu", "luc"],
        john: ["joao", "jo", "j"],
        acts: ["atos", "at"],
        romans: ["romanos", "rm", "rom"],
        "1corinthians": ["1 corintios", "1 coríntios", "i corintios", "i coríntios", "1co", "1 co"],
        "2corinthians": ["2 corintios", "2 coríntios", "ii corintios", "ii coríntios", "2co", "2 co"],
        galatians: ["galatas", "gálatas", "gl", "gal"],
        ephesians: ["efesios", "efésios", "ef"],
        philippians: ["filipenses", "fp", "fl"],
        colossians: ["colossenses", "cl", "col"],
        "1thessalonians": ["1 tessalonicenses", "i tessalonicenses", "1ts", "1 ts"],
        "2thessalonians": ["2 tessalonicenses", "ii tessalonicenses", "2ts", "2 ts"],
        "1timothy": ["1 timoteo", "1 timóteo", "i timoteo", "i timóteo", "1tm", "1 tm"],
        "2timothy": ["2 timoteo", "2 timóteo", "ii timoteo", "ii timóteo", "2tm", "2 tm"],
        titus: ["tito", "tt"],
        philemon: ["filemom", "filemon", "fm"],
        hebrews: ["hebreus", "hb"],
        james: ["tiago", "tg"],
        "1peter": ["1 pedro", "i pedro", "1pe", "1 pe"],
        "2peter": ["2 pedro", "ii pedro", "2pe", "2 pe"],
        "1john": ["1 joao", "1 joão", "i joao", "i joão", "1jo", "1 jo"],
        "2john": ["2 joao", "2 joão", "ii joao", "ii joão", "2jo", "2 jo"],
        "3john": ["3 joao", "3 joão", "iii joao", "iii joão", "3jo", "3 jo"],
        jude: ["judas", "jd"],
        revelation: ["apocalipse", "ap", "apoc"]
      };
      const normalized = normalizeText(value).replace(/\s+/g, " ").trim();

      return appData.books.find(book => {
        const bookAliases = [normalizeText(book.name), book.id, ...(aliases[book.id] || [])];
        return bookAliases.includes(normalized);
      });
    }

    function clearSearch() {
      els.searchInput.value = "";
      els.searchResults.classList.remove("active");
      els.searchResults.innerHTML = "";
      showToast("Pesquisa limpa.");
    }

    function findMatchingStrong(query) {
      const normalizedQuery = normalizeText(query);
      return Object.entries(appData.lexicon)
        .filter(([strong, entry]) => (
          strong.toLowerCase() === normalizedQuery ||
          normalizeText(entry.lemma || "").includes(normalizedQuery) ||
          normalizeText(entry.translit || "").includes(normalizedQuery) ||
          normalizeText(entry.gloss || "").includes(normalizedQuery)
        ))
        .map(([strong]) => strong);
    }

    function normalizeText(value) {
      return String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    }

    function showToast(message) {
      els.toast.textContent = message;
      els.toast.classList.add("active");
      window.setTimeout(() => els.toast.classList.remove("active"), 1700);
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char]));
    }

    function escapeRegExp(value) {
      return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    els.bookSelect.addEventListener("change", () => {
      state.bookId = els.bookSelect.value;
      state.chapter = getBook().chapters[0].number;
      state.selected = null;
      state.selectedVerseNote = null;
      updateChapterSelect();
      renderChapter();
      loadNote();
    });

    els.chapterSelect.addEventListener("change", () => {
      state.chapter = Number(els.chapterSelect.value);
      state.selected = null;
      state.selectedVerseNote = null;
      renderChapter();
      loadNote();
    });

    els.prevChapter.addEventListener("click", () => {
      const chapters = getBook().chapters.map(chapter => chapter.number);
      const currentIndex = chapters.indexOf(state.chapter);
      if (currentIndex > 0) {
        state.chapter = chapters[currentIndex - 1];
        state.selected = null;
        state.selectedVerseNote = null;
        els.chapterSelect.value = String(state.chapter);
        renderChapter();
        loadNote();
      }
    });

    els.nextChapter.addEventListener("click", () => {
      const chapters = getBook().chapters.map(chapter => chapter.number);
      const currentIndex = chapters.indexOf(state.chapter);
      if (currentIndex < chapters.length - 1) {
        state.chapter = chapters[currentIndex + 1];
        state.selected = null;
        state.selectedVerseNote = null;
        els.chapterSelect.value = String(state.chapter);
        renderChapter();
        loadNote();
      }
    });

    els.saveNote.addEventListener("click", saveNote);
    els.clearNote.addEventListener("click", clearCurrentNote);
    els.saveAiSettings.addEventListener("click", saveAiSettings);
    els.enterStudy.addEventListener("click", enterStudy);
    els.skipHome?.addEventListener("click", enterStudy);
    els.searchButton.addEventListener("click", runSearch);
    els.clearSearch.addEventListener("click", clearSearch);
    els.clearHistory.addEventListener("click", clearHistory);
    els.downloadMyStudy.addEventListener("click", downloadMyStudy);
    els.clearMyStudy.addEventListener("click", clearMyStudy);
    els.themeToggle?.addEventListener("click", () => {
      applyReaderTheme(state.readerTheme === "dark" ? "light" : "dark");
    });
    els.fontSizeToggle?.addEventListener("click", cycleReaderFontSize);
    els.addTheme.addEventListener("click", addTheme);
    [els.themeName, els.themeQuery].forEach(input => {
      input.addEventListener("keydown", event => {
        if (event.key === "Enter") addTheme();
      });
    });
    els.searchInput.addEventListener("keydown", event => {
      if (event.key === "Enter") runSearch();
    });

    applyReaderTheme();
    applyReaderFontSize();
    populateControls();
    initAiSettings();
    renderChapter();
    renderHistory();
    renderThemes();
    renderMyStudy();
    const forceHome = new URLSearchParams(window.location.search).get("home") === "1";
    if (!forceHome && localStorage.getItem("home-seen:v1") === "true") {
      els.homeScreen.classList.add("hidden");
    }
    loadNote();

    if ("serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("./sw.js").then(registration => {
        registration.update().catch(() => {});
      }).catch(() => {});
    }
