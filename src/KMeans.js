class KMeans{
    #kClusters;
    #data;
    #centroids;
    #distances;
    #results;

    constructor(){
        this.#kClusters = 0;
        this.#data = [];
        this.#results = [];
        this.#centroids = [];
        this.#distances = []
    }

    train(data){
        this.#data = [...data];
    }

    pickRandom(data){
        let randomIndex = Math.floor(Math.random() * data.length);
        return data[randomIndex];
    }

    predict(data){
        let distancesAux;
        let distance;
        let oldCentroids = [];

        // gera os centroides aleatorios
        //VER SE NAO EXISTE JA ESSE CENTROIDE !!!!!!!!!!!!!!!!!!!
        for(let i=0; i<this.#kClusters; i++) {
            this.#centroids.push( this.pickRandom(this.#data) );
        }

        while(!this.compareCentroids(oldCentroids, this.#centroids)) {

            oldCentroids = JSON.parse(JSON.stringify(this.#centroids));

            // gera estrutura de distancias
            this.#distances = [];
            this.#data.forEach((row, rowIndex) => {
                distancesAux = [];
                this.#centroids.forEach((centroid, centroidIndex) => {
                    distance = this.euclidianDistance(row, centroid);
                    distancesAux.push({distance, centroid: centroidIndex});
                });

                //Pegar a menor distância para elencar a classe (centróide)
                distancesAux.sort((a, b) => (a.distance > b.distance) ? 1 : -1);
                
                //Adicionar linha ao 
                this.#distances.push( distancesAux[0] );
            });

            //gera novo centroide
            let centAux = JSON.parse(JSON.stringify(this.#centroids));
            centAux.forEach((c => c.fill(0)));
            
            let counts = new Array(this.#centroids.length);
            counts.fill(0);
            for (let i = 0; i < counts.length; i++) {
                counts[i] = new Array(this.#centroids[0].length);
                counts[i].fill(0);
            }

            centAux.forEach((centroid, centroidIndex) => {
                for(let i=0; i<this.#data[0].length; i++) {
                    this.#distances.forEach((row, rowIndex) => {
                        if(row.centroid === centroidIndex) {
                            centAux[centroidIndex][i] += this.#data[centroidIndex][i];
                            counts[centroidIndex][i] = counts[centroidIndex][i] + 1;
                        }
                    });
                }
            });

            for(let i=0; i<centAux.length; i++) {
                for(let j=0; j<centAux[i].length; j++) {
                    this.#centroids[i][j] = centAux[i][j] / counts[i][0];
                }
            }
        }
        this.separeteDataByClass();
    }

    euclidianDistance(row, centroid){
        let distance = 0;
        for(var i = 0; i < centroid.length - 1; i++){
            distance += Math.pow(centroid[i] - row[i], 2);
        }
        return Math.sqrt(distance);
    }

    compareCentroids(oldCentroids, newCentroids){
        let isSame = true;
        for(let i=0; i<newCentroids.length; i++) {
            console.log(JSON.stringify(oldCentroids[i]));
            console.log(JSON.stringify(newCentroids[i]));
            if(JSON.stringify(oldCentroids[i]) !== JSON.stringify(newCentroids[i])){
                isSame = false;
            }
        }
        return isSame;
    }

    separeteDataByClass(){
        let classes = [];
        let classIndex;
        this.#distances.forEach((row, rowIndex) => {  
            classIndex = row.centroid;
            if(classes[classIndex] === undefined){
                classes[classIndex] = [];
            }
            classes[classIndex].push(this.#data[rowIndex]);
        });
        this.#results = classes;
    }

    get getKClusters(){
        return this.#kClusters;
    }

    set setKClusters(k){
        this.#kClusters = k;
    }

    get getCentroids(){
        return this.#centroids;
    }

    get getDistances(){
        return this.#distances;
    }

    get getResults(){
        return this.#results;
    }

}

export default KMeans;