<div align="center">

# ⚡ PDF Chapter Splitter

**Fatie livros inteiros em capítulos limpos automaticamente.**

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

</div>

---

## 🎯 Visão Geral

O **PDF Chapter Splitter** lê a estrutura de um documento PDF, identifica as quebras de capítulos através da extração de texto/sumário com `pdfjs-dist` e realiza o fatiamento preciso das páginas utilizando o `pdf-lib`, gerando arquivos individuais organizados.

---

## 📦 Estruturação do Projeto

```text
.
├── book/
│   └── livro_completo.pdf       # Coloque seu PDF aqui
├── chapters/                    # Saída dos capítulos
├── src/
│   ├── configs/
│   │   └── config.json          # Parâmetros de mapeamento
│   ├── container/
│   │   └── index.js             # Container DI explícito
│   ├── services/
│   │   ├── ConfigLoader.js      # Serviço responsável por ler o JSON
│   │   └── PdfSplitterService.js# Serviço que manipula o pdf-lib (POO)
│   └── core/
│       └── AppOrchestrator.js   # Orquestrador central (o método mestre)
├── index.js                     # Ponto de entrada (Bootstrap)
└── package.json