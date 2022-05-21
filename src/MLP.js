class Mlp {
    //Quantidade de neurônios
    #inputLayer;
    #outputLayer;
    #hiddenLayer;   
    
    //Valor máximo do erro da rede
    #maxError;
    
    //Número máximo de iterações
    #maxIterations
    
    //Valor de aprendizagem
    #nValue
    
    //Dados
    #data

    //Matriz desejados
    #matDesejados;

    //Função de transferência
    #transferFunction

    constructor(){
        this.#inputLayer = 0;
        this.#outputLayer = 0;
        this.#hiddenLayer = 0;
        this.#maxError = 0;
        this.#maxIterations = 0;
        this.#nValue = 0;
        this.#transferFunction = [];
    }

    init(){
        
    }
    
    //função para normalizar
    //para cada coluna = (x-min) / (max-min)
    normalize(){
        // Funcao para retornar o menor valor de um array
        Array.min = function(array) {
            return Math.min.apply(Math, array);
        };
        // Funcao para retornar o maior valor de um array
        Array.max = function(array) {
            return Math.max.apply(Math, array);
        };

        let cols = new Array(this.#data.lenght - 1);
        for(let i=0; i<this.#data.length; i++) {
            for(let j=0; j<this.#data[i].lenght; j++) {
                cols[i] = this.#data[i][j];
            }
        }
    }
    
    // getTransposta da matriz ?

    // multiplicarMatriz ?
        
    //0 - Inicializa os pesos (valores aleatórios)
    initializeWeights(){
        
    }
    
    //1 - Aplica as entradas X1, X2, ..., Xn 


    //2 - Calcula os nets da camada oculta
    hiddenLayerNets(){

    }

    //3 – Aplica função de transferência na camada oculta
    //função de transferencia Linear
    linearTransfer(){

    }

    //função de transferencia Logística
    logisticsTransfer(){

    }
    
    //função de transferencia Tangente Hiperbólica (função tanh())
    hyperbolicTransfer(){

    }
    
}

module.exports = Mlp;
