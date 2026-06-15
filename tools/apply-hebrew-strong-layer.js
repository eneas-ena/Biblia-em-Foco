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

const hebrewLexicon = {
  H430: ["Elohim", "אֱלֹהִים", "Elohim", "substantivo masculino plural com uso singular", "Deus, deuses, o Deus Criador", "Em Gênesis e no AT, Elohim apresenta Deus como Criador, Juiz e Senhor soberano. A forma plural pode funcionar como plural de majestade quando se refere ao Deus de Israel.", "No ambiente semítico antigo, elohim podia designar seres divinos. A fé bíblica aplica o termo ao Deus único de Israel, distinguindo-o dos ídolos.", ["Gênesis 1:1", "Deuteronômio 6:4", "Salmo 46:10"]],
  H3068: ["YHWH", "יְהוָה", "YHWH / Yahweh", "nome próprio divino", "SENHOR, o Deus da aliança", "O nome da aliança revela o Deus que se dá a conhecer, chama, salva e permanece fiel ao seu povo.", "A tradição judaica evita pronunciar o Nome, lendo Adonai. Muitas traduções portuguesas usam SENHOR ou Senhor.", ["Êxodo 3:14-15", "Êxodo 6:2-8", "Salmo 23:1"]],
  H7225: ["reshith", "רֵאשִׁית", "reshith", "substantivo feminino", "princípio, começo, primícias", "A palavra abre a Escritura colocando Deus antes da criação e estabelecendo a criação como ato soberano.", "Também pode indicar primícias, aquilo que vem primeiro e pertence a Deus.", ["Gênesis 1:1", "Provérbios 1:7", "Jeremias 2:3"]],
  H1254: ["bara", "בָּרָא", "bara", "verbo", "criar", "No AT, bara destaca a ação criadora de Deus, especialmente quando algo vem à existência por iniciativa divina.", "O verbo é associado de modo especial à ação de Deus, enfatizando origem e soberania.", ["Gênesis 1:1", "Isaías 43:1", "Salmo 51:10"]],
  H776: ["erets", "אֶרֶץ", "erets", "substantivo feminino", "terra, país, território", "Pode indicar a terra criada, uma região habitada ou a terra prometida. O contexto define a camada de sentido.", "Na narrativa bíblica, terra envolve criação, herança, promessa e responsabilidade diante de Deus.", ["Gênesis 1:1", "Gênesis 12:1", "Salmo 24:1"]],
  H8064: ["shamayim", "שָׁמַיִם", "shamayim", "substantivo masculino plural", "céus, céu", "Céus aponta para a esfera criada por Deus e também para a linguagem bíblica da majestade divina.", "A expressão céu e terra funciona como totalidade da criação.", ["Gênesis 1:1", "Salmo 19:1", "Isaías 66:1"]],
  H216: ["or", "אוֹר", "or", "substantivo feminino", "luz", "A luz é o primeiro elemento chamado por Deus em Gênesis 1 e se torna símbolo de vida, ordem e revelação.", "No AT, luz frequentemente contrasta com trevas, caos, juízo e ignorância.", ["Gênesis 1:3", "Salmo 27:1", "Isaías 9:2"]],
  H2822: ["choshek", "חֹשֶׁךְ", "choshek", "substantivo masculino", "trevas, escuridão", "Trevas podem indicar ausência de luz, caos, juízo ou condição espiritual de afastamento de Deus.", "A oposição luz/trevas atravessa a Bíblia e prepara linguagem usada no NT.", ["Gênesis 1:2", "Êxodo 10:21", "Isaías 9:2"]],
  H7307: ["ruach", "רוּחַ", "ruach", "substantivo feminino", "espírito, vento, sopro", "Ruach pode indicar vento, fôlego de vida ou o Espírito de Deus em ação criadora e vivificadora.", "A amplitude da palavra une vida, movimento e ação divina.", ["Gênesis 1:2", "Ezequiel 37:9-14", "Joel 2:28"]],
  H4325: ["mayim", "מַיִם", "mayim", "substantivo masculino plural", "águas", "Águas podem representar elemento criado, fonte de vida, perigo ou imagem de caos dominado por Deus.", "No mundo antigo, águas profundas simbolizavam forças incontroláveis; a Bíblia as coloca sob a palavra de Deus.", ["Gênesis 1:2", "Êxodo 14:21", "Salmo 29:3"]],
  H3117: ["yom", "יוֹם", "yom", "substantivo masculino", "dia, tempo", "Yom pode indicar dia comum, período ou tempo determinado. Em Gênesis estrutura a criação pela palavra de Deus.", "O ciclo dia/noite organiza a vida litúrgica e cotidiana de Israel.", ["Gênesis 1:5", "Êxodo 20:8-11", "Salmo 118:24"]],
  H3915: ["layil", "לַיְלָה", "layil", "substantivo masculino", "noite", "Noite pode ser marca do ciclo criado, tempo de vulnerabilidade ou cenário da ação de Deus.", "A alternância tarde/manhã dá ritmo à criação e à experiência humana.", ["Gênesis 1:5", "Êxodo 12:42", "Salmo 42:8"]],
  H2896: ["tov", "טוֹב", "tov", "adjetivo", "bom, agradável, apropriado", "Quando Deus vê que algo é bom, o texto afirma ordem, adequação e harmonia da criação com o propósito divino.", "Tov é uma palavra ampla: pode indicar bondade moral, beleza, utilidade ou bem-estar.", ["Gênesis 1:4", "Miquéias 6:8", "Salmo 34:8"]],
  H120: ["adam", "אָדָם", "adam", "substantivo masculino", "homem, ser humano, humanidade", "Adam pode designar o ser humano, a humanidade ou o nome Adão. Em Gênesis liga humanidade à terra e à imagem de Deus.", "O termo carrega dimensão coletiva e vocacional: o humano diante de Deus e da criação.", ["Gênesis 1:26", "Gênesis 2:7", "Salmo 8:4"]],
  H5315: ["nephesh", "נֶפֶשׁ", "nephesh", "substantivo feminino", "alma, vida, ser vivente", "Nephesh não significa apenas uma parte imaterial; muitas vezes aponta para a pessoa viva, o fôlego e a vida concreta.", "A antropologia hebraica costuma falar do ser humano de modo integrado.", ["Gênesis 2:7", "Levítico 17:11", "Salmo 42:1"]],
  H2416: ["chay", "חַי", "chay", "adjetivo/substantivo", "vivo, vida, vivente", "A linguagem de vida no AT liga existência, bênção e comunhão com o Deus vivo.", "Vida é recebida de Deus e vivida diante dele em aliança.", ["Gênesis 1:20", "Deuteronômio 30:19", "Salmo 42:2"]],
  H1285: ["berith", "בְּרִית", "berith", "substantivo feminino", "aliança, pacto", "Aliança é uma das grandes categorias do AT: Deus estabelece relação, promessa e responsabilidade com seu povo.", "Tratados e pactos eram comuns no mundo antigo; a Bíblia usa essa linguagem para revelar fidelidade divina.", ["Gênesis 9:9", "Gênesis 15:18", "Êxodo 24:8"]],
  H4428: ["melek", "מֶלֶךְ", "melek", "substantivo masculino", "rei", "Rei pode designar governantes humanos e também prepara a esperança do reinado justo de Deus e do Messias.", "A monarquia em Israel é lida sob a tensão entre poder humano e governo divino.", ["1 Samuel 8:7", "Salmo 2:6", "Zacarias 9:9"]],
  H4467: ["mamlakah", "מַמְלָכָה", "mamlakah", "substantivo feminino", "reino, domínio real", "Reino aponta para domínio, povo e governo. No AT, o reinado de Deus é fundamento da esperança bíblica.", "A linguagem de reino conecta política, culto e promessa messiânica.", ["Êxodo 19:6", "Salmo 145:13", "Daniel 2:44"]],
  H3478: ["Yisrael", "יִשְׂרָאֵל", "Yisrael", "nome próprio", "Israel", "Israel é nome do patriarca Jacó e do povo da aliança, chamado a viver como testemunha de Deus entre as nações.", "O nome se torna identidade teológica, familiar, nacional e espiritual.", ["Gênesis 32:28", "Êxodo 4:22", "Isaías 49:3"]],
  H3389: ["Yerushalayim", "יְרוּשָׁלַיִם", "Yerushalayim", "nome próprio", "Jerusalém", "Jerusalém concentra temas de templo, reinado, juízo, restauração e esperança escatológica.", "A cidade torna-se centro simbólico da presença de Deus e da história de Israel.", ["2 Samuel 5:6-9", "Salmo 122:6", "Isaías 2:3"]],
  H6944: ["qodesh", "קֹדֶשׁ", "qodesh", "substantivo masculino", "santo, santidade, separado para Deus", "Santidade indica aquilo que pertence a Deus e é separado para seu serviço e presença.", "No AT, santidade envolve culto, ética, espaço, tempo e identidade comunitária.", ["Êxodo 3:5", "Levítico 19:2", "Isaías 6:3"]],
  H6666: ["tsedaqah", "צְדָקָה", "tsedaqah", "substantivo feminino", "justiça, retidão", "Justiça no AT envolve retidão diante de Deus e relações corretas com o próximo, especialmente o vulnerável.", "A palavra une dimensão legal, ética, relacional e pactual.", ["Gênesis 15:6", "Salmo 89:14", "Isaías 1:17"]],
  H2403: ["chattaah", "חַטָּאָה", "chattaah", "substantivo feminino", "pecado, oferta pelo pecado", "Pecado é ruptura com Deus e com a aliança. O termo também pode designar a oferta que trata essa culpa.", "A linguagem sacrificial mostra a gravidade do pecado e a necessidade de expiação.", ["Gênesis 4:7", "Levítico 4:3", "Salmo 51:2"]],
  H7965: ["shalom", "שָׁלוֹם", "shalom", "substantivo masculino", "paz, plenitude, bem-estar", "Shalom é mais que ausência de conflito; aponta para integridade, bênção, segurança e vida ordenada por Deus.", "A paz bíblica é comunitária, espiritual e concreta.", ["Números 6:26", "Salmo 29:11", "Isaías 9:6"]],
  H2617: ["chesed", "חֶסֶד", "chesed", "substantivo masculino", "misericórdia, amor leal, bondade pactual", "Chesed expressa o amor fiel de Deus na aliança: misericórdia perseverante e compromisso gracioso.", "É uma palavra central para a fidelidade divina no culto e na oração de Israel.", ["Êxodo 34:6", "Salmo 136:1", "Miquéias 6:8"]],
  H571: ["emeth", "אֱמֶת", "emeth", "substantivo feminino", "verdade, fidelidade, firmeza", "Verdade no AT envolve confiabilidade e fidelidade, não apenas precisão verbal.", "A palavra descreve aquilo que é firme, digno de confiança e alinhado ao caráter de Deus.", ["Êxodo 34:6", "Salmo 25:5", "Zacarias 8:16"]],
  H1697: ["dabar", "דָּבָר", "dabar", "substantivo masculino", "palavra, coisa, assunto", "Dabar une palavra e acontecimento: a palavra de Deus comunica, cria, chama e realiza.", "No pensamento hebraico, palavra eficaz pode produzir realidade e convocar resposta.", ["Gênesis 15:1", "Isaías 55:11", "Jeremias 1:4"]],
  H8451: ["torah", "תּוֹרָה", "torah", "substantivo feminino", "lei, instrução, ensino", "Torah é instrução de Deus para formar um povo em aliança, não apenas código legal.", "A lei orienta culto, ética, memória e identidade de Israel.", ["Êxodo 24:12", "Salmo 1:2", "Deuteronômio 6:6"]],
  H4687: ["mitsvah", "מִצְוָה", "mitsvah", "substantivo feminino", "mandamento", "Mandamento expressa a vontade de Deus para a vida pactual, chamando a obediência concreta.", "No AT, obedecer é resposta de amor e reverência ao Deus que salvou.", ["Deuteronômio 6:1", "Salmo 119:10", "Eclesiastes 12:13"]],
  H5030: ["nabi", "נָבִיא", "nabi", "substantivo masculino", "profeta", "Profeta é porta-voz chamado por Deus para denunciar, consolar, interpretar a aliança e anunciar esperança.", "A função profética tem dimensão pública, ética e espiritual.", ["Deuteronômio 18:18", "Jeremias 1:5", "Amós 3:7"]],
  H3548: ["kohen", "כֹּהֵן", "kohen", "substantivo masculino", "sacerdote", "Sacerdote serve no culto, media ritos e ensina a distinção entre santo e comum.", "O sacerdócio organiza a vida litúrgica de Israel em torno da presença de Deus.", ["Êxodo 28:1", "Levítico 10:10-11", "Malaquias 2:7"]],
  H1004: ["bayith", "בַּיִת", "bayith", "substantivo masculino", "casa, família, templo", "Casa pode indicar moradia, família/dinastia ou a casa de Deus. O contexto define o alcance.", "A palavra une espaço físico e identidade familiar ou cultual.", ["Gênesis 7:1", "2 Samuel 7:11", "Salmo 23:6"]],
  H1121: ["ben", "בֵּן", "ben", "substantivo masculino", "filho, descendente", "Filho pode indicar relação familiar, descendência, pertencimento ou identidade vocacional.", "Genealogias e promessas usam ben para conectar família, aliança e herança.", ["Gênesis 5:4", "2 Samuel 7:14", "Salmo 2:7"]],
  H5650: ["ebed", "עֶבֶד", "ebed", "substantivo masculino", "servo, escravo, adorador", "Servo pode indicar sujeição social, serviço cultual ou título honroso de quem pertence a Deus.", "Moisés, Davi e o Servo de Isaías mostram a profundidade teológica do termo.", ["Êxodo 14:31", "2 Samuel 7:5", "Isaías 53:11"]],
  H8085: ["shama", "שָׁמַע", "shama", "verbo", "ouvir, obedecer", "Ouvir no hebraico bíblico frequentemente implica responder e obedecer, não apenas perceber som.", "O Shemá resume a espiritualidade da aliança: ouvir, amar e obedecer.", ["Deuteronômio 6:4", "1 Samuel 15:22", "Salmo 95:7"]],
  H559: ["amar", "אָמַר", "amar", "verbo", "dizer, falar", "O verbo introduz fala humana e divina. Quando Deus diz, sua palavra ordena, cria e revela.", "A narrativa bíblica é fortemente estruturada por discursos, promessas e mandamentos.", ["Gênesis 1:3", "Êxodo 3:14", "Isaías 55:11"]],
  H7200: ["raah", "רָאָה", "raah", "verbo", "ver, perceber", "Ver pode indicar percepção física, discernimento ou avaliação. Em Gênesis, Deus vê a bondade da criação.", "A visão é frequentemente ligada a juízo, revelação e cuidado divino.", ["Gênesis 1:4", "Gênesis 22:14", "1 Samuel 16:7"]],
  H5414: ["nathan", "נָתַן", "nathan", "verbo", "dar, entregar, conceder", "Dar expressa provisão, promessa, dom e entrega. Deus dá terra, aliança, lei e bênção.", "A teologia bíblica da dádiva mostra Deus como fonte de vida e herança.", ["Gênesis 1:29", "Gênesis 12:7", "Êxodo 31:18"]],
  H1980: ["halak", "הָלַךְ", "halak", "verbo", "andar, caminhar, viver", "Andar pode descrever movimento físico ou modo de vida diante de Deus.", "A imagem de andar com Deus resume comunhão e fidelidade cotidiana.", ["Gênesis 5:24", "Deuteronômio 10:12", "Salmo 1:1"]],
  H7725: ["shuv", "שׁוּב", "shuv", "verbo", "voltar, retornar, arrepender-se", "Voltar é movimento físico e também linguagem central de arrependimento e restauração.", "Os profetas usam shuv para chamar Israel de volta ao Senhor.", ["Deuteronômio 30:2", "Isaías 55:7", "Joel 2:12"]],
  H3467: ["yasha", "יָשַׁע", "yasha", "verbo", "salvar, libertar", "Salvar envolve livramento concreto e restauração por ação de Deus.", "A salvação no AT inclui êxodo, proteção, perdão e esperança futura.", ["Êxodo 14:30", "Salmo 27:1", "Isaías 45:22"]],
  H3444: ["yeshuah", "יְשׁוּעָה", "yeshuah", "substantivo feminino", "salvação, livramento", "Salvação é a ação libertadora de Deus que resgata e sustenta seu povo.", "A palavra alimenta a esperança de libertação pessoal e nacional.", ["Êxodo 15:2", "Salmo 3:8", "Isaías 12:2"]],
  H4899: ["mashiach", "מָשִׁיחַ", "mashiach", "substantivo/adjetivo", "ungido, Messias", "Ungido designa alguém separado por Deus para função real, sacerdotal ou profética, e sustenta a esperança messiânica.", "A unção comunica vocação, autoridade e consagração.", ["1 Samuel 16:13", "Salmo 2:2", "Daniel 9:25"]],
  H1732: ["David", "דָּוִד", "David", "nome próprio", "Davi", "Davi é rei da aliança e figura central da promessa messiânica.", "A casa de Davi torna-se eixo da esperança real em Israel.", ["1 Samuel 16:13", "2 Samuel 7:12-16", "Salmo 89:3"]],
  H85: ["Avraham", "אַבְרָהָם", "Avraham", "nome próprio", "Abraão", "Abraão é patriarca da promessa, chamado por Deus para bênção que alcança as nações.", "Sua história estrutura temas de fé, aliança, terra e descendência.", ["Gênesis 12:1-3", "Gênesis 15:6", "Gênesis 17:5"]],
  H3327: ["Yitschaq", "יִצְחָק", "Yitschaq", "nome próprio", "Isaque", "Isaque é filho da promessa e elo da aliança abraâmica.", "Seu nome lembra riso, impossibilidade humana e fidelidade divina.", ["Gênesis 17:19", "Gênesis 21:3", "Gênesis 26:3"]],
  H3290: ["Yaaqov", "יַעֲקֹב", "Yaaqov", "nome próprio", "Jacó", "Jacó é patriarca cuja história culmina no nome Israel e na formação das tribos.", "Sua trajetória passa por conflito, graça, transformação e promessa.", ["Gênesis 25:26", "Gênesis 32:28", "Gênesis 49:1"]],
  H4872: ["Mosheh", "מֹשֶׁה", "Mosheh", "nome próprio", "Moisés", "Moisés é mediador do êxodo, da lei e da aliança sinaítica.", "Sua vocação reúne libertação, liderança, profecia e intercessão.", ["Êxodo 3:10", "Êxodo 19:3", "Deuteronômio 34:10"]],
  H4714: ["Mitsrayim", "מִצְרַיִם", "Mitsrayim", "nome próprio", "Egito", "Egito é lugar de refúgio, escravidão e palco do livramento do êxodo.", "Na memória bíblica, Egito se torna símbolo de opressão e também de onde Deus resgata.", ["Gênesis 12:10", "Êxodo 1:13-14", "Êxodo 20:2"]],
  H6547: ["Paroh", "פַּרְעֹה", "Paroh", "título/nome", "Faraó", "Faraó representa o poder imperial que resiste ao Senhor na narrativa do êxodo.", "O confronto com Faraó revela Deus como Senhor sobre reis, impérios e deuses.", ["Êxodo 5:2", "Êxodo 9:16", "Êxodo 14:30"]],
  H1: ["ab", "אָב", "ab", "substantivo masculino", "pai, ancestral", "Pai pode indicar relação familiar, ancestralidade, liderança ou origem de um povo.", "A sociedade bíblica preserva memória, herança e identidade por meio da casa paterna.", ["Gênesis 2:24", "Êxodo 20:12", "Malaquias 4:6"]],
  H517: ["em", "אֵם", "em", "substantivo feminino", "mãe", "Mãe expressa vínculo familiar, cuidado e origem geracional.", "A maternidade aparece ligada à promessa, descendência, consolo e formação do povo.", ["Gênesis 3:20", "Êxodo 20:12", "Provérbios 1:8"]],
  H251: ["ach", "אָח", "ach", "substantivo masculino", "irmão, parente", "Irmão pode indicar parentesco de sangue, membro do povo ou aliado próximo.", "A fraternidade no AT envolve solidariedade, conflito, herança e responsabilidade.", ["Gênesis 4:9", "Levítico 19:17", "Salmo 133:1"]],
  H802: ["ishshah", "אִשָּׁה", "ishshah", "substantivo feminino", "mulher, esposa", "Mulher pode designar a pessoa feminina ou a esposa no contexto da família e da aliança.", "As narrativas bíblicas mostram mulheres como agentes centrais da promessa, sabedoria e preservação da vida.", ["Gênesis 2:23", "Rute 4:13", "Provérbios 31:10"]],
  H376: ["ish", "אִישׁ", "ish", "substantivo masculino", "homem, varão, pessoa", "Ish pode indicar homem adulto, marido, indivíduo ou representante de um grupo.", "O termo é muito comum na narrativa e precisa ser lido pelo contexto.", ["Gênesis 2:24", "Êxodo 2:12", "Salmo 1:1"]],
  H3205: ["yalad", "יָלַד", "yalad", "verbo", "gerar, nascer, dar à luz", "Gerar e nascer estruturam genealogias, promessas e continuidade da aliança.", "Genealogias bíblicas não são apenas listas; elas preservam identidade, memória e esperança.", ["Gênesis 4:1", "Gênesis 5:3", "Isaías 9:6"]],
  H4191: ["muth", "מוּת", "muth", "verbo", "morrer", "Morrer aparece como limite humano, consequência do pecado e realidade enfrentada pela esperança bíblica.", "A morte no AT é tratada com realismo, lamento e confiança no Deus da vida.", ["Gênesis 2:17", "Salmo 23:4", "Eclesiastes 3:2"]],
  H1818: ["dam", "דָּם", "dam", "substantivo masculino", "sangue", "Sangue representa vida, culpa, violência e expiação no sistema sacrificial.", "A vida está associada ao sangue, por isso o tema é central em Levítico.", ["Gênesis 4:10", "Levítico 17:11", "Êxodo 12:13"]],
  H1320: ["basar", "בָּשָׂר", "basar", "substantivo masculino", "carne, corpo", "Carne pode indicar corpo, parentesco ou fragilidade humana.", "A linguagem de carne destaca a criatura em sua dependência e limitação.", ["Gênesis 2:24", "Isaías 40:6", "Ezequiel 36:26"]],
  H3820: ["leb", "לֵב", "leb", "substantivo masculino", "coração, interior", "Coração no AT envolve pensamento, vontade, desejo e decisão, não apenas emoção.", "A espiritualidade bíblica trata o coração como centro da resposta humana a Deus.", ["Deuteronômio 6:5", "Salmo 51:10", "Provérbios 4:23"]],
  H5869: ["ayin", "עַיִן", "ayin", "substantivo feminino", "olho, fonte", "Olho pode indicar visão física, desejo, julgamento ou percepção espiritual.", "A Bíblia usa olhos para falar de discernimento, cobiça, compaixão e vigilância.", ["Gênesis 3:7", "Salmo 121:1", "Provérbios 15:3"]],
  H6310: ["peh", "פֶּה", "peh", "substantivo masculino", "boca", "Boca é órgão da fala, louvor, ensino e também de mentira ou violência.", "A palavra falada tem peso moral e espiritual no mundo bíblico.", ["Êxodo 4:12", "Salmo 19:14", "Provérbios 18:21"]],
  H3027: ["yad", "יָד", "yad", "substantivo feminino", "mão, poder", "Mão pode indicar membro físico, ação, posse, autoridade ou poder.", "A mão do Senhor é imagem frequente de intervenção, juízo e livramento.", ["Êxodo 13:3", "Salmo 31:5", "Isaías 59:1"]],
  H7218: ["rosh", "רֹאשׁ", "rosh", "substantivo masculino", "cabeça, chefe, início", "Cabeça pode indicar parte do corpo, liderança ou começo.", "O termo transita entre anatomia, autoridade e prioridade.", ["Gênesis 3:15", "Deuteronômio 28:13", "Salmo 23:5"]],
  H1870: ["derek", "דֶּרֶךְ", "derek", "substantivo masculino/feminino", "caminho, jornada, modo de vida", "Caminho descreve rota física e também conduta moral diante de Deus.", "Sabedoria e profecia usam caminho para contrastar obediência e rebeldia.", ["Gênesis 18:19", "Salmo 1:6", "Provérbios 3:6"]],
  H2451: ["chokmah", "חָכְמָה", "chokmah", "substantivo feminino", "sabedoria", "Sabedoria é discernimento prático para viver segundo a ordem de Deus.", "Em Provérbios, sabedoria é caminho de vida, temor do Senhor e formação do caráter.", ["Êxodo 31:3", "Provérbios 1:7", "Jó 28:28"]],
  H998: ["binah", "בִּינָה", "binah", "substantivo feminino", "entendimento, discernimento", "Entendimento é capacidade de perceber, distinguir e responder com sensatez.", "A sabedoria bíblica une inteligência, reverência e prática justa.", ["Provérbios 2:3", "Provérbios 4:5", "Daniel 1:17"]],
  H1847: ["daath", "דַּעַת", "daath", "substantivo feminino", "conhecimento", "Conhecimento no AT pode ser relacional, moral e espiritual, especialmente conhecimento de Deus.", "Conhecer envolve aliança, fidelidade e reconhecimento da verdade.", ["Provérbios 1:7", "Oséias 4:6", "Habacuque 2:14"]],
  H3374: ["yirah", "יִרְאָה", "yirah", "substantivo feminino", "temor, reverência", "Temor do Senhor é reverência que conduz à sabedoria, obediência e adoração.", "Não é mero pavor; é reconhecimento da santidade e autoridade de Deus.", ["Provérbios 1:7", "Salmo 111:10", "Eclesiastes 12:13"]],
  H3372: ["yare", "יָרֵא", "yare", "verbo/adjetivo", "temer, reverenciar", "Temer pode indicar medo diante de perigo ou reverência diante de Deus.", "O contexto define se o termo fala de pavor, respeito ou fidelidade piedosa.", ["Gênesis 22:12", "Deuteronômio 6:13", "Salmo 56:3"]],
  H7563: ["rasha", "רָשָׁע", "rasha", "adjetivo/substantivo", "ímpio, perverso", "Ímpio descreve quem vive em oposição à justiça e à vontade de Deus.", "Salmos e Provérbios contrastam o caminho do ímpio com o caminho do justo.", ["Salmo 1:1", "Provérbios 10:3", "Isaías 55:7"]],
  H6662: ["tsaddiq", "צַדִּיק", "tsaddiq", "adjetivo/substantivo", "justo, reto", "Justo é quem vive de modo alinhado à aliança, à verdade e à justiça de Deus.", "A justiça bíblica é relacional, prática e reverente.", ["Gênesis 6:9", "Salmo 1:6", "Provérbios 10:25"]],
  H3684: ["kesil", "כְּסִיל", "kesil", "substantivo/adjetivo", "tolo, insensato", "Tolo é quem rejeita disciplina, sabedoria e temor do Senhor.", "Na literatura sapiencial, insensatez é problema moral antes de ser intelectual.", ["Provérbios 1:22", "Provérbios 10:1", "Eclesiastes 2:14"]],
  H6098: ["etsah", "עֵצָה", "etsah", "substantivo feminino", "conselho, plano", "Conselho pode ser orientação sábia, decisão estratégica ou desígnio de Deus.", "A Bíblia contrasta conselhos humanos falhos com o conselho firme do Senhor.", ["Salmo 1:1", "Provérbios 19:21", "Isaías 46:10"]],
  H4941: ["mishpat", "מִשְׁפָּט", "mishpat", "substantivo masculino", "juízo, direito, justiça", "Mishpat envolve decisão justa, ordem social e defesa do direito.", "Profetas usam o termo para denunciar opressão e chamar o povo à justiça.", ["Êxodo 23:6", "Isaías 1:17", "Miquéias 6:8"]],
  H8199: ["shaphat", "שָׁפַט", "shaphat", "verbo", "julgar, governar", "Julgar pode significar decidir causas, governar ou exercer justiça.", "Juízes e reis são avaliados pela fidelidade ao julgamento justo.", ["Juízes 2:16", "Salmo 96:13", "Isaías 11:4"]],
  H3519: ["kabod", "כָּבוֹד", "kabod", "substantivo masculino", "glória, peso, honra", "Glória expressa peso, honra e manifestação da presença de Deus.", "A glória do Senhor é tema central no tabernáculo, templo e esperança profética.", ["Êxodo 40:34", "Salmo 24:7", "Isaías 6:3"]],
  H5769: ["olam", "עוֹלָם", "olam", "substantivo masculino", "eternidade, tempo antigo, perpétuo", "Olam pode indicar duração longa, antiguidade ou permanência indefinida.", "A palavra sustenta linguagem de aliança eterna, misericórdia duradoura e Deus eterno.", ["Gênesis 17:7", "Salmo 90:2", "Isaías 40:28"]],
  H5971: ["am", "עַם", "am", "substantivo masculino", "povo", "Povo indica comunidade, nação ou grupo pertencente a Deus.", "Israel é chamado povo do Senhor, com identidade formada por aliança e memória.", ["Êxodo 6:7", "Deuteronômio 7:6", "Salmo 100:3"]],
  H1471: ["goy", "גּוֹי", "goy", "substantivo masculino", "nação, gentios", "Nação pode designar Israel ou os povos em geral.", "A promessa bíblica inclui bênção às nações e juízo sobre poderes injustos.", ["Gênesis 12:2", "Salmo 67:4", "Isaías 49:6"]],
  H5892: ["ir", "עִיר", "ir", "substantivo feminino", "cidade", "Cidade é espaço de habitação, governo, comércio, culto e conflito.", "Jerusalém e Babilônia tornam-se símbolos teológicos contrastantes.", ["Gênesis 4:17", "2 Samuel 5:7", "Salmo 46:4"]],
  H2022: ["har", "הַר", "har", "substantivo masculino", "monte, montanha", "Montes são lugares de revelação, culto, refúgio e símbolo de estabilidade.", "Sinai, Sião e outros montes ganham peso teológico no AT.", ["Êxodo 19:20", "Salmo 121:1", "Isaías 2:2"]],
  H4057: ["midbar", "מִדְבָּר", "midbar", "substantivo masculino", "deserto", "Deserto é lugar de prova, dependência, encontro com Deus e formação do povo.", "A memória do êxodo transforma o deserto em escola espiritual de confiança.", ["Êxodo 3:1", "Deuteronômio 8:2", "Oséias 2:14"]],
  H3220: ["yam", "יָם", "yam", "substantivo masculino", "mar", "Mar pode indicar massa de água, perigo, caos ou limite geográfico.", "O domínio de Deus sobre o mar comunica soberania sobre forças ameaçadoras.", ["Êxodo 14:21", "Salmo 93:4", "Jonas 1:4"]],
  H5104: ["nahar", "נָהָר", "nahar", "substantivo masculino", "rio", "Rio pode ser fonte de vida, fronteira, caminho de comércio ou imagem de bênção.", "Água corrente aparece em imagens de fertilidade, juízo e restauração.", ["Gênesis 2:10", "Salmo 46:4", "Ezequiel 47:5"]],
  H6086: ["ets", "עֵץ", "ets", "substantivo masculino", "árvore, madeira", "Árvore pode indicar vida, fruto, provisão, idolatria ou material de construção.", "A Bíblia usa árvores em imagens de bênção, queda, sabedoria e restauração.", ["Gênesis 2:9", "Salmo 1:3", "Isaías 61:3"]],
  H6529: ["peri", "פְּרִי", "peri", "substantivo masculino", "fruto", "Fruto pode ser produção agrícola, descendência ou resultado moral da vida.", "A linguagem de fruto conecta criação, bênção, obediência e responsabilidade.", ["Gênesis 1:11", "Salmo 1:3", "Provérbios 11:30"]],
  H2233: ["zera", "זֶרַע", "zera", "substantivo masculino", "semente, descendência", "Semente pode indicar grão agrícola ou descendência prometida.", "É palavra-chave para promessa, genealogia, terra e esperança messiânica.", ["Gênesis 3:15", "Gênesis 12:7", "Isaías 53:10"]],
  H3899: ["lechem", "לֶחֶם", "lechem", "substantivo masculino", "pão, alimento", "Pão representa alimento básico, sustento e provisão de Deus.", "Da mesa familiar ao maná, pão comunica dependência diária.", ["Gênesis 3:19", "Êxodo 16:4", "Provérbios 30:8"]],
  H3196: ["yayin", "יַיִן", "yayin", "substantivo masculino", "vinho", "Vinho aparece como alegria, bênção agrícola, oferta e também risco de excesso.", "A Bíblia trata o vinho com tensão entre dádiva e advertência moral.", ["Gênesis 14:18", "Salmo 104:15", "Provérbios 20:1"]],
  H2077: ["zebach", "זֶבַח", "zebach", "substantivo masculino", "sacrifício", "Sacrifício envolve oferta cultual, comunhão, expiação e resposta a Deus.", "O sistema sacrificial ensinava santidade, gratidão, culpa e reconciliação.", ["Gênesis 31:54", "Levítico 3:1", "Salmo 51:17"]],
  H5930: ["olah", "עֹלָה", "olah", "substantivo feminino", "holocausto, oferta que sobe", "Holocausto é oferta inteiramente dedicada a Deus no altar.", "O nome se relaciona ao que sobe, apontando para entrega completa no culto.", ["Gênesis 8:20", "Levítico 1:3", "1 Samuel 7:9"]],
  H4503: ["minchah", "מִנְחָה", "minchah", "substantivo feminino", "oferta, presente", "Oferta pode indicar presente, tributo ou oferta de cereais no culto.", "Minchah une gratidão, honra e reconhecimento da provisão divina.", ["Gênesis 4:3", "Levítico 2:1", "Malaquias 1:10"]],
  H4196: ["mizbeach", "מִזְבֵּחַ", "mizbeach", "substantivo masculino", "altar", "Altar é lugar de oferta, memória, encontro e consagração a Deus.", "Altares marcam momentos de promessa, adoração e renovação da aliança.", ["Gênesis 8:20", "Êxodo 27:1", "Josué 22:26"]],
  H4908: ["mishkan", "מִשְׁכָּן", "mishkan", "substantivo masculino", "tabernáculo, habitação", "Tabernáculo é a habitação portátil da presença de Deus entre Israel.", "O tema mostra Deus habitando no meio do povo em santidade e graça.", ["Êxodo 25:9", "Êxodo 40:34", "Números 9:15"]],
  H727: ["aron", "אָרוֹן", "aron", "substantivo masculino", "arca", "Arca pode indicar caixa, especialmente a arca da aliança no lugar santíssimo.", "A arca simboliza aliança, presença e governo de Deus no meio do povo.", ["Êxodo 25:10", "Josué 3:6", "1 Samuel 4:3"]],
  H3722: ["kaphar", "כָּפַר", "kaphar", "verbo", "expiar, cobrir, fazer propiciação", "Expiar é tratar culpa e impureza diante de Deus.", "O termo é central no sistema sacrificial e no Dia da Expiação.", ["Levítico 16:30", "Números 15:25", "Salmo 78:38"]],
  H7812: ["shachah", "שָׁחָה", "shachah", "verbo", "prostrar-se, adorar", "Prostrar-se expressa reverência, submissão e adoração.", "Gestos corporais no AT comunicam lealdade, humildade e culto.", ["Gênesis 22:5", "Êxodo 34:8", "Salmo 95:6"]],
  H5647: ["abad", "עָבַד", "abad", "verbo", "servir, trabalhar, cultuar", "Servir pode indicar trabalho, escravidão ou serviço cultual ao Senhor.", "O êxodo liberta Israel do serviço a Faraó para servir ao Senhor.", ["Êxodo 3:12", "Josué 24:15", "Salmo 100:2"]],
  H8104: ["shamar", "שָׁמַר", "shamar", "verbo", "guardar, observar, proteger", "Guardar pode ser proteger, obedecer ou observar mandamentos.", "A aliança chama o povo a guardar a palavra, o sábado e o caminho do Senhor.", ["Gênesis 2:15", "Deuteronômio 6:17", "Salmo 121:4"]],
  H1984: ["halal", "הָלַל", "halal", "verbo", "louvar, celebrar", "Louvar é reconhecer publicamente a grandeza e bondade de Deus.", "O louvor bíblico é memória, testemunho e resposta comunitária.", ["Salmo 22:23", "Salmo 113:1", "Salmo 150:1"]],
  H3034: ["yadah", "יָדָה", "yadah", "verbo", "dar graças, confessar, louvar", "Yadah pode indicar confissão, ação de graças e louvor.", "A oração bíblica une reconhecimento do pecado e gratidão pela misericórdia.", ["Gênesis 29:35", "Salmo 106:1", "Daniel 9:4"]],
  H1288: ["barak", "בָּרַךְ", "barak", "verbo", "abençoar, bendizer", "Abençoar pode significar conceder favor ou bendizer a Deus.", "Bênção envolve vida, fecundidade, proteção e vocação para abençoar outros.", ["Gênesis 12:2", "Números 6:24", "Salmo 103:1"]],
  H157: ["ahab", "אָהַב", "ahab", "verbo", "amar", "Amar expressa afeição, lealdade, escolha e compromisso.", "No AT, amor aparece em família, aliança e devoção ao Senhor.", ["Gênesis 22:2", "Deuteronômio 6:5", "Oséias 11:1"]],
  H160: ["ahabah", "אַהֲבָה", "ahabah", "substantivo feminino", "amor", "Amor pode indicar afeto humano, amor pactual e desejo.", "Cânticos explora a linguagem do amor com poesia intensa e corporal.", ["Cânticos 2:4", "Cânticos 8:7", "Jeremias 31:3"]],
  H1730: ["dod", "דּוֹד", "dod", "substantivo masculino", "amado, amado íntimo", "Amado é palavra importante na poesia de Cânticos para desejo e reciprocidade.", "A linguagem amorosa bíblica pode ser celebrada poeticamente sem perder reverência.", ["Cânticos 1:13", "Cânticos 2:8", "Cânticos 5:16"]],
  H3618: ["kallah", "כַּלָּה", "kallah", "substantivo feminino", "noiva, esposa", "Noiva aparece em linguagem matrimonial, aliança e celebração.", "Profetas também usam casamento como imagem da relação entre Deus e seu povo.", ["Cânticos 4:8", "Isaías 62:5", "Jeremias 2:2"]],
  H3754: ["kerem", "כֶּרֶם", "kerem", "substantivo masculino", "vinha, vinhedo", "Vinha pode indicar propriedade agrícola, bênção ou metáfora de Israel.", "Isaías usa a vinha para falar do cuidado de Deus e da infidelidade do povo.", ["Cânticos 1:6", "Isaías 5:1", "Miquéias 4:4"]],
  H3123: ["yonah", "יוֹנָה", "yonah", "substantivo feminino", "pomba", "Pomba aparece como ave, símbolo poético e imagem de fragilidade ou beleza.", "A poesia bíblica usa animais e natureza para expressar afeto e busca.", ["Gênesis 8:8", "Cânticos 2:14", "Oséias 7:11"]],
  H7799: ["shushan", "שׁוּשַׁן", "shushan", "substantivo masculino", "lírio", "Lírio é imagem poética de beleza e delicadeza.", "Cânticos usa flores e jardins para construir linguagem de amor e desejo.", ["Cânticos 2:1", "Cânticos 2:16", "Cânticos 6:3"]],
  H1588: ["gan", "גַּן", "gan", "substantivo masculino", "jardim", "Jardim pode indicar espaço de vida, beleza e comunhão.", "Do Éden a Cânticos, jardim comunica deleite, cuidado e presença.", ["Gênesis 2:8", "Cânticos 4:12", "Isaías 51:3"]],
  H3130: ["Yoseph", "יוֹסֵף", "Yoseph", "nome próprio", "José", "José é figura de providência, sofrimento e preservação da família da promessa.", "Sua história liga sonho, fidelidade, perdão e salvação em meio à fome.", ["Gênesis 37:3", "Gênesis 50:20", "Êxodo 13:19"]],
  H3063: ["Yehudah", "יְהוּדָה", "Yehudah", "nome próprio", "Judá", "Judá é filho de Jacó, tribo real e eixo da promessa davídica.", "A bênção de Gênesis 49 liga Judá à linguagem de governo e esperança messiânica.", ["Gênesis 29:35", "Gênesis 49:10", "Rute 4:12"]],
  H1144: ["Binyamin", "בִּנְיָמִין", "Binyamin", "nome próprio", "Benjamim", "Benjamim é filho de Jacó e tribo associada a histórias decisivas de Israel.", "O nome e a tribo aparecem em narrativas de família, guerra e monarquia.", ["Gênesis 35:18", "Juízes 20:12", "1 Samuel 9:1"]],
  H3878: ["Levi", "לֵוִי", "Levi", "nome próprio", "Levi", "Levi é filho de Jacó e ancestral da tribo ligada ao serviço cultual.", "Os levitas ocupam papel central na guarda, ensino e culto de Israel.", ["Gênesis 29:34", "Números 3:6", "Malaquias 2:4"]],
  H669: ["Ephrayim", "אֶפְרַיִם", "Ephrayim", "nome próprio", "Efraim", "Efraim é filho de José e nome importante para o reino do norte.", "Profetas usam Efraim como representação teológica de Israel em infidelidade e esperança.", ["Gênesis 48:19", "Oséias 11:8", "Jeremias 31:20"]],
  H4519: ["Menashsheh", "מְנַשֶּׁה", "Menashsheh", "nome próprio", "Manassés", "Manassés é filho de José e nome de tribo de Israel.", "A tribo aparece na distribuição da terra e na memória das promessas patriarcais.", ["Gênesis 48:14", "Josué 17:1", "1 Crônicas 5:23"]],
  H8415: ["tehom", "תְּהוֹם", "tehom", "substantivo feminino", "abismo, profundidade", "Em Gênesis 1, abismo descreve a profundidade aquosa antes da ordenação criadora de Deus.", "No imaginário antigo, as águas profundas podiam simbolizar caos; o texto bíblico as coloca sob a soberania do Criador.", ["Gênesis 1:2", "Salmo 42:7", "Jonas 2:5"]],
  H7549: ["raqia", "רָקִיעַ", "raqia", "substantivo masculino", "expansão, firmamento", "A expansão separa águas e organiza o espaço criado na narrativa de Gênesis.", "A linguagem reflete a forma antiga de descrever o cosmos como mundo ordenado por Deus.", ["Gênesis 1:6", "Gênesis 1:14", "Salmo 19:1"]],
  H3974: ["maor", "מָאוֹר", "maor", "substantivo masculino", "luminar, fonte de luz", "Luminares governam tempos, sinais, dias e anos dentro da ordem criada por Deus.", "O texto evita divinizar sol e lua; eles são criaturas a serviço do Criador.", ["Gênesis 1:14", "Gênesis 1:16", "Êxodo 25:6"]],
  H3556: ["kokab", "כּוֹכָב", "kokab", "substantivo masculino", "estrela", "Estrelas aparecem como parte da criação e, em Gênesis, também como imagem da promessa de descendência.", "No mundo antigo, astros eram muitas vezes divinizados; a Bíblia os apresenta como criação de Deus.", ["Gênesis 1:16", "Gênesis 15:5", "Daniel 12:3"]],
  H6754: ["tselem", "צֶלֶם", "tselem", "substantivo masculino", "imagem", "Imagem de Deus indica vocação humana para representar o Criador na criação.", "No Antigo Oriente, imagem podia se relacionar a representação real; Gênesis amplia essa dignidade ao ser humano.", ["Gênesis 1:26", "Gênesis 9:6", "Salmo 8:5"]],
  H1823: ["demuth", "דְּמוּת", "demuth", "substantivo feminino", "semelhança", "Semelhança reforça a relação entre Deus e a humanidade criada para refletir sua vontade.", "A expressão imagem e semelhança sustenta dignidade, responsabilidade e missão humana.", ["Gênesis 1:26", "Gênesis 5:1", "Ezequiel 1:5"]],
  H6509: ["parah", "פָּרָה", "parah", "verbo", "frutificar", "Frutificar expressa bênção criacional, fecundidade e continuidade da vida.", "A bênção de frutificar aparece em criação, família e aliança.", ["Gênesis 1:22", "Gênesis 1:28", "Gênesis 9:1"]],
  H7235: ["rabah", "רָבָה", "rabah", "verbo", "multiplicar, tornar numeroso", "Multiplicar acompanha a bênção de Deus e a promessa de descendência.", "A multiplicação da vida e da família é sinal de bênção na narrativa patriarcal.", ["Gênesis 1:28", "Gênesis 16:10", "Gênesis 22:17"]],
  H5175: ["nachash", "נָחָשׁ", "nachash", "substantivo masculino", "serpente", "A serpente em Gênesis 3 é personagem de tentação, distorção da palavra de Deus e ruptura da confiança.", "A serpente se torna símbolo bíblico de engano, perigo e oposição ao propósito de Deus.", ["Gênesis 3:1", "Gênesis 3:15", "Números 21:8"]],
  H6175: ["arum", "עָרוּם", "arum", "adjetivo", "astuto, prudente", "Em Gênesis 3, astúcia descreve a capacidade da serpente de manipular a palavra e induzir desconfiança.", "A mesma raiz pode ter sentidos positivos ou negativos conforme o contexto sapiencial.", ["Gênesis 3:1", "Provérbios 12:16", "Provérbios 14:15"]],
  H779: ["arar", "אָרַר", "verbo", "amaldiçoar", "Amaldiçoar é declarar juízo, perda de bênção ou condição de desordem diante de Deus.", "A linguagem de bênção e maldição atravessa aliança, terra e obediência.", ["Gênesis 3:14", "Gênesis 12:3", "Deuteronômio 27:15"]],
  H5731: ["Eden", "עֵדֶן", "Eden", "nome próprio", "Éden", "Éden é o jardim da origem humana, lugar de vida, provisão e comunhão com Deus.", "O nome evoca deleite e abundância, tornando-se imagem de restauração futura.", ["Gênesis 2:8", "Gênesis 3:24", "Isaías 51:3"]],
  H7014: ["Qayin", "קַיִן", "Qayin", "nome próprio", "Caim", "Caim é filho de Adão e Eva e figura central na primeira narrativa de violência fraterna.", "Sua história mostra como pecado, inveja e ruptura familiar se expandem após a queda.", ["Gênesis 4:1", "Gênesis 4:8", "Gênesis 4:16"]],
  H1893: ["Hebel", "הֶבֶל", "Hebel", "nome próprio", "Abel", "Abel é irmão de Caim, lembrado por sua oferta e por seu sangue clamando da terra.", "O nome se relaciona a vapor ou brevidade, ecoando a fragilidade da vida.", ["Gênesis 4:2", "Gênesis 4:10", "Hebreus 11:4"]],
  H8352: ["Sheth", "שֵׁת", "Sheth", "nome próprio", "Sete", "Sete é apresentado como descendente dado em lugar de Abel, preservando a linhagem de esperança.", "Sua genealogia conduz à história de Noé e à continuidade da humanidade.", ["Gênesis 4:25", "Gênesis 5:3", "Lucas 3:38"]],
  H583: ["Enosh", "אֱנוֹשׁ", "Enosh", "nome próprio", "Enos", "Enos pertence à linhagem de Sete e aparece ligado ao início da invocação pública do nome do Senhor.", "A genealogia preserva memória teológica, não apenas informação biográfica.", ["Gênesis 4:26", "Gênesis 5:6", "1 Crônicas 1:1"]],
  H2585: ["Chanok", "חֲנוֹךְ", "Chanok", "nome próprio", "Enoque", "Enoque é lembrado como aquele que andou com Deus e foi tomado por Deus.", "Sua breve nota em Gênesis destaca comunhão com Deus em meio à genealogia marcada pela morte.", ["Gênesis 5:22", "Gênesis 5:24", "Hebreus 11:5"]],
  H5146: ["Noach", "נֹחַ", "Noach", "nome próprio", "Noé", "Noé é figura de justiça, livramento e recomeço da humanidade após o dilúvio.", "Sua história une juízo, graça, aliança e preservação da vida.", ["Gênesis 6:8", "Gênesis 9:9", "Hebreus 11:7"]],
  H8392: ["tebah", "תֵּבָה", "tebah", "substantivo feminino", "arca, caixa de preservação", "Em Gênesis, a arca de Noé é instrumento de preservação em meio ao juízo das águas.", "Esta palavra é diferente da arca da aliança; também aparece no cesto de Moisés.", ["Gênesis 6:14", "Gênesis 7:1", "Êxodo 2:3"]],
  H3315: ["Yepheth", "יֶפֶת", "Yepheth", "nome próprio", "Jafé", "Jafé é filho de Noé e ancestral de povos listados na tábua das nações.", "Gênesis usa genealogias para explicar relações entre povos conhecidos de Israel.", ["Gênesis 5:32", "Gênesis 9:27", "Gênesis 10:2"]],
  H3667: ["Kena'an", "כְּנַעַן", "Kena'an", "nome próprio", "Canaã", "Canaã é filho de Cam e também nome da terra central nas promessas patriarcais.", "O nome liga genealogia, território, promessa e conflito espiritual na narrativa bíblica.", ["Gênesis 9:25", "Gênesis 12:5", "Êxodo 3:8"]],
  H894: ["Babel", "בָּבֶל", "Babel", "nome próprio", "Babel, Babilônia", "Babel em Gênesis 11 representa concentração de poder humano e confusão das línguas.", "Mais tarde, Babilônia se torna símbolo de império, orgulho e oposição a Deus.", ["Gênesis 11:9", "Isaías 13:1", "Daniel 1:1"]],
  H8152: ["Shinar", "שִׁנְעָר", "Shinar", "nome próprio", "Sinar", "Sinar é a planície associada à construção de Babel.", "O local conecta a narrativa das origens à memória posterior da Babilônia.", ["Gênesis 10:10", "Gênesis 11:2", "Daniel 1:2"]],
  H218: ["Ur", "אוּר", "Ur", "nome próprio", "Ur", "Ur dos caldeus é o ponto de origem da jornada familiar de Abrão.", "A saída de Ur prepara o chamado, a promessa e a peregrinação patriarcal.", ["Gênesis 11:28", "Gênesis 15:7", "Neemias 9:7"]],
  H2039: ["Haran", "הָרָן", "Haran", "nome próprio", "Harã", "Harã é nome de pessoa e também lugar de parada na jornada da família de Abrão.", "A narrativa patriarcal usa deslocamentos para mostrar chamado, espera e promessa.", ["Gênesis 11:31", "Gênesis 12:4", "Gênesis 27:43"]],
  H8646: ["Terach", "תֶּרַח", "Terach", "nome próprio", "Terá", "Terá é pai de Abrão, Naor e Harã, ligado à transição para a história patriarcal.", "Sua família marca a passagem das genealogias universais para a promessa abraâmica.", ["Gênesis 11:24", "Gênesis 11:31", "Josué 24:2"]],
  H87: ["Avram", "אַבְרָם", "Avram", "nome próprio", "Abrão", "Abrão é o nome inicial de Abraão antes da renovação do nome na aliança.", "A mudança de nome em Gênesis 17 expressa vocação ampliada e promessa às nações.", ["Gênesis 12:1", "Gênesis 15:6", "Gênesis 17:5"]],
  H8297: ["Saray", "שָׂרַי", "Saray", "nome próprio", "Sarai", "Sarai é o nome inicial de Sara antes da promessa explicitada na aliança.", "Sua história passa por esterilidade, espera, promessa e nascimento impossível aos olhos humanos.", ["Gênesis 11:29", "Gênesis 16:1", "Gênesis 17:15"]],
  H8283: ["Sarah", "שָׂרָה", "Sarah", "nome próprio", "Sara", "Sara é matriarca da promessa e mãe de Isaque.", "A mudança de nome reforça seu lugar na aliança e na promessa de descendência.", ["Gênesis 17:15", "Gênesis 18:12", "Gênesis 21:1"]],
  H3876: ["Lot", "לוֹט", "Lot", "nome próprio", "Ló", "Ló é sobrinho de Abrão, associado à escolha das campinas do Jordão e ao juízo de Sodoma.", "Sua história contrasta proximidade com a promessa e vulnerabilidade diante de cidades corrompidas.", ["Gênesis 12:5", "Gênesis 13:11", "Gênesis 19:1"]],
  H5467: ["Sedom", "סְדֹם", "Sedom", "nome próprio", "Sodoma", "Sodoma torna-se símbolo de grave corrupção, violência e juízo divino.", "A cidade aparece na tradição bíblica como advertência moral e social.", ["Gênesis 13:13", "Gênesis 18:20", "Ezequiel 16:49"]],
  H6017: ["Amorah", "עֲמֹרָה", "Amorah", "nome próprio", "Gomorra", "Gomorra é cidade associada a Sodoma no juízo das cidades da campina.", "Sodoma e Gomorra funcionam juntas como memória de juízo e advertência.", ["Gênesis 14:2", "Gênesis 19:24", "Deuteronômio 29:23"]],
  H4442: ["Malki-Tsedeq", "מַלְכִּי־צֶדֶק", "Malki-Tsedeq", "nome/título", "Melquisedeque", "Melquisedeque aparece como rei de Salém e sacerdote do Deus Altíssimo.", "Sua figura une realeza, sacerdócio, bênção e tipologia messiânica posterior.", ["Gênesis 14:18", "Salmo 110:4", "Hebreus 7:1"]],
  H8004: ["Shalem", "שָׁלֵם", "Shalem", "nome próprio", "Salém", "Salém é o reino de Melquisedeque e é tradicionalmente associado a Jerusalém.", "O nome evoca paz e inteireza, conectando realeza e bênção.", ["Gênesis 14:18", "Salmo 76:2", "Hebreus 7:2"]],
  H1904: ["Hagar", "הָגָר", "Hagar", "nome próprio", "Hagar", "Hagar é serva egípcia de Sarai e mãe de Ismael.", "Sua história destaca conflito familiar, sofrimento, cuidado divino e o Deus que vê.", ["Gênesis 16:1", "Gênesis 16:13", "Gênesis 21:17"]],
  H3458: ["Yishmael", "יִשְׁמָעֵאל", "Yishmael", "nome próprio", "Ismael", "Ismael é filho de Abraão e Hagar, cujo nome lembra que Deus ouve.", "Sua narrativa mostra tensão familiar e também promessa de cuidado divino.", ["Gênesis 16:11", "Gênesis 17:20", "Gênesis 21:18"]],
  H4471: ["Mamre", "מַמְרֵא", "Mamre", "nome próprio", "Manre", "Manre é local associado à permanência de Abraão e à visita divina em Gênesis 18.", "Carvalhais, tendas e altares marcam a vida patriarcal como peregrinação diante de Deus.", ["Gênesis 13:18", "Gênesis 18:1", "Gênesis 23:19"]],
  H7259: ["Rivqah", "רִבְקָה", "Rivqah", "nome próprio", "Rebeca", "Rebeca é matriarca, esposa de Isaque e mãe de Jacó e Esaú.", "Sua história envolve providência, família, conflito entre filhos e continuidade da promessa.", ["Gênesis 24:15", "Gênesis 25:23", "Gênesis 27:13"]],
  H6215: ["Esav", "עֵשָׂו", "Esav", "nome próprio", "Esaú", "Esaú é filho de Isaque e Rebeca, irmão de Jacó e ancestral de Edom.", "Sua história envolve primogenitura, bênção, conflito familiar e reconciliação.", ["Gênesis 25:25", "Gênesis 27:41", "Gênesis 33:4"]],
  H123: ["Edom", "אֱדוֹם", "Edom", "nome próprio", "Edom", "Edom é nome ligado a Esaú e ao povo descendente dele.", "A relação entre Jacó e Esaú se projeta nas tensões posteriores entre Israel e Edom.", ["Gênesis 25:30", "Gênesis 36:1", "Obadias 1:1"]],
  H3837: ["Lavan", "לָבָן", "Lavan", "nome próprio", "Labão", "Labão é irmão de Rebeca e pai de Lia e Raquel, ligado ao ciclo de Jacó.", "Sua narrativa explora trabalho, engano, família e providência.", ["Gênesis 24:29", "Gênesis 29:25", "Gênesis 31:55"]],
  H3812: ["Leah", "לֵאָה", "Leah", "nome próprio", "Lia", "Lia é esposa de Jacó e mãe de filhos que formam tribos de Israel.", "Sua história mostra dor familiar, competição e graça na formação do povo.", ["Gênesis 29:23", "Gênesis 29:32", "Gênesis 49:31"]],
  H7354: ["Rachel", "רָחֵל", "Rachel", "nome próprio", "Raquel", "Raquel é esposa amada de Jacó e mãe de José e Benjamim.", "Sua narrativa reúne amor, esterilidade, rivalidade e promessa.", ["Gênesis 29:18", "Gênesis 30:22", "Gênesis 35:18"]],
  H1783: ["Dinah", "דִּינָה", "Dinah", "nome próprio", "Diná", "Diná é filha de Jacó e Lia, ligada à narrativa dolorosa de Gênesis 34.", "Sua história expõe honra familiar, violência e respostas problemáticas de vingança.", ["Gênesis 30:21", "Gênesis 34:1", "Gênesis 46:15"]],
  H1008: ["Bethel", "בֵּית־אֵל", "Bethel", "nome próprio", "Betel", "Betel significa casa de Deus e marca experiências decisivas de Jacó.", "O lugar se torna memória de revelação, voto e encontro com Deus.", ["Gênesis 28:19", "Gênesis 35:1", "Amós 4:4"]],
  H6439: ["Penuel", "פְּנוּאֵל", "Penuel", "nome próprio", "Peniel, Penuel", "Peniel/Penuel é o lugar onde Jacó luta e recebe novo nome.", "O nome lembra a experiência de ver Deus face a face e sair transformado.", ["Gênesis 32:30", "Juízes 8:8", "1 Reis 12:25"]],
  H6318: ["Potiphar", "פּוֹטִיפַר", "Potiphar", "nome próprio", "Potifar", "Potifar é oficial egípcio a quem José é vendido.", "A casa de Potifar introduz a fidelidade de José em terra estrangeira.", ["Gênesis 37:36", "Gênesis 39:1", "Gênesis 39:20"]],
  H2526: ["Cham", "חָם", "Cham", "nome próprio", "Cam, Cão", "Cam é filho de Noé e ancestral de povos listados em Gênesis 10.", "A tabela das nações organiza povos antigos em relações de parentesco teológico e geográfico.", ["Gênesis 5:32", "Gênesis 9:22", "Gênesis 10:6"]],
  H7205: ["Reuven", "רְאוּבֵן", "Reuven", "nome próprio", "Rúben", "Rúben é primogênito de Jacó e Lia.", "Sua história envolve primogenitura, perda de posição e memória tribal.", ["Gênesis 29:32", "Gênesis 35:22", "Gênesis 49:3"]],
  H8095: ["Shimon", "שִׁמְעוֹן", "Shimon", "nome próprio", "Simeão", "Simeão é filho de Jacó e Lia e nome de uma das tribos de Israel.", "Sua narrativa aparece ligada à família de Jacó e ao episódio de Siquém.", ["Gênesis 29:33", "Gênesis 34:25", "Gênesis 49:5"]],
  H1835: ["Dan", "דָּן", "Dan", "nome próprio", "Dã", "Dã é filho de Jacó e Bila e nome de tribo de Israel.", "O nome se relaciona à ideia de julgar, preservando memória da fala de Raquel.", ["Gênesis 30:6", "Gênesis 49:16", "Juízes 18:29"]],
  H5321: ["Naphtali", "נַפְתָּלִי", "Naphtali", "nome próprio", "Naftali", "Naftali é filho de Jacó e Bila, ligado à formação das tribos.", "Os nomes dos filhos de Jacó frequentemente carregam memória de conflito, oração e esperança familiar.", ["Gênesis 30:8", "Gênesis 35:25", "Gênesis 49:21"]],
  H1410: ["Gad", "גָּד", "Gad", "nome próprio", "Gade", "Gade é filho de Jacó e Zilpa e ancestral de uma tribo de Israel.", "O nome se relaciona à ideia de fortuna ou tropa, dentro da dinâmica familiar de Jacó.", ["Gênesis 30:11", "Gênesis 35:26", "Gênesis 49:19"]],
  H836: ["Asher", "אָשֵׁר", "Asher", "nome próprio", "Aser", "Aser é filho de Jacó e Zilpa e nome de uma tribo.", "O nome se relaciona à felicidade ou bem-aventurança anunciada por Lia.", ["Gênesis 30:13", "Gênesis 35:26", "Gênesis 49:20"]],
  H3485: ["Yissaskar", "יִשָּׂשכָר", "Yissaskar", "nome próprio", "Issacar", "Issacar é filho de Jacó e Lia e ancestral de uma tribo de Israel.", "Sua história participa da formação familiar das doze tribos.", ["Gênesis 30:18", "Gênesis 35:23", "Gênesis 49:14"]],
  H2074: ["Zevulun", "זְבֻלוּן", "Zevulun", "nome próprio", "Zebulom", "Zebulom é filho de Jacó e Lia e nome tribal.", "A bênção de Jacó associa Zebulom à linguagem de habitação e região marítima.", ["Gênesis 30:20", "Gênesis 35:23", "Gênesis 49:13"]],
  H4179: ["Moriyah", "מֹרִיָּה", "Moriyah", "nome próprio", "Moriá", "Moriá é a terra associada ao teste de Abraão em Gênesis 22.", "O lugar ganha importância posterior por sua associação com adoração, entrega e provisão divina.", ["Gênesis 22:2", "2 Crônicas 3:1", "Hebreus 11:17"]],
  H2275: ["Chevron", "חֶבְרוֹן", "Chevron", "nome próprio", "Hebrom", "Hebrom é local importante da vida patriarcal, associado a Abraão, sepulturas familiares e promessa.", "A cidade se torna lugar de memória ancestral e, depois, cenário da história de Davi.", ["Gênesis 13:18", "Gênesis 23:19", "2 Samuel 2:1"]],
  H4375: ["Machpelah", "מַכְפֵּלָה", "Machpelah", "nome próprio", "Macpela", "Macpela é o campo/caverna comprado por Abraão para sepultura familiar.", "A compra do terreno em Canaã é sinal concreto da esperança na promessa da terra.", ["Gênesis 23:9", "Gênesis 23:19", "Gênesis 49:30"]],
  H7153: ["Qiryath-Arba", "קִרְיַת אַרְבַּע", "Qiryath-Arba", "nome próprio", "Quiriate-Arba", "Quiriate-Arba é nome antigo associado a Hebrom.", "O nome preserva memória geográfica anterior dentro da narrativa da terra prometida.", ["Gênesis 23:2", "Gênesis 35:27", "Josué 14:15"]],
  H884: ["Beer-Sheva", "בְּאֵר שֶׁבַע", "Beer-Sheva", "nome próprio", "Berseba", "Berseba é lugar ligado a poços, juramentos e permanência patriarcal.", "Poços e juramentos em Gênesis mostram sobrevivência, conflito e reconhecimento público.", ["Gênesis 21:31", "Gênesis 26:33", "Gênesis 46:1"]],
  H1642: ["Gerar", "גְּרָר", "Gerar", "nome próprio", "Gerar", "Gerar é região associada a Abraão, Isaque e Abimeleque.", "As narrativas em Gerar exploram medo, proteção divina e conflitos por poços.", ["Gênesis 20:1", "Gênesis 26:1", "Gênesis 26:20"]],
  H1568: ["Gilead", "גִּלְעָד", "Gilead", "nome próprio", "Gileade", "Gileade é região a leste do Jordão, citada na história de Jacó e Labão.", "O lugar se torna referência geográfica e memorial em Israel.", ["Gênesis 31:21", "Gênesis 31:48", "Jeremias 8:22"]],
  H3383: ["Yarden", "יַרְדֵּן", "Yarden", "nome próprio", "Jordão", "O Jordão é rio importante como fronteira, passagem e marco da terra.", "Na história bíblica, atravessar o Jordão torna-se imagem de transição para a promessa.", ["Gênesis 13:10", "Josué 3:15", "2 Reis 5:14"]]
};

