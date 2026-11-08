export class Container {
    constructor() {
        this.dependencies = new Map()
        this.singleTons = new Map()
    }

    //instanciada uma unica vez
    registerSingleTon(name, implementation) {
        this.dependencies.set(name, {implementation, type: 'SINGLETON'})
    }

    //uma instancia a cada a cada injeção
    registerTransient(name, implementation) {
        this.dependencies.set(name, {implementation, type: 'TRANSIENT'})
    }

    resolve(name) {
        const dependency = this.dependencies.get(name)

        if(!dependency) throw new Error(`Dependência nao encontrada ${name}`)
        
        //se for singleton e estiver instanciada, reotrna em cache
        if(dependency.type == 'SINGLETON') {
            if(this.singleTons.has(name)) {
                return this.singleTons.get(name)
            }
        }
        
        const TargetClass = dependency.implementation

        const injectNames = TargetClass.dependencies || []
        const resolveDependencies = injectNames.map((depNames) => this.resolve(depNames))

        const instance = new TargetClass(...resolveDependencies)

        if(dependency.type == 'SINGLETON') this.singleTons.set(name, instance)

        return instance
    }
}