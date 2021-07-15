import { Grid } from './components/grid.js'
import { Algorithms } from './components/algorithms.js'


;(function() {

    let canvas, ctx, cellSize, gridSize, grid, container

    /**
     * Function for intial setup of config variables
     */
    function init() {
        canvas = document.getElementById('monitor-canvas')
        container = document.querySelector('#canvas-container')
        ctx = canvas.getContext('2d')

        container.width = innerWidth * 0.9 * 0.5
        container.height = innerHeight * 0.7 * 0.6

        ctx.canvas.height = container.height;
        ctx.canvas.width = canvas.height;

        gridSize = 30  // 30x30 grid

        cellSize = canvas.height/gridSize

        grid = new Grid(gridSize, cellSize, canvas.height, canvas.width)

        // Declare starting cell, remove wall 
        let startCell = grid.getRandom()
        grid.getCell(0, 0).deleteWall("left", grid.getCell(0, 0).getNeighbours(grid))  // Delete wall from start cell
        let endCell = grid.getCell(gridSize-1, gridSize-1)
        endCell.deleteWall("right", endCell.getNeighbours(grid))

        grid.draw(ctx, false)
        
        // Implement play button functionality
        let playbtn = document.getElementById("playbtn");

        playbtn.addEventListener("click", e => {
            // Choose appropriate algorithm and play animation
            Algorithms.randomizedDFS(startCell, ctx, grid, update)    

            //TODO: Change play button to pause/stop button?
        })

    }

    function update(color) {
        // Clear grid before re-drawing
        ctx.clearRect(0, 0, grid.totalWidth, grid.totalHeight)
        grid.draw(ctx, color)
    }

    // wait for HTML to load
    document.addEventListener('DOMContentLoaded', init)

})()