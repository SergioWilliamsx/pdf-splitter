import { Container } from './container/index.js';
import { LoggerService } from './services/LoggerService.js';
import { ConfigLoaderService } from './services/ConfigLoaderService.js';
import { PdfAnalyzerService } from './services/PdfAnalyzerService.js';
import { PdfSplitterService } from './services/PdfSplitterService.js';
import { AppOrchestrator } from './core/AppOrchestrator.js';

export function bootstrap() {
    const container = new Container();

    container.registerSingleTon('LoggerService', LoggerService);
    container.registerSingleTon('ConfigLoaderService', ConfigLoaderService);
    container.registerSingleTon('PdfAnalyzerService', PdfAnalyzerService);
    container.registerSingleTon('PdfSplitterService', PdfSplitterService);
    container.registerSingleTon('AppOrchestrator', AppOrchestrator);

    return container.resolve('AppOrchestrator');
}