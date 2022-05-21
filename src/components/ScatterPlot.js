
import { React, useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const ScatterPlot = (props) => {
    const [posX, setPosX] = useState(0);
    const [posY, setPosY] = useState(1);

    const createDatasets = () => {
        let datasets = [];
        let colors = ['#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#00FFFF', '#FFFF00', '#000000'];
        let labels = [];

        for(let i=0; i<props.clusters.length; i++) {
            datasets.push({
                label: String.fromCharCode(65 + i),
                data: [],
                backgroundColor: colors[i],
                borderColor: colors[i],
                borderWidth: 1,
            });
        }

        for(let i=0; i<props.clusters.length; i++) {
            for(let j=0; j<props.clusters[i].length; j++) {
                datasets[i].data.push({
                    x: props.clusters[i][j][posX],
                    y: props.clusters[i][j][posY],
                    label: datasets[i].label
                });
            }
        }

        let data = [];
        for(let i=0; i<props.centroids.length; i++) {
            data.push({
                x: props.centroids[i][posX],
                y: props.centroids[i][posY],
                label: String.fromCharCode(65 + i),
            });
        }

        datasets.push({
            label: 'Centroids',
            data: data,
            backgroundColor: '#333333',
            borderColor:'#333333',
            borderWidth: 3,
            pointRadius: 5,
        });

        return { datasets };

    }

    const data = {
        datasets: createDatasets().datasets
    }
    
    const options = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
    };

    const renderOptions = () => {
        let  options = [];
        for(let i=0; i<props.attributes; i++) {
            options.push(<option value={i} key={"att"+i}> {String.fromCharCode(65 + i)} </option>);
        }

        return options;
    }

    const Render = () => {
        let output = 
        <>
            <h4 className="text-center">Scatter Plot</h4>

            <div className="row my-4">
                <div className="col-6">
                    <label className="form-label">X</label>
                    <select className="form-select" value={posX} onChange={(e) => setPosX(e.target.value)}>
                        {
                            renderOptions()
                        }
                    </select>
                </div>
                <div className="col-6">
                    <label className="form-label">Y</label>
                    <select className="form-select" value={posY} onChange={(e) => setPosY(e.target.value)}>
                        {
                            renderOptions()
                        }
                    </select>
                </div>

            </div>
            


            <div className="p-3 rounded border bg-white mb-5">
                <Scatter data={data} options={options}/>
            </div>
        </>
        return output;
    }

    return <Render />
}

export default ScatterPlot;
