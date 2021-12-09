const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 3001;

const app = express();

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// All other GET requests not handled before will return our React app
const root = require("path").join(__dirname, "./../../build");
app.use(express.static(root));
app.get("*", (req, res) => {
    console.log('request url', req.url);
    res.sendFile(path.join(__dirname+'/../../build/index.html'));
    // res.sendFile("index.html", { root });
});
/*
app.get('*', (req, res) => {
    // console.log('get request', req);
    res.sendFile(path.resolve(__dirname, './../build', 'index.html'));
  });
  */