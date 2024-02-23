const express = require('express');
const app = express()
const fs = require('fs')

app.get('/api-data', (_, res) => { 
    const logData = []

    fs.readFile('../data/2024-02-20-access.log', 'utf8', (err, data) => {
        const resources = data.split("\n")

        for(let i=0;i<resources.length;i++) {
          const sortData = resources[i].replace(/["\[\]\(\)]/g, '').split(/\s-|\s+/);  
          
          function generateData(first, second) {
             let string = "" 

             for(let j=first;j<=second;j++) {
                 string += sortData[j] + " ";
             }

             return string
          }

          function generateKiloByte(bytes) {
            return kilobytes = bytes / 1024;
          }

          const objectJSON = {
             remote_addr : sortData[0],
             remote_user: sortData[2] ? sortData[2] : "-",
             time_local: sortData[3] + " " + sortData[4],
             request:sortData[5] +" "+ sortData[6]+" "+sortData[7],
             status: sortData[8],
             body_bytes_sent: generateKiloByte(sortData[9]),
             http_referer: sortData[10] ? sortData[10]: "-",
             http_user_agent:sortData[11]+" "+generateData(12, sortData.length-2),
             http_x_forwarded_for:sortData[sortData.length-1] ? sortData[sortData.length-1] : "-",
          }

          logData.push(objectJSON);
        }
        const filePath = "logfiles.json"

        fs.writeFile(filePath, JSON.stringify(logData, null, 2), (err) => {
            if (err) {
              console.error('Error writing JSON file:', err);
              res.status(500)
            } else {
              console.log('Data has been written to', filePath);
              res.status(200);
            }
          });
      }
    )
})

app.listen(2000, () => {
    console.log("server is running")
})