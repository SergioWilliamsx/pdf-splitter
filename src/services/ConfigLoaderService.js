import fs from 'fs/promises';

export class ConfigLoaderService {
    static dependencies = ['LoggerService'];

    constructor(Logger) {
        this.configPath = './src/configs/config.json';
        this.cache = null;
        this.logger = Logger.forContext('ConfigLoaderService')
    }

    async getConfig() {
        if (this.cache) return this.cache; //Se a config ja estiver em cache, retorna direto

        try {
            const rawData = await fs.readFile(this.configPath, 'utf-8');
            this.cache = JSON.parse(rawData);
            return this.cache; // senao popula o cache
        } catch (error) {
            this.logger.error(`[ConfigLoaderService] Falha ao carregar ${this.configPath}: ${error.message}`, error);
        }
    }
}