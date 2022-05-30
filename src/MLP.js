import Neuron from './Neuron.js';

class MLP {
    //Quantidade de neurônios
    #inputLayer;
    #outputLayer;
    #hiddenLayer;   
    
    //Valor máximo do erro da rede
    #maxError;
    //Erro atual da rede
    #error
    
    //Número máximo de iterações
    #maxIterations;
    
    //Valor de aprendizagem
    #nValue;
    
    //Dados
    #dataTraining; 
    #dataTest;

    //Valores para normalização
    #normalizationValues;

    //Pesos
    #hiddenWeights;
    #outputWeights;

    //Matriz desejados
    #wantedMatrix;

    //Função de transferência
    #transferFunction

    //classes
    #classes

    constructor(inputLayer, outputLayer, hiddenLayer, maxError, maxIterations, nValue, data, transferFunction, classes){
        this.#inputLayer = inputLayer;
        this.#outputLayer = outputLayer;
        this.#hiddenLayer = hiddenLayer;
        this.#maxError = maxError;
        this.#maxIterations = maxIterations;
        this.#nValue = nValue;
        this.#transferFunction = transferFunction;
        this.#dataTraining = data;
        this.#normalizationValues = [];
        this.#outputWeights = [];
        this.#hiddenWeights = [];
        this.#wantedMatrix = [];
        this.#classes = classes;
        this.#error = 0;
    }

