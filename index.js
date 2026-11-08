import { bootstrapTest } from './src/bootstrap.js';

async function runTest() {
    try {
        const pdfAnalyzer = bootstrapTest();
        
        console.log('--- INICIANDO TESTE DO ANALYZER ---');
        const chapters = await pdfAnalyzer.DiscoverChapters();
        
        console.log('\n--- RESULTADO DO MAPEAMENTO ---');
        console.dir(chapters, { depth: null });
    } catch (error) {
        console.error('❌ Falha durante o teste:', error);
    }
}

runTest();