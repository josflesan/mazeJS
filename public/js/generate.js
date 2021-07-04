import { Grid } from './components/grid.js'
import { Algorithms } from './components/algorithms.js'


;(function() {

    let canvas, ctx, cellSize, gridSize, grid

    /**
     * Function for intial setup of config variables
     */
    function init() {
        canvas = document.getElementById('gameCanvas')
        ctx = canvas.getContext('2d')
        gridSize = 50  // 20x20 grid
        cellSize = canvas.height/gridSize

        grid = new Grid(gridSize, cellSize, canvas.height, canvas.width)

        // Declare starting cell, remove wall 
        let startCell = grid.getRandom()
        grid.getCell(0, 0).deleteWall("left", startCell.getNeighbours(grid))  // Delete wall from start cell
        let endCell = grid.getCell(gridSize-3, gridSize-3)
        endCell.deleteWall("right", endCell.getNeighbours(grid))

        grid.draw(ctx, false)
        
        Algorithms.randomizedDFS(startCell, ctx, grid, update)    

    }

    function update(color) {
        // Clear grid before re-drawing
        ctx.clearRect(0, 0, grid.totalWidth, grid.totalHeight)
        grid.draw(ctx, color)
    }

    // wait for HTML to load
    document.addEventListener('DOMContentLoaded', init)

})()