const wordBank = {
  H430: ["Deus", "deuses"],
  H3068: ["Senhor", "SENHOR"],
  H7225: ["princípio"],
  H1254: ["criou", "criar", "cria"],
  H776: ["terra"],
  H8064: ["céu", "céus"],
  H216: ["luz"],
  H2822: ["trevas"],
  H7307: ["Espírito", "espírito", "vento", "sopro"],
  H4325: ["água", "águas"],
  H3117: ["dia", "dias"],
  H3915: ["noite", "noites"],
  H2896: ["bom", "boa"],
  H120: ["homem", "homens", "Adão"],
  H5315: ["alma", "almas"],
  H2416: ["vida", "vivente", "viventes", "vivo", "vivos"],
  H1285: ["aliança", "pacto"],
  H4428: ["rei", "reis"],
  H4467: ["reino", "reinos"],
  H3478: ["Israel"],
  H3389: ["Jerusalém"],
  H6944: ["santo", "santa", "santos", "santas", "santidade"],
  H6666: ["justiça", "justo", "justos"],
  H2403: ["pecado", "pecados"],
  H7965: ["paz"],
  H2617: ["misericórdia", "benignidade"],
  H571: ["verdade", "fidelidade"],
  H1697: ["palavra", "palavras"],
  H8451: ["lei"],
  H4687: ["mandamento", "mandamentos"],
  H5030: ["profeta", "profetas"],
  H3548: ["sacerdote", "sacerdotes"],
  H1004: ["casa", "casas"],
  H1121: ["filho", "filhos"],
  H5650: ["servo", "servos"],
  H8085: ["ouviu", "ouve", "ouvir", "ouvi", "ouvido", "escuta"],
  H559: ["disse", "dizendo", "dizer"],
  H7200: ["viu", "ver", "vendo"],
  H5414: ["deu", "dar", "dá", "dado"],
  H1980: ["andou", "andar", "anda"],
  H7725: ["voltou", "voltar", "convertei", "converteu"],
  H3467: ["salvar", "salvou", "salva"],
  H3444: ["salvação"],
  H4899: ["ungido", "Messias"],
  H1732: ["Davi"],
  H85: ["Abraão"],
  H3327: ["Isaque"],
  H3290: ["Jacó"],
  H4872: ["Moisés"],
  H4714: ["Egito"],
  H6547: ["Faraó"],
  H1: ["pai", "pais", "patriarcas", "ancestral", "antepassados"],
  H517: ["mãe", "mae", "mães", "maes"],
  H251: ["irmão", "irmao", "irmãos", "irmaos"],
  H802: ["mulher", "mulheres", "esposa", "esposas"],
  H376: ["homem", "varão", "varao"],
  H3205: ["nasceu", "nasceram", "gerou", "geraram", "gerar", "gerado", "deu à luz", "deu a luz"],
  H4191: ["morreu", "morrer", "morte", "morto", "mortos"],
  H1818: ["sangue"],
  H1320: ["carne", "corpo"],
  H3820: ["coração", "coracao", "corações", "coracoes"],
  H5869: ["olho", "olhos"],
  H6310: ["boca"],
  H3027: ["mão", "mao", "mãos", "maos"],
  H7218: ["cabeça", "cabeca", "cabeças", "cabecas", "chefe"],
  H1870: ["caminho", "caminhos"],
  H2451: ["sabedoria", "sábio", "sabio", "sábios", "sabios", "sábia", "sabia"],
  H998: ["entendimento", "entender", "discernimento"],
  H1847: ["conhecimento", "conhecer", "conheceu"],
  H3374: ["temor", "reverência", "reverencia"],
  H3372: ["temer", "temeu", "teme", "temei"],
  H7563: ["ímpio", "impio", "ímpios", "impios", "perverso", "perversos"],
  H6662: ["justo", "justos", "justa", "justas"],
  H3684: ["tolo", "tolos", "insensato", "insensatos"],
  H6098: ["conselho", "conselhos", "plano", "planos"],
  H4941: ["juízo", "juizo", "juízos", "juizos", "direito", "justiça", "justica"],
  H8199: ["julgar", "julgou", "julga", "julgam", "julgamento"],
  H3519: ["glória", "gloria", "honra"],
  H5769: ["eterno", "eterna", "perpétuo", "perpetuo", "sempre"],
  H5971: ["povo", "povos"],
  H1471: ["nação", "nacao", "nações", "nacoes", "gentios"],
  H5892: ["cidade", "cidades"],
  H2022: ["monte", "montes", "montanha", "montanhas"],
  H4057: ["deserto", "desertos"],
  H3220: ["mar", "mares"],
  H5104: ["rio", "rios"],
  H6086: ["árvore", "arvore", "árvores", "arvores", "madeira"],
  H6529: ["fruto", "frutos"],
  H2233: ["semente", "descendência", "descendencia"],
  H3899: ["pão", "pao", "alimento"],
  H3196: ["vinho"],
  H2077: ["sacrifício", "sacrificio", "sacrifícios", "sacrificios"],
  H5930: ["holocausto", "holocaustos"],
  H4503: ["oferta", "ofertas", "presente", "presentes"],
  H4196: ["altar", "altares"],
  H4908: ["tabernáculo", "tabernaculo", "habitação", "habitacao"],
  H727: [],
  H3722: ["expiar", "expiação", "expiacao", "perdoar"],
  H7812: ["adorar", "adorou", "prostrou", "prostrar"],
  H5647: ["servir", "serviu", "serve", "serviço", "servico", "cultuar"],
  H8104: ["guardar", "guardou", "guarda", "guardai", "observa", "observar"],
  H1984: ["louvar", "louvai", "louvor", "louvores"],
  H3034: ["graças", "gracas", "agradecer", "confessar", "louvarei"],
  H1288: ["abençoar", "abencoar", "abençoou", "abencoou", "bênção", "bencao", "bendize"],
  H157: ["amar", "amou", "ama", "amei"],
  H160: ["amor", "amores"],
  H1730: ["amado", "amada", "amados"],
  H3618: ["noiva", "esposa"],
  H3754: ["vinha", "vinhas", "vinhedo"],
  H3123: ["pomba", "pombas"],
  H7799: ["lírio", "lirio", "lírios", "lirios"],
  H1588: ["jardim", "jardins"],
  H3130: ["José", "Jose"],
  H3063: ["Judá", "Juda"],
  H1144: ["Benjamim"],
  H3878: ["Levi"],
  H669: ["Efraim"],
  H4519: ["Manassés", "Manasses"],
  H8415: ["abismo"],
  H7549: ["expansão", "expansao", "firmamento"],
  H3974: ["luminar", "luminares"],
  H3556: ["estrela", "estrelas"],
  H6754: ["imagem"],
  H1823: ["semelhança", "semelhanca"],
  H6509: ["frutificai", "frutificou", "frutificar"],
  H7235: ["multiplicai", "multiplicar", "multiplicarei", "multiplicou", "multiplicaram"],
  H5175: ["serpente", "serpentes"],
  H6175: ["astuta", "astuto", "prudente"],
  H779: ["amaldiçoada", "amaldicoada", "amaldiçoado", "amaldicoado", "amaldiçoarei", "amaldicoarei", "maldito", "maldita"],
  H5731: ["Éden", "Eden"],
  H7014: ["Caim"],
  H1893: ["Abel"],
  H8352: ["Sete"],
  H583: ["Enos"],
  H2585: ["Enoque"],
  H5146: ["Noé", "Noe"],
  H3315: ["Jafé", "Jafe"],
  H3667: ["Canaã", "Canaa"],
  H894: ["Babel", "Babilônia", "Babilonia"],
  H8152: ["Sinar"],
  H218: ["Ur"],
  H2039: ["Harã", "Hara"],
  H8646: ["Terá", "Tera"],
  H87: ["Abrão", "Abraao"],
  H8297: ["Sarai"],
  H8283: ["Sara"],
  H3876: ["Ló", "Lo"],
  H5467: ["Sodoma"],
  H6017: ["Gomorra"],
  H4442: ["Melquisedeque"],
  H8004: ["Salém", "Salem"],
  H1904: ["Hagar", "Agar"],
  H3458: ["Ismael"],
  H4471: ["Manre", "Mamre"],
  H7259: ["Rebeca"],
  H6215: ["Esaú", "Esau"],
  H123: ["Edom"],
  H3837: ["Labão", "Labao"],
  H3812: ["Lia"],
  H7354: ["Raquel"],
  H1783: ["Diná", "Dina"],
  H1008: ["Betel"],
  H6439: ["Peniel", "Penuel"],
  H6318: ["Potifar"],
  H2526: ["Cão", "Cao"],
  H7205: ["Rúben", "Ruben"],
  H8095: ["Simeão", "Simeao"],
  H1835: ["Dã", "Da"],
  H5321: ["Naftali"],
  H1410: ["Gade"],
  H836: ["Aser"],
  H3485: ["Issacar"],
  H2074: ["Zebulom"],
  H4179: ["Moriá", "Moria"],
  H2275: ["Hebrom"],
  H4375: ["Macpela"],
  H7153: ["Quiriate-Arba", "Quiriate Arba"],
  H884: ["Berseba", "Beer-Seba", "Beer Seba"],
  H1642: ["Gerar"],
  H1568: ["Gileade"],
  H3383: ["Jordão", "Jordao"]
};

