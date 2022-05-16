
import React from 'react';
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
    const data = {
        datasets: [
            {
                backgroundColor: 'rgba(255, 99, 132, 1)',
                label: ["Teste 1"],
                data: [
                    { x: 1, y: 1 },
                    { x: 2, y: 3 },
                    { x: 3, y: 3 },
                    { x: 3, y: 2 },
                    { x: 5, y: 5 },
                    { x: 8, y: 4 },
                    { x: 9, y: 6 },
                    { x: 10, y: 8 },
                    { x: 11, y: 8 },
                    { x: 12, y: 8 },
                    { x: 13, y: 9 },
                    { x: 14, y: 10 }
                ]
            },
            {
                backgroundColor: 'rgba(155, 559, 132, 1)',
                label: ["Teste 2"],
                data: [
                    { x: 3, y: 1 },
                    { x: 4, y: 3 },
                    { x: 5, y: 3 },
                    { x: 6, y: 2 },
                    { x: 10, y: 5 },
                    { x: 4, y: 4 },
                    { x: 3, y: 6 },
                    { x: 12, y: 8 },
                    { x: 8, y: 8 },
                    { x: 3, y: 8 },
                    { x: 3, y: 9 },
                    { x: 4, y: 10 }
                ]
            }
        ],
    }
    const options = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
    };

    const Render = () => {
        let output = 
        <>
            <h4 className="text-center">Scatter Plot</h4>
            <div className="p-3 rounded border bg-white mb-5">
                <Scatter data={data} options={options}/>
            </div>
        </>
        return output;
    }

    return <Render />
}

export default ScatterPlot;