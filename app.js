const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

const fs = require('fs');

let data = []

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, "/public/pages/landing.html"));
});

router.get('/mazegeneration', function(req, res) {
    res.sendFile(path.join(__dirname, "/public/pages/maze_gen.html"));
});

router.get('/solve', function(req, res) {
    res.sendFile(path.join(__dirname, "/public/pages/maze_solve.html"));
});

router.post('/save', function(req, res) {

    res.setHeader('Content-Type', 'application/json');

    let info = req.body

    fs.writeFile('./saved_mazes.json', JSON.stringify(req.body), function(err) {
        if (err) {
            console.log("An error occured")
            return;
        } 
    })
    
    data.push(info)
    console.log(data)
    res.send(info)
})

app.use(express.static(path.join(__dirname, '/')), router);

app.listen(process.env.port || 3000);

console.log('Running at Port 3000');