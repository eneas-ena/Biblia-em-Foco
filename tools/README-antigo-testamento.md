# Antigo Testamento

O terminal desta sessao nao conseguiu acessar `bible-api.com` nem `raw.githubusercontent.com`
por bloqueio de rede/DNS. Por isso, o caminho preparado para importar o AT e:

1. Baixar no navegador o arquivo JSON completo:
   `https://raw.githubusercontent.com/thiagobodruk/biblia/master/json/acf.json`
2. Salvar o arquivo como:
   `outputs/biblia-em-foco/tools/acf.json`
3. Rodar:
   `node outputs/biblia-em-foco/tools/import-old-testament-json.js outputs/biblia-em-foco/tools/acf.json`

O importador cria os 39 livros do Antigo Testamento, gera marcacoes iniciais usando
o banco Strong ja existente no app, reorganiza o `index.html` em ordem biblica e
inclui os novos arquivos no cache offline (`sw.js`).
