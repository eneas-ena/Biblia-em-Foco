# Bíblia em Foco

Protótipo organizado do leitor bíblico de estudo.

## Arquivos

- `index.html`: estrutura da tela.
- `styles.css`: aparência do app.
- `app.js`: lógica de leitura, busca, notas, card Strong e IA.
- `data/app-data.js`: metadados gerais do app.
- `data/books/*.js`: textos do Novo Testamento, palavras marcadas e vínculos Strong.
- `data/lexicon.js`: léxico Strong usado pelo app.
- `assets/BF.png`: imagem usada como referência visual da tela inicial.
- `tools/build-book.js`: gera um novo livro a partir de um JSON simples.
- `tools/audit-data.js`: confere se todos os livros e cards Strong estão ligados corretamente.
- `tools/strong-word-bank.json`: banco editável de palavras usadas para marcação automática.

## Estado atual

- Livro piloto: João.
- Livros disponíveis: Novo Testamento completo, de Mateus a Apocalipse.
- Recursos funcionando: tela inicial, navegação por capítulo, palavras clicáveis, card de estudo, dossiê Strong com ocorrências clicáveis, busca por texto/Strong/lema, estudo por tema editável, favoritos, histórico recente, marcações pessoais, notas por palavra, notas por versículo e análise com IA configurável.
- Ao salvar uma nota, o app também baixa um arquivo de estudo quando houver nota escrita ou análise da IA salva para aquele card.
- Textos importados a partir de João Ferreira de Almeida em domínio público via bible-api.com; as marcações Strong foram aplicadas de forma conservadora usando palavras já cobertas pelo léxico do app.
- Camada adicional de marcações: nomes e lugares importantes em João, enriquecimento de João 4 e reforço dos termos de julgamento/cruz em João 18-19.
- Melhorias de uso: busca direta por referência, temas compostos, card Strong com resumo de ocorrências, painel Meu estudo e enriquecimento de João 5-6.
- Ajustes finais em João: botões de limpar nota/estudo, botões menores e camada ampla de marcações nos 21 capítulos.
- Esteira para próximos livros: agora é possível importar um livro em JSON, gerar o arquivo do app automaticamente e aplicar uma primeira camada de marcações usando o léxico já existente.
- Marcos incluído com 16 capítulos, 678 versículos e primeira camada automática de marcações Strong.
- Marcos 10 a 16 reforçados com termos de discipulado, entrada em Jerusalém, discurso final, paixão, ressurreição e missão; o gerador também passou a reconhecer expressões compostas como “falsos cristos”.
- Mateus incluído com 28 capítulos, 1071 versículos e primeira camada automática de marcações Strong.
- Mateus reforçado: genealogia de Jesus com nomes marcados, Sermão do Monte, parábolas, João Batista, denúncias de Mateus 23, vigilância de Mateus 24-25 e paixão em Mateus 27.
- Lucas incluído com 24 capítulos, 1150 versículos e reforço inicial nos relatos do nascimento, bom samaritano, parábolas dos perdidos, vigilância, ceia, paixão e ressurreição.
- Genealogia de Lucas 3 reforçada com cards Strong para os nomes da linhagem de Jesus, de Eli a Adão.
- Novo Testamento completo incluído para demonstração, com Atos, cartas e Apocalipse pesquisáveis e marcados automaticamente.
- Manifesto PWA e service worker adicionados para uso em celular quando o app estiver em um link HTTPS.
- Marcação assistida inicial: palavras comuns do texto podem ser clicadas; o app sugere Strong já usado para a mesma palavra e salva a nova marcação pessoal no navegador.
- Busca reposicionada: resultados aparecem logo abaixo da barra superior. Sugestão com IA agora aplica automaticamente quando retorna um único Strong já existente no app.
- Minhas marcações: painel para abrir ou remover palavras acrescentadas pela marcação assistida, sem mexer nas marcações oficiais do livro.

## Como incluir um novo livro mais rápido

1. Duplique `tools/book-source.example.json`.
2. Troque `id`, `name`, capítulos, versículos e textos.
3. Rode, dentro da pasta `biblia-em-foco`:

```bash
node tools/build-book.js tools/seu-livro.json --install
```

4. Confira a saúde dos dados:

```bash
node tools/audit-data.js
```

O importador não inventa Strong novo. Ele marca automaticamente apenas palavras que já existem no léxico ou no banco `tools/strong-word-bank.json`. Depois disso, a lapidação fina continua sendo feita com revisão humana.
