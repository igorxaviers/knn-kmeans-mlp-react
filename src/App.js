import { useState, useEffect } from "react";
import Knn from './Knn'
 // import { getFile } from "./importFile";

function App() {

  const [kNeighbor , setKNeighbor] = useState(0);

  const [fileHeader, setHeader] = useState([]);
  const [fileDataTraining, setFileDataTraining] = useState([]);
  const [fileDataTest, setFileDataTest] = useState([]);
  const [confusionMatrix, setConfusionMatrix] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");

  const classify = () => {

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

      //Criar matriz Classes X Classes
      let auxMatrix = new Array(classes.length);
      for (let i = 0; i < auxMatrix.length; i++) {
        auxMatrix[i] = new Array(classes.length);
      }
  }

  const getFile = (e, type) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    
    reader.readAsText(file);
    reader.onload = (e) => {
      let csv = e.target.result;
      let data = csvToJson(csv);
      
      setHeader(data[0]);

      if(type === "training")
        setFileDataTraining(data.slice(1));
      else
        setFileDataTest(data.slice(1));
    }

    console.log(fileHeader);
    console.log(fileDataTraining);
    console.log(fileDataTest);
  }

  const csvToJson = (csv) => {
    const lines = csv.split('\r\n');
    let data = [];
    lines.forEach(line =>{
      let row = line.split(',');
      for(let i = 0; i < row.length - 1; i++){
        row[i] = parseFloat(row[i]);
      }
      if(row.length > 1)
        data.push(row);
    })
    return data;
  }


  return (
    <>
      <div className="col-md-6 mx-auto pt-5">
        <h1 className="text-center">knn k-means</h1>
        <div className="mt-5 mb-3 col-7 border bg-white rounded p-3 px-4 mx-auto">
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


          {
            errorMessage !== "" 
            ?
              <div className="alert alert-danger my-4" role="alert">
                {errorMessage}
              </div>
            :
            null
          }

          <div className="d-grid gap-2 col-6 mx-auto my-4">
            <button className="btn btn-dark" type="button" onClick={() => {classify()}}>Calcular Acurácia</button>
          </div>
        </div>

      </div>
    </>
  );
}

export default App;