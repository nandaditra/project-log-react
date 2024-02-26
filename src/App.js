import { useState } from 'react';
import LineChart from './component/LineChart';

function App() {
  const [file, setFile] = useState(null);
  const [check, setCheck] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logFiles, setLogFiles] = useState({
    labels:[],
    datasets: [{
      label: 'Total Log Request',
      data: [],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
       },
      ]  
     }  
  )

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
            const data = logs[context.dataIndex];
            return [
              `User: ${data.remote_user}`,
              `Date: ${data.time_local}`,
              `Request: ${data.request}`,
              `Status: ${data.status}`,
              `Size: ${convertSingaporeKb(context.parsed.y)} kb`,
              `Referer: ${data.http_referer}`,
              `User Ag ent: ${data.http_user_agent}`,
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

  
  function convertSingaporeKb(kilobytes){
    const roundedNumber = Math.round(kilobytes * 100) / 100;
          
    const convertion = roundedNumber.toLocaleString('en-SG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return convertion
}

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  }

  const handleUpload = async() => {
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const array = []
        const lines = e.target.result.split('\n');

        for(let i=0;i<lines.length;i++) {
          const sortData = lines[i].replace(/["\[\]\(\)]/g, '').split(/\s-|\s+/);  
          
          const objectData = {
            remote_addr: sortData[0],
            remote_user: sortData[2] ? sortData[2]: "-",
            time_local: sortData[3] + " " + sortData[4],
            request: sortData[5] +" "+sortData[6]+" "+sortData[7],
            status: sortData[8],
            body_bytes_sent: sortData[9] / 1024,
            http_referer: sortData[10] ? sortData[10]: "-",
            http_user_agent:sortData[11]+" "+generateData(12, sortData.length-2, sortData),
            http_x_forwarded_for:sortData[sortData.length-1] ? sortData[sortData.length-1] : "-",
          }
          array.push(objectData);
        }
        setLogs(array)
        setLogFiles((prevLogFiles) => ({
          ...prevLogFiles,
          labels: array.map((data)=> data.remote_addr),
          datasets: [
            {
              ...prevLogFiles.datasets[0], // Maintain other properties of the dataset
              data: array.map((data)=> data.body_bytes_sent),
            },
          ],
        }));
      }
      reader.readAsText(file);
    } 

    if(file) setCheck(true)
  }

  function generateData(first, second, data) {
    let string = "";
    for(let j=first;j<=second;j++) string += data[j] + " ";
    return string
  }

  return (
    <div style={mystyle}>
         <div>
          <h3>Upload File</h3>
          <input type="file" onChange={handleFileUpload} />
          <button onClick={handleUpload}>Upload</button>
        </div>

        { check ? <LineChart chartData={logFiles} options={chartOptions} /> : ""}      
            
    </div>
  );
}

export default App;
