import { bootstrap } from './src/bootstrap.js';

async function main() {
    try {
        const orchestrator = bootstrap();
        await orchestrator.run();
    } catch (error) {
        console.error(' Erro fatal na execução:', error);
        process.exit(1);
    }
}

main();