import { useState, useEffect } from "react";
import Knn from './Knn'
import KMeans from "./KMeans";
import ConfusionMatrix from "./components/ConfusionMatrix";
 // import { getFile } from "./importFile";

function App() {

  const [algorithm, setAlgorithm] = useState("knn");

  //knn
  const [fileHeader, setHeader] = useState([]);
  const [fileDataTraining, setFileDataTraining] = useState([]);
  const [fileDataTest, setFileDataTest] = useState([]);
  const [confusionMatrix, setConfusionMatrix] = useState([]);
  const [kNeighbor , setKNeighbor] = useState(0);
  const [classes, setClasses] = useState([]);

  //k-means
  const [fileHeaderKMeans, setHeaderKMeans] = useState([]);
  const [fileDataKMeans, setFileDataKMeans] = useState([]);
  const [kClusters , setKClusters] = useState(0);
  const [labels, setLabels] = useState([]);
  const [centroids, setCentroids] = useState([]);


  const [errorMessage, setErrorMessage] = useState("");


  // useEffect(() => {
  //   setConfusionMatrix(new Array());
  // });

  const classifyKnn = () => {

      //knn classifier
      const knnClassifier = new Knn();
      knnClassifier.setK = kNeighbor;
      knnClassifier.train(fileDataTraining);
      knnClassifier.predict(fileDataTest);

      //Resultado das predições para a base de teste a partir da base de treinamento
      let result = knnClassifier.getPredictions;

      //Criar set com apenas as classes que não se repetem [CA,CB,CC,CE,CD...]
      let classes = [...new Set(knnClassifier.getClasses)];

      //Ordenar as classes
      classes.sort();
      setClasses(classes);

      //Criar matriz Classes X Classes
      let auxMatrix = new Array(classes.length);
      auxMatrix.fill(0);
      for (let i = 0; i < auxMatrix.length; i++) {
        auxMatrix[i] = new Array(classes.length);
        auxMatrix[i].fill(0);
      }


      //Contabilizar as ocorrências de classes
      classes.forEach((classL, lineIndex) => {
        result.forEach((resultN, testIndex) => {
          let correctClass = fileDataTest[testIndex][fileDataTest[testIndex].length-1];

          if(classL === resultN.class && correctClass == resultN.class){
            auxMatrix[lineIndex][lineIndex] += 1;
          }
          else if(classL === correctClass){
            let index = classes.indexOf(resultN.class);
            auxMatrix[lineIndex][index] += 1;
          }
        });
      });

      setConfusionMatrix(auxMatrix);
      console.log(auxMatrix);
  }

  const classifyKMeans = () => {
    const kmeansClassifier = new KMeans();
    kmeansClassifier.setKClusters = kClusters;
    kmeansClassifier.train(fileDataKMeans);
    kmeansClassifier.predict(fileDataKMeans);

    debugger;
    let labelsAux = kmeansClassifier.getDistances;
    let centroids = kmeansClassifier.getCentroids;
    
    setLabels(labelsAux);
    setCentroids(centroids);

  }

  const getFile = (e, type) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    
    reader.readAsText(file);
    reader.onload = (e) => {
      let csv = e.target.result;
      let data = csvToJson(csv);
      
      if(algorithm === "knn") {
        setHeader(data[0]);

        if(type === "training")
          setFileDataTraining(data.slice(1));
        else
          setFileDataTest(data.slice(1));
      }
      else {
        setHeaderKMeans(data[0]);
        setFileDataKMeans(data.slice(1));
      }
    }
  }

  const csvToJson = (csv) => {
    const lines = csv.split('\r\n');
    let data = [];
    lines.forEach((line, index) => {
      if(index > 0) {
        let row = line.split(',');
        
        if(algorithm === "kmeans") {
          row = row.slice(0, row.length-1);
          for(let i = 0; i < row.length; i++){
            row[i] = parseFloat(row[i]);
          }
        }
        else{
          for(let i = 0; i < row.length - 1; i++){
            row[i] = parseFloat(row[i]);
          }
        }

        if(row.length > 1)
          data.push(row);
      }
      else {
        let row = line.split(',');
        
        data.push(row);
      }
    });
    return data;
  }

  const showMatrix = () => {
    confusionMatrix.map((line, L) => {
      line.map((column, C) => {
        return(
          confusionMatrix[L][C]
        )
      });
    })
  }

  const renderKnn = () => {
    let output = 
      <>
        <label htmlFor="csv-file" className="form-label">Arquivo CSV de treino</label>
        <input
          className="form-control mb-3"
          type="file"
          id="csv-file"
          accept=".csv"
          onChange={(e) => getFile(e, "training")}
        />

        <label htmlFor="csv-file" className="form-label">Arquivo CSV de teste</label>
        <input
          className="form-control mb-3"
          type="file"
          id="csv-file"
          accept=".csv"
          onChange={(e) => getFile(e, "test")}
        />

        <div className="col-5">
          <label className="form-label">K</label>
          <input
            type="number"
            className="form-control"
            onChange={(e) => setKNeighbor(parseInt(e.target.value))}
            min={0}
            max={50} />
        </div>

        <div className="d-grid gap-2 col-6 mx-auto my-4">
          <button className="btn btn-dark" type="button" onClick={() => {classifyKnn()}}>Calcular Acurácia</button>
        </div>
      </>
      
    return output;
  }

  const renderKmeans = () => {
    let output =  
    <>
      <label htmlFor="csv-file" className="form-label">Arquivo CSV</label>
      <input
        className="form-control mb-3"
        type="file"
        id="csv-file"
        accept=".csv"
        onChange={(e) => getFile(e, "")}
      />

      <div className="col-5">
        <label className="form-label">K</label>
        <input
          type="number"
          className="form-control"
          onChange={(e) => setKClusters(parseInt(e.target.value))}
          min={0}
          max={50} />
      </div>

      <div className="d-grid gap-2 col-6 mx-auto my-4">
        <button 
          className="btn btn-dark" 
          type="button" 
          onClick={() => {classifyKMeans()}}>Classificar kClusters</button>
      </div>
    </>

    return output
  }



  return (
    <>
      <div className="col-lg-6 col-md-8 col-12 mx-auto pt-5">
        <h1 className="text-center">knn k-means</h1>
        <div className="mt-5 mb-3 col-md-8 border bg-white rounded p-3 px-4 mx-auto">

          <label htmlFor="csv-file" className="form-label">Algoritmo</label>
          <select className="form-select mb-3" value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
            <option value="knn">KNN</option>
            <option value="kmeans">K-Means</option>
          </select>
          {
            (algorithm === "knn")
            ?
            renderKnn()
            :
            renderKmeans()
          }

          {
            errorMessage !== "" 
            ?
              <div className="alert alert-danger my-4" role="alert">
                {errorMessage}
              </div>
            :
            null
          }

         
        </div>

        
        {
          (confusionMatrix != null && confusionMatrix.length > 0)
          ?
            <ConfusionMatrix 
              classes={classes} 
              size={classes.length} 
              matrix={confusionMatrix}
            />
          : 
          null
        }
      </div>
    </>
  );
}

export default App;