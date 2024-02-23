import { useState } from 'react';
import LogData from "./api/logfiles.json"
import LineChart from './component/LineChart';

function App() {
  const [logFiles, SetLogFiles] = useState({
      labels:LogData.map((data)=> data.remote_addr),
      datasets: [{
        label: 'Total Log Request',
        data: LogData.map((data)=>  data.body_bytes_sent),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
    ]
  })

  function convertSingaporeKb(kilobytes){
      const roundedNumber = Math.round(kilobytes * 100) / 100;
            
      const convertion = roundedNumber.toLocaleString('en-SG', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
      });

      return convertion
  }

  const chartOptions = {
    maintainAspectRatio:false,
    scales: {
       y: {
        beginAtZero:true
       }
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItem) => tooltipItem[0].label,
          label: (context) => {
            const data = LogData[context.dataIndex];
            return [
              `User: ${data.remote_user}`,
              `Date: ${data.time_local}`,
              `Request: ${data.request}`,
              `Status: ${data.status}`,
              `Size: ${convertSingaporeKb(context.parsed.y)} kb`,
              `Referer: ${data.http_referer}`,
              `User Agent: ${data.http_user_agent}`,
              `Forwarded: ${data.http_x_forwarded_for}`
            ];
          },
        },
      },
    },
    hover: {
      mode: 'nearest',
      intersect: false,
      delay: 0,
    }
  };

  const mystyle = {
    width: "4000vh",
    height:"90vh"
  };

  return (
    <div style={mystyle}>
        <LineChart chartData={logFiles} options={chartOptions}
         />         
    </div>
  );
}

export default App;
