
import { React } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, CategoryScale, Tooltip, Legend);


const LineChart = (props) => {
  console.log(props.iteration);

  const data = {
    id: 'line-chart',
    labels: props.iteration,
    datasets: [
      {
        label: "Gráfico de Erro",
        data: props.error,
        fill: false,
        borderColor: "#742774"
      }
    ]

  };


  const Render = () => {
    let output = <Line data={data}/>
    return output;
  }

  return (<Render/>);
}

export default LineChart;