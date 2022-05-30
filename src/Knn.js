class Knn{
    #kNeighbors;
    #dataTraining;
    #dataTest;
    #results;
    #classes;

    constructor(){
        this.#kNeighbors = 0;
        this.#dataTraining = [];
        this.#dataTest = [];
        this.#results = [];
        this.#classes = [];
    }

    train(data){
        this.#dataTraining = [...data];
    }

    predict(data){
        this.#dataTest = [...data];
        var minors = new Array(this.#kNeighbors);
        var distances = [];
        var distance = 0;
        var nearestNeighbors = Object.create(null);

        this.#dataTest.forEach((test, testIndex) => {
            minors = [];
            distances = [];    
            nearestNeighbors = Object.create(null);   
            
            //Calcular a distância para todos os registros da base de treinamento
            this.#dataTraining.forEach((training, trainingIndex) => {
                distance = this.euclidianDistance(test, training);
                distances.push({distance, index: trainingIndex});
            });

            //Ordenar distâncias pelo menor valor
            distances.sort((a, b) => (a.distance > b.distance) ? 1 : -1);

            //Escolher os K vizinhos (das distâncias)
            for(let i=0; i<this.#kNeighbors; i++){
                minors[i] = ({
                    distance: distances[i].distance,
                    class: this.#dataTraining[distances[i].index][test.length-1]
                });
            }

            //Contagem de ocorrência dos vizinhos
            for (const nome of minors) {
              if (nearestNeighbors[nome.class]) {
                nearestNeighbors[nome.class] += 1;
              }
              else {
                nearestNeighbors[nome.class] = 1;
              }
            }

            //Estrurura de vizinhos
            let classes = [];
            for(let classAux in nearestNeighbors){
                classes.push({class: classAux, value: nearestNeighbors[classAux], index: testIndex});
            }

            //Maior ocorrência de vizinho primeiro
            classes.sort((a, b) => (a.value < b.value) ? 1 : -1);

            //Escolher o vizinho de maior ocorrência
            this.#results.push(classes[0]);

            //Inserindo todas as possíveis classes na estrutura 
            this.#classes.push(test[test.length-1]);

        });  

        console.log(this.#results);
    }

    euclidianDistance(test, training){
        let distance = 0;
        for(var i = 0; i < test.length - 1; i++){
            distance += Math.pow(test[i] - training[i], 2);
        }
        return Math.sqrt(distance);
    }

    get getK(){
        return this.#kNeighbors;
    }

    set setK(k){
        this.#kNeighbors = k;
    }

    get getPredictions(){
        return this.#results;
    }

    get getClasses(){
        return this.#classes;
    }

}

export default Knn;