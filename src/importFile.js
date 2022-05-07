const csvToJson = (file) => {
    let reader = new FileReader();
    var dataTotal = [];
    reader.readAsText(file);
    reader.onload = (e) => {
        let csv = e.target.result;
        var data = [];

        const lines = csv.split('\r\n');
        lines.forEach(line =>{
            let row = line.split(',');
            for(let i = 0; i < row.length - 1; i++){
                row[i] = parseFloat(row[i]);
            }
            if(row.length > 1)
                data.push(row);
            }
        )
        dataTotal = data;
    }

    return dataTotal;
}


module.exports = csvToJson;