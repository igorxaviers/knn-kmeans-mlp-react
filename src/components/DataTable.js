

const DataTable = (props) => {
    console.log(props.data);
    console.log(props.header);
    const Render = () => {

        let saida = <>
            <div className="fixed-header rounded my-3 bg-light"> 
                <table className="table table-bordered ">
                    <thead>
                        <tr>
                            {props.header.map((el, key) => {
                                return(<th className="text-center" key={key}>{el}</th>);
                            })}
                        </tr>
                    </thead>      
                    <tbody>
                        {props.data.map((el, key) => {
                            return(
                                <tr key={key}>
                                    {el.map((el, key) => {
                                        if(!isNaN(el)) { 
                                            return(
                                                <td key={key} className="text-center">{el.toFixed(4)}</td>
                                            );
                                        }
                                        else{
                                            return(
                                                <td key={key} className="text-center">{el}</td>
                                            );
                                        }
                                    }
                                    )}
                                </tr>
                            );
                        }
                        )}
                    </tbody>
                </table>
            </div>
        </>
        return saida;
    }

    return (<Render/>);

}

export default DataTable;