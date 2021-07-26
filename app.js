const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

const fs = require('fs');

function getAllSavedMazeNames() {

    let savedNames = []

    fs.readFileSync('./saved_mazes.json', function(err, data) {
        if (err) {
            console.log("An error occured trying to read the resource")
            return; 
        }

        let json = JSON.parse(data)

        json.forEach((obj) => {
            savedNames.push(obj.name)
        })

        console.log(savedNames)
    })


}

let data = {}

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

    let mazeName = req.body.name
    let mazeGrid = req.body.grid

    let newMaze = {
        name: mazeName,
        grid: mazeGrid
    }

    fs.readFile('./saved_mazes.json', function(err, data) {
        let json = JSON.parse(data)
        json.push(newMaze)

        fs.writeFile('./saved_mazes.json', JSON.stringify(json), function(err) {
            if (err) {
                console.log("An error occured trying to write to the resource")
                return;
            }
        })

        if (err) {
            console.log("An error occured trying to read the resource")
            return;
        } 
    })
    
    data[mazeName] = mazeGrid

    getAllSavedMazeNames()
    res.send(newMaze)
})

app.use(express.static(path.join(__dirname, '/')), router);

app.listen(process.env.port || 3000);

console.log('Running at Port 3000');