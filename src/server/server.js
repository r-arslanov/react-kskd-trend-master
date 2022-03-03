const path = require('path');
const express = require('express');

let PORT = 3001;
const args = process.argv;
const app = express();
let base_url;

process.argv.forEach((item, i, arr)=>{
  if(item === '--base_url'){
    base_url = arr[i+1];
  }
  if(item === '--port'){
    PORT = arr[i+1];
  }
});

app.listen(PORT, () => {
  console.log(args, base_url)
  console.log(`Server listening on ${PORT}`);
});

// All other GET requests not handled before will return our React app
const root = require("path").join(__dirname, "./../../build");
app.use(express.static(root));
app.get("*", (req, res) => {
    console.log('request url', req.url);
    // res.sendFile(path.join(__dirname+'/../../index.html'));
    // res.sendFile(path.join(__dirname+'/../../build/index.html'), "params");
    res.sendFile("index.html", { root });
});