const bookWordBank = {
  genesis: {
    H8392: ["arca"]
  }
};

const shortProperWordBank = {
  genesis: {
    H3876: ["Ló", "Lo"],
    H1835: ["Dã"],
    H1642: ["Gerar"]
  }
};

function normalize(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findTokens(text, bookId) {
  const matches = [];
  const occupied = [];

  function overlaps(start, end) {
    return occupied.some(range => start < range.end && end > range.start);
  }

  const normalizedText = normalize(text);
  const shortBank = shortProperWordBank[bookId] || {};

  Object.entries(shortBank).forEach(([strong, words]) => {
    words.forEach(word => {
      const regex = new RegExp(`(^|[^\\p{L}\\p{N}_])(${escapeRegExp(word)})(?=[^\\p{L}\\p{N}_]|$)`, "gu");
      let match;
      while ((match = regex.exec(text))) {
        const start = match.index + match[1].length;
        const end = start + match[2].length;
        if (overlaps(start, end)) continue;
        const visible = text.slice(start, end);
        occupied.push({ start, end });
        matches.push({ start, word: visible, strong });
      }
    });
  });

  const bank = { ...wordBank, ...(bookWordBank[bookId] || {}) };

  Object.entries(bank).forEach(([strong, words]) => {
    words
      .slice()
      .sort((left, right) => right.length - left.length)
      .forEach(word => {
        const normalizedWord = normalize(word);
        if (normalizedWord.length < 3) return;
        const regex = new RegExp(`(^|[^\\p{L}\\p{N}_])(${escapeRegExp(normalizedWord)})(?=[^\\p{L}\\p{N}_]|$)`, "giu");
        let match;
        while ((match = regex.exec(normalizedText))) {
          const start = match.index + match[1].length;
          const end = start + match[2].length;
          if (overlaps(start, end)) continue;
          const visible = text.slice(start, end);
          occupied.push({ start, end });
          matches.push({ start, word: visible, strong });
        }
      });
  });

  return matches
    .sort((left, right) => left.start - right.start || left.strong.localeCompare(right.strong))
    .map(({ word, strong }) => ({ word, strong }));
}

function readBook(file) {
  const raw = fs.readFileSync(file, "utf8");
  return JSON.parse(raw.replace(/^globalThis\.appData\.books\.push\(/, "").replace(/\);\s*$/, ""));
}

function writeBook(file, book) {
  fs.writeFileSync(file, `globalThis.appData.books.push(${JSON.stringify(book, null, 2)});\n`);
}

let markedWords = 0;
for (const id of otIds) {
  const file = path.join(booksDir, `${id}.js`);
  const book = readBook(file);
  for (const chapter of book.chapters) {
    for (const verse of chapter.verses) {
      verse.tokens = findTokens(verse.text, id);
      markedWords += verse.tokens.length;
    }
  }
  writeBook(file, book);
}

const lexiconPayload = Object.fromEntries(Object.entries(hebrewLexicon).map(([strong, values]) => ([
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
lexicon = lexicon.replace(/\n\/\/ BEGIN HEBREW STRONG LAYER[\s\S]*?\/\/ END HEBREW STRONG LAYER\n?/u, "\n");
lexicon += `\n// BEGIN HEBREW STRONG LAYER\nObject.assign(globalThis.appData.lexicon, ${JSON.stringify(lexiconPayload, null, 2)});\n// END HEBREW STRONG LAYER\n`;
fs.writeFileSync(lexiconFile, lexicon);

console.log(JSON.stringify({
  hebrewCards: Object.keys(hebrewLexicon).length,
  markedWords
}, null, 2));
