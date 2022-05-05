import { ReactDOM } from "react";

const ConfusionMatrix = (classes, size, matrix) => {
    if(!matrix)
        matrix = [];
    console.log(matrix)
    // let auxMatrix = new Array(5);
    // auxMatrix.fill('a')
    // for (let i = 0; i < auxMatrix.length; i++) {
    //     auxMatrix[i] = new Array(5);
    //     auxMatrix[i].fill('a');
    // }

    const createLine = (row) => {
        return row.map((el, key) => {
            return(
                <td key={key}>
                    {el}
                </td>
            );
        });
    }

    const Render = () => {
        let saida = 
            <div>
                teste
                <table className="table table-bordered ">
                    <thead>
                        <tr>
                        {matrix.map(el => {
                            return(<td>{el}</td>);
                        })}
                        </tr>
                    </thead>

                    <tbody>
                        {matrix.map((el, key) => {
                            return(
                                <tr key={key}>
                                    {/* {createLine(el)} */}
                                </tr>
                            )
                        })} 
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