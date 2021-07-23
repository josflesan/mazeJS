const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, "/public/pages/landing.html"));
});

router.get('/mazegeneration', function(req, res) {
    res.sendFile(path.join(__dirname, "/public/pages/maze_gen.html"));
});

router.get('/solve', function(req, res) {
    res.sendFile(path.join(__dirname, "/public/pages/maze_solve.html"));
});

app.use(express.static(path.join(__dirname, '/')), router);

app.listen(process.env.port || 3000);

console.log('Running at Port 3000');