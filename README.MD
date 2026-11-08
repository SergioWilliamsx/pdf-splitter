<div align="center">

# ⚡ PDF Chapter Splitter

**Divida livros em PDFs individuais a partir do sumário interno do documento.**

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

## Sobre o projeto

O PDF Chapter Splitter identifica os capítulos pelo **outline/sumário interno** do PDF e gera um arquivo separado para cada capítulo encontrado.

O fluxo é:

1. Ler os marcadores de navegação do PDF.
2. Selecionar os marcadores que correspondem ao padrão configurado.
3. Calcular o intervalo de páginas de cada capítulo.
4. Copiar as páginas para novos arquivos PDF na pasta de saída.

O projeto usa [`pdfjs-dist`](https://github.com/mozilla/pdfjs-dist) para ler o outline e [`pdf-lib`](https://github.com/Hopding/pdf-lib) para criar os arquivos resultantes.

> **Importante:** o PDF precisa ter um sumário/outline legível. O projeto não identifica capítulos apenas procurando texto nas páginas.

## Requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [Git](https://git-scm.com/) (apenas para clonar o repositório)
- Um PDF com marcadores de capítulo no outline interno

## Instalação

```bash
git clone https://github.com/SergioWilliamsx/pdf-splitter.git
cd pdf-splitter
npm install
```

## Configuração

Edite [`src/configs/config.json`](src/configs/config.json):

```json
{
  "inputFile": "./book/meu-livro.pdf",
  "outputDir": "./chapters",
  "chapterPattern": "(Capítulo|Chapter|Livro)\\s*(\\d+|[IVXLCDM]+)?[:\\.-]?\\s*(.*)?"
}
```

| Campo | Descrição |
| --- | --- |
| `inputFile` | Caminho do PDF original. |
| `outputDir` | Pasta onde os capítulos serão salvos. Ela será criada automaticamente. |
| `chapterPattern` | Expressão regular usada para filtrar os itens do outline que representam capítulos. |

Os caminhos são relativos à raiz do projeto. Por exemplo, para usar `book/meu-livro.pdf`:

```bash
mkdir -p book
```

Depois, copie o PDF para essa pasta e atualize o valor de `inputFile`.

### Exemplos de padrões

Para capítulos no formato `Chapter 1`, `Chapter 2`:

```json
"chapterPattern": "^Chapter\\s+\\d+"
```

Para capítulos no formato `Capítulo I - Introdução`:

```json
"chapterPattern": "^Capítulo\\s+[IVXLCDM]+"
```

O padrão é aplicado sem diferenciar letras maiúsculas de minúsculas. Os nomes gerados são normalizados: acentos e caracteres especiais são removidos, espaços viram `_` e o nome é limitado a 60 caracteres.

## Uso

Após configurar o arquivo:

```bash
npm start
```

Exemplo de saída no terminal:

```text
Analisando o arquivo: ./book/meu-livro.pdf
Mapeamento concluído (12 capítulo(s) principal(is) identificados).
Gerando: Capitulo_1_Introducao.pdf (Páginas 15 a 28)
...
Fatiamento finalizado! 12 capítulo(s) salvos em: ./chapters
Processamento concluído com sucesso!
```

Os arquivos gerados ficam em `chapters/`:

```text
chapters/
├── Capitulo_1_Introducao.pdf
├── Capitulo_2_Conceitos.pdf
└── ...
```

## Como o intervalo de páginas é calculado

Cada capítulo começa na página indicada pelo seu marcador no outline e termina na página anterior ao próximo capítulo. O último capítulo termina na última página do PDF.

Por isso, a numeração considera as páginas físicas do arquivo, incluindo capa, prefácio e outras páginas anteriores ao primeiro capítulo.

## Limitações e solução de problemas

### “O PDF não possui um sumário/outline legível”

Abra o PDF em um leitor que exiba os marcadores de navegação. Se não houver marcadores, o programa não terá como descobrir os capítulos automaticamente.

### “Nenhum capítulo correspondeu ao padrão”

Confira os títulos exibidos no outline e ajuste `chapterPattern` no [`config.json`](src/configs/config.json). Teste primeiro um padrão mais amplo e torne-o específico depois.

### Capítulos ou páginas incorretos

- Verifique se os marcadores apontam para as páginas corretas.
- Confirme se o padrão não está selecionando seções que não são capítulos.
- O programa ignora itens cujo título contenha `end-chapter`, `materials`, `exercises` ou `practice set`.

### Arquivos com o mesmo nome

Os arquivos existentes na pasta de saída podem ser sobrescritos. Use uma pasta vazia ou remova os resultados anteriores antes de executar novamente.

## Estrutura do projeto

```text
.
├── book/                         # PDFs de entrada
├── chapters/                    # PDFs gerados
├── src/
│   ├── configs/
│   │   └── config.json          # Caminhos e padrão dos capítulos
│   ├── container/
│   │   └── index.js             # Registro das dependências
│   ├── core/
│   │   └── AppOrchestrator.js   # Orquestra a execução
│   ├── services/
│   │   ├── ConfigLoaderService.js
│   │   ├── LoggerService.js
│   │   ├── PdfAnalyzerService.js
│   │   └── PdfSplitterService.js
│   └── bootstrap.js              # Inicialização da aplicação
├── index.js                      # Ponto de entrada
└── package.json
```

## Desenvolvimento

Para executar diretamente o ponto de entrada:

```bash
node index.js
```

O projeto ainda não possui uma suíte de testes automatizados configurada.

## Licença

Distribuído sob a licença MIT. Consulte [`LICENSE`](LICENSE) para mais informações.
