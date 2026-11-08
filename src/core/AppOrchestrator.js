export class AppOrchestrator {
    static dependencies = ['PdfAnalyzerService', 'PdfSplitterService', 'LoggerService'];

    constructor(pdfAnalyzer, pdfSplitter, Logger) {
        this.pdfAnalyzer = pdfAnalyzer;
        this.pdfSplitter = pdfSplitter;
        this.logger = Logger.forContext('AppOrchestrator');
    }

    async run() {
        this.logger.info('Iniciando pipeline de divisão de PDF...');
        
        // mapeia caps na memoria
        const chapters = await this.pdfAnalyzer.DiscoverChapters();

        // transfere os caps mapeados diretamente para o splitter
        await this.pdfSplitter.split(chapters);

        this.logger.success('Processamento concluído com sucesso!');
    }
}