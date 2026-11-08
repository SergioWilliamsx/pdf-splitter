import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs/promises';

export class PdfAnalyzerService {
    static dependencies = ['ConfigLoaderService', 'LoggerService'];

    constructor(configLoader, Logger) {
        this.configLoader = configLoader;
        this.logger = Logger.forContext('PdfAnalyzerService');
    }

    SanitizeFileName(name) {
        return name
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9_\-\s]/g, '')
            .replace(/\s+/g, '_')
            .substring(0, 60);
    }

    flattenOutline(items) {
        let result = [];
        for (const item of items) {
            result.push(item);
            if (item.items && item.items.length > 0) {
                result = result.concat(this.flattenOutline(item.items));
            }
        }
        return result;
    }

    async DiscoverChapters() {
        const config = await this.configLoader.getConfig();
        const chapterRegex = new RegExp(config.chapterPattern, 'i');

        // filtro para ignorar entradas falhas
        // se quiser enviar arquivos separados para exercicios, basta comentar o ignoregex, !!atencao!! não é uma função implementada, apenas um quebra galho, dependendo do pdf pode nao ter resultado esperado
        const ignoreRegex = /end-chapter|materials|exercises|practice set/i;

        this.logger.warn(`Analisando o arquivo: ${config.inputFile}`);

        const fileData = await fs.readFile(config.inputFile);
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileData) });
        const doc = await loadingTask.promise;
        const totalPages = doc.numPages;

        const rawOutline = await doc.getOutline();

        if (!rawOutline || rawOutline.length === 0) {
            throw new Error('[PdfAnalyzerService] O PDF não possui um sumário/outline legível.');
        }

        const flatOutline = this.flattenOutline(rawOutline);
        const rawChapters = [];

        for (const item of flatOutline) {
            // Captura os capítulos e ignora os blocos de End-Chapter Materials
            if (chapterRegex.test(item.title) && !ignoreRegex.test(item.title)) {
                try {
                    let dest = item.dest;

                    if (typeof dest === 'string') {
                        dest = await doc.getDestination(dest);
                    }

                    if (dest && Array.isArray(dest)) {
                        const pageRef = dest[0];
                        const pageIndex = await doc.getPageIndex(pageRef);
                        const physicalPage = pageIndex + 1;

                        rawChapters.push({
                            title: this.SanitizeFileName(item.title),
                            startPage: physicalPage
                        });
                    }
                } catch (err) {
                    this.logger.warn(`Falha ao resolver destino do capítulo: "${item.title}"`);
                }
            }
        }

        if (rawChapters.length === 0) {
            throw new Error('[PdfAnalyzerService] Nenhum capítulo correspondeu ao padrão no sumário.');
        }

        // ordena por ordem fisica
        rawChapters.sort((a, b) => a.startPage - b.startPage);

        // marcadores de msm paginas deduplicados
        const uniqueChapters = [];
        for (const ch of rawChapters) {
            const exists = uniqueChapters.find(u => u.startPage === ch.startPage || u.title === ch.title);
            if (!exists) {
                uniqueChapters.push(ch);
            }
        }

        // calcula intervalo dos caps
        const chapters = [];
        for (let i = 0; i < uniqueChapters.length; i++) {
            const current = uniqueChapters[i];
            const next = uniqueChapters[i + 1];

            const startPage = current.startPage;
            const endPage = next ? next.startPage - 1 : totalPages;

            if (endPage >= startPage) {
                chapters.push({
                    title: current.title,
                    startPage: startPage,
                    endPage: endPage
                });
            }
        }

        this.logger.success(`Mapeamento concluído (${chapters.length} capítulo(s) principal(is) identificados).`);
        return chapters;
    }
}