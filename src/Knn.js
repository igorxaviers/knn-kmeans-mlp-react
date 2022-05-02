class Knn{
    #kNeighbors;
    #data;
    #dataTraining;
    #dataTest;

    constructor(){
        this.#kNeighbors = 0;
        this.#data = [];
        this.#dataTraining = [];
        this.#dataTest = [];
    }

    train(data){
        this.#dataTraining = [...data];
    }

    predict(data){
        this.#dataTest = [...data];
        var minors = new Array(this.#kNeighbors);
        var result = [];
        var distances = [];
        var distance = 0;
        var nearestNeighbors = Object.create(null);
        const selectedClass = '';

        this.#dataTest.forEach((test, testIndex) => {
            distances = [];                
            this.#dataTraining.forEach((training, trainingIndex) => {
                distance = this.euclidianDistance(test, training);
                distances.push({distance, index: trainingIndex});
            });
            distances.sort((a, b) => (a.distance > b.distance) ? 1 : -1);
            for(let i=0; i<this.#kNeighbors; i++){
                minors[i] = ({
                    distance: distances[i].distance,
                    class: this.#dataTraining[distances[i].index][test.length-1]
                });
            }
            console.log(minors);
            debugger;
  
            for (const nome of minors) {
              if (nearestNeighbors[nome.class]) {
                nearestNeighbors[nome.class] += 1;
              } else {
                nearestNeighbors[nome.class] = 1;
              }
            }
            console.log(nearestNeighbors);
            nearestNeighbors.sort();
            selectedClass = Object.keys(nearestNeighbors)[0];

            // for (var i = 0; i < this.#kNeighbors; i++) {
            //     minor = Number.MAX_SAFE_INTEGER - 1;
            //     debugger;
            //     for (var index = 0; index < distances.length - 1 && minors.length <= this.#kNeighbors; index++) {
            //         if(distances[index].distance < minor){
            //             minor = { 
            //                 distance: distances[index].distance,
            //                 class: this.#dataTraining[distances[index].index]//[length-1]
            //             };
            //         }
            //     }
    
            //     minors.push(minor);
            //     distances.splice(index, 1);
            // }
        });  


        console.log(minors);
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
}

export default Knn;