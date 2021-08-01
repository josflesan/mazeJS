const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

const fs = require('fs');

async function getAllSavedMazes() {

    let mazes = []

    const data = await fs.promises.readFile('./saved_mazes.json', function(err, data) {
        if (err) {
            console.log("An error occurred trying to read the resource")
            return
        }
    })

    let json = JSON.parse(data.toString("utf-8"))

    json.forEach((obj) => {
        mazes.push(obj)
    })

    return mazes
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

router.get('/build', function(req, res) {
    res.sendFile(path.join(__dirname, "/public/pages/maze_build.html"))
});

router.get('/about', function(req, res) {
    res.sendFile(path.join(__dirname, "/public/pages/about.html"))
});

router.get('/data', function(req, res) {
    (async () => {
        let mazes = await getAllSavedMazes()
        let dataToSend = {
            "mazes": mazes
        }
        let JSONdata = JSON.stringify(dataToSend)
        res.send(JSONdata)
    })()
})

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
    res.send(newMaze)
})

app.use(express.static(path.join(__dirname, '/')), router);

app.listen(process.env.port || 3000);

console.log('Running at Port 3000');