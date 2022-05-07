import { ReactDOM } from "react";

const ConfusionMatrix = (props) => {

    // let auxMatrix = new Array(5);
    // auxMatrix.fill('a')
    // for (let i = 0; i < auxMatrix.length; i++) {
    //     auxMatrix[i] = new Array(5);
    //     auxMatrix[i].fill('a');
    // }

    const sumRowElements = (row) => {
        let sum = 0;
        row.forEach(el => {
            sum += el;
        });
        return sum;
    }

    const accuracyPerClass = (row, key) => {
        let truePositive = row[key];
        let sum = sumRowElements(row);

        return (truePositive / sum) * 100;
    }

    const totalAccuracy = () => {
        let sum = 0;
        let sumTruePositive = 0;
        for(let i=0; i<props.matrix.length; i++){
            for(let j=0; j<props.matrix[i].length; j++) {
                if(i === j)
                    sumTruePositive += props.matrix[i][j];
                sum += props.matrix[i][j];
            }
        }

        return (sumTruePositive / sum ) * 100;
    }

    const createLine = (row, keyC) => {
        return row.map((el, key) => {
            return(
                <td key={key} className={`text-center ${key===keyC ? 'bg-success text-white' : ''}`}>
                    {el}
                </td>
            );
        });
    }

    const Render = () => {
        console.log(props.matrix);

        let saida = 
            <div className="bg-white rounded p-4 border mb-5">
                <h4 className="mb-4">Matriz de Confusão</h4>
                <table className="table table-bordered rounded">
                    <thead>
                        <tr>
                            <th></th>
                            {props.classes.map(el => {
                                return(<th className="text-center">{el}</th>);
                            })}
                            <th className="text-center" style={{width: 180}}>Ac. por classe (%)</th>
                        </tr>
                    </thead>

                    <tbody>
                        {props.matrix.map((el, key) => {
                            return(
                                <tr key={key}>
                                    <th className="text-center">{props.classes[key]}</th>
                                    {createLine(el, key)}
                                    <td className="text-center">{accuracyPerClass(el, key).toFixed(2)}%</td>
                                </tr>
                            )
                        })} 
                        <tr>
                            <td className="text-end" colSpan={props.classes.length+1}>Acurácia total</td>
                            <td className="text-center fw-bold">{totalAccuracy().toFixed(2)}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        return saida;
    }


    return ( 
        <Render/> 
    );
}

export default ConfusionMatrix;