import { PDFDocument as PdfLibDoc } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

export class PdfSplitterService {
    static dependencies = ['ConfigLoaderService', 'LoggerService'];

    constructor(configLoader, Logger) {
        this.configLoader = configLoader;
        this.logger = Logger.forContext('PdfSplitterService');
    }

    // func de fatiamento
    async split(chapters) {
        const config = await this.configLoader.getConfig(); //captura configurações

        this.logger.info(`Garantindo diretório de saída: ${config.outputDir}`);
        await fs.mkdir(config.outputDir, { recursive: true }); //garante a existencia da pasta de output

        this.logger.info(`Carregando documento original: ${config.inputFile}`);
        const sourcePdfBytes = await fs.readFile(config.inputFile); // Carrega o pdf em estrutura de dados organizadas
        const sourceDoc = await PdfLibDoc.load(sourcePdfBytes); //carrega o pdf na lib pra manipular

        for (const chapter of chapters) {
            this.logger.info(`Gerando: ${chapter.title}.pdf (Páginas ${chapter.startPage} a ${chapter.endPage})`);
            
            const newDoc = await PdfLibDoc.create(); //cria um pdf novo em branco
            const pageIndices = []; //lista pra guardar os indices das paginas

            for (let i = chapter.startPage - 1; i < chapter.endPage; i++) {
                pageIndices.push(i); //adiciona o indice atual no array
            }

            const copiedPages = await newDoc.copyPages(sourceDoc, pageIndices); //copia as paginas do pdf original
            copiedPages.forEach((page) => newDoc.addPage(page)); //bota cada pagina copiada no novo pdf

            const outputPath = path.join(config.outputDir, `${chapter.title}.pdf`); //monta o caminho final do arquivo
            const pdfBytes = await newDoc.save(); //salva o novo pdf e gera os bytes
            await fs.writeFile(outputPath, pdfBytes); //escreve o pdf fatiado no disco
        }

        this.logger.success(`Fatiamento finalizado! ${chapters.length} capítulo(s) salvos em: ${config.outputDir}`);
    }
}
