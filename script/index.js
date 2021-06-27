;(function() {

    let canvas, ctx

    // intial setup of config variables
    function init() {
        canvas = document.getElementById('gameCanvas')
        ctx = canvas.getContext('2d')

        drawGrid()
    }

    function drawGrid() {
        
        let cellSize = canvas.height/50;

        for (var y = 0; y < canvas.height; y+=cellSize) {
            for (var x = 0; x < canvas.width; x+=cellSize) {
                ctx.strokeRect(x, y, cellSize, cellSize)
            }
        }

    }

    // wait for HTML to load
    document.addEventListener('DOMContentLoaded', init)
    
})()