    init(){
        this.selectTransferFunction(this.#transferFunction);
        this.normalizeTrainingData();
        this.generateNeurons();
        this.initializeWeights();
        this.oneHotEncode();
    }

    train(){
        let iteration = 0;
        while(this.#error < this.#maxError && iteration < this.#maxIterations){
            // setTimeout(() => {
                this.trainEpoch();
                console.log('===========================================');
                console.log('ITERAÇÃO/ÉPOCA:' +  iteration);
                console.log('ERRO: ' + this.#error);
                console.table(this.#hiddenLayer);
                console.table(this.#outputLayer);
                console.log('===========================================');
                iteration++;
            // }, 500);
        }
        console.log(this.#dataTraining);
        return true;
    }

    trainEpoch(){
        let i = 0;
        for(let data of this.#dataTraining){
            this.calculateNetHidden(data);
            this.calculateNetOutput();
            this.calculateErrorOutput(this.#wantedMatrix[i]); 
            this.calculateErrorHidden();
            this.updateWeightsOutput();
            this.updateWeightsHidden(data);
            this.calculateError();
            console.log('data: ' + i);
            i++;
        }
    }

    test(){

        this.normalizeData(this.#dataTest);
        console.log(this.#dataTest);

        // let results = []
        // for(let data of this.#dataTest){


        //     for (let lin = 0; lin < this.#hiddenWeights.length; lin++) {
        //         for (let col = 0; col < this.#hiddenWeights[i].length; col++) {
        //             results.push(this.#hiddenWeights[lin][col] * data[col]);
        //         }
        //     }

        //     for (let i = 0; i < results.length; i++) {

        //     }
            
        //     for (let lin = 0; lin < this.#outputWeights.length;lin++) {
        //         for (let col = 0; col < this.#outputWeights[lin].length; col++) {
        //         }
        //     }
        // }

        // debugger;
        // return true;
    }

    testEpoch(){
        let i = 0;
        for(let data of this.#dataTest){
            this.calculateNetHidden(data);
            this.calculateNetOutput();
            this.calculateErrorOutput(this.#wantedMatrix[i]); 
            this.calculateErrorHidden();
            this.updateWeightsOutput();
            this.updateWeightsHidden(data);
            this.calculateError();
            console.log('data: ' + i);
            i++;
        }
    }

    calculateNetHidden(data){
        let net = 0;
        this.#hiddenWeights.forEach((weight, index) => {
            net = 0;
            for(let i=0; i<weight.length; i++){
                net += weight[i] * data[i];
            }
            this.#hiddenLayer[index].setNet = net;
            this.#hiddenLayer[index].setI = this.#transferFunction(net);
        });
    }

    calculateNetOutput(){
        let net = 0;
        for(let i=0; i<this.#outputWeights.length; i++){
            net = 0;
            for (let j = 0; j < this.#outputWeights[i].length; j++) {
                net += this.#outputWeights[i][j] * this.#hiddenLayer[j].getI;
            }
            this.#outputLayer[i].setNet = net;
            this.#outputLayer[i].setI = this.#transferFunction(net);
        }
    }

    calculateErrorOutput(wantedVet){
        let error = 0;
        for(let i=0; i<this.#outputLayer.length; i++){
            error = wantedVet[i] - this.#outputLayer[i].getI ;
            this.#outputLayer[i].setError = error;
            this.#outputLayer[i].gradientError = this.#transferFunction(error);
        }
    }

    calculateErrorHidden(){
        let error = 0;
        for(let col=0; col < this.#outputWeights.length; col++){
            for(let lin=0; lin < this.#outputWeights.length; lin++){
                error += this.#outputWeights[lin][col] * this.#outputLayer[lin].gradientError
            }
            this.#hiddenLayer[col].gradientError = this.#transferFunction(error);
        }
    }

    //peso atual + nValue * gradientError * i(da camada oculta)
    updateWeightsOutput(){
        for(let i=0; i < this.#outputWeights.length; i++){
            for(let j=0; j < this.#outputWeights[i].length; j++){
                this.#outputWeights[i][j] = this.#outputWeights[i][j] + this.#nValue * this.#outputLayer[i].gradientError * this.#hiddenLayer[j].getI;
            }
        }
    }

    updateWeightsHidden(data){
        for (let i = 0; i < this.#hiddenWeights.length; i++) {
            for (let j = 0; j < this.#hiddenWeights.length - 1; j++) {
                this.#hiddenWeights[i][j] = this.#hiddenWeights[i][j] + this.#nValue * this.#hiddenLayer[i].gradientError * data[j];                
            }            
        }
    }

    calculateError(){
        let error = 0;
        for(let i=0; i<this.#outputLayer.length; i++){
            error += Math.pow(this.#outputLayer[i].getError, 2);
        }
        this.#error = this.#transferFunction(error);
    }
    

    //função para normalizar
    //para cada coluna = (x-min) / (max-min)
    normalizeTrainingData(){
        // Funcao para retornar o menor valor de um array
        Array.min = (array) => {
            return Math.min.apply(Math, array);
        };
        // Funcao para retornar o maior valor de um array
        Array.max = (array) => {
            return Math.max.apply(Math, array);
        };

        let cols = [];
        for(let col=0; col<this.#dataTraining[0].length - 1; col++) {
            cols = [];
            for(let lin=0; lin<this.#dataTraining.length; lin++) {
                cols.push(this.#dataTraining[lin][col]);
            }

            let min = Array.min(cols);
            let max = Array.max(cols);
            this.#normalizationValues.push({ min, max });
        }

        this.normalizeData(this.#dataTraining);
    }

    normalizeData(data){
        for(let col=0; col<data[0].length - 1; col++) {
            for(let lin=0; lin<data.length; lin++) {
                data[lin][col] = (data[lin][col] - this.#normalizationValues[col].min) / (this.#normalizationValues[col].max - this.#normalizationValues[col].min);
            }
        }
    }

    generateNeurons(){
        let hiddenNeurons = [];
        let outputNeurons = [];
        for(let i=0; i<this.#hiddenLayer; i++){
            hiddenNeurons.push(new Neuron());
        }
        for(let i=0; i<this.#outputLayer; i++){
            outputNeurons.push(new Neuron());
        }
        this.#hiddenLayer = hiddenNeurons;
        this.#outputLayer = outputNeurons;
    }

    //0 - Inicializa os pesos (valores aleatórios)
    initializeWeights(){
        let hiddenWeights = [];
        let outputWeights = [];
        //Para cada camada oculta gerar pesos aleatórios de cada atributo
        for(let i=0; i < this.#hiddenLayer.length; i++){
            hiddenWeights.push([]);
            for(let j=0; j < this.#inputLayer; j++){
                hiddenWeights[i].push(this.getRandom(-1, 1));
            }
        }

        //Para cada camada de saída gerar pesos aleatórios de cada camada oculta
        for(let i=0; i < this.#outputLayer.length; i++){
            outputWeights.push([]);
            for(let j=0; j < this.#hiddenLayer.length; j++){
                //random value between -1 and 1
                outputWeights[i].push(this.getRandom(-1, 1));
            }
        }

        this.#hiddenWeights = hiddenWeights;
        this.#outputWeights = outputWeights;
    }

    getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    //gerando a matriz das saidas desejadas
    oneHotEncode(){
        let matrixWanted = [];

        for(let i=0; i<this.#dataTraining.length; i++){
            matrixWanted.push([]);
            for(let j=0; j<this.#classes.length; j++){
                if(this.#dataTraining[i][this.#dataTraining[0].length - 1] === this.#classes[j]){
                    matrixWanted[i].push(1);
                }else{
                    matrixWanted[i].push(0);
                }
            }
        }

        this.#wantedMatrix = matrixWanted;
    }

    //função de transferencia Linear
    linearTransfer(net){
        return net/10;
    }

    //função de transferencia Logística
    logisticsTransfer(net){
        return (1/(1+(Math.exp(-net))));
    }
    
    //função de transferencia Tangente Hiperbólica (função tanh())
    hyperbolicTransfer(net){
        return Math.tanh(net);
    }

    selectTransferFunction(transferFunction){
        switch(transferFunction){
            case 1:
                this.#transferFunction = this.linearTransfer;
                break;
            case 2:
                this.#transferFunction = this.logisticsTransfer;
                break;
            case 3:
                this.#transferFunction = this.hyperbolicTransfer;
                break;
            default:
                this.#transferFunction = this.hyperbolicTransfer;
        }
    }
    

    set dataTest(dataTest){
        this.#dataTest = dataTest;
    }

    get dataTest(){
        return this.#dataTest;
    }

}

export default MLP;
