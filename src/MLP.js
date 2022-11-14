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

    //Matriz de confusão
    #confusionMatrix

    constructor(inputLayer, outputLayer, hiddenLayer, maxError, maxIterations, nValue, data, transferFunction, classes){
        this.#inputLayer = inputLayer;
        this.#outputLayer = outputLayer;
        this.#hiddenLayer = hiddenLayer;
        this.#maxError = maxError;
        this.#maxIterations = maxIterations;
        this.#nValue = nValue;
        this.#transferFunction = transferFunction;
        this.#dataTraining = data;
        this.#classes = classes;
        this.#dataTest = [];
        this.#normalizationValues = [];
        this.#outputWeights = [];
        this.#hiddenWeights = [];
        this.#wantedMatrix = [];
        this.#confusionMatrix = [];
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
            this.trainEpoch();
            console.log('===========================================');
            console.log('ITERAÇÃO/ÉPOCA:' +  iteration);
            console.log('ERRO: ' + this.#error);
            console.table(this.#hiddenLayer);
            console.table(this.#outputLayer);
            console.log('===========================================');
            iteration++;
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
            // console.log('data: ' + i);
            i++;
        }
    }

    test(){
        this.normalizeData(this.#dataTest);

        let results = []
        let higher = 0;
        let higherIndex = 0;
        let expectedClass = '';
        let predictedClass = '';
        let expectedClasstx = '';

        let auxMatrix = new Array(this.#classes.length);
        auxMatrix.fill(0);
        for (let i = 0; i < auxMatrix.length; i++) {
          auxMatrix[i] = new Array(this.#classes.length);
          auxMatrix[i].fill(0);
        }

        for(let data of this.#dataTest){
            this.calculateNetHidden(data);
            this.calculateNetOutput();        
            higher = Number.MIN_SAFE_INTEGER;
            higherIndex = 0;

            for(let i=0; i<this.#outputLayer.length; i++){
                results.push(this.#outputLayer[i].getI);
            }

            for(let i=0; i<results.length; i++){
                if(results[i] > higher){
                    higher = results[i];
                    higherIndex = i;
                }
            }

            predictedClass = this.#classes[higherIndex];
            expectedClass = this.#classes.indexOf(data[data.length-1]);
            expectedClasstx = data[data.length-1];

            console.log('expected: ' + expectedClasstx + ' predicted: ' + predictedClass); 

            var flag = false;
            for (let i = 0; (i < auxMatrix.length && !flag); i++) {
                for (let j = 0; (j < auxMatrix[i].length && !flag); j++) {
                    if(i === j && i === higherIndex){
                        auxMatrix[i][i]++;
                        flag = true;
                    }
                    else if(i === expectedClass && j === higherIndex){
                        auxMatrix[i][j]++;
                        flag = true;
                    }
                }   
            }

            results = [];
        }

        this.#confusionMatrix = auxMatrix;
    }

    calculateNetHidden(data){
        let net = 0;
        for (let i = 0; i < this.#hiddenWeights.length; i++) {
            net = 0;
            for (let j = 0; j < this.#hiddenWeights[i].length; j++) {
                net += this.#hiddenWeights[i][j] * data[j];
            }
            this.#hiddenLayer[i].setNet = net;
            this.#hiddenLayer[i].setI = this.#transferFunction(net);
        }
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
            error = wantedVet[i] - this.#outputLayer[i].getI;
            this.#outputLayer[i].setError = error;
            this.#outputLayer[i].gradientError = this.#transferFunction(this.#outputLayer[i].getNet, true) * error;
        }
    }

    calculateErrorHidden(){
        for(let col=0; col < this.#outputWeights.length; col++){
            
            let error = 0;
            for(let lin=0; lin < this.#outputWeights.length; lin++){
                error += this.#outputWeights[lin][col] * this.#outputLayer[lin].gradientError
            }
            this.#hiddenLayer[col].gradientError = this.#transferFunction(this.#hiddenLayer[col].getNet, true) * error;
        }
    }

    //peso atual + nValue * gradientError * i(da camada oculta)
    updateWeightsOutput(){
        for(let i=0; i < this.#outputWeights.length; i++){
            for (let j = 0; j < this.#hiddenWeights.length; j++) {
                this.#outputWeights[i][j] = this.#outputWeights[i][j] + this.#nValue * this.#outputLayer[i].gradientError * this.#hiddenLayer[j].getI;
            }
        }
    }

    updateWeightsHidden(data){
        for (let i = 0; i < this.#hiddenWeights.length; i++) {
            for (let j = 0; j < data.length-1; j++) {
                this.#hiddenWeights[i][j] = this.#hiddenWeights[i][j] + this.#nValue * this.#hiddenLayer[i].getGradientError * data[j];                
            }
        }
    }

    calculateError(){
        let error = 0;
        for(let i=0; i<this.#outputLayer.length; i++){
            error += Math.pow(this.#outputLayer[i].getError, 2);
        }
        debugger;
        this.#error = error / 2;
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
        debugger;
    }

    //função de transferencia Logística
    logisticsTransfer(value, derivative = false){
        let fNet = 1 / (1 + Math.exp(-value));
        if(derivative){
            return fNet * (1 - fNet);
        }
        else{
            return fNet;
        }
    }

    //função de transferencia Linear
    linearTransfer(value, derivative = false){
        let fNet = value/10;
        if(derivative){
            return 0.1; //lembrar de calcular
        }
        else{
            return fNet;
        }
    }
    
    //função de transferencia Tangente Hiperbólica (função tanh())
    hyperbolicTransfer(value, derivative = false){
        let fNet = Math.tanh(value);
        if(derivative){
            return 1 - Math.pow(fNet, 2);
        }
        else{
            return fNet;
        }
    }

    selectTransferFunction(transferFunction){
        switch(transferFunction){
            case 1:
                this.#transferFunction = this.logisticsTransfer;
                break;
            case 2:
                this.#transferFunction = this.linearTransfer;
                break;
            case 3:
                this.#transferFunction = this.hyperbolicTransfer;
                break;
            default:
                this.#transferFunction = this.hyperbolicTransfer;
        }
    }
    

    set setDataTest(dataTest){
        this.#dataTest = dataTest;
    }

    get getDataTest(){
        return this.#dataTest;
    }

    
    get getDataTraining(){
        return this.#dataTraining;
    }
    
    set setError(error){
        this.#error = error;
    }
    get getError(){
        return this.#error;
    }

    set setMaxError(maxError){
        this.#maxError = maxError;
    }
    get getMaxError(){
        return this.#maxError;
    }

    set setMaxIterations(maxIterations){
        this.#maxIterations = maxIterations;
    }
    get getMaxIterations(){
        return this.#maxIterations;
    }

    get getConfusionMatrix(){
        return this.#confusionMatrix;
    }
}

export default MLP;
