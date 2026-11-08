import {Container} from './container/index.js'
import {LoggerService} from './services/LoggerService.js'
import {ConfigLoaderService} from './services/ConfigLoaderService.js'
import {PdfAnalyzerService} from './services/PdfAnalyzerService.js'

export function bootstrapTest() {
    const container = new Container

    container.registerSingleTon('LoggerService', LoggerService);
    container.registerSingleTon('ConfigLoaderService', ConfigLoaderService);
    container.registerSingleTon('PdfAnalyzerService', PdfAnalyzerService);

    return container.resolve('PdfAnalyzerService');
}