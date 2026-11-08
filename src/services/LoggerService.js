export class LoggerService {
    static dependencies = [];

    constructor(context = 'App') {
        this.context = context;
    }

    // Permite criar um sub-logger atribuindo o contexto do serviço chamador
    forContext(contextName) {
        return new LoggerService(contextName);
    }

    info(message) {
        console.log(`[INFO] [${this.context}] ${new Date().toISOString()} - ${message}`);
    }

    warn(message) {
        console.warn(`[WARN] [${this.context}] ${new Date().toISOString()} - ${message}`);
    }

    error(message, error = null) {
        console.error(`[ERROR] [${this.context}] ${new Date().toISOString()} - ${message}`);
        if (error) {
            console.error(error);
        }
    }

    success(message) {
        console.log(`[SUCCESS] [${this.context}] ${new Date().toISOString()} - ${message}`);
    }
}